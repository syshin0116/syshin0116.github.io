---
layout: post
title: "[Spring]DAO vs DTO vs VO"
date: 2022-09-04 02:35:29 +0900
categories: [Java, Spring]
tags: [spring, java]
---

# [Spring]DTO vs DAO vs VO
## DAO
### : Data Access Object
#### 실질적으로 DB에 접근하는 객체를 말한다. 효율적인 커넥션 관리와 보안성 때문에 사용한다.

#### 정의: 
한마디로 Database의 data에 access하는 트랜잭션 객체이다.(일종의 객체) DAO는 저수준의 Logic과 고급 비즈니스 Logic을 분리하고, domain logic으로부터 persistence mechanism을 숨기기 위해 사용한다.(적절히 디자인하면 모든 domain logic을 바꾸는 대신에 DAO를 바꾸기만 하면 됨)
(persistence mechanism: DB에 데이터를 CRUD하는 계층)

#### 설명:
웹서버는 DB와 연결하기 위해서 매번 컨넥션 객체를 생성하는데, 이것을 해결하기 위해 나온 것이 ConnectionPool.

(ConnectionPool: connection 객체를 미리 만들어 놓고 그것을 가져다 쓰는 것. 또 다 쓰고 난 후 반환해 놓는 것)

하지만 유저 한 명이 접속하여 한번에 하나의 커넥션만 일으키지 않고 게시판 하나만 봐도 목록 볼 때 한 번, 글 읽을 때 한 번, 글 쓸때 한 번 등,, 엄청나게 많은 커넥션이 일어난다. 커넥션풀은 커넥션을 또 만드는 오버헤드를 효율적으로 하기 위해 DB에 접속하는 객체를 전용으로 하나만 만들고, 모든 페이지에서 그 객체를 호출하여 사용한다. ➡️ 이렇게 커넥션을 하나만 가져오고 그 커넥션을 가져온 객체가 모든 DB와의 연결을 하는 것이 바로 DAO 객체이다.

❗️즉, DAO는 DB를 사용해 데이터를 조회하거나 조작하는 기능을 전담하도록 만든 오브젝트

사용자는 자신이 필요한 인터페이스를 DAO에게 던지고 DAO는 이 인터페이스를 구현한 객체를 사용자에게 편리하게 사용할 수 있도록 반환해준다.

DB에 대한 접근을 DAO가 담당하도록 하여 데이터베이스 액세스를 DAO에서만 하게되면 다수의 원격 호출을 통한 오버헤드를 VO나 DTO를 통해 줄일 수 있고 다수의 DB 호출 문제를 해결할 수 있다. 또한, 단순히 읽기만 하는 연산이므로 트랜잭션 간 오버헤드를 감소시킬 수 있다.

## DTO
### : Data Transfer Object
#### VO(Value Object)로 바꾸어 말할 수 있는데 계층간 데이터 교환을 위한 자바빈즈를 말한다.

여기서 말하는 계층간의 controller, view, business 계층, persistent 계층을 말하며 각 계층 간 데이터 교환을 위한 객체를 DTO 또는 VO라고 부른다.
(그런데 VO는 DTO와 동일한 개념이지만 read only 속성을 가진다.)

대표적인 DTO로는 폼데이터빈, 데이터베이스 테이블빈 등이 있으며, 각 폼 요소나 데이터베이스 레코드의 데이터를 매핑하기 위한 데이터 객체를 말한다.
즉, 폼 필드들의 이름을 그대로 가지고 있는 자바빈 객체를 폼 필드와 그대로 매핑하여 비즈니스 계층으로 보낼 때 사용한다. 이른 객체를 DTO라고 부르며 VO패턴이라고도 한다.

VO패턴은 데이터 전달을 위한 가장 효율적인 방법이지만, 클래스 선언을 위해 많은 코드가 필요하다는 단점이 있다.

일반적인 DTO는 로직을 가지고 있지 않다. 순수한 데이터 객체이며 속성과 그 속성에 접근하기 위한 getter, setter 메소드만 가진 클래스를 말한다. 여기에 추가적으로 toString(), equals() 등의 Object 클래스 메소드를 작성할 수 있다.

즉, 계층 간의 데이터 전달에 사용하는 데이터 객체들을 말한다.

## VO
### : Value Object
#### DTO와 혼용하여 쓰이긴 하지만 미묘한 차이가 있다.

VO는 값 오브젝트로써 값을 위해 사용된다. 자바는 값 타입을 표현하기 위해 불변 클래스를 만들어 사용하는데 불변이라는 것은 readOnly 특징을 가진다.

이러한 클래스는 중간에 값을 바꿀 수 없고 새로 만들어야 한다는 특징이 있다.
예를들어 Color클래스를 보면 Red를 표현하기 위해 Color.RED 등을 사용하며 getter 기능만이 존재한다.

#### DTO와의 차이:
넣어진 데이터를 getter를 통해 사용하므로 주 목적은 같다는 것이 공통점이다.
그러나 DTO의 경우에는 가변의 성격을 가진 클래스이다.(setter활용) 그와 반대되어 VO는 불변의 성격을 가졌기에 차이점을 가진다고 할 수 있다.

VO는 특정한 비즈니스 값을 담는 객체, DTO는 layer간 통신 용도로 오고가는 객체
