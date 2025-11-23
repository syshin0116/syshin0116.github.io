#!/usr/bin/env python3
"""
Inject summaries into markdown files
This script will process files in batches and inject both:
1. summary field in frontmatter
2. > [!summary] callout in body
"""
import json
import re
import yaml
from pathlib import Path
from typing import Dict, Tuple, List

def read_file(file_path: str) -> str:
    """Read file content"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

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

def generate_summary(title: str, description: str, body_preview: str) -> str:
    """
    Generate summary based on title, description and body preview
    This is a placeholder - actual implementation would use LLM
    """
    # For now, use description if available, otherwise extract from body
    if description and len(description) > 20:
        return description

    # Extract first meaningful paragraph from body
    lines = [line.strip() for line in body_preview.split('\n') if line.strip()]
    # Skip frontmatter, headings, and short lines
    meaningful_lines = []
    for line in lines:
        if line.startswith('#') or line.startswith('---') or line.startswith('>'):
            continue
        if len(line) > 50:
            meaningful_lines.append(line)
        if len(' '.join(meaningful_lines)) > 150:
            break

    if meaningful_lines:
        return ' '.join(meaningful_lines[:2])

    return title

def inject_summary(file_path: str, summary_text: str) -> bool:
    """Inject summary into both frontmatter and body"""
    try:
        content = read_file(file_path)
        frontmatter, body = parse_frontmatter(content)

        # Add summary to frontmatter
        frontmatter['summary'] = summary_text

        # Check if body already has summary callout
        has_summary_callout = '> [!summary]' in body

        if not has_summary_callout:
            # Add summary callout at the beginning of body
            summary_callout = f"\n\n> [!summary]\n> \n> {summary_text}\n"
            body = summary_callout + body

        # Reconstruct file
        new_content = '---\n' + serialize_frontmatter(frontmatter) + '---' + body

        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def process_batch(files: List[Dict], start_idx: int, end_idx: int, batch_num: int):
    """Process a batch of files"""
    print(f"\n{'='*80}")
    print(f"Processing Batch {batch_num}: Files {start_idx+1} to {end_idx}")
    print(f"{'='*80}\n")

    batch_files = files[start_idx:end_idx]
    success_count = 0
    failed_files = []

    for idx, file_info in enumerate(batch_files, start=start_idx+1):
        file_path = file_info['path']
        title = file_info.get('title', '')
        description = file_info.get('description', '')
        body_preview = file_info.get('body_preview', '')

        # Generate summary
        summary = generate_summary(title, description, body_preview)

        # Inject summary
        if inject_summary(file_path, summary):
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

def main():
    # Load files needing summary
    with open('files_needing_summary.json', 'r', encoding='utf-8') as f:
        files = json.load(f)

    print(f"Total files to process: {len(files)}")
    print(f"\nNote: This script uses basic summary generation.")
    print(f"For high-quality summaries, each file should be reviewed individually.")
    print(f"Proceeding with batch processing...\n")

    # Process in batches of 30
    batch_size = 30
    total_batches = (len(files) + batch_size - 1) // batch_size

    for batch_num in range(1, total_batches + 1):
        start_idx = (batch_num - 1) * batch_size
        end_idx = min(start_idx + batch_size, len(files))
        process_batch(files, start_idx, end_idx, batch_num)

    print(f"\n{'='*80}")
    print(f"ALL BATCHES COMPLETED!")
    print(f"{'='*80}")
    print(f"\nNext steps:")
    print(f"1. Review generated summaries for quality")
    print(f"2. Improve summaries where needed")
    print(f"3. Commit and push changes")

if __name__ == '__main__':
    main()
