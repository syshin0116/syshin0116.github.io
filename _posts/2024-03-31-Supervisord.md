---
layout: post
title: Supervisord
date: 2024-03-31 20:38 +0900
categories:
  - ETC
  - Tech
tags: 
math: true
---

Supervisord는 UNIX 계열 운영 시스템에서 여러 프로세스를 모니터링하고 제어하는 클라이언트/서버 시스템으로, 주로 긴 실행 시간을 요하는 프로세스들의 시작, 유지 관리 및 로깅을 관리하는 데 사용된다

## 프로세스 관리의 필요성

웹 서버, 작업 큐, 백그라운드 작업 등 지속적으로 실행되어야 하는 프로세스들의 관리를 자동화함으로써, 수동으로 서비스를 재시작하는 번거로움 없이 항상 실행 상태를 유지할 수 있다

### 설정 파일

`supervisord.conf` 설정 파일을 통해 각 프로세스의 시작 방법, 로그 파일 위치, 프로세스가 충돌했을 때의 대응 방식 등을 정의한다 이를 통해 사용자는 세밀한 제어와 함께 효율적인 프로세스 관리를 할 수 있다

### 자동 시작 및 재시작

Supervisord는 설정에 따라 자동으로 프로세스를 시작할 수 있으며, 예상치 못한 종료 후에는 자동으로 재시작한다 이는 시스템의 안정성을 크게 향상시킨다

### 로깅

프로세스에서 발생하는 stdout과 stderr 출력을 캡처하여 파일로 로깅할 수 있으며, 이는 디버깅과 모니터링에 매우 유용하다

### 웹 인터페이스

설정을 통해 활성화할 수 있는 웹 기반 인터페이스를 통해 사용자는 프로세스 상태를 확인하고, 프로세스를 시작/중지할 수 있으며, 로그 파일을 직접 읽을 수 있다

### 커맨드라인 인터페이스

Supervisorctl은 Supervisor의 커맨드라인 클라이언트로, 웹 인터페이스와 유사한 기능을 제공한다 프로세스의 시작, 중지 및 모니터링이 가능하다

## 사용 사례

- **애플리케이션 배포**: Django나 Flask 앱, Celery 워커 등 애플리케이션의 다양한 구성 요소를 관리하는 데 사용
- **도커 컨테이너**: 단일 컨테이너 내 여러 프로세스를 관리하기 위해 사용되며, 가능한 한 컨테이너 당 하나의 프로세스를 유지하는 것이 권장됨
- **개발 환경**: 개발 중인 애플리케이션의 모든 부분이 실행되고 있는지 확인하기 위해 개발자가 사용


### 문제 상황과 해결

프로젝트에서 Flask, Celery, Redis를 포함하는 복잡한 환경을 도커 컨테이너 안에서 효율적으로 관리해야 했으며, 특히 Celery가 Redis에 연결하지 못하는 문제와 Flask 및 Celery 로그가 기록되지 않는 문제가 있었다

### Supervisord를 통한 해결 전략

1. **프로세스 관리**: Flask, Celery, Redis 프로세스의 시작, 중지, 재시작을 `supervisord.conf` 설정 파일로 관리, 안정성 향상
2. **로깅 개선**: 각 프로세스의 로그 파일 경로 지정과 표준 오류를 표준 출력으로 리다이렉션하여 로깅 문제 해결
3. **연결 문제 해결**: Docker 내부에서 `localhost`를 통한 Redis 연결 설정으로 Celery와 Redis 연결 문제 해결
4. **보안 강화**: 비루트 사용자 실행을 통한 보안 경고 대응