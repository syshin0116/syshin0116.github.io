---
title: 문서(pdf 등) 내 시각 자료와 텍스트의 추출 및 활용
date: 2024-07-23
tags:
  - AI
  - RAG
  - MultiModal
  - PDF
  - pdf-parser
description: 멀티모달 RAG를 활용한 PDF 문서 내 시각 자료와 텍스트 추출 및 활용 기법
---

# 1. 문서(pdf 등) 내 시각 자료와 텍스트의 추출 및 활용

## 1-1. 배경

### 시각 자료의 중요성

- 시각 자료(그래프, 표, 이미지 등)는 문서의 이해와 정보 전달을 돕는 중요한 요소
- 복잡한 정보를 쉽게 전달하는 수단으로 사용되며, 중요한 정보를 담고 있는 경우가 많음

### 다중 모달 LLM의 등장

- GPT-4V, GPT-4o 등 텍스트와 이미지를 동시에 활용하는 대규모 언어모델(LLM)이 등장
- RAG(Retrieval-Augmented Generation)에서도 텍스트뿐 아니라 이미지 등 다양한 모달을 함께 활용하는 방향으로 발전 중

---

## 1-2. PDF 문서에서 텍스트 및 시각 자료 추출의 어려움

PDF에서 텍스트 및 이미지를 추출하는 일은 다양한 이유로 쉽지 않다. 아래는 주요 이슈들이다.

- **Paragraphs**
    - PDF 원본의 줄바꿈 위치를 그대로 가져갈지
    - 하나의 단락으로 합쳐서 추출할지
- **Page numbers**
    - 페이지 번호를 추출물에 포함시킬지
- **Headers and Footers**
    - 머리글, 바닥글에 대한 처리 방식
- **Outlines**
    - 챕터나 섹션 목록 같은 목차 요소를 추출할지
- **Formatting**
    - 굵게(**bold**), 기울임(_italic_) 등의 서식을 유지할지
- **Tables**
    - 테이블을 어떻게 추출할지
    - 테이블 구조(열/행)나 셀 병합 정보를 복원할지
    - Markdown/HTML 같은 형태로 유지할지
- **Captions**
    - 이미지 혹은 테이블 캡션을 어떻게 처리할지
- **Ligatures**
    - 'ﬀ' 같은 합쳐진 문자를 ASCII 'ff'로 풀어서 처리할지
- **SVG images**
    - 벡터 기반 이미지에서 텍스트가 있으면 추출할지
- **Mathematical Formulas**
    - 인덱스나 분수, 중첩 등을 어떻게 변환할지
- **Whitespace characters**
    - 일정 크기의 공백(가로·세로)에 대해 몇 줄이나 공백을 둬야 하는지
    - 공백을 탭으로 처리할지, 스페이스로 처리할지
- **Footnotes**
    - 여러 페이지에 걸쳐서 추출할 때, 각 주석을 어디에 배치할지
- **Hyperlinks and Metadata**
    - 링크나 메타데이터를 어떻게 추출해 표시할지
- **Linearization**
    - 본문에 부유(floating) 요소가 있을 때, 이를 본문에 끼워 넣을지 말지

추가로 다음과 같은 PDF 내부 구조상의 문제도 있다.

- **Tables**
    - 텍스트가 절대 좌표로 찍혀 있어 열/행 구조를 파악하기가 어려움
- **Images**
    - PDF 내 텍스트가 사실상 이미지로만 들어 있는 경우
    - OCR 레이어가 없는 이미지이거나 OCR이 부정확하면 제대로 텍스트를 얻기 어려움

---

# 2. Multi-Modal RAG

## 2-1. 개요

"RAG(Retrieval-Augmented Generation)"은 LLM이 응답을 생성할 때, 외부에서 검색된 문서나 정보를 함께 참조하도록 하는 기법이다. 전통적인 RAG가 텍스트 기반 문서만 다루었다면, 이제는 이미지, 표 등 다양한 시각 자료도 함께 다루는 멀티모달 RAG가 제안되고 있다.

### 주요 방법

1. **Retrieve Raw Image**
    
    - 다중 모달 임베딩(예: CLIP)으로 이미지와 텍스트를 임베딩
    - 이미지와 텍스트를 함께 유사도 검색
    - 다중 모달 LLM에 원본 이미지와 텍스트 조각을 함께 전달해 답변을 생성
2. **Retrieve Image Summary**
    
    - 다중 모달 LLM(예: GPT-4V, GPT-4o, LLaVA, FUYU)으로 이미지 요약 텍스트를 생성
    - 이 요약 텍스트를 임베딩하여 검색
    - 최종 답변 생성 시에는 해당 요약 텍스트만 전달
3. **Retrieve Raw Image + Image Summary**
    
    - 다중 모달 LLM(예: GPT-4V, GPT-4o, LLaVA, FUYU)으로 이미지에서 텍스트 요약을 생성
    - 원본 이미지와 요약 텍스트를 모두 임베딩해 검색
    - 최종 답변 생성 시 원본 이미지와 텍스트 조각, 그리고 이미지 요약 텍스트를 모두 전달

아래 그림은 Multi-Modal RAG 파이프라인을 보여준다.

![](https://i.imgur.com/rqUfDaj.png)

---

## 2-2. 시각 자료 활용 방법 예시

### 1) Unstructured Loader와 같은 PDF Loader 활용

- **이미지 저장**: PDF에서 추출된 이미지를 파일로 분리·저장
- **이미지 경로 삽입**: 추출 과정에서 생성된 이미지 파일 경로를 관련 텍스트 중간에 삽입
- **벡터스토어에 저장**: 텍스트와 이미지(또는 이미지 경로)를 함께 벡터화해 저장

#### 예시 이미지

![](https://i.imgur.com/zyp2jfb.png)

![](https://i.imgur.com/ZMTUlU3.png)

---

# 3. PDF 요소 추출 및 요약 예시 코드

아래 코드는 Python 환경에서 `unstructured` 라이브러리와 LangChain 계열의 도구를 사용하여 PDF에서 텍스트·이미지·테이블을 추출하고, 이를 요약·벡터화하는 과정을 간단히 정리한 예시 코드다.

## 3-1. PDF에서 요소(image, text) 추출

```python
def extract_pdf_elements(path, fname):
    """
    PDF 파일에서 이미지, 테이블, 그리고 텍스트 조각을 추출한다.
    path: 이미지(.jpg)를 저장할 파일 경로
    fname: 파일 이름
    """
    return partition_pdf(
        filename=os.path.join(path, fname),
        extract_images_in_pdf=True,     # PDF 내 이미지 추출 활성화
        infer_table_structure=True,     # 테이블 구조 추론 활성화
        chunking_strategy="by_title",   # 제목별로 텍스트 조각화
        max_characters=4000,            # 최대 문자 수
        new_after_n_chars=3800,         # 이 문자 수 이후에 새로운 조각 생성
        combine_text_under_n_chars=2000,# 이 문자 수 이하의 텍스트는 결합
        image_output_dir_path=path,     # 이미지 출력 디렉토리 경로
    )
```

## 3-2. 요소 유형별(테이블, 텍스트)로 분류

```python
def categorize_elements(raw_pdf_elements):
    """
    PDF에서 추출된 요소를 테이블과 텍스트로 분류한다.
    raw_pdf_elements: unstructured.documents.elements의 리스트
    """
    tables = []
    texts = []
    for element in raw_pdf_elements:
        if "unstructured.documents.elements.Table" in str(type(element)):
            tables.append(str(element))  # 테이블 요소 추가
        elif "unstructured.documents.elements.CompositeElement" in str(type(element)):
            texts.append(str(element))   # 텍스트 요소 추가
    return texts, tables
```

---

## 3-3. 데이터 요약

### 텍스트 및 테이블 요약

```python
def generate_text_summaries(texts, tables, summarize_texts=False):
    """
    텍스트 요소 요약
    texts: 문자열 리스트
    tables: 문자열 리스트
    summarize_texts: 텍스트 요약 여부를 결정 (True/False)
    """
    
    # 프롬프트 설정
    prompt_text = """You are an assistant tasked with summarizing tables and text for retrieval. \ 
    These summaries will be embedded and used to retrieve the raw text or table elements. \ 
    Give a concise summary of the table or text that is well optimized for retrieval. Table or text: {element} """
    prompt = ChatPromptTemplate.from_template(prompt_text)
    
    model = ChatOpenAI(temperature=0, model="gpt-4")
    summarize_chain = {"element": lambda x: x} | prompt | model | StrOutputParser()
    
    text_summaries = []
    table_summaries = []
    
    if texts and summarize_texts:
        text_summaries = summarize_chain.batch(texts, {"max_concurrency": 5})
    elif texts:
        text_summaries = texts
    
    if tables:
        table_summaries = summarize_chain.batch(tables, {"max_concurrency": 5})
    
    return text_summaries, table_summaries
```

### 이미지 요약

```python
def generate_img_summaries(path):
    """
    이미지에 대한 요약과 base64 인코딩된 문자열을 생성한다.
    path: Unstructured에 의해 추출된 .jpg 파일 목록의 경로
    """
    
    img_base64_list = []
    image_summaries = []
    
    prompt = """You are an assistant tasked with summarizing images for retrieval. \ 
    These summaries will be embedded and used to retrieve the raw image. \ 
    Give a concise summary of the image that is well optimized for retrieval."""
    
    for img_file in sorted(os.listdir(path)):
        if img_file.endswith(".jpg"):
            img_path = os.path.join(path, img_file)
            base64_image = encode_image(img_path)
            img_base64_list.append(base64_image)
            image_summaries.append(image_summarize(base64_image, prompt))
    
    return img_base64_list, image_summaries
```

---

## 3-4. Vectorstore에 저장

- **Docstore**: 원본 텍스트, 테이블, 이미지 등을 저장
- **Vectorstore**: 임베딩된 벡터를 저장하여 검색 시 활용

> 데모에서는 `UnStructured PDF Loader` 사용
> 
> - `partition_pdf` 함수를 통해 이미지 및 테이블 구조 추출이 가능하기 때문

---

# 4. Colpali와 Late Interaction

## 4-1. Colpali 연구 내용

**Colpali**는 시각(이미지)·텍스트 검색을 위한 개선된 기법을 탐구하는 프로젝트다. 주요 모델은 다음과 같다.

- **SigLIP**: 바닐라 모델
    - vision-language bi-encoder 모델
    - 이미지-텍스트 쌍으로 사전학습
- **BiSigLIP**: SigLIP + 파인튜닝
    - figure retrieval + table retrieval 태스크
    - 복잡한 형식 이해 능력 향상
- **BiPali**: 추가로 LLM 결합
    - LLM 모델: PaliGemma (예: [https://arxiv.org/pdf/2407.07726](https://arxiv.org/pdf/2407.07726) 참고)
- **ColPali**: Late Interaction 추가
    - ColBert가 제안한 후기 상호작용 방식을 결합

## 4-2. ColBert의 Late Interaction

![](https://i.imgur.com/IxwVgOJ.jpeg)

- 후기 상호작용(Late Interaction)
    - 쿼리와 문서 간의 보다 세밀한 매칭을 가능하게 함
    - 쿼리 인코딩과 문서 인코딩을 미리 분리해놓고, 필요할 때만 비교함
    - 대규모 코퍼스에 대해 미리 임베딩을 생성·색인할 수 있으므로 쿼리 시점의 계산량이 효율적

장점

- 쿼리와 문서를 각 토큰 단위로 비교할 수 있어 관련성 판단이 더욱 세밀해짐
- 인코딩과 검색 과정을 분리해 효율성을 높임
- 동적·즉석 쿼리에 대해서도 문서 전체를 재처리하지 않고 빠르게 검색 가능

**한계**

- 현재 영어와 불어만 지원
- 페이지 단위 수준까지 검색 가능
- open source이므로 발전 가능성이 큼
- 다른 방식과 혼합해 사용하는 것도 고려 가능

---

# 5. 기타 멀티모달 접근 연구

## 5-1. ChartGemma

- 논문: [https://paperswithcode.com/paper/chartgemma-visual-instruction-tuning-for](https://paperswithcode.com/paper/chartgemma-visual-instruction-tuning-for)
- HuggingFace Space Demo: [https://huggingface.co/spaces/ahmed-masry/ChartGemma](https://huggingface.co/spaces/ahmed-masry/ChartGemma)
- 차트·그래프에 대한 시각적 인스트럭션 튜닝으로 정확한 정보 추출 및 해석을 시도

---

# 6. MultiVector Retriever

**MultiVector Retriever**는 LangChain 라이브러리가 제공하는 문서 검색 도구로, 하나의 문서에 대해 여러 벡터를 생성·저장하여 검색 정확도와 유연성을 높이는 방식이다.

## 6-1. 문서 생성 방법

1. **Smaller Chunks (작은 조각)**
    - 문서를 작은 조각으로 나누어 각각을 임베딩
2. **Summary (요약)**
    - 문서 요약을 생성해 임베딩
3. **Hypothetical Questions (가설 질문)**
    - 해당 문서와 관련된 가상의 질문들을 생성해 임베딩

이러한 다각도의 임베딩을 통해 하나의 문서가 여러 형태의 검색 쿼리에 대응할 수 있게 된다.

## 6-2. 사용 예시

- **Smaller Chunks**  
    `RecursiveCharacterTextSplitter` 등을 사용해 문서를 작은 단위로 잘라 벡터 스토어에 저장
- **Summary**  
    `ChatOpenAI` 등을 이용해 생성한 요약문을 벡터화 후 저장
- **Hypothetical Questions**  
    문서에 맞는 가상 질문을 생성하고, 이를 벡터화해 저장

![](https://i.imgur.com/oagBKKs.png)

---

# 7. 참고 자료

아래는 본문 곳곳에서 언급된 자료 및 참고할 만한 링크를 모두 모은 것이다.

- **유튜브 테디노트**
    
    - [GPT4o를 사용하여 PDF 내 표와 이미지를 참고하여 답변하는 멀티모달 RAG](https://youtu.be/U_f4-Br3_Y0?si=Q-cRhXih576BoDcg)
    - [https://www.youtube.com/watch?v=0C0FL0iFd1E](https://www.youtube.com/watch?v=0C0FL0iFd1E)
- **LangChain 관련**
    
    - [LangChain Multi-modal Inputs 문서](https://python.langchain.com/v0.2/docs/how_to/multimodal_inputs/)
    - [LangChain Cookbook - multi_modal_output_agent.ipynb](https://github.com/langchain-ai/langchain/blob/master/cookbook/multi_modal_output_agent.ipynb)
    - [https://blog.langchain.dev/semi-structured-multi-modal-rag/](https://blog.langchain.dev/semi-structured-multi-modal-rag/)
- **DeepLearning.AI**
    
    - [building-multimodal-search-and-rag](https://learn.deeplearning.ai/courses/building-multimodal-search-and-rag)
- **PyPDF2**
    
    - [PyPDF2 Documentation](https://pypdf2.readthedocs.io/)
- **Colpali / Vidore**
    
    - Github: [https://github.com/illuin-tech/colpali](https://github.com/illuin-tech/colpali)
    - Paper: [https://arxiv.org/pdf/2407.01449v2](https://arxiv.org/pdf/2407.01449v2)
    - HuggingFace Model: [https://huggingface.co/vidore](https://huggingface.co/vidore)
    - Vidore-benchmark: [https://github.com/illuin-tech/vidore-benchmark](https://github.com/illuin-tech/vidore-benchmark)
    - [https://arxiv.org/abs/2407.01449](https://arxiv.org/abs/2407.01449)
- **ChartGemma**
    
    - [PapersWithCode](https://paperswithcode.com/paper/chartgemma-visual-instruction-tuning-for)
    - [HuggingFace Space Demo](https://huggingface.co/spaces/ahmed-masry/ChartGemma)
- **기타**
    
    - [https://medium.com/@abatutin/is-the-langchain-multi-vector-retriever-worth-it-0c8565e8a8fd](https://medium.com/@abatutin/is-the-langchain-multi-vector-retriever-worth-it-0c8565e8a8fd)
    - 발표 자료: [https://docs.google.com/presentation/d/1X4UjKIj8Hf5h80QgvwKSLM2jNsW_X3YIlArYWhyv5UU/edit?usp=sharing](https://docs.google.com/presentation/d/1X4UjKIj8Hf5h80QgvwKSLM2jNsW_X3YIlArYWhyv5UU/edit?usp=sharing)
    - [https://medium.aiplanet.com/multimodal-rag-using-langchain-expression-language-and-gpt4-vision-8a94c8b02d21](https://medium.aiplanet.com/multimodal-rag-using-langchain-expression-language-and-gpt4-vision-8a94c8b02d21)