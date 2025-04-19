---
title: "홈페이지"
enableToc: false
---

# 사용자 지식 베이스

> 이 지식 베이스는 개발, AI, 도구 등 다양한 주제에 대한 정보와 노트를 모아둔 곳입니다.
> 주로 개발자 생산성, 머신러닝, 설정 가이드 등을 다룹니다.

## 최근 글

<div id="recent-notes">
  <h3>최근 아티클</h3>
  <div class="recent-articles-container">
    <p>불러오는 중...</p>
  </div>
</div>

<script>
// 최근 아티클을 불러오는 스크립트
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // contentIndex.json 파일 가져오기
    const response = await fetch('/static/contentIndex.json');
    const data = await response.json();
    
    // 모든 콘텐츠 항목을 배열로 변환
    const allItems = Object.entries(data).map(([slug, content]) => {
      return {
        slug: slug,
        title: content.title || slug,
        date: content.date,
        tags: content.tags || [],
        description: content.description || ''
      };
    });
    
    // 1일 1아티클 챌린지 글만 필터링
    const recentArticles = allItems.filter(item => {
      return item.slug.includes('1일 1아티클 챌린지') && !item.slug.includes('항해99 1일 1아티클 챌린지');
    });
    
    // 날짜 기준으로 정렬 (최신순)
    recentArticles.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    // 최대 5개 표시
    const limitedArticles = recentArticles.slice(0, 5);
    
    // HTML 생성
    const container = document.querySelector('.recent-articles-container');
    
    if (limitedArticles.length === 0) {
      container.innerHTML = '<p>최근 아티클이 없습니다.</p>';
      return;
    }
    
    const ul = document.createElement('ul');
    ul.className = 'recent-ul';
    
    limitedArticles.forEach(article => {
      const li = document.createElement('li');
      li.className = 'recent-li';
      
      const section = document.createElement('div');
      section.className = 'section';
      
      const desc = document.createElement('div');
      desc.className = 'desc';
      
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = '/' + article.slug;
      a.className = 'internal';
      a.textContent = article.title;
      h3.appendChild(a);
      
      desc.appendChild(h3);
      
      const meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = article.date ? new Date(article.date).toLocaleDateString('ko-KR') : '';
      
      section.appendChild(desc);
      section.appendChild(meta);
      
      // 태그가 있으면 표시
      if (article.tags && article.tags.length > 0) {
        const tagsList = document.createElement('ul');
        tagsList.className = 'tags';
        
        article.tags.forEach(tag => {
          const tagLi = document.createElement('li');
          const tagA = document.createElement('a');
          tagA.className = 'internal tag-link';
          tagA.href = '/tags/' + tag;
          tagA.textContent = tag;
          
          tagLi.appendChild(tagA);
          tagsList.appendChild(tagLi);
        });
        
        section.appendChild(tagsList);
      }
      
      li.appendChild(section);
      ul.appendChild(li);
    });
    
    container.innerHTML = '';
    container.appendChild(ul);
    
    // 더 보기 링크 추가
    const moreLink = document.createElement('p');
    const moreA = document.createElement('a');
    moreA.href = '/Events/1일%201아티클%20챌린지/항해99%201일%201아티클%20챌린지';
    moreA.className = 'internal';
    moreA.textContent = '더 많은 아티클 보기';
    moreLink.appendChild(moreA);
    container.appendChild(moreLink);
    
  } catch (error) {
    console.error('아티클을 불러오는 중 오류가 발생했습니다:', error);
    document.querySelector('.recent-articles-container').innerHTML = '<p>아티클을 불러오는 데 실패했습니다.</p>';
  }
});
</script>

<style>
.recent-articles-container {
  margin-top: 1rem;
}

.recent-ul {
  list-style: none;
  margin-top: 1rem;
  padding-left: 0;
}

.recent-li {
  margin: 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--lightgray);
}

.recent-li .section .desc h3 a {
  background-color: transparent;
}

.recent-li .section .meta {
  margin: 0 0 0.5rem 0;
  opacity: 0.6;
}
</style>

## 루트 폴더 내용

<div id="root-folder-content" class="popover-hint">
  <p>파일을 불러오는 중...</p>
</div>

<script>
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // contentIndex.json 파일 가져오기
    const response = await fetch('/static/contentIndex.json');
    const data = await response.json();
    
    // 모든 콘텐츠 항목을 배열로 변환
    const allItems = Object.entries(data).map(([slug, content]) => {
      return {
        slug: slug,
        title: content.title || slug,
        tags: content.tags || []
      };
    });
    
    // root 수준의 파일과 폴더 필터링 (FolderContent 컴포넌트와 유사한 로직)
    const rootItems = allItems.filter(item => {
      // index.md 자체는 제외
      if (item.slug === 'index') return false;
      
      // 태그 페이지 제외
      if (item.slug.startsWith('tags/')) return false;
      
      // Root 수준 항목인지 확인 (슬래시가 없거나 하나만 있고 끝에 있는 경우)
      const parts = item.slug.split('/');
      return parts.length === 1 || (parts.length === 2 && parts[1] === '');
    });
    
    // HTML 생성
    const container = document.getElementById('root-folder-content');
    
    if (rootItems.length === 0) {
      container.innerHTML = '<p>root 수준의 항목이 없습니다.</p>';
      return;
    }
    
    // FolderContent 컴포넌트와 유사한 HTML 구조 생성
    const pageListing = document.createElement('div');
    pageListing.className = 'page-listing';
    
    // 항목 개수 표시 (FolderContent 스타일)
    const countText = document.createElement('p');
    countText.textContent = `${rootItems.length}개 항목`;
    pageListing.appendChild(countText);
    
    // 항목 목록 생성
    const listDiv = document.createElement('div');
    const ul = document.createElement('ul');
    ul.className = 'section-ul';
    
    // 항목을 사전순으로 정렬
    rootItems.sort((a, b) => a.title.localeCompare(b.title));
    
    rootItems.forEach(item => {
      const li = document.createElement('li');
      li.className = 'section-li';
      
      const section = document.createElement('div');
      section.className = 'section';
      
      const desc = document.createElement('div');
      desc.className = 'desc';
      
      const h3 = document.createElement('h3');
      const a = document.createElement('a');
      a.href = '/' + item.slug;
      a.className = 'internal';
      a.textContent = item.title;
      h3.appendChild(a);
      
      desc.appendChild(h3);
      section.appendChild(desc);
      
      // 태그가 있으면 표시
      if (item.tags && item.tags.length > 0) {
        const tagsList = document.createElement('ul');
        tagsList.className = 'tags';
        
        item.tags.forEach(tag => {
          const tagLi = document.createElement('li');
          const tagA = document.createElement('a');
          tagA.className = 'internal tag-link';
          tagA.href = '/tags/' + tag;
          tagA.textContent = tag;
          
          tagLi.appendChild(tagA);
          tagsList.appendChild(tagLi);
        });
        
        section.appendChild(tagsList);
      }
      
      li.appendChild(section);
      ul.appendChild(li);
    });
    
    listDiv.appendChild(ul);
    pageListing.appendChild(listDiv);
    
    // 기존 내용 제거 후 새 내용 추가
    container.innerHTML = '';
    
    // 설명 영역 (선택 사항)
    const article = document.createElement('article');
    article.innerHTML = '<p>Root 수준의 파일 및 폴더 목록입니다.</p>';
    container.appendChild(article);
    
    container.appendChild(pageListing);
    
  } catch (error) {
    console.error('파일을 불러오는 중 오류가 발생했습니다:', error);
    document.getElementById('root-folder-content').innerHTML = '<p>파일을 불러오는 데 실패했습니다.</p>';
  }
});
</script>

## 카테고리별 문서

### 개발 (Dev)

개발 관련 문서들입니다:
- [[Dev/index|개발 문서 목록]]

### 도구 (Tools)

도구 및 생산성 향상 가이드:
- [[Tools/Mac/2025-05-18-맥북 초기 세팅|맥북 초기 세팅]]

### AI / 머신러닝

AI 및 머신러닝 관련 문서:
- [[AI/Anomaly Detection|Anomaly Detection]]

## 주제별 태그

- [#생산성도구](/tags/생산성도구)
- [#개발환경](/tags/개발환경) 
- [#초기설정](/tags/초기설정)
- [#anomaly-detection](/tags/anomaly-detection)
- [#machine-learning](/tags/machine-learning)

**안녕하세요, syshin0116입니다!**

AI와 웹 개발, 특히 Python과 LangChain을 활용한 프로젝트에 관심이 많습니다.

현재 RAG 기반 AI 솔루션 개발에 집중하고 있으며, 새로운 기술과 협업에 항상 열려 있습니다.


📧 **Email:** [syshin0116@gmail.com](mailto:syshin0116@gmail.com)

💻 **GitHub:** [github.com/syshin0116](https://github.com/syshin0116)
