# AI Positioning - Claude Code Project

## 프로젝트 개요
AI 시대 직무 전략적 포지셔닝 분석 플랫폼 — 직무명을 입력하면 Gemini AI가 자동화/AI 활용/인간 고유 영역으로 분류하고 커리어 전략을 제시합니다.

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **AI**: Google Gemini API (`@google/genai`, model: `gemini-3-flash-preview`)
- **Auth**: NextAuth.js v4 (Google OAuth, `@hanbit.co.kr` 도메인 제한)
- **Deployment**: Vercel

## 프로젝트 구조
```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth 핸들러
│   │   └── positioning/
│   │       ├── route.ts                  # 전체 분석 API
│   │       └── refresh/route.ts          # 카테고리 재생성 API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                          # 메인 UI (모든 컴포넌트 포함)
└── lib/
    ├── gemini.ts                          # Gemini API 호출 로직
    ├── auth.ts                            # NextAuth 설정
    └── translations.ts                   # 한/영 번역 데이터
```

## 데이터 구조

### 분석 결과 (PositioningResult)
```typescript
{
  job_title: { ko: string; en: string }
  definition: { ko: string; en: string }
  positioning_summary: { ko: string; en: string }
  career_advice: Array<{ ko: string; en: string }>  // 3개
  categories: {
    automation: Array<{
      title: { ko; en }
      reason: { ko; en }
      automation_prompt: { ko; en }
    }>  // 5개
    ai_enhanced: Array<{
      title: { ko; en }
      scenario: { ko; en }
      tool_recommendation: { ko; en }
    }>  // 5개
    creative: Array<{
      title: { ko; en }
      human_value: { ko; en }
    }>  // 5개
  }
}
```

## 주요 작업 흐름

### 직무 분석 실행
```
/analyze-job [직무명]
```

### 카테고리 재생성
```
/refresh-category [automation|ai_enhanced|creative]
```

### 프롬프트 생성
```
/generate-prompt [직무명] [대상 AI: chatgpt|claude|gemini]
```

## 환경 변수
| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API 키 |
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 |
| `NEXTAUTH_URL` | 앱 URL (dev: http://localhost:3000) |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화 키 |

## 스킬 목록
- `job-analysis`: 직무 분석 및 정의
- `ai-categorization`: AI 시대 작업 분류 (5개 항목씩)
- `prompt-generation`: AI 프롬프트 자동 생성
- `translation`: 한/영 번역 처리

## 에이전트
- `job-analyzer`: 직무 분석 전문 에이전트
- `career-advisor`: 커리어 조언 생성 에이전트

## 참조 문서
- [아키텍처 문서](docs/ARCHITECTURE.md)
- [API 문서](docs/API.md)
- [배포 가이드](docs/DEPLOYMENT.md)

## 개발 서버 실행
```bash
npm run dev
```
