---
layout: post
title:  "[BoB 프로젝트 주제 분석]"
date:   2025-10-16
categories: "기술문서/블로그"
tags: image
image: /assets/article_images/2025-10-16-secure_coding/pink.png
---

# Solidity 기반 스마트 컨트랙트 취약점 분석 및 점검 툴 개발

## 스마트 컨트랙트

- 블록체인 플랫폼에서 실행되는 자동화된 계약 프로그램
- Solidity로 작성된 스마트 컨트랙트는 배포 후 수정이 어렵고, 한 번의 실수가 막대한 자산 손실로 이어질 수 있음
- 컨트랙트 배포 전 단계에서 재진입(Reentrancy), 접근제어 오류, 산술/가스 한도, 업그레이어블 패턴 위험 등을 조기에 탐지·차단하는 방법에 대한 연구가 필요

## 주제 선정 이유

- 탈중앙화 금융(DeFi), NFT, DAO 등 블록체인 기반 서비스가 확산되면서 스마트 컨트랙트의 사용 급증 → 이에 따라 보안 검증의 필요성도 함께 증가하고 있음
- 스마트 컨트랙트의 오류는 시간이 지남에 따라 반복적으로 발생하며 금전적 손실을 발생시킴. 보안 도구 개발이 이러한 피해를 사전에 예방할 수 있는 실질적인 해결책

## 주요 스마트 컨트랙트 취약점 유형

### (1) [Reentrancy Attack](https://blog.chain.link/reentrancy-attacks-and-the-dao-hack/) (재진입 공격)

재진입 공격은 외부 계약이 원래 함수로 다시 호출되어 코드 실행을 임의의 위치에서 재진입하는 방식으로 작동

**공격 메커니즘**
```solidity
// 취약한 코드 예시
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    msg.sender.call.value(amount)(""); // 외부 호출이 먼저 발생
    balances[msg.sender] -= amount;    // 상태 변경이 나중에 발생
}
```

외부 계약의 출금 함수를 호출하기 직전에 userBalances의 상태를 업데이트함으로써 방지할 수 있음

**방어 기법**
- Checks-Effects-Interactions 패턴
- ReentrancyGuard 모디파이어 사용
- Mutex 패턴

### (2) Integer Overflow/Underflow

데이터 타입 범위를 초과하는 숫자를 추가할 때 발생

**방어 기법**
- SafeMath 라이브러리 사용 (0.8.0 이전 버전)
- Solidity 0.8.0 이상 사용 (자동 체크)

### (3) [Unchecked External Calls](https://www.cobalt.io/blog/smart-contract-security-risks)

- 스마트 컨트랙트가 외부 함수 호출의 결과를 검증하지 않을 때 발생하는 취약점
- 호출이 실패해도 예외 오류를 발생시키지 않아 계약이 성공한 것처럼 진행될 수 있음

**방어 기법**
- `transfer()` 사용 (실패 시 자동 revert)
- `send()` 또는 `call()`의 반환값 체크

### (4) [Access Control 문제](https://hacken.io/discover/most-common-smart-contract-vulnerabilities/)

- Solidity의 함수는 가시성 지정자를 가지며, 이는 함수가 어떻게 호출될 수 있는지를 결정함
- 함수의 기본 가시성은 public이므로, 가시성을 지정하지 않은 함수는 외부 사용자가 호출할 수 있음


**방어 기법**
- 명시적으로 함수 가시성 지정
- 적절한 접근 제어 메커니즘 구현
- 다중 서명 지갑 관리

## 대표적인 해킹 사례: [The DAO Attack (2016)](https://coinmarketcap.com/academy/article/a-history-of-the-dao-hack)

The DAO는 2016년 이더리움 블록체인에서 시작된 탈중앙화 자율 조직으로, 토큰 세일을 통해 1억 5천만 달러 상당의 이더를 모금한 후 코드베이스의 취약점으로 인해 해킹당함

**공격 과정**  
초당 100 ETH의 속도로 The DAO 스마트 컨트랙트에서 이더를 유출시킴

**대응**  
하드 포크: The DAO 공격 이전으로 이더리움 네트워크의 히스토리를 되돌려 The DAO의 이더를 다른 스마트 컨트랙트로 재할당하여 투자자들이 자금을 인출할 수 있도록 함

**결과**  
- 이더리움이 두 개의 체인으로 분할: Ethereum (ETH)과 Ethereum Classic (ETC)
- 스마트 컨트랙트 보안의 중요성 부각
- 감사(Audit) 문화 확립

## 최신 취약점 분석 도구
<br>
### (1) 정적 분석 도구

[**Slither**](https://www.cyfrin.io/blog/industry-leading-smart-contract-auditing-and-security-tools)  
- Python 기반
- Solidity 코드에 대한 광범위한 취약점 탐지기를 제공
- 빠른 실행 시간, 낮은 오탐률, CI 파이프라인 통합 능력
- 장점: 92개 이상의 취약점 탐지기, Python API를 통한 커스텀 분석
- 지원: Hardhat, Foundry, DappTools

[**Aderyn**](https://www.quillaudits.com/blog/smart-contract/smart-contract-security-tools-guide)  
- Rust 기반
- Solidity 스마트 컨트랙트의 취약점을 탐지
- AST를 순회하여 잠재적 문제를 마크다운 형식으로 보고
- 장점: 빠른 탐지, 낮은 오탐, CI/CD 통합, Nyth를 통한 커스텀 분석 프레임워크

[**Mythril**](https://www.rapidinnovation.io/post/top-7-smart-contract-audit-tools)  
- Python 기반 스마트 컨트랙트 감사 도구
- 오염 분석 및 심볼릭 실행과 같은 고급 분석 기법을 제공
- EVM 바이트코드만으로도 분석이 가능

### (2) 퍼징 도구

[**Echidna**](https://www.quillaudits.com/blog/smart-contract/smart-contract-security-tools-guide)  
- 이더리움 스마트 컨트랙트를 위한 속성 기반 퍼징 도구
- 사용자 정의 속성에 대해 계약을 테스트하여 취약점을 식별
- 특징: 속성 기반 퍼징, 사용자 정의 assertion, 커버리지 리포팅

[**Medusa**](https://www.cyfrin.io/blog/industry-leading-smart-contract-auditing-and-security-tools)  
- Echidna에서 영감을 받은 실험적 스마트 컨트랙트 퍼저
- CLI 또는 Go API를 통한 병렬 퍼즈 테스트를 가능하게 함
- 특징: 멀티스레드 병렬 퍼징, Solidity 속성 및 assertion 테스트, 커버리지 기반 퍼징

[**Diligence Fuzzing**](https://www.cyfrin.io/blog/industry-leading-smart-contract-auditing-and-security-tools)  
- Harvey로 구동되는 완전한 스마트 컨트랙트 퍼징 서비스 플랫폼
- Harvey는 이더리움 바이트코드를 위한 강력한 퍼저

### (3) 형식 검증 도구

[**Halmos**](https://www.quillaudits.com/blog/smart-contract/smart-contract-security-tools-guide)  
- 이더리움 스마트 컨트랙트를 위한 오픈소스 형식 검증 도구
- 계약 로직을 분석하기 위해 제한된 심볼릭 실행을 사용

### (4) AI 기반 도구

[**QuillShield**](https://www.quillaudits.com/blog/smart-contract/smart-contract-security-tools-guide)  
- 일반적인 취약점을 넘어 논리적 오류를 탐지하여 스마트 컨트랙트 감사를 향상시킴

[**Lightning Cat**](https://www.nature.com/articles/s41598-023-47219-0)  
- 딥러닝 기법을 기반으로 한 솔루션
- CodeBERT 모델을 최적화하고 CNN과 결합하여 취약점 코드에서 중요한 특징을 추출하고 강력한 의미 분석 능력을 갖춤

### (5) 통합 플랫폼

[**Solodit**](https://www.cyfrin.io/blog/industry-leading-smart-contract-auditing-and-security-tools)  
- 여러 보안 회사와 최고 연구자들의 15,000개 이상의 보안 취약점 및 버그 바운티를 집계
- 기능: 8,000개 이상의 취약점 데이터베이스, 버그 바운티 추적, 감사 체크리스트
