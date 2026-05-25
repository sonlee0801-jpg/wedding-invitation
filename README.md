# 청첩장 — GitHub Pages 배포 가이드

## 로컬 개발

```bash
# .env 파일 생성
cp .env.example .env
# VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY 값 입력 후

bun install
bun dev
```

## GitHub Pages 배포

### 1. GitHub Secrets 등록

레포지토리 → Settings → Secrets and variables → Actions → New repository secret

| 이름 | 값 |
|------|-----|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |

### 2. GitHub Pages 설정

레포지토리 → Settings → Pages → Source: **GitHub Actions** 선택

### 3. 배포

`main` 브랜치에 push하면 자동 배포됩니다.
