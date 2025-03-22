---
title: LLM Compiler for Parallel Function Calling
date: 2025-01-26
tags:
  - AI
  - PaperReview
  - LLM
  - ToolCalling
  - Optimization
  - ParallelProcessing
draft: false
enableToc: true
description: "LLM 기능 호출을 병렬로 처리하여 지연 시간과 비용을 줄이는 LLM Compiler 연구에 대한 검토"
published: 2025-01-26
modified: 2025-01-26
---

> [!summary]
> 
> 본 문서는 LLM Compiler 연구에 대한 검토로, 함수 호출을 병렬로 처리함으로써 지연 시간과 비용을 크게 줄일 수 있는 방법을 설명한다. 기존 ReAct 방식 대비 최대 3.7배 속도 향상, 6.7배 비용 절감, 9%의 정확도 향상 효과를 제공한다. Function Calling Planner, Task Fetching Unit, Executor의 세 구성요소를 통해 효율적인 병렬 처리를 구현하는 방식을 자세히 다룬다.

- paper: [https://arxiv.org/abs/2312.04511](https://arxiv.org/abs/2312.04511)
- github: [https://github.com/SqueezeAILab/LLMCompiler](https://github.com/SqueezeAILab/LLMCompiler)
- youtube: [https://youtu.be/aoLtTIYAafY?si=9d4O99LWEWpX15Oc](https://youtu.be/aoLtTIYAafY?si=9d4O99LWEWpX15Oc)

## Abstract

#### **Problem**: 
현재 LLM 함수 호출 방법은 각 함수에 대해 순차적인 추론과 실행이 필요하여 **높은 지연 시간, 비용, 때로는 부정확한 동작**을 초래할 수 있다.

#### Key Question: 
여러 함수 호출을 통합하는 가장 효과적인 접근 방식은 무엇인가?

#### LLM Compiler
- 여러 함수 호출을 효율적으로 조정하기 위해 함수를 병렬로 실행한다
- 세 가지 구성 요소로 이루어진다:
  1. Function Calling Planner: 함수 호출을 위한 실행 계획 수립
  2. Task Fetching Unit: 함수 호출 작업 배포
  3. Executor: 이러한 작업을 병렬로 실행

**ReAct**와 비교한 관찰 결과:
- 최대 3.7배의 일관된 지연 시간 단축
- 최대 6.7배의 비용 절감
- 최대 약 9%의 정확도 향상

// ... existing code ... 