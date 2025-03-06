---
title: Permanent Notes
description: 정리된 영구 노트를 저장하는 공간
---

# Permanent Notes

이 폴더는 정리되고 체계화된 영구 노트를 저장하는 공간입니다.

## 폴더 구조
- `programming/`: 프로그래밍 관련 노트
  - `python/`: Python 관련
  - `javascript/`: JavaScript 관련
  - `algorithms/`: 알고리즘 관련
- `books/`: 책 노트
  - `non-fiction/`: 논픽션
  - `fiction/`: 픽션
- `projects/`: 프로젝트 관련
  - `current/`: 진행 중인 프로젝트
  - `completed/`: 완료된 프로젝트
- `thoughts/`: 생각과 아이디어
  - `philosophy/`: 철학적 생각
  - `ideas/`: 일반적인 아이디어

## Frontmatter 설정
```markdown
---
title: [주제명]
date: YYYY-MM-DD
tags:
  - permanent
  - [주제 태그]
  - [관련 주제 태그]
draft: false
enableToc: true  # 긴 영구 노트는 목차 유용
description: "노트의 핵심 내용 요약"
aliases:  # 다른 이름으로도 찾을 수 있게
  - [동의어1]
  - [동의어2]
cssclasses:  # 특별한 스타일링이 필요한 경우
  - [스타일 클래스]
---
```

## 사용 방법
- 각 주제별로 적절한 폴더에 노트 저장
- 태그를 활용하여 크로스 레퍼런싱
- Obsidian의 링크 기능을 활용하여 관련 노트들 연결

## 예시
```markdown
---
title: Python Decorators
date: 2024-03-05
tags:
  - permanent
  - python
  - programming
  - decorators
draft: false
enableToc: true
description: "Python 데코레이터의 개념과 사용법"
aliases:
  - 파이썬 데코레이터
  - Python 함수 데코레이터
cssclasses:
  - code-example
---

여기에 정리된 노트 내용을 작성합니다...
``` 