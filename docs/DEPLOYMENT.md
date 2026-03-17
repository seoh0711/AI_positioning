# Deployment Guide

## Vercel 배포 (권장)

### 1. Vercel 프로젝트 연결
```bash
npm i -g vercel
vercel
```

### 2. 환경 변수 설정
Vercel 대시보드 → Settings → Environment Variables:

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google AI Studio에서 발급 |
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth 클라이언트 시크릿 |
| `NEXTAUTH_URL` | 배포된 도메인 (예: https://ai-positioning.vercel.app) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` 로 생성 |

### 3. Google OAuth 설정
Google Cloud Console → APIs & Services → Credentials:
- Authorized JavaScript origins: `https://your-domain.vercel.app`
- Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`

### 4. 배포
```bash
vercel --prod
```

---

## 로컬 개발

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 실제 값 입력

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000
```

Google OAuth 로컬 설정:
- Authorized JavaScript origins: `http://localhost:3000`
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

---

## 빌드 확인

```bash
npm run build
npm run start
```

## vercel.json 설정
현재 `vercel.json`에 커스텀 설정이 있는지 확인:
```bash
cat vercel.json
```
