---
title: Blog Posts
description: 블로그 포스트를 저장하는 공간
---


블로그에 게시될 포스트들을 저장하는 공간

## 폴더 구조
- `posts/`: 일반 블로그 포스트
  - `2024/`: 2024년 포스트
  - `2023/`: 2023년 포스트
- `projects/`: 프로젝트 관련 포스트
  - `showcase/`: 프로젝트 쇼케이스

## Frontmatter 설정
```markdown
---
title: [포스트 제목]
date: YYYY-MM-DD
tags:
  - blog
  - [주제 태그]
draft: false
enableToc: true
description: "포스트 요약"
socialDescription: "소셜 미디어 공유용 설명"
socialImage: "대표 이미지 경로"
published: YYYY-MM-DD
modified: YYYY-MM-DD
cssclasses:
  - blog
---
```

## 사용 방법
- 각 포스트는 적절한 연도 폴더에 저장
- 프로젝트 관련 포스트는 `projects/showcase/`에 저장
- 태그를 활용하여 카테고리화
- Obsidian의 링크 기능을 활용하여 관련 노트들과 연결

## 예시
```markdown
---
title: My First Blog Post
date: 2024-03-05
tags:
  - blog
  - first-post
  - introduction
draft: false
enableToc: true
description: "블로그 시작을 알리는 첫 포스트"
socialDescription: "새로운 블로그를 시작합니다!"
socialImage: "/images/blog/first-post.jpg"
published: 2024-03-05
modified: 2024-03-05
cssclasses:
  - blog
---

여기에 블로그 포스트 내용을 작성합니다...
``` 