---
title: MCP(Model Context Protocol)
date: 2024-03-31
tags:
  - ai
  - anthropic
  - mcp
  - claude
  - langchain
  - langgraph
  - tool-use
  - smithery
draft: false
enableToc: true
description: "Anthropic에서 개발한 MCP(Model Context Protocol)의 개념, 구조 및 활용에 대한 설명"
published: 2024-03-31
modified: 2024-03-31
---
> [!summary]
> MCP(Model Context Protocol)는 Anthropic에서 개발한 개방형 프로토콜로, AI 모델(특히 LLM)과 외부 데이터 소스 및 도구를 표준화된 방식으로 연결한다. USB-C와 유사한 방식으로 AI 애플리케이션과 다양한 데이터 소스 간의 통합을 단순화하며, 클라이언트-서버 구조를 통해 안전하고 확장 가능한 AI 시스템 구축을 지원한다.

## 개요

MCP(Model Context Protocol)는 AI 모델과 외부 데이터 소스 및 도구를 연결하는 개방형 프로토콜이다. Anthropic에서 개발했으며, LLM 애플리케이션 개발 시 맞춤형 통합 솔루션 대신 표준화된 방식으로 데이터와 도구에 접근할 수 있게 한다.

![](https://i.imgur.com/LooAPju.png)


### 기본 개념
- USB-C를 AI 애플리케이션에 적용한 것과 같은 방식으로 이해할 수 있다.
- AI 모델과 다양한 데이터 소스 및 도구 간의 표준화된 연결 방식을 제공한다.
- 개방형 프로토콜로, 여러 언어와 플랫폼에서 구현 가능하다.


### 참고자료
- **공식 문서**: [Model Context Protocol 문서](https://modelcontextprotocol.io/introduction)
- **GitHub**: [Model Context Protocol GitHub](https://github.com/modelcontextprotocol)
- **Anthropic 문서**: [Anthropic MCP 문서](https://docs.anthropic.com/en/docs/build-with-claude/mcp)

---

## MCP의 아키텍처

MCP는 클라이언트-서버 아키텍처를 기반으로 하며, 다음과 같은 주요 구성 요소로 이루어진다.

![](https://i.imgur.com/23LhWf8.png)

### 주요 구성 요소
- **MCP 호스트**: Claude Desktop, IDE, AI 도구 등 MCP를 통해 데이터에 접근하려는 프로그램
- **MCP 클라이언트**: 서버와 1:1 연결을 유지하는 프로토콜 클라이언트
- **MCP 서버**: 표준화된 Model Context Protocol을 통해 특정 기능을 노출하는 경량 프로그램
- **로컬 데이터 소스**: MCP 서버가 안전하게 접근할 수 있는 컴퓨터의 파일, 데이터베이스, 서비스
- **원격 서비스**: API 등을 통해 인터넷으로 사용 가능한 외부 시스템

### 호스트, 클라이언트, 서버의 상세 역할

#### MCP 호스트 (Host)
- **정의**: MCP 호스트는 사용자와 직접 상호작용하는 최종 애플리케이션이다.
- **주요 기능**:
  - 사용자 인터페이스 제공
  - 여러 MCP 클라이언트 관리
  - 사용자 동의 및 승인 처리
  - LLM과의 통합 관리
- **예시**: 
  - Claude Desktop: Anthropic의 데스크톱 애플리케이션
  - Visual Studio Code와 같은 코드 편집기의 AI 확장 프로그램
  - 커스텀 AI 워크플로우 애플리케이션
- **책임**:
  - 사용자 데이터 보호 및 접근 제어
  - 도구 호출에 대한 적절한 권한 부여
  - 여러 서버 간의 통합 조정

#### MCP 클라이언트 (Client)
- **정의**: MCP 클라이언트는 호스트 애플리케이션 내에서 실행되며 MCP 서버와의 직접적인 통신을 담당한다.
- **주요 기능**:
  - 서버와의 연결 초기화 및 유지
  - 프로토콜 메시지 형식 처리
  - 서버 기능 검색 및 협상
  - 데이터 및 명령 전송/수신
- **동작 방식**:
  - JSON-RPC 2.0 형식 메시지 사용
  - 비동기 통신 제공
  - 서버 응답 처리 및 호스트에 결과 반환
- **주요 인터페이스**:
  - `initialize`: 서버와의 연결 설정 및 기능 협상
  - `listTools`: 사용 가능한 도구 목록 가져오기
  - `invokeTool`: 도구 실행
  - `getResource`: 데이터 리소스 가져오기

#### MCP 서버 (Server)
- **정의**: MCP 서버는 특정 데이터 소스나 서비스에 접근하는 전문화된 경량 프로그램이다.
- **주요 기능**:
  - 특정 도메인의 기능 노출
  - 도구 구현 및 제공
  - 데이터 리소스 접근 관리
  - 서비스 API와의 통합
- **서버 유형**:
  - **리소스 서버**: 정적/동적 데이터 제공 (파일, 데이터베이스 등)
  - **도구 서버**: 함수형 기능 제공 (계산, API 호출, 작업 실행 등)
  - **하이브리드 서버**: 리소스와 도구 모두 제공
- **통신 모드**:
  - `stdio`: 표준 입출력을 통한 통신 (로컬 서버)
  - `sse`: Server-Sent Events를 통한 HTTP 기반 통신 (웹 서버)
  - `websocket`: 양방향 웹소켓 통신 (실시간 서버)

### 통신 흐름 예시
1. 사용자가 Claude Desktop(호스트)에서 "내 파일 시스템에서 최신 보고서를 찾아줘"라고 요청
2. Claude Desktop은 파일 시스템 MCP 클라이언트를 활성화
3. 클라이언트는 파일 시스템 MCP 서버와 연결 초기화
4. 서버는 사용 가능한 도구 목록(파일 검색, 읽기 등)을 반환
5. 클라이언트는 파일 검색 도구를 호출하여 최신 보고서 파일 검색
6. 서버는 파일 시스템에서 검색 작업을 실행하고 결과 반환
7. 클라이언트는 결과를 호스트에 전달
8. 호스트는 이 정보를 LLM에 전달하여 적절한 응답 생성

### 통신 프로토콜
- JSON-RPC 2.0 메시지 형식 사용
- 상태 유지형 연결 지원
- 서버 및 클라이언트 간 기능 협상 제공

### MCP 통신 전송 방식
MCP는 여러 가지 전송 방식(Transport)을 지원하여 다양한 환경에서 유연하게 작동할 수 있다. 주로 사용되는 두 가지 전송 방식은 stdio와 SSE이다.

#### STDIO (Standard Input/Output)
- **정의**: stdio는 표준 입력(stdin)과 표준 출력(stdout)을 사용하여 로컬 프로세스 간 통신하는 방식이다.
- **작동 방식**:
  - 클라이언트가 자식 프로세스로 MCP 서버를 시작
  - 클라이언트는 stdin으로 메시지를 보내고 stdout에서 응답을 읽음
  - JSON-RPC 메시지를 줄 단위로 교환
  
- **장점**:
  - 로컬 환경에서 매우 간단하고 빠른 설정
  - 보안 측면에서 외부 네트워크 노출이 없음
  - 낮은 지연 시간과 오버헤드
  
- **단점**:
  - 로컬 시스템에서만 작동 가능
  - 원격 서버와 연결 불가
  - 확장성이 제한적
  
- **활용 사례**:
  - 로컬 파일 시스템 접근
  - 로컬 명령어 실행
  - 개인용 도구 통합

```python
# stdio 서버 실행 예시
if __name__ == "__main__":
    mcp.run(transport="stdio")

# stdio 클라이언트 연결 예시
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="python",
    args=["/path/to/server.py"],
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
```

#### SSE (Server-Sent Events)
- **정의**: SSE는 서버에서 클라이언트로 단방향 실시간 데이터 스트림을 제공하는 HTTP 기반 통신 기술이다.
- **작동 방식**:
  - 클라이언트가 HTTP 연결을 통해 서버에 연결
  - 서버는 `text/event-stream` 콘텐츠 타입으로 응답
  - 클라이언트는 별도의 HTTP 요청으로 메시지 전송
  - 서버는 스트림을 통해 이벤트 형태로 응답 전송
  
- **장점**:
  - 기존 웹 인프라와 호환성 우수
  - 방화벽 친화적 (표준 HTTP 사용)
  - 원격 서버와 통신 가능
  - 자동 재연결 메커니즘 내장
  
- **단점**:
  - stdio보다 더 많은 오버헤드
  - 웹 서버 설정 필요
  - 양방향 통신을 위해 추가 HTTP 요청 필요
  
- **활용 사례**:
  - 웹 기반 MCP 서버 호스팅
  - 원격 서비스 통합
  - 다중 클라이언트 지원

```python
# SSE 서버 설정 예시 (FastAPI 사용)
from fastapi import FastAPI
from mcp.server.sse import serve_sse

app = FastAPI()
mcp = FastMCP("MyServer")

# SSE 엔드포인트 등록
serve_sse(app, mcp, path="/sse")

# 서버 실행
import uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# SSE 클라이언트 연결 예시
from mcp.client.sse import sse_client

async with sse_client("http://localhost:8000/sse") as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
```

#### 전송 방식 선택 가이드
- **로컬 도구와 리소스**: stdio 사용 (보안 및 성능 최적화)
- **웹 서비스 및 공유 도구**: SSE 사용 (접근성 및 확장성)
- **기업 환경**: 보안 정책에 따라 선택 (내부 도구는 stdio, 공유 도구는 SSE)
- **개발 및 테스트**: stdio가 더 단순하고 빠른 설정 제공


---

## MCP의 주요 기능

MCP는 서버와 클라이언트 간에 다양한 기능을 제공한다.

### 서버가 제공하는 기능
- **리소스(Resources)**: AI 모델이 참조할 수 있는 컨텍스트 데이터 및 콘텐츠
- **프롬프트(Prompts)**: 재사용 가능한 프롬프트 템플릿 및 워크플로우
- **도구(Tools)**: AI 모델이 실행할 수 있는 함수 및 작업

### 클라이언트가 제공하는 기능
- **샘플링(Sampling)**: 서버 주도의 에이전트 동작 및 재귀적 LLM 상호작용

### 추가 유틸리티
- 구성(Configuration)
- 진행 상황 추적(Progress tracking)
- 취소(Cancellation)
- 오류 보고(Error reporting)
- 로깅(Logging)

![](https://i.imgur.com/NtOVng9.png)


---

## 구현 및 SDK

MCP는 다양한 언어로 구현된 SDK를 제공하여 개발자가 쉽게 시작할 수 있도록 지원한다.

### 공식 SDK
- **Python SDK**: [python-sdk](https://github.com/modelcontextprotocol/python-sdk)
- **TypeScript SDK**: [typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- **Java/Kotlin SDK**: [java-sdk](https://github.com/modelcontextprotocol/java-sdk)
- **C# SDK**: [csharp-sdk](https://github.com/modelcontextprotocol/csharp-sdk)
- **Swift SDK**: [swift-sdk](https://github.com/modelcontextprotocol/swift-sdk)

### 서버 구현 예시
```python
# math_server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Math")

@mcp.tool()
def add(a: int, b: int) -> int:
    """두 숫자 더하기"""
    return a + b

@mcp.tool()
def multiply(a: int, b: int) -> int:
    """두 숫자 곱하기"""
    return a * b

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

### 클라이언트 구현 예시
```python
# 표준 입출력 연결 파라미터 생성
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="python",
    args=["/path/to/math_server.py"],
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        # 연결 초기화
        await session.initialize()
        
        # 도구 가져오기
        tools = await session.list_tools()
```

---

## LangChain과 LangGraph 통합

MCP는 LangChain 및 LangGraph와 통합되어 더욱 강력한 AI 애플리케이션 개발을 지원한다.

### LangChain MCP Adapters
- LangChain MCP Adapters는 Anthropic의 MCP 도구를 LangChain 및 LangGraph와 호환되도록 하는 경량 래퍼다.
- GitHub: [langchain-mcp-adapters](https://github.com/langchain-ai/langchain-mcp-adapters)

![](https://i.imgur.com/3LMvUyw.png)

### 주요 기능
- MCP 도구를 LangChain 도구로 변환하여 LangGraph 에이전트에서 사용
- 여러 MCP 서버에 연결하고 도구를 로드할 수 있는 클라이언트 구현 제공

### 활용 예시
```python
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o")

# MultiServerMCPClient 사용 예시
async with MultiServerMCPClient(
    {
        "math": {
            "command": "python",
            "args": ["/path/to/math_server.py"],
            "transport": "stdio",
        },
        "weather": {
            "url": "http://localhost:8000/sse",
            "transport": "sse",
        }
    }
) as client:
    agent = create_react_agent(model, client.get_tools())
    response = await agent.ainvoke({"messages": "뉴욕의 날씨는 어때?"})
```


---

## 활용 사례

MCP는 다양한 분야에서 활용될 수 있으며, 현재 여러 서버 구현이 제공되고 있다.

### 공식 및 커뮤니티 서버 예시
- **파일시스템**: 구성 가능한 접근 제어를 통한 안전한 파일 작업
- **GitHub**: 저장소 관리, 파일 작업 및 GitHub API 통합
- **Google Drive**: Google Drive의 파일 접근 및 검색 기능
- **PostgreSQL**: 스키마 검증 지원이 포함된 읽기 전용 데이터베이스 접근
- **Slack**: 채널 관리 및 메시징 기능
- **메모리**: 지식 그래프 기반의 지속적 메모리 시스템
- **Puppeteer**: 브라우저 자동화 및 웹 스크래핑
- **Brave Search**: Brave의 검색 API를 사용한 웹 및 로컬 검색

---
## Smithery 소개

Smithery는 MCP 생태계를 위한 중앙 허브 역할을 하는 플랫폼으로, 다양한 MCP 서버들을 검색하고 활용할 수 있는 환경을 제공한다.

![](https://i.imgur.com/2KFvXNB.png)


### Smithery의 주요 기능
- **서버 디렉토리**: 3,200개 이상의 MCP 서버 제공 및 검색 기능
- **카테고리별 브라우징**: 웹 검색, 메모리 관리, 브라우저 자동화 등 다양한 카테고리로 서버 분류
- **쉬운 설치 및 통합**: Claude Desktop 및 다른 MCP 호환 클라이언트에 서버 추가 용이
- **개발자 도구**: MCP 서버 개발 및 배포를 위한 도구 제공

### 주요 서버 카테고리
1. **웹 검색**
   - Brave Search: 웹 및 로컬 검색 기능 통합
   - Exa Search: 임베딩과 전통적 검색을 결합한 지능형 웹 검색
   - Perplexity Search: Perplexity의 Sonar Pro를 활용한 웹 검색

2. **메모리 관리**
   - Knowledge Graph Memory Server: 로컬 지식 그래프를 활용한 영구 메모리
   - Memory Box MCP Server: 시맨틱 이해 기반 메모리 저장/검색
   - DuckDB Knowledge Graph Memory Server: 효율적인 메모리 시스템

3. **브라우저 자동화**
   - Browserbase: 클라우드 브라우저 자동화 기능
   - Hyperbrowser: 웹 스크래핑 및 구조화된 데이터 추출
   - Playwright: 브라우저 제어 및 웹 상호작용 자동화

4. **금융 데이터 분석**
   - Crypto Price & Market Analysis Server: 실시간 암호화폐 데이터
   - Lunchmoney MCP Server: 거래 및 예산 관리
   - Alpha Vantage Stock Server: 실시간 및 과거 주식 시장 데이터

5. **날씨 및 위치 데이터**
   - Weather: 실시간 날씨 정보 및 예보
   - Time Server: 현재 시간 정보 및 시간대 변환
   - Flightradar24 Server: 실시간 항공편 추적

### Smithery 사용법
1. [Smithery 웹사이트](https://smithery.ai/) 방문
2. 필요한 기능에 맞는 서버 검색 또는 카테고리별 탐색
3. 원하는 서버 선택 및 설치 지침 확인
4. Claude Desktop이나 다른 MCP 호환 클라이언트에 서버 연결
5. 연결된 서버의 기능을 AI 애플리케이션에서 활용


---

## 결론

MCP는 AI 시스템과 외부 데이터 소스 및 도구 간의 상호작용을 표준화함으로써 AI 애플리케이션 개발을 크게 단순화한다. 오픈 프로토콜로서 다양한 언어와 플랫폼에서 구현될 수 있으며, 보안 및 개인 정보 보호 원칙을 중심으로 설계되어 안전한 AI 시스템 구축을 지원한다.

- 표준화된 방식으로 AI 모델이 외부 데이터 및 도구와 통합
- 개방형 생태계를 통한 혁신 및 협업 촉진
- 기존 RAG와 같은 접근 방식보다 더 포괄적이고 확장 가능한 솔루션 제공

MCP에 대한 더 자세한 내용은 [[LangChain]], [[LangGraph]], [[Agent 사용 RAG+Tavily]] 문서와 함께 살펴보면 AI 애플리케이션 개발에 대한 종합적인 이해를 얻을 수 있다.
