# 필요한 스크린샷 목록

글에 추가할 스크린샷들입니다. PDF에서 캡처해서 imgur에 올린 후 마크다운 이미지 링크로 추가해주세요.

## 1. The Non-consensus 표 (슬라이드 p.3)
**파일**: `content/AI/2025-10-26-context-engineering-for-ai-agents.md`
**위치**: "왜 컨텍스트 엔지니어링인가?" 섹션
**내용**: 다양한 프로젝트들의 Offload/Reduce/Retrieve/Isolate/Cache 전략 비교표
- Drew's Post vs Manus vs Anthropic-researcher vs Cognition vs LC open-deep-research

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.3 - The Non-consensus 표]**
```

**교체 후**:
```markdown
![The Non-consensus](https://i.imgur.com/xxxxx.png)
*다양한 AI 에이전트 프로젝트들의 컨텍스트 엔지니어링 전략 비교*
```

---

## 2. The First Trap (슬라이드 p.5)
**위치**: "파인튜닝이 아닌 컨텍스트 엔지니어링" 섹션
**내용**: IQ 분포 곡선 그래프
- "Train your own model!" vs "Context Engineering" 두 극단 표시

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.5 - The First Trap]**
```

**교체 후**:
```markdown
![The First Trap](https://i.imgur.com/xxxxx.png)
*모델 파인튜닝 vs 컨텍스트 엔지니어링: IQ 분포에서 극단적 선택의 함정*
```

---

## 3. Context Reduction - Compaction vs Summarization (슬라이드 p.8-9)
**위치**: "컨텍스트 축소" 섹션
**내용**:
- 왼쪽: 전체 도구 호출/결과
- 오른쪽 (Compaction): path만 남기고 압축
- 오른쪽 (Summarization): 파일 + 요약

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.8-9 - Context Reduction (Compaction vs Summarization)]**
```

**교체 후**:
```markdown
![Context Reduction: Compaction](https://i.imgur.com/xxxxx.png)
*압축(Compaction): 파일 시스템에서 재구성 가능한 정보 제거*

![Context Reduction: Summarization](https://i.imgur.com/xxxxx.png)
*요약(Summarization): 파일 + 구조화된 요약으로 비가역적 축소*
```

---

## 4. Context Reduction 그래프 (슬라이드 p.10-11)
**위치**: "압축과 요약의 차이점" 섹션
**내용**:
- X축: Turns (0-250)
- Y축: Context Length (K) (0-128)
- Compaction과 Summarization 발생 시점 표시

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.10-11 - Context Reduction 그래프]**
```

**교체 후**:
```markdown
![Context Reduction Graph](https://i.imgur.com/xxxxx.png)
*컨텍스트 길이 변화: Compaction과 Summarization 타이밍*
```

---

## 5. Context Isolation 패턴 (슬라이드 p.13-15)
**위치**: "컨텍스트 격리" 섹션
**내용**:
- p.13: Go 언어 인용구
- p.14: By Communicating 패턴 다이어그램
- p.15: By Sharing Memory 패턴 다이어그램

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.13-15 - Context Isolation 패턴]**
```

**교체 후**:
```markdown
![Context Isolation: By Communicating](https://i.imgur.com/xxxxx.png)
*통신을 통한 격리: 독립된 컨텍스트로 작업 위임*

![Context Isolation: By Sharing Context](https://i.imgur.com/xxxxx.png)
*메모리 공유를 통한 격리: 전체 컨텍스트 포크*
```

---

## 6. Hierarchical Action Space 다이어그램 (슬라이드 p.17-21)
**위치**: "계층형 액션 공간" 섹션
**내용**:
- Functions: message, shell, search, file, browser, ...
- 아래로 펼쳐지는 계층 구조
  - Level 2: $ manus-mcp-cli, $ manus-render-diagram
  - Level 3: create_3d_model.py, analyze_data.py

슬라이드 p.21에 전체 다이어그램이 있음

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.17-21 - Hierarchical Action Space]**
```

**교체 후**:
```markdown
![Hierarchical Action Space](https://i.imgur.com/xxxxx.png)
*3계층 액션 공간: 함수 호출 → 샌드박스 유틸리티 → 패키지/API*
```

---

## 7. Bringing It All Together (슬라이드 p.22)
**위치**: "5가지 차원의 상호연결성" 섹션
**내용**:
- Offload + Retrieve → Reduction
- Reliable Retrieve → Isolation
- Isolation → Reduction 빈도 감소
- All under Cache optimization

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.22 - Bringing It All Together]**
```

**교체 후**:
```markdown
![Bringing It All Together](https://i.imgur.com/xxxxx.png)
*5가지 차원의 상호연결성: 독립적이지 않은 컨텍스트 엔지니어링 기법들*
```

---

## 8. Avoid Context Over-Engineering (슬라이드 p.23-24)
**위치**: "과잉 엔지니어링을 피하라" 섹션
**내용**:
- More context ≠ more intelligence
- Simplification beats expansion
- p.24: "Build less, understand more."

**교체할 라인**:
```markdown
**[📸 필요한 스크린샷: 슬라이드 p.23-24 - Avoid Over-Engineering]**
```

**교체 후**:
```markdown
![Avoid Context Over-Engineering](https://i.imgur.com/xxxxx.png)
*컨텍스트 과잉 엔지니어링 피하기: 단순화가 확장을 이긴다*
```

---

## 작업 순서

1. ✅ 글 작성 완료
2. ⬜ PDF에서 8개 스크린샷 캡처
3. ⬜ Imgur에 업로드
4. ⬜ 마크다운 파일 업데이트
5. ⬜ 이 파일 삭제

## 팁

- 스크린샷은 깔끔하게 crop하기
- 필요시 화살표나 하이라이트 추가
- Imgur 링크는 Direct Link (`.png`로 끝나는 것) 사용하기
