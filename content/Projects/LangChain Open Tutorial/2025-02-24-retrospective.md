---
layout: post
title: "[LangChain Open Tutorial]프로젝트 회고록"
date: 2025-02-24 22:12 +0900
categories:
  - Project
  - LangChain Open Tutorial
tags: 
math: true
---

## 배경

유튜버 **TeddyNote님**이 최근 가장 관심 있어하는 **RAG(Retrieval-Augmented Generation)** 관련 **LangChain 오픈소스 튜토리얼** 기여자를 모집한다는 소식을 접했다. 단순히 팬으로서가 아니라, **관심 있는 주제에 직접 기여할 수 있는 기회**라는 점에서 매력적이었다. 특히, 규모 있는 오픈소스 프로젝트에 참여하고, 다양한 사람들과 협업하는 경험이 처음이라 더욱 기대되었다.

튜토리얼 기여 과정은 약 7주 동안 진행되었으며, 전체 프로젝트에서 **2000개 이상의 커밋**이 쌓일 정도로 활발하게 진행되었다. 첫 주에는 모든 기여자가 공통적으로 기존 튜토리얼을 검토하고 번역하는 작업을 수행했다. 이후부터는 최대한 **신규 튜토리얼 제작에 집중적으로 참여**하며, 직접 내용을 구성하고 구현하는 작업을 맡았다.

Gitbook: [🦜️🔗 The LangChain Open Tutorial for Everyone](https://langchain-opentutorial.gitbook.io/langchain-opentutorial)
Github: [LangChain-OpenTutorial](https://github.com/LangChain-OpenTutorial/LangChain-OpenTutorial)


## 기여 튜토리얼

### LlamaParse 튜토리얼
- **GitBook:** [LlamaParse Gitbook](https://langchain-opentutorial.gitbook.io/langchain-opentutorial/06-documentloader/12-llamaparse)
- **GitHub**: [LlamaParse 튜토리얼 코드](https://github.com/LangChain-OpenTutorial/LangChain-OpenTutorial/blob/main/06-DocumentLoader/13-LlamaParse.ipynb)
- **Google Colab**: [Colab에서 실행하기](https://colab.research.google.com/github/LangChain-OpenTutorial/LangChain-OpenTutorial/blob/main/06-DocumentLoader/13-LlamaParse.ipynb)

가장 첫번째로 작성한 튜토리얼로, 새로운 내용을 만들기 보다는, 기존에 있던 튜토리얼을 검토하고 번역하는 작업에 가까웠다. 나머지 신규 프로젝트들에 비해 흥미는 떨어졌지만, 튜토리얼 작성법, 그리고 대규모 프로젝트의 워크플로우를 익히기에 좋은 실전 연습이었다고 생각한다.

이 튜토리얼에서는 **LlamaIndex에서 제공하는 LlamaParse**를 활용해 **문서를 효과적으로 파싱하는 방법**을 다뤘다. LlamaParse는 단순한 문서 로딩을 넘어, **PDF, Word, PowerPoint, Excel 등 다양한 포맷을 지원**하며, 자연어 명령을 통한 커스텀 출력, 이미지 및 표 추출, 다국어 지원까지 제공하는 강력한 도구다.

LLM 기반 애플리케이션에서 문서 처리는 중요한 요소인데, LlamaParse를 활용하면 **RAG(Retrieval-Augmented Generation)** 같은 시스템에서 **보다 정교한 문서 검색과 활용이 가능해진다**. 이번 튜토리얼에서는 **기본적인 문서 파싱부터 멀티모달 모델을 활용한 고급 파싱까지** 실습하며, LlamaParse의 기능을 체계적으로 정리했다.


### 핵심 구현 포인트

- **기본 문서 파싱**
    
    - PDF 파일을 LlamaParse를 활용해 로드하고, LangChain 문서 객체로 변환
    - LlamaParse가 단순한 텍스트 추출이 아니라, 문서 구조를 인식하여 보다 정리된 결과를 제공
- **멀티모달 모델을 이용한 문서 해석**
    
    - OpenAI **GPT-4o** 같은 모델을 활용해 **이미지, 표, 그래프까지 해석**
    - 단순 텍스트뿐만 아니라 문서의 시각적 요소까지 처리할 수 있는 점이 인상적
- **커스텀 파싱 설정**
    
    - 특정 요구사항에 맞춰 **자연어 명령을 사용하여 출력 형식을 조정**
    - 예를 들어, 문서에서 **요약된 내용만 추출**하거나, **특정 섹션만 필터링**하는 방식 구현
- **파라미터 튜닝 및 고급 기능 활용**
    
    - LlamaParse의 **세부 설정값**을 조정해 최적의 문서 파싱 성능을 확보
    - OCR 기반 이미지 텍스트 추출, JSON 포맷 출력 등 다양한 기능 실험

### 배운 점 & 개선할 점

✔ **LLM 기반 문서 처리가 더 강력해질 가능성**  
기존에는 문서에서 **단순히 텍스트를 추출하는 방식**이 대부분이었다. 하지만 LlamaParse는 문서 내 정보의 **위치, 컨텍스트, 의미까지 고려한 파싱**이 가능해서, **LLM과 결합하면 문서 이해력이 훨씬 높아질 것**이라는 점을 실감했다.

✔ **멀티모달 문서 처리의 가능성**  
PDF나 이미지 기반 문서에서도 **표, 다이어그램, 강조된 텍스트까지 분석 가능**하다는 점이 특히 인상적이었다. 앞으로는 **멀티모달 AI와 결합해 문서를 단순히 "텍스트화"하는 것이 아니라, 시각적 요소까지 활용하는 방향**으로 발전할 가능성이 크다고 본다.

✔ **자연어 기반 파싱의 유용성**  
커스텀 파싱 설정을 할 때 복잡한 코드 작성 없이 **자연어 명령으로 원하는 데이터를 추출할 수 있다는 점**이 강력했다. 다만, **출력 형식이 복잡해질 경우에는 여전히 추가적인 후처리가 필요**하다는 점을 고려해야 한다.

---

### Conversation Memory Management System 튜토리얼

- **GitBook**: [ConversationMemoryManagementSystem GitBook](https://langchain-opentutorial.gitbook.io/langchain-opentutorial/19-cookbook/05-aimemorymanagementsystem/09-conversationmemorymanagementsystem)
- **GitHub**: [Conversation Memory Management System 튜토리얼 코드](https://github.com/LangChain-OpenTutorial/LangChain-OpenTutorial/blob/main/19-Cookbook/07-Agent/15-CoT-basedSmartWebSearch.ipynb)
- **Google Colab**: [Colab에서 실행하기](https://colab.research.google.com/github/LangChain-OpenTutorial/LangChain-OpenTutorial/blob/main/19-Cookbook/07-Agent/15-CoT-basedSmartWebSearch.ipynb)


이 튜토리얼에서는 **LangChain의 LangGraph를 활용해 AI 챗봇의 대화 메모리 관리 시스템을 구축하는 과정**을 다뤘다. AI 챗봇이 **사용자의 맥락을 지속적으로 유지하며 더 자연스러운 대화를 이어가는 것**이 핵심 목표였고, 이를 위해 **단기 및 장기 메모리를 효과적으로 저장, 검색, 업데이트하는 시스템을 설계**했다.

기존의 챗봇들은 주어진 입력에 대한 즉각적인 응답을 생성하는 방식이 많았지만, **메모리를 관리함으로써 보다 맥락적이고 유저 맞춤형 대화를 생성할 수 있도록 개선**하는 것이 이번 실험의 주된 포인트였다.


### 핵심 구현 포인트

- **Configuration 클래스 활용**
    
    - 실행 시점에서 필요한 **user_id, 모델 선택 등의 정보를 설정**하여 챗봇의 대화 흐름을 제어
    - 대화마다 다른 컨텍스트를 가질 수 있도록 관리
- **단기 및 장기 메모리 구현**
    
    - `upsert_memory`: **사용자 데이터를 저장**하거나 **업데이트**하는 기능
    - `store_memory`: **새로운 학습 데이터나 툴 호출 결과를 반영**하여 메모리를 지속적으로 갱신
    - `call_model`: 현재 **대화의 맥락을 반영한 메모리 검색 및 LLM 호출**
- **StateGraph를 활용한 대화 흐름 자동화**
    
    - 대화 상태를 조정하며 `call_model`과 `store_memory`를 **자동으로 연결하여 메모리를 업데이트**
    - 단순한 Rule-based 방식이 아니라 **유연하게 대화 흐름을 유지**할 수 있도록 설계
- **LangGraph 체크포인터 활용**
    
    - **대화 상태를 저장하고 롤백할 수 있도록 구현**, 필요 시 특정 상태로 복귀 가능


### 배운 점 & 개선할 점

✔ **챗봇의 "기억"이 대화의 자연스러움을 크게 향상**  
메모리 저장 방식이 정교해질수록 챗봇의 응답 품질이 **더욱 자연스럽고 유저 친화적으로 발전**했다. 예를 들어, 사용자가 과거에 언급한 내용을 기억하고 대화를 이어가는 방식이 가능해졌는데, 이는 **사용자 경험(UX) 측면에서 매우 중요한 요소**라는 점을 다시 한번 체감했다.

✔ **메모리 관리 최적화가 필요함**  
장기 메모리를 무작정 쌓다 보면 불필요한 데이터가 많아질 수 있고, 이는 **검색 성능 저하 및 비용 증가로 이어질 가능성**이 있다. 따라서, 메모리를 적절히 정리하거나 **우선순위를 고려해 저장하는 방법을 추가적으로 고민할 필요**가 있다.

✔ **LangGraph의 활용성이 기대 이상**  
StateGraph를 이용해 대화 상태를 관리하는 방식이 기존 방식보다 훨씬 유연하고 직관적이었다. 앞으로 **LangGraph를 더 깊이 탐색해 챗봇뿐만 아니라 다른 워크플로우 자동화에도 적용할 수 있을 것** 같다.

---


### CoT Based Smart Web Search 튜토리얼

- **GitHub**: [CoT Based Smart Web Search 튜토리얼 코드](https://github.com/LangChain-OpenTutorial/LangChain-OpenTutorial/blob/main/19-Cookbook/07-Agent/15-CoT-basedSmartWebSearch.ipynb)
    
- **Google Colab**: [Colab에서 실행하기](https://colab.research.google.com/github/LangChain-OpenTutorial/LangChain-OpenTutorial/blob/main/19-Cookbook/07-Agent/15-CoT-basedSmartWebSearch.ipynb)
    

이 튜토리얼에서는 **Chain-of-Thought (CoT) 기반의 스마트 웹 검색 시스템**을 구축하는 과정을 다뤘다. 단순한 검색을 넘어, **Plan-and-Execute 방식의 QA 시스템**을 설계하여 복잡한 질문을 여러 단계로 나눠 처리하는 것이 핵심이었다.

기존의 웹 검색 방식은 단순히 키워드 매칭을 기반으로 정보를 제공하지만, CoT 접근법을 적용하면 **검색 → 추출 → 추론 → 응답 생성**이라는 체계적인 프로세스를 구성할 수 있다. 이를 통해 챗봇이 더 정교한 방식으로 정보를 탐색하고, 보다 신뢰할 만한 답변을 생성할 수 있도록 했다.


### 핵심 구현 포인트

- **CoT 기반 검색 쿼리 확장**
    
    - 복잡한 질의를 여러 개의 실행 가능한 검색 쿼리로 변환하여 보다 다양한 정보를 수집할 수 있도록 함
- **모듈형 워크플로우**
    
    - 검색, 추론, 응답 생성을 각각 개별적인 노드로 분리하여 실행
    - 필요에 따라 특정 단계를 건너뛸 수도 있어 효율적인 처리 가능
- **비동기 실행 최적화**
    
    - 웹 검색 및 데이터 추출을 동시에 수행하여 처리 속도를 개선
- **LangGraph 기반 태스크 라우팅**
    
    - 각 검색 및 분석 단계의 결과를 기반으로 자동으로 실행 흐름을 결정
- **구조화된 데이터 모델링**
    
    - `Pydantic`을 활용해 검색 결과 및 응답 데이터를 정리하여 일관성을 유지


### 배운 점 & 개선할 점

✔ **체계적인 검색 전략**  
기존에는 웹 검색을 단순한 정보 조회 정도로 생각했지만, CoT 방식을 적용하면서 검색 자체도 **계획(Plan)과 실행(Execute)** 단계를 나눠 처리할 수 있다는 점이 흥미로웠다. 단순히 검색어를 던지는 것이 아니라, **질문을 분석하고 적절한 검색 전략을 구성하는 과정**이 상당히 중요하다는 것을 다시금 깨달았다. 최근 CoT 모델들이 많은 이슈가 되었는데, 개인적인 생각으로는, CoT로 학습된 모델보다는, 기본 모델에 CoT 방식을 적용하여 직접 생각 방식을 컨트롤하는것이 더 성능이 좋은것 같다.

✔ **비동기 실행의 장점**  
여러 검색 쿼리를 동시에 실행하는 방식으로 속도를 크게 향상시킬 수 있었다. 다만, **검색 결과를 종합하고 요약하는 과정에서 노이즈를 걸러내는 추가적인 로직이 필요했다**. 검색 결과가 많아질수록 불필요한 정보를 제거하고 핵심 내용을 추출하는 전략이 더욱 중요하다는 점을 느꼈다.

✔ **LangGraph의 활용성**  
LangGraph를 활용하여 **검색 → 추출 → 응답 생성의 흐름을 자동화**하는 것이 기대 이상으로 유용했다. 특정 단계를 건너뛸 수도 있고, 필요한 경우 검색을 반복 수행하도록 유연하게 구성할 수 있었다. 앞으로 더 복잡한 검색 시스템을 설계할 때도 이 방식을 적용해볼 가치가 충분하다고 생각했다.


## 후기

이 프로젝트에서 LangChain과 RAG에 대한 기술적인 이해뿐만 아니라 매주 진행된 **피어 리뷰 세션**에서 다른 기여자들의 코드를 검토하고 피드백을 주고받으면서 **다양한 접근 방식과 새로운 아이디어를 접할 수 있었다**. 덕분에 LangChain을 활용한 워크플로우 설계에 대한 이해가 한층 깊어졌고, 실무에서도 적용할 수 있는 인사이트를 많이 얻었다.

무엇보다도, **규모 있는 오픈소스 프로젝트에서 협업하는 과정 자체가 큰 배움이었다**. 단순한 코드 작성이 아니라, 리뷰, 개선, 문서화, 협업 도구 활용까지 고려해야 했기 때문에 프로젝트 운영 방식에 대한 경험치도 쌓을 수 있었다. 기대했던 것 이상으로 많은 것을 배운 프로젝트였고, 앞으로도 오픈소스 기여를 지속해볼 동기부여가 된 의미 있는 경험이었다.