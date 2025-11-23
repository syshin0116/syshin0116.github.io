#!/usr/bin/env python3
"""
Process files in batches and prepare them for LLM summary generation
This script reads each file's full content and prepares summary injection
"""
import json
import re
import yaml
from pathlib import Path
from typing import Dict, Tuple

def read_file(file_path: str) -> str:
    """Read file content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

def parse_frontmatter(content: str) -> Tuple[Dict, str]:
    """Parse frontmatter and body"""
    if not content.startswith('---'):
        return {}, content

    parts = content.split('---', 2)
    if len(parts) < 3:
        return {}, content

    try:
        frontmatter = yaml.safe_load(parts[1])
        if frontmatter is None:
            frontmatter = {}
        body = parts[2]
        return frontmatter, body
    except yaml.YAMLError:
        return {}, content

def serialize_frontmatter(frontmatter: Dict) -> str:
    """Convert frontmatter dict to YAML string"""
    field_order = ['title', 'date', 'tags', 'draft', 'enableToc', 'description', 'summary', 'published', 'modified']

    ordered_fm = {}
    for field in field_order:
        if field in frontmatter:
            ordered_fm[field] = frontmatter[field]

    for key, value in frontmatter.items():
        if key not in ordered_fm:
            ordered_fm[key] = value

    return yaml.dump(ordered_fm, default_flow_style=False, allow_unicode=True, sort_keys=False)

def extract_meaningful_content(body: str, max_length: int = 2000) -> str:
    """Extract meaningful content from body for summary generation"""
    # Remove existing summary callouts
    body = re.sub(r'> \[!summary\][\s\S]*?(?=\n#|\n##|$)', '', body)

    # Remove code blocks
    body = re.sub(r'```[\s\S]*?```', '[CODE_BLOCK]', body)

    # Remove images
    body = re.sub(r'!\[.*?\]\(.*?\)', '[IMAGE]', body)

    # Get first few paragraphs
    lines = []
    for line in body.split('\n'):
        line = line.strip()
        if line and not line.startswith('!') and len(' '.join(lines)) < max_length:
            lines.append(line)

    return '\n'.join(lines[:50])

def inject_summary_to_file(file_path: str, summary_text: str) -> bool:
    """Inject summary into both frontmatter and body"""
    try:
        content = read_file(file_path)
        if not content:
            return False

        frontmatter, body = parse_frontmatter(content)

        # Add summary to frontmatter
        frontmatter['summary'] = summary_text

        # Check if body already has summary callout
        has_summary_callout = '> [!summary]' in body

        if not has_summary_callout:
            # Add summary callout at the beginning of body
            summary_callout = f"\n\n> [!summary]\n> \n> {summary_text}\n"
            body = summary_callout + body
        else:
            # Replace existing summary callout
            pattern = r'(> \[!summary\]\s*>\s*\n)(>.*?)(?=\n\n|\n#)'
            replacement = f'\\1> {summary_text}'
            body = re.sub(pattern, replacement, body, flags=re.DOTALL)

        # Reconstruct file
        new_content = '---\n' + serialize_frontmatter(frontmatter) + '---' + body

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True
    except Exception as e:
        print(f"Error injecting summary to {file_path}: {e}")
        return False

def get_file_info(file_path: str) -> Dict:
    """Get comprehensive file info for summary generation"""
    content = read_file(file_path)
    if not content:
        return None

    frontmatter, body = parse_frontmatter(content)

    meaningful_content = extract_meaningful_content(body)

    return {
        'path': file_path,
        'title': frontmatter.get('title', ''),
        'description': frontmatter.get('description', ''),
        'tags': frontmatter.get('tags', []),
        'body_content': meaningful_content,
        'current_summary': frontmatter.get('summary', ''),
        'has_summary_callout': '> [!summary]' in body
    }

def save_batch_for_review(batch_files: list, batch_num: int):
    """Save batch files info for manual review and summary generation"""
    output = []

    for idx, file_info in enumerate(batch_files, 1):
        file_data = get_file_info(file_info['path'])
        if file_data:
            output.append({
                'idx': idx,
                **file_data
            })

    filename = f'batch_{batch_num}_for_summary.json'
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved batch info to: {filename}")
    return output

def main():
    # Load files needing summary
    with open('files_needing_summary.json', 'r', encoding='utf-8') as f:
        files = json.load(f)

    print(f"Total files to process: {len(files)}")

    # Process first batch (30 files)
    batch_size = 30
    batch_1_files = files[:batch_size]

    print(f"\nPreparing Batch 1: {len(batch_1_files)} files")
    batch_data = save_batch_for_review(batch_1_files, 1)

    print(f"\nBatch 1 prepared successfully!")
    print(f"Files: {len(batch_data)}")
    print(f"\nNext step: Review batch_1_for_summary.json and generate high-quality summaries")

if __name__ == '__main__':
    main()
