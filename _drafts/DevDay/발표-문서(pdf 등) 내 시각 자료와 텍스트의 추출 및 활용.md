---
quickshare-date: 2024-07-19 16:58:36
quickshare-url: https://noteshare.space/note/clyserxtb1088201mwu5i2ou9q#Ml5HMTaJEyYCZnphYj8muolhjTKmSzmILSdWXTYIVsQ
share_link: https://share.note.sx/1cv3mxxv#Vvp9NA58T90KcZCqDKp9z/guPi0tXD9I3Yjp5Byr/Eo
share_updated: 2024-07-21T23:55:56+09:00
---
# 문서(pdf 등) 내 시각 자료와 텍스트의 추출 및 활용

신승엽

## 배경

### 시각 자료의 중요성
- 시각 자료는 문서의 이해와 정보 전달을 돕는 중요한 요소
- 특히, 그래프, 표, 이미지 등은 복잡한 정보를 쉽게 전달하는 수단으로 사용되기 때문에, 중요한 정보를 담고 있는 경우가 많음

### PDF 에서 시각 정보 추출이 어려운 이유
- [텍스트 추출이 어려운 이유(PyPDF2)](_drafts/DevDay/텍스트%20추출이%20어려운%20이유(PyPDF2).md)

### 한자연 Agent에서의 기본 PyPDF 사용 결과

![](https://i.imgur.com/IGfnuxc.png)


![](https://i.imgur.com/ZMTUlU3.png)


---

## 시각 자료 활용 방법

### 1. Unstructured Loader와 같은 PDF Loader 활용

#### 1-1. 단순 변환
- **이미지 저장**: PDF 파일에서 추출된 이미지를 파일로 저장
- **이미지 경로 삽입**: 저장된 이미지의 파일 경로를 해당 이미지를 설명하는 텍스트 사이에 삽입
- **벡터스토어에 저장**: 텍스트와 이미지 경로를 포함한 데이터를 벡터스토어에 저장

![[Excalidraw/Method1]]
#### 2. Multi-Modal RAG 

![](https://i.imgur.com/rqUfDaj.png)

1. Retrieve Raw Image
	- 다중 모달 임베딩(ex: CLIP)을 사용하여 이미지와 텍스트를 임베딩
	- 유사성 검색을 사용하여 둘 다 검색
	- 다중 모달 LLM에 원본 이미지와 텍스트 조각을 전달하여 답변 합성
2. Retrieve Image Summary
	- 다중 모달 LLM(ex: GPT-4V, GPT-4o, LLaVA, FUYU)를 사용하여 이미지에서 텍스트 요약 생성
	- 텍스트 임베딩, 검색
	- LLM에 텍스트 조각을 전달하여 답변을 합성
3. Retrieve Raw Image + Image Summary
	- 다중 모달 LM(ex: GPT-4V, GPT-4o, LLaVA, FUYU)을 사용하여 이미지에서 텍스트 요약 생성
	- 원본 이미지에 대한 참조와 함께 이미지 요약을 임베딩하고 검색
	- 다중 모달 LLM에 원본 이미지와 텍스트 조각을 전달하여 답변을 합성

![[_drafts/DevDay/Excalidraw-Multivector Retriever]]
- [MultiVector Retriever](_drafts/DevDay/MultiVector%20Retriever.md)
- [Teddy Note - GPT4o 를 사용하여 PDF 내 표와 이미지를 참고하여 답변하는 멀티모달 RAG](_drafts/DevDay/Teddy%20Note%20-%20GPT4o%20를%20사용하여%20PDF%20내%20표와%20이미지를%20참고하여%20답변하는%20멀티모달%20RAG.md)

### 2. Colpali
![](https://cdn-uploads.huggingface.co/production/uploads/60f2e021adf471cbdf8bb660/T3z7_Biq3oW6b8I9ZwpIa.png)
- [ColPali-Efficient Document Retrieval with Vision Language Models](_drafts/DevDay/ColPali-Efficient%20Document%20Retrieval%20with%20Vision%20Language%20Models.md)



## 추가
ChartGemma: Visual Instruction-tuning for Chart Reasoning in the Wild
- PapersWithCode:  https://paperswithcode.com/paper/chartgemma-visual-instruction-tuning-for
- HuggingFace Space Demo: https://huggingface.co/spaces/ahmed-masry/ChartGemma

## 발표 자료
https://docs.google.com/presentation/d/1X4UjKIj8Hf5h80QgvwKSLM2jNsW_X3YIlArYWhyv5UU/edit?usp=sharing

## 참고 자료:
- https://medium.com/@abatutin/is-the-langchain-multi-vector-retriever-worth-it-0c8565e8a8fd
- [\[유튜브 테디노트\] GPT4o를 사용하여 PDF 내 표와 이미지를 참고하여 답변하는멀티모달 RAG](https://youtu.be/U_f4-Br3_Y0?si=Q-cRhXih576BoDcg)
- https://blog.langchain.dev/semi-structured-multi-modal-rag/
- https://arxiv.org/pdf/2407.01449v2

- https://github.com/illuin-tech/vidore-benchmark
- https://arxiv.org/abs/2407.01449
- https://huggingface.co/spaces/vidore/vidore-leaderboard