---
title: Fleeting Notes
description: 임시 노트와 아이디어를 저장하는 공간
---

# Fleeting Notes

이 폴더는 임시적인 노트와 아이디어를 저장하는 공간입니다.

## 사용 방법
- 파일명 형식: `YYYY-MM-DD-title.md`
- 태그를 활용하여 나중에 정리하기 쉽게 구성
- Obsidian의 링크 기능을 활용하여 다른 노트들과 연결

## Frontmatter 설정
```markdown
---
title: YYYY-MM-DD-title
date: YYYY-MM-DD
tags:
  - fleeting
  - [관련 주제 태그]
draft: true  # 임시 노트는 기본적으로 draft로 설정
enableToc: false  # 임시 노트는 목차 불필요
description: "짧은 설명"
---
```

## 예시
```markdown
---
title: 2024-03-05-quartz-setup-ideas
date: 2024-03-05
tags:
  - fleeting
  - quartz
  - setup
  - ideas
draft: true
enableToc: false
description: "Quartz 설정 관련 아이디어들"
---

여기에 임시 노트 내용을 작성합니다...
``` 