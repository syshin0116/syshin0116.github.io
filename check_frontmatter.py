#!/usr/bin/env python3
"""
Check markdown files for missing summaries and analyze frontmatter format
"""
import os
import re
from pathlib import Path

def check_file(file_path):
    """Check a single markdown file for frontmatter and summary"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if file has frontmatter
    if not content.startswith('---'):
        return {
            'path': file_path,
            'has_frontmatter': False,
            'has_summary': False,
            'tags_format': None,
            'issue': 'No frontmatter'
        }

    # Extract frontmatter
    parts = content.split('---', 2)
    if len(parts) < 3:
        return {
            'path': file_path,
            'has_frontmatter': False,
            'has_summary': False,
            'tags_format': None,
            'issue': 'Invalid frontmatter'
        }

    frontmatter = parts[1]
    body = parts[2]

    # Check for summary
    has_summary = '> [!summary]' in body

    # Check tags format
    tags_format = None
    if 'tags:' in frontmatter:
        # Check if it's array format (- item) or comma-separated
        if re.search(r'tags:\s*\n\s+-', frontmatter):
            tags_format = 'array'
        elif re.search(r'tags:\s*[^\n]+,', frontmatter):
            tags_format = 'comma'
        else:
            tags_format = 'single'

    # Determine issue
    issue = None
    if not has_summary:
        issue = 'Missing summary'
    elif tags_format == 'comma':
        issue = 'Tags in comma format (should be array)'

    return {
        'path': file_path,
        'has_frontmatter': True,
        'has_summary': has_summary,
        'tags_format': tags_format,
        'issue': issue
    }

def main():
    content_dir = Path('/home/user/syshin0116.github.io/content')

    issues = {
        'no_frontmatter': [],
        'no_summary': [],
        'comma_tags': [],
        'ok': []
    }

    # Check all markdown files
    for md_file in content_dir.rglob('*.md'):
        result = check_file(md_file)

        if result['issue'] == 'No frontmatter' or result['issue'] == 'Invalid frontmatter':
            issues['no_frontmatter'].append(str(md_file))
        elif result['issue'] == 'Missing summary':
            issues['no_summary'].append(str(md_file))
        elif result['issue'] == 'Tags in comma format (should be array)':
            issues['comma_tags'].append(str(md_file))
        else:
            issues['ok'].append(str(md_file))

    # Print summary
    print("=" * 80)
    print("Frontmatter Analysis Summary")
    print("=" * 80)
    print(f"\nTotal files: {sum(len(v) for v in issues.values())}")
    print(f"Files without frontmatter: {len(issues['no_frontmatter'])}")
    print(f"Files without summary: {len(issues['no_summary'])}")
    print(f"Files with comma-separated tags: {len(issues['comma_tags'])}")
    print(f"Files OK: {len(issues['ok'])}")

    print("\n" + "=" * 80)
    print("Files without summary (first 20):")
    print("=" * 80)
    for file in issues['no_summary'][:20]:
        print(f"  {file}")

    if len(issues['no_summary']) > 20:
        print(f"  ... and {len(issues['no_summary']) - 20} more")

    print("\n" + "=" * 80)
    print("Files with comma-separated tags (first 10):")
    print("=" * 80)
    for file in issues['comma_tags'][:10]:
        print(f"  {file}")

    if len(issues['comma_tags']) > 10:
        print(f"  ... and {len(issues['comma_tags']) - 10} more")

    # Save detailed report
    with open('/home/user/syshin0116.github.io/frontmatter_report.txt', 'w', encoding='utf-8') as f:
        f.write("Files without summary:\n")
        for file in issues['no_summary']:
            f.write(f"{file}\n")

        f.write("\n\nFiles with comma-separated tags:\n")
        for file in issues['comma_tags']:
            f.write(f"{file}\n")

        f.write("\n\nFiles without frontmatter:\n")
        for file in issues['no_frontmatter']:
            f.write(f"{file}\n")

    print("\n" + "=" * 80)
    print("Detailed report saved to: frontmatter_report.txt")
    print("=" * 80)

if __name__ == '__main__':
    main()
