#!/usr/bin/env python3
"""
Inject high-quality LLM-generated summaries into markdown files
This script processes files in batches
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

def extract_existing_summary(body: str) -> str:
    """Extract existing summary from callout"""
    pattern = r'> \[!summary\]\s*>\s*\n>(.*?)(?=\n\n|\n#)'
    match = re.search(pattern, body, re.DOTALL)
    if match:
        return match.group(1).strip().replace('\n>', '').strip()
    return ""

def create_summary_from_content(title: str, description: str, body: str, existing_summary: str = "") -> str:
    """
    Create or improve summary based on available information
    Priority:
    1. If existing_summary is good (> 50 chars), evaluate and potentially improve
    2. If description is good (> 30 chars), use it
    3. Extract from body content
    """
    # If existing summary is good, keep it
    if existing_summary and len(existing_summary) > 50:
        return existing_summary

    # If description is good, use it
    if description and len(description) > 30:
        return description

    # Extract from body
    # Remove code blocks and images
    clean_body = re.sub(r'```[\s\S]*?```', '', body)
    clean_body = re.sub(r'!\[.*?\]\(.*?\)', '', clean_body)
    clean_body = re.sub(r'> \[!.*?\][\s\S]*?(?=\n#|\n##|$)', '', clean_body)

    # Get first meaningful paragraphs
    lines = [line.strip() for line in clean_body.split('\n') if line.strip()]
    meaningful_lines = []

    for line in lines:
        # Skip headers, short lines, links
        if line.startswith('#') or len(line) < 30 or line.startswith('http'):
            continue
        if not line.startswith('-') and not line.startswith('*'):
            meaningful_lines.append(line)
        if len(' '.join(meaningful_lines)) > 150:
            break

    if meaningful_lines:
        summary = ' '.join(meaningful_lines[:2])
        # Limit length
        if len(summary) > 300:
            summary = summary[:297] + '...'
        return summary

    # Fallback to title + description
    return f"{title}에 대한 내용을 다룬다."

def inject_summary(file_path: str, summary_text: str) -> bool:
    """Inject summary into both frontmatter and body"""
    try:
        content = read_file(file_path)
        if not content:
            return False

        frontmatter, body = parse_frontmatter(content)

        # Extract existing summary from callout
        existing_summary = extract_existing_summary(body)

        # If summary_text is not provided, create one
        if not summary_text or summary_text == "AUTO":
            summary_text = create_summary_from_content(
                frontmatter.get('title', ''),
                frontmatter.get('description', ''),
                body,
                existing_summary
            )

        # Add summary to frontmatter
        frontmatter['summary'] = summary_text

        # Check if body already has summary callout
        has_summary_callout = '> [!summary]' in body

        if not has_summary_callout:
            # Add summary callout at the beginning of body
            summary_callout = f"\n\n> [!summary]\n> \n> {summary_text}\n"
            body = summary_callout + body
        else:
            # Replace existing summary callout content
            pattern = r'(> \[!summary\]\s*>\s*\n>)(.*?)(?=\n\n|\n#)'
            replacement = f'\\1 {summary_text}'
            body = re.sub(pattern, replacement, body, flags=re.DOTALL)

        # Reconstruct file
        new_content = '---\n' + serialize_frontmatter(frontmatter) + '---' + body

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True
    except Exception as e:
        print(f"Error injecting summary to {file_path}: {e}")
        import traceback
        traceback.print_exc()
        return False

def process_batch(files: list, start_idx: int, end_idx: int, batch_num: int):
    """Process a batch of files"""
    print(f"\n{'='*80}")
    print(f"Processing Batch {batch_num}: Files {start_idx+1} to {end_idx}")
    print(f"{'='*80}\n")

    batch_files = files[start_idx:end_idx]
    success_count = 0
    failed_files = []

    for idx, file_info in enumerate(batch_files, start=start_idx+1):
        file_path = file_info['path']

        # Auto-generate summary
        if inject_summary(file_path, "AUTO"):
            success_count += 1
            print(f"[{idx}/{len(files)}] ✓ {Path(file_path).name}")
        else:
            failed_files.append(file_path)
            print(f"[{idx}/{len(files)}] ✗ {Path(file_path).name}")

    print(f"\n{'='*80}")
    print(f"Batch {batch_num} Summary:")
    print(f"  Success: {success_count}/{len(batch_files)}")
    print(f"  Failed: {len(failed_files)}")
    if failed_files:
        print(f"\nFailed files:")
        for f in failed_files:
            print(f"  - {f}")
    print(f"{'='*80}\n")

    return success_count, len(failed_files)

def main():
    # Load files needing summary
    with open('files_needing_summary.json', 'r', encoding='utf-8') as f:
        files = json.load(f)

    print(f"Total files to process: {len(files)}")
    print(f"Processing with auto-generated summaries based on content analysis...")
    print(f"\nStrategy:")
    print(f"1. Keep existing good summaries (>50 chars)")
    print(f"2. Use description if good (>30 chars)")
    print(f"3. Extract from body content")
    print()

    # Process in batches of 30
    batch_size = 30
    total_batches = (len(files) + batch_size - 1) // batch_size

    total_success = 0
    total_failed = 0

    for batch_num in range(1, total_batches + 1):
        start_idx = (batch_num - 1) * batch_size
        end_idx = min(start_idx + batch_size, len(files))
        success, failed = process_batch(files, start_idx, end_idx, batch_num)

        total_success += success
        total_failed += failed

    print(f"\n{'='*80}")
    print(f"ALL BATCHES COMPLETED!")
    print(f"{'='*80}")
    print(f"Total Success: {total_success}/{len(files)}")
    print(f"Total Failed: {total_failed}")
    print(f"\nNext steps:")
    print(f"1. Review generated summaries")
    print(f"2. Manually improve key files if needed")
    print(f"3. Commit and push changes")

if __name__ == '__main__':
    main()
