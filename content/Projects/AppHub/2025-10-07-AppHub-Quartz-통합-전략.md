---
title: AppHub와 Quartz 블로그 통합 전략
date: 2025-10-07
tags:
  - AppHub
  - Projects
  - Quartz
  - Obsidian
  - NextJS
  - 아키텍처
  - 통합전략
  - RAG
  - 블로그
draft: false
enableToc: true
description: Obsidian Quartz 블로그를 AppHub 플랫폼에 통합하는 전략. Obsidian의 강력한 기능들을 유지하면서 Next.js 기반 통합 플랫폼의 일부로 만드는 방법과 RAG 시스템 구축 계획
---

> [!summary] **Quartz 블로그 + AppHub 통합**
> 기존 Quartz로 운영 중인 Obsidian 블로그를 AppHub의 첫 번째 프로젝트로 통합한다. Obsidian의 핵심 기능들(위키링크, 백링크, 그래프 뷰)을 유지하면서, AppHub의 통합 UI/UX와 RAG 챗봇을 결합하여 **살아있는 지식 베이스**를 구축한다.

## 프로젝트 배경

### 현재 상황

**Quartz 블로그 (syshin0116.github.io)**
- Obsidian vault를 웹으로 퍼블리싱
- 위키링크 `[[]]`, 백링크, 그래프 뷰 등 Obsidian 기능 완벽 지원
- SPA 라우팅, Popover 미리보기, 전체 텍스트 검색
- GitHub Pages로 배포

**AppHub의 첫 번째 프로젝트: 블로그 RAG 시스템**
- 내 블로그 포스트들을 RAG로 검색 가능하게
- LangGraph + pgvector 기반 AI 챗봇
- "이 개발자가 어떤 기술을 다뤘나요?" 같은 질문에 답변

### 핵심 과제

> [!question] **어떻게 통합할 것인가?**
> Quartz의 강력한 Obsidian 기능들을 포기하지 않으면서, AppHub의 통합된 경험을 제공할 수 있을까?

## Quartz를 선택한 이유 (유지해야 할 가치)

### 1. Obsidian 기능의 완벽한 웹 구현

| 기능 | Obsidian | Quartz | 일반 블로그 |
|------|----------|--------|------------|
| 위키링크 `[[]]` | ✅ | ✅ | ❌ |
| 양방향 백링크 | ✅ | ✅ | ❌ |
| 그래프 뷰 | ✅ | ✅ (D3.js) | ❌ |
| 태그 시스템 | ✅ | ✅ | 제한적 |
| Callout/Admonition | ✅ | ✅ | ❌ |
| Popover 미리보기 | ❌ | ✅ | ❌ |

### 2. 개발자 친화적 워크플로우

```
Obsidian에서 작성 → Git Push → 자동 배포
```

- 별도 CMS 불필요
- Markdown으로 모든 것 관리
- Git 기반 버전 관리

### 3. 강력한 플러그인 시스템

Quartz의 핵심 플러그인들:
- `ObsidianFlavoredMarkdown`: Obsidian 문법 완벽 지원
- `CrawlLinks`: 위키링크 자동 변환
- `Graph`: D3.js 기반 관계도 시각화
- `Latex`: 수식 렌더링 (KaTeX)
- `SyntaxHighlighting`: 코드 하이라이팅

## 블로그 포스트 지속 추가 시나리오

> [!important] **현재 워크플로우는 신성불가침**
> Quartz를 선택한 핵심 이유: `Obsidian에서 작성 → Git Push → 자동 배포`
> 이 워크플로우는 **절대 복잡해지면 안 됨**

### 각 옵션별 새 포스트 추가 프로세스

| 단계 | 옵션 1 (서브도메인) | 옵션 2 (완전 마이그레이션) | 옵션 3 (하이브리드) |
|------|-------------------|------------------------|-------------------|
| **1. 작성** | Obsidian | Obsidian | Obsidian |
| **2. 배포** | Git Push → Quartz 자동 빌드 ✅ | Git Push → Next.js 전체 빌드 ⚠️ | Git Push → Webhook 트리거 ✅ |
| **3. 웹 반영** | 즉시 (Quartz) | ISR/SSG 재빌드 | ISR 캐시 무효화 (즉시) |
| **4. RAG 업데이트** | GitHub Actions 별도 트리거 | 빌드 프로세스에 포함 | Webhook → 증분 인덱싱 |
| **5. 백링크 업데이트** | Quartz 자동 | 전체 재계산 필요 | 증분 업데이트 |
| **총 소요시간** | ~2분 | ~5-10분 (전체 빌드) | ~1분 (증분) |

### 자동화 파이프라인 필요사항

#### 옵션 1: 서브도메인 분리
```yaml
# 단순하지만 RAG만 별도 관리
on:
  push:
    paths: ['content/**/*.md']
jobs:
  rag-index:
    - name: RAG 증분 인덱싱
      run: python index_new_posts.py
```

**특징:**
- ✅ 가장 단순
- 🤔 RAG와 웹사이트가 분리되어 관리

#### 옵션 2: 완전 마이그레이션
```yaml
# Next.js가 모든 것 처리 (복잡)
on:
  push:
jobs:
  build-and-index:
    - name: Next.js 빌드 (모든 페이지)
    - name: 백링크 재계산
    - name: RAG 인덱싱
    # ⚠️ 빌드 시간 증가
```

**특징:**
- ⚠️ 전체 재빌드 필요
- ⚠️ 포스트 개수 증가 시 느려짐

#### 옵션 3: 하이브리드 (추천)
```yaml
# 똑똑한 증분 업데이트
on:
  push:
    paths: ['content/**/*.md']
jobs:
  incremental-update:
    steps:
      # 1. 변경된 파일만 감지
      - name: Get changed files
        id: changed
        uses: tj-actions/changed-files@v41
      
      # 2. Next.js ISR 캐시 무효화 (즉시 반영)
      - name: Revalidate Next.js
        run: |
          for file in ${{ steps.changed.outputs.all_changed_files }}; do
            curl -X POST https://apphub.com/api/revalidate \
              -d "{\"path\": \"/blog/${file}\"}"
          done
      
      # 3. RAG 증분 인덱싱 (변경된 파일만)
      - name: Incremental RAG Index
        run: |
          python scripts/incremental_index.py \
            --files "${{ steps.changed.outputs.all_changed_files }}"
      
      # 4. 백링크 증분 업데이트
      - name: Update Backlinks
        run: |
          python scripts/update_backlinks.py \
            --changed "${{ steps.changed.outputs.all_changed_files }}"
```

**특징:**
- ✅ 변경된 파일만 처리 (빠름)
- ✅ 전체 재빌드 불필요
- ✅ 확장성 우수 (수천 개 포스트도 문제없음)

### 증분 인덱싱 구현 예시

```python
# scripts/incremental_index.py
from pathlib import Path
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings

def incremental_index(changed_files: list[str]):
    """변경된 파일만 RAG에 업데이트"""
    
    vectorstore = PGVector(
        connection_string=DATABASE_URL,
        collection_name='blog_posts',
        embedding_function=OpenAIEmbeddings(),
    )
    
    for file_path in changed_files:
        # 1. 기존 벡터 삭제 (있다면)
        vectorstore.delete(
            filter={"source": file_path}
        )
        
        # 2. 새 문서 파싱 및 청크 분할
        document = parse_markdown(file_path)
        chunks = split_document(document)
        
        # 3. 새 벡터 추가
        vectorstore.add_documents(chunks)
        
        print(f"✅ Updated: {file_path}")
    
    print(f"🎉 Total updated: {len(changed_files)} files")
```

### 백링크 증분 업데이트

```typescript
// scripts/update_backlinks.ts
import { readFileSync, writeFileSync } from 'fs'

function updateBacklinksIncremental(changedFiles: string[]) {
  // 기존 백링크 인덱스 로드
  const backlinks = JSON.parse(
    readFileSync('data/backlinks.json', 'utf8')
  )
  
  changedFiles.forEach(file => {
    const content = readFileSync(file, 'utf8')
    const links = extractWikiLinks(content) // [[link]] 추출
    
    // 이 파일이 참조하는 링크들의 백링크에 추가
    links.forEach(target => {
      if (!backlinks[target]) {
        backlinks[target] = []
      }
      
      // 중복 제거하며 추가
      const slug = fileToSlug(file)
      if (!backlinks[target].includes(slug)) {
        backlinks[target].push(slug)
      }
    })
  })
  
  // 업데이트된 인덱스 저장
  writeFileSync(
    'data/backlinks.json', 
    JSON.stringify(backlinks, null, 2)
  )
}
```

## 통합 전략 비교

### 옵션 1: 서브도메인 분리 (가장 간단)

```
https://apphub.com          → Next.js AppHub 메인
https://blog.apphub.com     → Quartz 블로그 (독립)
```

**구조:**
```
AppHub (Next.js)
├── 메인 대시보드
├── RAG 챗봇 → Quartz 콘텐츠 인덱싱
└── 블로그 링크 → blog.apphub.com (Quartz)

Quartz (별도 배포)
└── 기존 Quartz 그대로 유지
```

| 평가 기준 | 점수 | 설명 |
|----------|------|------|
| **구현 난이도** | ⭐⭐⭐⭐⭐ | 매우 쉬움 - 기존 Quartz 그대로 |
| **Quartz 기능 유지** | ⭐⭐⭐⭐⭐ | 100% 유지 |
| **UI/UX 통합** | ⭐ | 분리된 디자인 |
| **포스트 추가 편의성** | ⭐⭐⭐⭐⭐ | Git Push만 하면 됨 |
| **RAG 업데이트** | ⭐⭐⭐ | 별도 트리거 필요 |
| **확장성** | ⭐⭐⭐⭐ | 각자 독립적 확장 |
| **개발 기간** | 1-2주 | 빠른 구현 |

**종합 평가:** 빠른 MVP에는 좋지만, "통합 플랫폼"이라는 AppHub의 핵심 가치와 맞지 않음

---

### 옵션 2: 완전 마이그레이션 (가장 통합적)

```
AppHub (Next.js)
└── /blog
    └── Quartz 기능을 Next.js로 재구현
```

**구조:**
```typescript
// Next.js로 Quartz 기능 재구현
app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx          // MDX 렌더링
│   ├── graph/
│   │   └── page.tsx          // D3.js React 컴포넌트
│   └── components/
│       ├── Backlinks.tsx     // 백링크 컴포넌트
│       ├── WikiLink.tsx      // 위키링크 파서
│       └── GraphView.tsx     // 그래프 시각화
└── api/
    └── search/
        └── route.ts          // 검색 API
```

| 평가 기준 | 점수 | 설명 |
|----------|------|------|
| **구현 난이도** | ⭐ | 매우 어려움 - 모든 것 재구현 |
| **Quartz 기능 유지** | ⭐⭐ | 수동 재구현 필요 |
| **UI/UX 통합** | ⭐⭐⭐⭐⭐ | 완벽한 통합 |
| **포스트 추가 편의성** | ⭐⭐ | 전체 빌드 필요 (느림) |
| **RAG 업데이트** | ⭐⭐⭐⭐ | 빌드 프로세스에 통합 |
| **확장성** | ⭐⭐ | 포스트 증가 시 빌드 시간↑ |
| **개발 기간** | 2-3개월 | 매우 긴 개발 |

**종합 평가:** 이상적이지만 개발 비용이 너무 높음. "빠른 MVP 검증"과 맞지 않음

---

### 옵션 3: 하이브리드 통합 ⭐ **최종 선택**

```
AppHub (Next.js)
├── /blog → Next.js로 렌더링 (UI 통합)
│   ├── 콘텐츠: Quartz content/ 공유
│   ├── 파싱: Quartz 플러그인 재사용
│   └── 고급 기능: Quartz 임베드
└── /chat → RAG 챗봇
```

**아키텍처:**

```
┌─────────────────────────────────────────────┐
│           AppHub (Next.js 15)               │
├─────────────────────────────────────────────┤
│  /blog                                      │
│  ├─ SSG: Markdown → HTML                   │
│  │  └─ Quartz 플러그인 사용 ✓              │
│  ├─ UI: ShadCN (통일된 디자인)             │
│  └─ 그래프 뷰: Quartz 임베드               │
│                                             │
│  /chat (RAG)                                │
│  ├─ LangGraph + pgvector                   │
│  └─ 인덱싱: Quartz 콘텐츠                  │
└─────────────────────────────────────────────┘
         ↓ 콘텐츠 소스
┌─────────────────────────────────────────────┐
│     content/ (Obsidian Vault)               │
│     - 단일 소스, 양쪽에서 공유              │
└─────────────────────────────────────────────┘
```

**장점:**
- ✅ 구현 난이도: 중간
- ✅ Obsidian 기능 유지 (Quartz 플러그인 활용)
- ✅ UI 통일 (Next.js + ShadCN)
- ✅ 점진적 마이그레이션 가능
- ✅ 개발 기간: 3-4주

**단점:**
- 🤔 초기 설정 복잡도
- 🤔 Quartz 플러그인 Next.js 통합 필요

**평가:** 최고의 균형점. Quartz의 장점 유지 + AppHub 통합

## 구체적 구현 계획 (옵션 3)

### Phase 1: 콘텐츠 소스 공유

**Monorepo 구조:**
```
AppHub/
├── content/                 # Obsidian vault (공유)
│   ├── Projects/
│   ├── AI/
│   ├── Dev/
│   └── ...
├── apps/
│   ├── web/                 # Next.js AppHub
│   │   ├── app/
│   │   │   └── blog/
│   │   └── lib/
│   │       └── content/     # content/ 읽기
│   └── ai-service/          # LangGraph Python
└── packages/
    └── quartz-plugins/      # Quartz 플러그인 추출
```

**설정:**
```typescript
// apps/web/lib/content/loader.ts
import { readFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const contentDir = join(process.cwd(), '../../content')

export function getPost(slug: string) {
  const fullPath = join(contentDir, `${slug}.md`)
  const fileContents = readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug,
    frontmatter: data,
    content,
  }
}
```

### Phase 2: Quartz 플러그인 활용

**Quartz 파서 재사용:**
```typescript
// packages/quartz-plugins/src/parser.ts
import { unified } from 'unified'
import { ObsidianFlavoredMarkdown } from './plugins/obsidian'
import { WikiLinkParser } from './plugins/wikilink'
import { remarkMath } from 'remark-math'
import { rehypeKatex } from 'rehype-katex'

export async function parseQuartzMarkdown(content: string) {
  const processor = unified()
    .use(remarkParse)
    .use(ObsidianFlavoredMarkdown)  // Quartz 플러그인
    .use(WikiLinkParser)             // 위키링크 변환
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
  
  const result = await processor.process(content)
  return result.toString()
}
```

**Next.js에서 사용:**
```typescript
// app/blog/[slug]/page.tsx
import { getPost } from '@/lib/content/loader'
import { parseQuartzMarkdown } from '@apphub/quartz-plugins'

export default async function BlogPost({ params }) {
  const post = getPost(params.slug)
  const html = await parseQuartzMarkdown(post.content)
  
  return (
    <article className="prose dark:prose-invert">
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Backlinks slug={params.slug} />
    </article>
  )
}
```

### Phase 3: 백링크 시스템 구현

**백링크 인덱싱:**
```typescript
// lib/content/backlinks.ts
import { getAllPosts } from './loader'

export function buildBacklinksIndex() {
  const posts = getAllPosts()
  const backlinks = new Map<string, string[]>()
  
  posts.forEach(post => {
    // [[wikilink]] 패턴 찾기
    const links = post.content.match(/\[\[([^\]]+)\]\]/g) || []
    
    links.forEach(link => {
      const target = link.slice(2, -2)
      if (!backlinks.has(target)) {
        backlinks.set(target, [])
      }
      backlinks.get(target)!.push(post.slug)
    })
  })
  
  return backlinks
}
```

**백링크 컴포넌트:**
```tsx
// components/Backlinks.tsx
import { getBacklinks } from '@/lib/content/backlinks'
import Link from 'next/link'

export function Backlinks({ slug }: { slug: string }) {
  const backlinks = getBacklinks(slug)
  
  if (backlinks.length === 0) return null
  
  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-semibold">참조된 곳</h3>
      <ul className="mt-2 space-y-1">
        {backlinks.map(link => (
          <li key={link.slug}>
            <Link 
              href={`/blog/${link.slug}`}
              className="text-blue-600 hover:underline"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Phase 4: 그래프 뷰 통합

**옵션 A: Quartz 그래프를 iframe으로 임베드** (빠른 구현)
```tsx
// app/blog/graph/page.tsx
export default function GraphPage() {
  return (
    <div className="h-screen">
      <iframe 
        src="https://quartz-graph.apphub.com"
        className="w-full h-full border-0"
        title="Blog Graph"
      />
    </div>
  )
}
```

**옵션 B: D3.js 그래프를 React로 재구현** (완전 통합)
```tsx
// components/GraphView.tsx
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export function GraphView({ nodes, links }) {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!svgRef.current) return
    
    const svg = d3.select(svgRef.current)
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
    
    // D3.js 그래프 렌더링 로직
    // ... Quartz 그래프 코드 참고
  }, [nodes, links])
  
  return <svg ref={svgRef} className="w-full h-full" />
}
```

### Phase 5: RAG 시스템 구축

**LangGraph 인덱싱 파이프라인:**
```python
# apps/ai-service/indexing/blog_indexer.py
from pathlib import Path
from langchain.text_splitter import MarkdownTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_postgres import PGVector

def index_blog_content():
    """Quartz content/ 폴더를 RAG용으로 인덱싱"""
    
    content_dir = Path("../../content")
    documents = []
    
    # 모든 마크다운 파일 로드
    for md_file in content_dir.rglob("*.md"):
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 메타데이터 추출 (frontmatter)
        metadata = extract_frontmatter(content)
        
        documents.append({
            'content': content,
            'metadata': {
                **metadata,
                'source': str(md_file.relative_to(content_dir)),
                'slug': md_file.stem,
            }
        })
    
    # 청크로 분할
    splitter = MarkdownTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    chunks = splitter.split_documents(documents)
    
    # pgvector에 저장
    vectorstore = PGVector.from_documents(
        documents=chunks,
        embedding=OpenAIEmbeddings(),
        connection_string=DATABASE_URL,
        collection_name='blog_posts',
    )
    
    return vectorstore
```

**RAG 챗봇 에이전트:**
```python
# apps/ai-service/agents/blog_assistant.py
from langgraph.graph import StateGraph
from langchain_openai import ChatOpenAI
from langchain_postgres import PGVector

def create_blog_assistant():
    """블로그 콘텐츠 기반 RAG 챗봇"""
    
    # Vector Store 연결
    vectorstore = PGVector(
        connection_string=DATABASE_URL,
        collection_name='blog_posts',
        embedding_function=OpenAIEmbeddings(),
    )
    
    def search_blog(state):
        """블로그 콘텐츠 검색"""
        query = state['messages'][-1].content
        
        # 유사도 검색
        docs = vectorstore.similarity_search(query, k=5)
        
        return {
            'context': docs,
        }
    
    def generate_answer(state):
        """답변 생성"""
        llm = ChatOpenAI(model='gpt-4')
        
        prompt = f"""
        다음은 개발자의 블로그 포스트 내용입니다:
        
        {state['context']}
        
        질문: {state['messages'][-1].content}
        
        블로그 내용을 바탕으로 답변해주세요. 
        관련 포스트가 있다면 제목과 링크를 포함하세요.
        """
        
        response = llm.invoke(prompt)
        
        return {
            'messages': state['messages'] + [response],
        }
    
    # 워크플로우 구성
    workflow = StateGraph(AgentState)
    workflow.add_node('search', search_blog)
    workflow.add_node('answer', generate_answer)
    workflow.add_edge('search', 'answer')
    
    return workflow.compile()
```

### Phase 6: Next.js UI 통합

**블로그 + 챗봇 통합 UI:**
```tsx
// app/blog/[slug]/page.tsx
import { ChatInterface } from '@/components/ChatInterface'
import { Backlinks } from '@/components/Backlinks'

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 메인 콘텐츠 */}
      <article className="lg:col-span-2">
        <BlogContent post={post} />
        <Backlinks slug={params.slug} />
      </article>
      
      {/* 사이드바: AI 챗봇 */}
      <aside className="lg:col-span-1">
        <div className="sticky top-4">
          <ChatInterface 
            context={`현재 글: ${post.frontmatter.title}`}
            placeholder="이 글에 대해 질문하세요..."
          />
        </div>
      </aside>
    </div>
  )
}
```

## 기술 스택 정리

### Frontend (Next.js)
- **Framework**: Next.js 15
- **UI**: ShadCN/UI + Tailwind CSS
- **Markdown**: Quartz 플러그인 재사용
  - `ObsidianFlavoredMarkdown`
  - `WikiLinkParser`
  - `SyntaxHighlighting`
- **Graph**: D3.js (Quartz 코드 참고)

### Backend (LangGraph)
- **AI Framework**: LangGraph Python
- **Vector Store**: pgvector
- **Embeddings**: OpenAI text-embedding-3
- **LLM**: GPT-4

### 콘텐츠
- **소스**: Obsidian vault (단일 소스)
- **포맷**: Markdown + Frontmatter
- **버전 관리**: Git

## 단계별 구현 로드맵

### Week 1-2: 콘텐츠 통합
- [ ] Monorepo 구조 설정
- [ ] content/ 폴더 공유 설정
- [ ] Quartz 플러그인 추출 및 패키지화
- [ ] Next.js에서 Markdown 렌더링 구현

### Week 3-4: 백링크 & 검색
- [ ] 위키링크 파서 구현
- [ ] 백링크 인덱스 구축
- [ ] 백링크 컴포넌트 개발
- [ ] 전체 텍스트 검색 (Algolia or Meilisearch)

### Week 5-6: RAG 시스템
- [ ] pgvector 스키마 설계
- [ ] 블로그 콘텐츠 인덱싱 파이프라인
- [ ] LangGraph RAG 에이전트 구현
- [ ] Next.js API Routes 연결

### Week 7-8: UI/UX 완성
- [ ] 블로그 레이아웃 디자인
- [ ] 챗봇 UI 통합
- [ ] 그래프 뷰 구현 (옵션 선택)
- [ ] 반응형 디자인

### Week 9-10: 배포 & 최적화
- [ ] Vercel 배포 설정
- [ ] Railway (AI 서비스 + DB)
- [ ] 성능 최적화
- [ ] SEO 최적화

## 예상 결과물

### 사용자 경험

1. **블로그 읽기**
   ```
   apphub.com/blog/langgraph-tutorial
   → Next.js로 렌더링
   → ShadCN 디자인
   → 백링크, 태그 표시
   ```

2. **AI 챗봇 질문**
   ```
   사용자: "이 개발자는 LangGraph를 어떻게 사용했나요?"
   챗봇: "LangGraph 관련 포스트 3개를 찾았습니다:
         1. LangGraph 튜토리얼 - 기본 개념 설명
         2. Multi-Agent 아키텍처 - LangGraph로 구현
         3. AppHub 기술 스택 - LangGraph 선택 이유
         
         [각 포스트 요약 + 링크]"
   ```

3. **그래프 탐색**
   ```
   apphub.com/blog/graph
   → D3.js 인터랙티브 그래프
   → 노드 클릭 → 해당 포스트로 이동
   → AppHub 디자인 시스템 적용
   ```

## 핵심 가치 제안

> [!success] **Living Knowledge Base**
> Quartz의 Obsidian 기능 + AppHub의 AI 챗봇 = **살아있는 지식 베이스**

### 방문자 경험
```
1. 블로그 포스트 읽기
   ↓
2. "이 개발자 다른 관련 글은?" → 백링크 & 그래프
   ↓
3. "더 자세한 내용 궁금한데?" → AI 챗봇 질문
   ↓
4. "다른 프로젝트도 보고 싶다" → AppHub 다른 프로젝트로 이동
```

### 포트폴리오 차별화
- ❌ 일반 블로그: 글만 읽고 끝
- ✅ AppHub 블로그: 
  - Obsidian 그래프로 지식 구조 시각화
  - AI 챗봇과 대화하며 탐색
  - 다른 프로젝트와 자연스럽게 연결

## 관련 문서

- [[2025-06-28-AppHub-개인-프로젝트-플랫폼-기획]] - AppHub 전체 기획
- [[2025-07-26-AppHub-구조-및-기술-스택]] - 기술 스택 상세
- [[Quartz, GitHub Pages 사용하여 Obsidian 노트 배포]] - 현재 Quartz 설정

## 다음 단계

1. **의사결정**: Phase 4 그래프 뷰 구현 방식 (iframe vs 재구현)
2. **검색 도구**: Algolia vs Meilisearch vs Custom (LangGraph)
3. **배포 전략**: Vercel + Railway vs GCP
4. **프로토타입**: 2주 내 MVP 구현 시작
