#!/usr/bin/env python3
"""
Convert Jekyll frontmatter to Quartz format
- Convert comma-separated tags to array format
- Add missing frontmatter fields (draft, enableToc, published, modified)
- Prepare files for summary injection
"""
import os
import re
import yaml
from pathlib import Path
from typing import Dict, Any, Tuple

def parse_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """Parse frontmatter and body from markdown content"""
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
    except yaml.YAMLError as e:
        print(f"YAML parsing error: {e}")
        return {}, content

def convert_tags(tags) -> list:
    """Convert tags to array format"""
    if tags is None:
        return []

    if isinstance(tags, list):
        return tags

    if isinstance(tags, str):
        # Split by comma and clean up
        return [tag.strip() for tag in tags.split(',') if tag.strip()]

    return []

def enhance_frontmatter(frontmatter: Dict[str, Any]) -> Dict[str, Any]:
    """Add missing frontmatter fields"""
    # Convert tags to array format
    if 'tags' in frontmatter:
        frontmatter['tags'] = convert_tags(frontmatter['tags'])

    # Add missing fields
    if 'draft' not in frontmatter:
        frontmatter['draft'] = False

    if 'enableToc' not in frontmatter:
        frontmatter['enableToc'] = True

    # Add published and modified dates based on date field
    if 'date' in frontmatter and 'published' not in frontmatter:
        frontmatter['published'] = frontmatter['date']

    if 'date' in frontmatter and 'modified' not in frontmatter:
        frontmatter['modified'] = frontmatter['date']

    return frontmatter

def serialize_frontmatter(frontmatter: Dict[str, Any]) -> str:
    """Convert frontmatter dict back to YAML string with proper formatting"""
    # Custom order for fields
    field_order = ['title', 'date', 'tags', 'draft', 'enableToc', 'description', 'summary', 'published', 'modified']

    ordered_fm = {}
    for field in field_order:
        if field in frontmatter:
            ordered_fm[field] = frontmatter[field]

    # Add any remaining fields
    for key, value in frontmatter.items():
        if key not in ordered_fm:
            ordered_fm[key] = value

    return yaml.dump(ordered_fm, default_flow_style=False, allow_unicode=True, sort_keys=False)

def has_summary_callout(body: str) -> bool:
    """Check if body already has [!summary] callout"""
    return '> [!summary]' in body

def get_file_info(file_path: Path, frontmatter: Dict, body: str) -> Dict:
    """Get file information for summary generation"""
    return {
        'path': str(file_path),
        'title': frontmatter.get('title', ''),
        'description': frontmatter.get('description', ''),
        'summary': frontmatter.get('summary', ''),
        'has_summary_callout': has_summary_callout(body),
        'body_preview': body[:1000]  # First 1000 chars for context
    }

def process_file(file_path: Path, dry_run: bool = True) -> Dict:
    """Process a single markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        frontmatter, body = parse_frontmatter(content)

        if not frontmatter:
            return {'status': 'skip', 'reason': 'No frontmatter', 'path': str(file_path)}

        # Get file info before modification
        file_info = get_file_info(file_path, frontmatter, body)

        # Enhance frontmatter
        enhanced_fm = enhance_frontmatter(frontmatter)

        # Prepare new content (without summary injection yet)
        new_content = '---\n' + serialize_frontmatter(enhanced_fm) + '---' + body

        if not dry_run:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

        return {
            'status': 'processed',
            'path': str(file_path),
            'info': file_info,
            'needs_summary_fm': 'summary' not in enhanced_fm or not enhanced_fm['summary'],
            'needs_summary_callout': not has_summary_callout(body),
            'tags_converted': isinstance(frontmatter.get('tags'), str)
        }

    except Exception as e:
        return {'status': 'error', 'reason': str(e), 'path': str(file_path)}

def main():
    content_dir = Path('/home/user/syshin0116.github.io/content')

    # First pass: dry run to collect information
    print("=" * 80)
    print("Phase 1: Analyzing files and collecting information")
    print("=" * 80)

    files_needing_summary = []
    files_to_process = []

    for md_file in content_dir.rglob('*.md'):
        result = process_file(md_file, dry_run=True)

        if result['status'] == 'processed':
            files_to_process.append(result)

            if result['needs_summary_fm'] or result['needs_summary_callout']:
                files_needing_summary.append(result['info'])

    print(f"\nTotal markdown files: {len(files_to_process)}")
    print(f"Files needing summary: {len(files_needing_summary)}")
    print(f"Files with comma-separated tags: {sum(1 for f in files_to_process if f.get('tags_converted'))}")

    # Save files needing summary to JSON for later processing
    import json
    with open('/home/user/syshin0116.github.io/files_needing_summary.json', 'w', encoding='utf-8') as f:
        json.dump(files_needing_summary, f, ensure_ascii=False, indent=2)

    print(f"\nFiles needing summary saved to: files_needing_summary.json")

    # Second pass: apply changes
    print("\n" + "=" * 80)
    print("Phase 2: Applying frontmatter changes")
    print("=" * 80)

    processed = 0
    errors = 0

    for md_file in content_dir.rglob('*.md'):
        result = process_file(md_file, dry_run=False)

        if result['status'] == 'processed':
            processed += 1
            if processed % 20 == 0:
                print(f"Processed {processed} files...")
        elif result['status'] == 'error':
            errors += 1
            print(f"Error processing {result['path']}: {result['reason']}")

    print(f"\n✅ Frontmatter conversion complete!")
    print(f"   Processed: {processed}")
    print(f"   Errors: {errors}")
    print(f"\nNext step: Generate summaries for {len(files_needing_summary)} files")

if __name__ == '__main__':
    main()
