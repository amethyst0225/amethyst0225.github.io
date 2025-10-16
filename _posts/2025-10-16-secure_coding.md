---
layout: post
title:  "[BoB 프로젝트 주제 분석]"
date:   2025-10-16
categories: "기술문서/블로그"
tags: image
image: /assets/article_images/2025-10-16-secure_coding/pink.png
---

# bug hunting guide line & secure coding

## 1. 개념

- Bug hunting: 소프트웨어 또는 하드웨어의 오류(버그)를 찾아내서 제보하는 행위. 단순 취약점 찾기 뿐 아니라 체계적 접근과 결과 입증(재현성) 및 영향평가가 중요하며, MS SDL 등 위협모델링 기반 접근이 필수로 자리잡음.
- Secure coding: 설계, 구현 전 과정에서 보안을 내재화(Security by Design)해야 하며, 처음부터 위협모델링–보안요구 분석–코드 리뷰–테스트–배포 전 게이트 등 전체 주기를 구조화해야 효과적.

## 2. Bug Hunting Guideline
<br>
### 핵심 요소
<br>
**1.** 범위 정의
- 테스트 대상 시스템/기능 명확히 하기
- 허용되는 테스트 방법과 금지 사항 확인

**2.** 체계적 접근법
- 재현 가능한 버그 찾기
- 명확한 재현 단계 문서화
- 버그의 영향도 평가 (심각도, 우선순위)

**3.** 보고 방식
- 버그 제목과 설명을 명확하게 작성
- 재현 단계를 순서대로 기록
- 스크린샷, 로그 등 증거 첨부
- 예상 결과 vs 실제 결과 비교

**4.** 윤리적 원칙
- 허가된 범위 내에서만 테스트
- 발견한 취약점 악용 금지
- 책임있는 공개(Responsible Disclosure)

## 3. Secure Coding 핵심 원칙

1. 최소 권한(Least privilege): 코드, 프로세스, 사용자 등 모든 엔티티는 반드시 필요한 권한만 부여
2. 실패-안전 기본값(Fail-safe defaults): 기본 거부 및 명시적 허용, 오류·예외 시 안전모드로 수렴
3. 완전 매개/중재(Complete mediation): 모든 접근 마다 권한 검증(캐시된 결정은 권한변경 때 무효화)
4. 경제성(Economy of mechanism): 단순 구조, 작은 크기 → 검증·분석·운영이 쉬움 
5. 개방 설계(Open design): 설계는 공개/검증 가능해야 하며, 비밀 유지의 중점은 키에(‘security through obscurity’는 지양)
6. 권한 분리(Separation of privilege): 두 개 이상의 조건(예: 2인 승인) 필요 상황에선 반드시 다중 인증(2FA 등) 사용
7. 공유 최소화(Least common mechanism): 여러 사용자/서브시스템이 공유하는 메커니즘은 최소화, 교차영향·사이드채널 차단
8. 심리적 수용성(Psychological acceptability): 개발자/사용자 관점 모두에서 이해·사용 쉬운 보안 인터페이스 필요
9. 방어 심층화(Defense in depth): 단일 취약점으로 전체 뚫리는 것을 방지하는 다층 구조 적용
10. 효과적 로깅(Effective logging): 접근/행동 추적, 위변조 방지, 개인정보·비밀키 등 민감정보 미기록
11. Build-in, Not bolt-on: 보안을 사후(‘패치’)가 아니라 애초에 설계에 반영해야 함

## 4. 프로세스: Built-in Security

- 요구사항/분석: ‘무엇이 안전한가?’의 정의, 위험 기반 요구사항 추출(STRIDE, LINDDUN 등 모델 활용)
- 설계단계: 위협모델링, DFD/UML 등 다이어그램화 → 공격자 시나리오·파급효과 분석, 방어 수단 내재화
- 구현/코딩: 안전한 프레임워크, 라이브러리 사용 및 리뷰, 정적분석 도구, Secure-by-default 옵션 유지
- 시험/검증: 동적분석 및 펜테스트 등으로 설계·코드상의 취약점 검증(OWASP Top 10, SANS 등 참고)
- 배포/운영: 배포 전 보안게이트(코드 리뷰, 분석, 위협모델 검증 등), 자동화/CI 연계 기준 마련

## 5. Security Theater

- 보안 효과 없는 정책·도구 남용 금지: 망분리·다중 보안툴 등 ‘느낌만’ 주는 보안에 그쳐 실제 위협 감소 효능 x
- 운영 복잡성 증가·공격면 확장·사용자 불편에 상응하는 실증적 효과가 없을 경우 정책 재점검 필요
- 실사례: 평문 자격증명·민감정보, 로그 부재 등 실제 유출 대응·탐지 불능이 반복됨. 저장중 암호화, 키 분리관리, 로그 위변조 방지 등을 지켜야 진짜 보안

## 6. 실제 시스템 적용 관점(SSDLC)

![image.png](/assets/article_images/2025-10-16-secure_coding/image.png)

- 인증·세션: STS 등 표준 프로토콜, 상호 인증/키합의 연계, 토큰 만료 짧게·회전/폐기 가능 구조
- 입력 검증: 경로·쿼리·헤더·파일명 등은 화이트리스트+정규식+컨텍스트 인코딩으로 단일 파서화
- 데이터 보호: 저장·전송 전체 강한 암호화, 키는 HSM 등 외부 금고에 격리 저장. 하드코딩 키/비밀정보는 금지
- 권한·리소스 경계: 객체별 권한검사 강제, 각 기능/객체별 최소권한화, 임시 자격증명·세션엔 만료·범위 체크
- 에러/로깅: 사용자 에러는 민감정보 노출 없이, 내부 로그만 위변조 방지/보존주기 설정
- 서드파티/의존성: 안전한 기본설정 유지, 의존성 취약점 탐지 자동화, 수시 SLO·업데이트 운용
- 배포 전 게이트: 모든 주요 보안점검(정적/동적/조합 분석, 위협모델, 코드리뷰 등) 통과 후에만 배포

## 7. Threat Modeling
<br>
### **Threat Modeling 단계**
<br>
**1. DFD 작성 및 시스템 범위‧Trust Boundary 확정**

- DFD(Data Flow Diagram)로 시스템의 데이터 흐름, 외부 엔터티, 내부 프로세스, 데이터 저장소, Trust Boundary(신뢰 경계; 권한·신뢰 수준이 바뀌는 지점)를 시각적으로 표현
- Trust Boundary 주위에서 권한 상승(EoP)·우회(Tampering) 등 위험이 주로 발생하며, exploit 코딩의 주요 진입점이 됨

![image.png](/assets/article_images/2025-10-16-secure_coding/image%201.png)

**2. 자산(Asset) 파악**

- 보호해야 할 핵심 자산(데이터, 서비스, 인증정보 등) 식별, 공격 성공 시 위험이 큰 타깃 위주로 모델링
- 실제 exploit 구현의 목표가 되는 지점과 일치.

**3. 위협 및 취약점 식별(STRIDE, LINDDUN 등 활용)**

- STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
    
    ![image.png](/assets/article_images/2025-10-16-secure_coding/image%202.png)
    
- LINDDUN: 개인정보 위험 평가에 최적화됨
    
    ![image.png](/assets/article_images/2025-10-16-secure_coding/image%203.png)
    
- 각 Threat별로 공격 시나리오/공격트리(Attack Tree)로 구체화 → exploit 개발시 시나리오 뼈대 역할을 함
    
    ![image.png](/assets/article_images/2025-10-16-secure_coding/image%204.png)
    

**4. 위험 우선순위 산정(DREAD, TARA, Simple/Qualitative Risk Model 적용)**

- DREAD: Damage/Reproducibility/Exploitability/Affected users/Discoverability
    
    ![image.png](/assets/article_images/2025-10-16-secure_coding/image%205.png)
    
- 공격 난이도, 피해 규모 등 계량화→익스플로잇 타겟 선정 결정적 근거

**5. 대응방안 도출(Reduce, Transfer, Accept, Avoid) 및 반복 갱신**

- Countermeasure 설계: Exploit 성공을 막기 위한 방어책(완화)
- exploitable bug 발견 → exploit 개발/공격자 관점에서 최종 우회 코드(서로 피드백/루프 구조)로 연결

<br>
<br>
주요 기업들이 실제로 보안을 어떻게 체계적으로 구축·유지하는지 파악하고자 이번 주제를 조사하게 되었다. 조사 과정에서 단순히 보안 정책만 도입하기보다는 Threat Modeling과 같은 사전 위험 식별 과정과 개발 과정에서의 보안 내재화가 핵심임을 알게 되었다. 실제로 많은 기업들이 Security by Design원칙 하에 요구사항 단계부터 배포까지 보안을 기본 공정으로 포함하고 있다.

추후에는 간단한 예시 상황에 직접 Threat Modeling 절차를 단계적으로 적용해보고, 도출된 위협 시나리오에 어떤 방식으로 Secure Coding 원칙들을 실제 소스 코드에 반영할 수 있을지 실습해보고 싶다.
