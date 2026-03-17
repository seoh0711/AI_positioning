# ✨ AI Positioning

> **AI 시대, 내 직무의 탄력성과 전략적 위치를 분석하는 프리미엄 웹 플랫폼**

AI Positioning은 사용자가 입력한 직무를 분석하여 자동화 가능성, AI 활용 시너지, 그리고 인간 고유의 창의적 영역으로 정밀 분류합니다. 단순히 직무를 정의하는 것을 넘어, 변화하는 기술 환경 속에서 커리어를 방어하고 확장하기 위한 구체적인 액션 플랜과 AI 프롬프트를 제공합니다.

---

## 🎨 Premium Design Aesthetics

본 프로젝트는 단순한 분석 도구를 넘어 사용자에게 **몰입감 있는 시각적 경험**을 제공합니다.

- **Glassmorphism UI**: 반투명한 레이어와 블러 효과를 활용한 고급스러운 디자인
- **Dynamic Animations**: `Framer Motion`을 이용한 부드러운 상태 전환 및 인터랙티브 요소
- **Sleek Dark Mode**: 가독성과 전문성을 동시에 잡은 다크 테마 기반의 컬러 팔레트
- **Real-time Feedback**: 분석 결과가 생성되는 동안의 세련된 로딩 상태와 마이크로 애니메이션

---

## 🚀 Key Features

- **심층 직무 분석** — 입력된 직무의 핵심 정의와 AI 시대의 전략적 포지셔닝 요약
- **3-Layer Positioning System**
  - 🤖 **Automation**: AI가 효율적으로 대체하거나 자동화할 수 있는 반복적·규칙적 작업
  - ⚡ **AI Enhanced**: AI 도구와 협업하여 업무 성과를 획기적으로 높일 수 있는 시너지 영역
  - 🎨 **Creative / Human Value**: 인간의 복합적 판단, 공감, 창의성이 필수적인 대체 불가능한 영역
- **커리어 액션 플랜** — 경쟁력 유지를 위한 3가지 구체적인 학습 방향 및 전략 제안
- **One-Click AI Prompts** — 분석된 작업을 즉시 실행할 수 있도록 ChatGPT / Claude / Gemini용 최적화 프롬프트 제공
- **Bilingual Interface** — 한국어와 영어를 실시간으로 전환하며 분석 결과 확인 (i18n 완벽 대응)
- **Enterprise Security** — `@hanbit.co.kr` 도메인 소유자만 접근 가능한 구글 OAuth 기반 보안 적용

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18 |
| **Logic** | TypeScript (Strict Mode) |
| **Styling** | Vanilla CSS, Tailwind CSS |
| **Motion** | Framer Motion |
| **Icons** | Lucide React |
| **AI Engine** | Google Gemini 3 Flash Preview (`@google/genai`) |
| **Auth** | NextAuth.js (Google Provider) |
| **Deployment** | Vercel |

---

## 📦 Project Structure

```bash
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth OAuth 핸들러
│   │   └── positioning/
│   │       ├── route.ts                  # 전체 직무 분석 API
│   │       └── refresh/route.ts          # 특정 카테고리 개별 재생성 API
│   ├── globals.css                       # 디자인 시스템 및 커스텀 스타일
│   ├── layout.tsx                        # 폰트 및 공통 레이아웃
│   ├── page.tsx                          # 메인 분석 대시보드 (Client-side logic 포함)
│   └── providers.tsx                     # NextAuth & Theme 컨텍스트
└── lib/
    ├── gemini.ts                         # 프롬프트 엔지니어링 및 AI 통신 로직
    ├── auth.ts                           # 도메인 제한 및 보안 설정
    └── translations.ts                   # 다국어 데이터 모델 및 사전
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js**: v18.17.0 이상
- **API Keys**: 
  - [Google Gemini API Key](https://aistudio.google.com/)
  - [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 Client credentials

### Installation

```bash
git clone https://github.com/your-repo/ai-positioning.git
cd ai-positioning
npm install
```

### Environment Setup

`.env.local` 파일을 루트에 생성하고 아래 형식을 따르세요:

```env
# AI API
NEXT_PUBLIC_GEMINI_API_KEY=your_key

# Authentication
GOOGLE_CLIENT_ID=your_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

### Development

```bash
npm run dev    # http://localhost:3000 에서 실행
```

---

## 📖 Developer Workflows (CLAUDE.md)

- **커스텀 분석**: `lib/gemini.ts`에서 시스템 프롬프트를 수정하여 분석 페르소나 변경 가능
- **언어 추가**: `lib/translations.ts`에 새로운 언어 객체를 추가하여 확장 가능
- **도메인 정책**: `lib/auth.ts`의 `callbacks` 섹션에서 허용 도메인 수정 가능

---

## 🚢 Deployment

이 프로젝트는 **Vercel** 환경에 최적화되어 있습니다.
1. 환경 변수를 Vercel 대시보드에 등록합니다.
2. `NEXTAUTH_URL`을 배포된 도메인 주소로 업데이트합니다.
3. Github 레포지토리를 연결하여 자동 배포를 활성화합니다.
