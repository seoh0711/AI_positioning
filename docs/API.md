# API Documentation

## Base URL
```
Development:  http://localhost:3000/api
Production:   https://your-domain.vercel.app/api
```

---

## Endpoints

### 1. POST /positioning

직무 전체 분석

#### Request
```json
{ "job": "데이터 분석가" }
```

#### Response (200)
```json
{
  "job_title": { "ko": "데이터 분석가", "en": "Data Analyst" },
  "definition": {
    "ko": "데이터를 수집, 처리, 분석하여 비즈니스 인사이트를 도출하는 전문가",
    "en": "A professional who collects, processes, and analyzes data to derive business insights"
  },
  "positioning_summary": {
    "ko": "AI 도구를 활용한 고급 분석 능력이 핵심 경쟁력",
    "en": "Advanced analytical skills leveraging AI tools are the core competitive advantage"
  },
  "career_advice": [
    { "ko": "Python, SQL 고급 활용법 학습", "en": "Learn advanced Python and SQL" },
    { "ko": "머신러닝 기초 이해 및 AutoML 도구 활용", "en": "Understand ML fundamentals and leverage AutoML tools" },
    { "ko": "비즈니스 도메인 지식 강화", "en": "Strengthen business domain knowledge" }
  ],
  "categories": {
    "automation": [
      {
        "title": { "ko": "데이터 수집 자동화", "en": "Data Collection Automation" },
        "reason": { "ko": "반복적인 규칙 기반 작업", "en": "Repetitive rule-based task" },
        "automation_prompt": {
          "ko": "다음 데이터를 자동으로 수집하고 정제하는 Python 스크립트를 작성해줘...",
          "en": "Write a Python script to automatically collect and clean the following data..."
        }
      }
      // ... 총 5개
    ],
    "ai_enhanced": [
      {
        "title": { "ko": "패턴 분석 및 시각화", "en": "Pattern Analysis and Visualization" },
        "scenario": { "ko": "AI 도구로 복잡한 패턴을 빠르게 식별하고 시각화", "en": "Quickly identify and visualize complex patterns with AI tools" },
        "tool_recommendation": { "ko": "ChatGPT, Tableau AI", "en": "ChatGPT, Tableau AI" }
      }
      // ... 총 5개
    ],
    "creative": [
      {
        "title": { "ko": "비즈니스 문제 정의", "en": "Business Problem Definition" },
        "human_value": { "ko": "조직의 맥락과 이해관계자의 니즈를 이해하는 인간 고유의 능력", "en": "Uniquely human ability to understand organizational context and stakeholder needs" }
      }
      // ... 총 5개
    ]
  }
}
```

#### Error Response (400/500)
```json
{ "error": "직무명을 입력하세요" }
```

---

### 2. POST /positioning/refresh

특정 카테고리 재생성

#### Request
```json
{
  "job": "데이터 분석가",
  "category": "automation"
}
```

#### Parameters
- `category`: `"automation"` | `"ai_enhanced"` | `"creative"`

#### Response (200) — automation 예시
```json
[
  {
    "title": { "ko": "ETL 파이프라인 구축", "en": "ETL Pipeline Construction" },
    "reason": { "ko": "반복적인 데이터 이동 작업", "en": "Repetitive data movement task" },
    "automation_prompt": { "ko": "...", "en": "..." }
  }
  // ... 총 5개
]
```

---

### 3. GET /auth/session

현재 세션 정보 (NextAuth)

#### Response (인증된 경우)
```json
{
  "user": {
    "name": "홍길동",
    "email": "hong@hanbit.co.kr",
    "image": "https://lh3.googleusercontent.com/..."
  },
  "expires": "2026-04-16T22:12:00.000Z"
}
```

#### Response (미인증)
```json
null
```

---

## Gemini API 설정

| 설정 | 값 |
|------|-----|
| 패키지 | `@google/genai` |
| 모델 | `gemini-3-flash-preview` |
| 호출 방식 | `client.interactions.create()` |
| 출력 | JSON only (마크다운 불허) |

## 에러 처리

- JSON 파싱 실패 시 제어문자 제거, trailing comma 정제 후 재시도
- 재시도 실패 시 500 에러 반환

## 인증
NextAuth 세션 기반. `@hanbit.co.kr` 도메인만 허용.
미인증 사용자에게는 로그인 UI만 표시 (API는 세션 검사 없음, UI 레벨 제한).
