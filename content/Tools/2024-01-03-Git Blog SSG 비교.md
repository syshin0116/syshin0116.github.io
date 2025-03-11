---
layout: post
title: Git Blog SSG 비교
date: 2024-01-03 17:25 +0900
categories:
  - ETC
  - Tech
tags: 
math: true
---

## Intro: 
깃 블로그 리뉴얼을 위해 알아보던 중, Github Pages로 배포하는 정적 웹사이트 생성기 방식 중 기존에 내가 쓰던 Jekyll 외에도 Hexo, Hugo, Gatsby 등 많은 SSG(Static Site Generators)가 있다는걸 알게 되었다. 

따라서 이 번 포스트에서는 세 방식의 차이를 비교하고, 나에게 알맞는 방식을 채택하고자 한다.


## Github Stars 수

### Star-history를 통한 Github Stars 트랜드 비교

출처: [https://star-history.com/](https://star-history.com/)


[![Star History Chart](https://api.star-history.com/svg?repos=jekyll/jekyll,hexojs/hexo,gatsbyjs/gatsby,gohugoio/hugo&type=Date)](https://star-history.com/#jekyll/jekyll&hexojs/hexo&gatsbyjs/gatsby&gohugoio/hugo&Date)


### 언어별 SSG Github stars 수

출처: [https://ssg-dataset.streamlit.app/](https://ssg-dataset.streamlit.app/)

![](https://i.imgur.com/lzPCS5D.png)


### Jemstars Site Generators Github Stars 순위
출처: [https://jamstack.org/generators/](https://jamstack.org/generators/)

![](https://i.imgur.com/9NHYVlP.png)



## Jekyll, Hexo, Hugo, Gatsby 비교

### Jekyll

- **언어**: Ruby
- **특징**: GitHub Pages와 통합 용이, 블로그나 프로젝트 문서 호스팅에 적합
- **장점**: 간단한 블로그나 개인 웹사이트 빠르게 설정, 마크다운 사용
- **단점**: Ruby 환경 설정 필요, 대규모 사이트 빌드 시간 길어짐
- **Markdown 지원**: 가능
- **Obsidian 연결**: 가능 (Markdown 파일 기반)
- **GitHub Pages 배포**: 가능
- **테마 링크**:
  - [Jekyll Themes](https://jekyllthemes.io/)
  - [Dr. Jekyll's Themes](https://drjekyllthemes.github.io/)
  - [Jekyll Templates](https://www.jekylltemplates.com/)

### Hexo

- **언어**: Node.js
- **특징**: 빠른 렌더링 속도, 사용법 간단
- **장점**: 풍부한 플러그인과 테마, 블로그 관리 용이
- **단점**: Node.js 환경 필요, 플러그인/종속성 문제 발생 가능
- **Markdown 지원**: 가능
- **Obsidian 연결**: 가능 (Markdown 파일 기반)
- **GitHub Pages 배포**: 가능
- **테마 링크**:
  - [Hexo Themes](https://hexo.io/themes/)

### Hugo

- **언어**: Go
- **특징**: 매우 빠른 빌드 속도, 대규모 사이트에 적합
- **장점**: 설치 간편, 다양한 기능 내장, 빠른 성능
- **단점**: Go 언어 이해 필요, 사용자 커뮤니티 작음
- **Markdown 지원**: 가능
- **Obsidian 연결**: 가능 (Markdown 파일 기반)
- **GitHub Pages 배포**: 가능
- **테마 링크**:
  - [Hugo Themes](https://themes.gohugo.io/)

### Gatsby

- **언어**: React (JavaScript)
- **특징**: 현대적 웹 프레임워크, 빠른 웹사이트/앱 구축
- **장점**: 성능 최적화, 플러그인/커뮤니티 풍부, 다양한 콘텐츠 제공
- **단점**: React/GraphQL 학습 곡선, 간단한 웹사이트에는 과도할 수 있음
- **Markdown 지원**: 가능 (플러그인을 통해)
- **Obsidian 연결**: 가능하지만 설정이 복잡할 수 있음 (React 기반)
- **GitHub Pages 배포**: 가능, 추가 설정 필요
- **테마 링크**:
  - [Gatsby Themes](https://www.gatsbyjs.com/plugins/?=gatsby-theme)


## 결론:

새로운 깃 블로그 SSG를 알아보게 된 계기를 생각해보자면:
1. 기존 theme이 맘에 안듬
2. 새로운 시도
3. Trending 프레임워크 사용

개인적 조건:
1. Obsidian에 연결 가능(넘편리함)
2. Github page 사용 가능


위 내용을 종합해 봤을 때, Hugo 기반의 theme을 먼저 찾아보고 정 맘에 들지 않는다면 Gatsby로 시도해볼 생각이다. 