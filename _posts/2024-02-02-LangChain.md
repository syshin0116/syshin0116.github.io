---
layout: post
title: LangChain
date: 2024-02-02 16:20 +0900
categories:
  - ETC
  - Tech
tags: 
math: true
---

## Intro: 

랭체인 공부하고자 랭체인 docs를 보다가 생각보다 양이 많아서, 처음부터 뛰어들기 보다 일단 따라해볼 유튜브나 블로그를 경험해본 후에 official documentation을 정독해 보려 한다. 입문용으로 괜찮아 보이는 유툽을 찾아 따라해보려 한다. 

유붑 link: ![https://www.youtube.com/watch?v=aWKrL4z5H6w](https://www.youtube.com/watch?v=aWKrL4z5H6w)



tags: Streamlit, OpenAI, Lamma2, Gemini Pro


Agenda: Practical Oriented
1. Environment Set up Open AI API Key
2. Building simpoe application with
	- LLM's -- LLM's Amd Chatmodels
	- PRomt Templates
	- Output Parser(PromptTemplate + LLM + OutputParser)


requirements.txt에 ipykernel을 추가하지 않는 이유:
	개발 단계에서만 필요하지 deploy시엔 필요하지 않음


### PDF Query with Langchain and Cassandra DB
### Apache Cassandra(Astra DB)
- open source No-SQL database 
- scalability and high availability

#### DATAX
- tool used to create Cassandra DB


#### Vector Search
- enhances machine learning models by allowing similarity comparisons of embeddings
- a capability of Astra DB