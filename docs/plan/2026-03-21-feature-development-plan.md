# AI Positioning — 기능 개발 계획서

> 작성일: 2026-03-21
> 대상 리포지토리: https://github.com/seoh0711/AI_positioning

---

## 개요

현재 AI Positioning 플랫폼은 직무 분석(3-Layer: Automation / AI Enhanced / Creative)의 기본 기능을 갖추고 있습니다.
이번 개발 계획은 분석 결과의 **실용성과 깊이**를 높이는 세 가지 신규 기능을 추가합니다.

| # | 기능 | 목적 |
|---|------|------|
| 1 | 1회성 자동화 업무 | 반복이 아닌 단발성 업무를 즉시 AI로 처리하는 프롬프트 생성 |
| 2 | AI 협업 전문성 강화 | 직무별 AI 도구 활용 시나리오 및 워크플로우 제공 |
| 3 | 전자책 제작 | 직무 분석 결과를 기반으로 개인화된 성장 전자책 자동 생성 |

---

## Feature 1: 1회성 자동화 업무

### 배경
사용자는 매일 반복되지 않는 단발성 업무(보고서 작성, 데이터 정리, 이메일 초안 등)에도 많은 시간을 소비합니다.
현재 플랫폼의 Automation 카테고리는 반복 업무 중심이지만, 1회성 업무에 대한 즉각적인 AI 활용 가이드는 없습니다.

### 기능 설명
- 사용자가 자유 형식으로 "지금 해야 할 업무"를 입력
- Gemini AI가 해당 업무를 분석하여 즉시 실행 가능한 자동화 프롬프트 생성
- 추천 AI 도구, 예상 소요 시간 단축률, 단계별 실행 가이드 제공

### 주요 작업 항목

#### Issue 1-1: 1회성 자동화 입력 UI 구현
- 메인 페이지에 "지금 당장 자동화할 업무" 입력 섹션 추가
- 입력창, 분석 버튼, 결과 카드 컴포넌트 구현
- 로딩 상태 및 에러 핸들링 UI

#### Issue 1-2: 1회성 자동화 API 엔드포인트
- `POST /api/automation/one-time` 엔드포인트 구현
- 요청: `{ task: string, job_context?: string }`
- 응답: `{ prompt, tool_recommendation, time_saving, steps[] }`

#### Issue 1-3: Gemini 프롬프트 엔지니어링 (1회성 자동화)
- `lib/gemini.ts`에 `getOneTimeAutomation()` 함수 추가
- 업무 내용을 분석하여 즉시 실행 가능한 프롬프트 생성 로직

### 인수 조건
- [ ] 사용자가 업무를 입력하면 5초 이내에 자동화 프롬프트가 표시된다
- [ ] 결과에 추천 AI 도구(ChatGPT/Claude/Gemini)가 포함된다
- [ ] 생성된 프롬프트를 클립보드에 복사할 수 있다
- [ ] 한국어/영어 전환이 정상 작동한다

### 의존성
- 없음 (독립적으로 개발 가능)

---

## Feature 2: 업무 전문성 강화를 위한 AI 협업

### 배경
현재 AI Enhanced 카테고리는 도구 추천과 시나리오를 단순 나열합니다.
사용자가 실제로 AI와 협업하는 구체적인 워크플로우(단계별 작업 흐름)가 없어 실용성이 부족합니다.

### 기능 설명
- 직무 분석 결과의 AI Enhanced 항목을 선택하면 상세 협업 워크플로우 제공
- 단계별 인터랙티브 가이드: 입력 → AI 처리 → 검토 → 활용
- 직무 전문성 향상을 위한 AI 도구 조합 추천

### 주요 작업 항목

#### Issue 2-1: AI 협업 워크플로우 뷰어 컴포넌트
- `src/components/WorkflowViewer.tsx` 신규 생성
- 단계별 스텝 카드 UI (Step 1 → Step 2 → ... 시각화)
- Framer Motion 기반 스텝 전환 애니메이션

#### Issue 2-2: AI 협업 심층 분석 API 엔드포인트
- `POST /api/collaboration/workflow` 엔드포인트 구현
- 요청: `{ job: string, task_title: string, category: 'ai_enhanced' }`
- 응답: `{ workflow_steps[], tools[], skill_growth_tips[], practice_prompt }`

#### Issue 2-3: Gemini 프롬프트 엔지니어링 (AI 협업 워크플로우)
- `lib/gemini.ts`에 `getCollaborationWorkflow()` 함수 추가
- 5~7단계 구체적 워크플로우 + 각 단계별 AI 프롬프트 생성

#### Issue 2-4: AI Enhanced 카드와 워크플로우 연동
- 기존 AI Enhanced 카드에 "워크플로우 보기" 버튼 추가
- 모달 또는 사이드패널로 워크플로우 뷰어 노출

### 인수 조건
- [ ] AI Enhanced 카드에서 "워크플로우 보기" 클릭 시 상세 화면이 열린다
- [ ] 워크플로우는 최소 5단계 이상으로 구성된다
- [ ] 각 단계에 실행 가능한 AI 프롬프트가 포함된다
- [ ] 한국어/영어 전환이 정상 작동한다

### 의존성
- Issue 2-1 완료 후 Issue 2-4 진행 가능
- Issue 2-2, 2-3은 병렬 개발 가능

---

## Feature 3: 업무 능력 성장을 위한 전자책 제작

### 배경
`EbookViewer` 컴포넌트와 `EbookContent` 타입이 이미 구현되어 있으나, 실제 콘텐츠를 Gemini로 생성하는 로직이 없습니다.
직무 분석 결과를 바탕으로 개인화된 학습 전자책을 자동 생성하면 플랫폼의 핵심 차별화 가치가 됩니다.

### 기능 설명
- 직무 분석 완료 후 "전자책 생성하기" 버튼 노출
- Gemini가 분석 결과를 기반으로 5~7챕터 전자책 자동 생성
- 챕터 구성: 직무 개요 → AI 도구 활용법 → 스킬 개발 로드맵 → 실전 액션 플랜 → 미래 전망
- 페이지 넘기기 인터랙션, 진행률 표시

### 주요 작업 항목

#### Issue 3-1: 전자책 생성 Gemini 프롬프트 엔지니어링
- `lib/gemini.ts`에 `generateEbook()` 함수 추가
- 직무 분석 결과(`PositioningResult`)를 입력받아 `EbookContent` 구조 반환
- 챕터별 500~800자 분량의 실질적 학습 콘텐츠 생성

#### Issue 3-2: 전자책 생성 API 엔드포인트
- `POST /api/ebook/generate` 엔드포인트 구현
- 요청: `{ positioning_result: PositioningResult }`
- 응답: `EbookContent` JSON
- 생성 시간이 길 수 있으므로 스트리밍 또는 적절한 로딩 UX 필요

#### Issue 3-3: EbookViewer 컴포넌트 고도화
- 현재 `EbookViewer.tsx` 기반으로 페이지 네비게이션 완성
- 챕터 목차(TOC) 사이드바 추가
- 읽기 진행률 표시 (Progress Bar)
- 텍스트 크기 조절 기능

#### Issue 3-4: 전자책 생성 플로우 메인 페이지 연동
- 직무 분석 완료 후 결과 화면에 "전자책으로 저장하기" 버튼 추가
- 전자책 생성 중 로딩 애니메이션 (책 페이지 넘기기 효과)
- 생성 완료 후 EbookViewer 자동 오픈

### 인수 조건
- [ ] 직무 분석 완료 후 전자책 생성 버튼이 표시된다
- [ ] 전자책은 최소 5챕터 이상으로 생성된다
- [ ] 챕터 간 네비게이션(이전/다음)이 정상 작동한다
- [ ] 목차에서 특정 챕터로 바로 이동할 수 있다
- [ ] 한국어/영어 전환이 정상 작동한다

### 의존성
- Issue 3-1 완료 후 Issue 3-2 진행 가능
- Issue 3-3은 독립적으로 개발 가능 (목업 데이터 활용)
- Issue 3-4는 Issue 3-2, 3-3 모두 완료 후 진행

---

## 개발 우선순위 및 의존성 맵

```
Feature 1 (1회성 자동화)
  └── 1-1 UI → 1-2 API ← 1-3 Gemini 프롬프트

Feature 2 (AI 협업)
  └── 2-1 WorkflowViewer
  └── 2-2 API ← 2-3 Gemini 프롬프트
  └── 2-4 카드 연동 (depends: 2-1, 2-2)

Feature 3 (전자책)
  └── 3-1 Gemini 프롬프트 → 3-2 API
  └── 3-3 EbookViewer 고도화 (독립)
  └── 3-4 메인 연동 (depends: 3-2, 3-3)
```

## 권장 개발 순서

1. **1-3 → 1-2 → 1-1** (가장 독립적, 빠른 시제품 검증 가능)
2. **2-3 → 2-2 → 2-1 → 2-4** (기존 UI 확장)
3. **3-3 (병렬) → 3-1 → 3-2 → 3-4** (가장 복잡, 마지막)
