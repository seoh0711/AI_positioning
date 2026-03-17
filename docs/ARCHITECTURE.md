# AI Positioning - System Architecture

## 시스템 개요

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────┐
│      Next.js 14 App Router      │
│  ┌───────────┐   ┌───────────┐  │
│  │    UI     │   │    API    │  │
│  │ (page.tsx)│   │  Routes   │  │
│  └───────────┘   └─────┬─────┘  │
└──────────────────────┬──────────┘
                       │
       ┌───────────────┼───────────────┐
       ↓               ↓               ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Gemini    │ │  NextAuth   │ │   Framer    │
│     API     │ │   (OAuth)   │ │   Motion    │
│  (gemini-   │ │ @hanbit.co  │ │  (animations│
│  3-flash)   │ │    .kr)     │ │   & UI)     │
└─────────────┘ └─────────────┘ └─────────────┘
```

## 주요 컴포넌트

### Frontend (src/app/page.tsx)
모든 UI 컴포넌트가 단일 파일에 포함됨:
- **Home**: 메인 페이지 (상태 관리, API 호출)
- **LoadingOverlay**: 분석 중 오버레이 (5단계 메시지)
- **CategorySection**: 카테고리별 섹션 (재생성 버튼 포함)

### API Routes (src/app/api/)
| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/positioning` | POST | 전체 직무 분석 |
| `/api/positioning/refresh` | POST | 특정 카테고리 재생성 |
| `/api/auth/[...nextauth]` | GET/POST | Google OAuth 핸들러 |

### Libraries (src/lib/)
| 파일 | 역할 |
|------|------|
| `gemini.ts` | Gemini API 호출, JSON 파싱/정제 |
| `auth.ts` | NextAuth 설정, @hanbit.co.kr 도메인 제한 |
| `translations.ts` | 한/영 UI 텍스트 번역 데이터 |

## 데이터 흐름

```
1. 사용자 직무명 입력
   ↓
2. POST /api/positioning
   ↓
3. getPositioning(job) — gemini.ts
   ↓
4. Gemini API (gemini-3-flash-preview) 호출
   ↓
5. JSON 응답 파싱 (마크다운 제거, 정제)
   ↓
6. PositioningResult 반환
   ↓
7. React 상태 업데이트 → UI 렌더링
   ↓
8. Framer Motion 애니메이션
```

## 카테고리 재생성 흐름

```
1. 사용자 "새로고침" 버튼 클릭
   ↓
2. POST /api/positioning/refresh { job, category }
   ↓
3. getPartialPositioning(job, category) — gemini.ts
   ↓
4. 해당 카테고리만 JSON 배열로 반환
   ↓
5. 부분 상태 업데이트 (다른 카테고리 유지)
```

## 인증 흐름

```
1. Google OAuth 로그인 (signIn("google"))
   ↓
2. NextAuth 콜백: 이메일 @hanbit.co.kr 검증
   ↓ (통과) ↓ (실패)
3. 세션 생성    3. 접근 거부 (로그인 페이지로 리다이렉트)
   ↓
4. 보호된 UI 노출 (직무 입력 폼)
```

## 이중 언어 처리

모든 Gemini 응답 필드는 `{ ko: string; en: string }` 구조:
- 언어 토글 버튼으로 즉시 전환
- UI 레이블: `src/lib/translations.ts`
- 콘텐츠: Gemini가 두 언어 동시 생성

## 보안

- **API 키**: `NEXT_PUBLIC_GEMINI_API_KEY` 환경 변수
- **도메인 제한**: `@hanbit.co.kr` 이메일만 접근 가능
- **세션**: NextAuth JWT 기반
- **Rate Limiting**: 추후 구현 예정

## 성능 특성

- 초기 분석: ~10-15초 (Gemini API 응답 시간)
- 카테고리 재생성: ~5-8초
- 언어 토글: 즉시 (클라이언트 사이드)
- 5단계 로딩 메시지로 UX 개선 (2.5초 간격)
