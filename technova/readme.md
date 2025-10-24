# Technova Place - IT 기술 블로그

DESIGN. BUILD. DEPLOY. Blog Frontend

## 🚀 이메일 구독 기능

이 프로젝트는 Node.js + Express + Nodemailer를 사용하여 실제 이메일 구독 기능을 제공합니다.

### 📧 이메일 구독 기능 설정

1. **환경 변수 설정**
   ```bash
   # .env 파일 생성 (env.example 참고)
   cp env.example .env
   ```

2. **Gmail 앱 비밀번호 설정**
   - Gmail 계정에서 2단계 인증 활성화
   - 앱 비밀번호 생성: https://myaccount.google.com/apppasswords
   - `.env` 파일에 이메일 정보 입력:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@technova.com
   PORT=3001
   ```

3. **서버 실행**
   ```bash
   # 개발 모드 (자동 재시작)
   npm run dev:server
   
   # 프로덕션 모드
   npm run server
   ```

4. **프론트엔드 실행**
   ```bash
   # 정적 파일 서버
   npm run dev
   ```

### 🔧 API 엔드포인트

- `POST /api/subscribe` - 구독 등록
- `GET /api/subscribers` - 구독자 목록 조회
- `POST /api/unsubscribe` - 구독 해지
- `GET /api/health` - 서버 상태 확인

### 📝 사용법

1. **구독 팝업**: 헤더의 "Subscribe" 버튼 클릭
2. **페이지 내 구독**: 각 페이지 하단의 구독 섹션
3. **이메일 확인**: 구독 완료 후 환영 이메일 발송
4. **관리자 알림**: 새로운 구독자 등록 시 관리자에게 알림

### 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer, Gmail SMTP
- **Styling**: Custom CSS, Responsive Design
- **Fonts**: Hubot Sans, Inter, Pretendard

### 📁 프로젝트 구조

```
├── server.js              # 이메일 서버
├── env.example            # 환경 변수 예시
├── package.json           # 프로젝트 설정
├── index.html             # 메인 페이지
├── styles.css             # 메인 스타일
├── script.js              # 메인 스크립트
├── js/                    # JavaScript 모듈
├── css/                   # CSS 파일들
├── components/            # 컴포넌트 스타일
└── asset/                 # 이미지 및 아이콘
```

### 🔒 보안 고려사항

- 이메일 유효성 검사
- 중복 구독 방지
- CORS 설정
- 환경 변수 사용
- 에러 처리

### 📧 이메일 템플릿

구독자에게 발송되는 환영 이메일은 다음과 같은 내용을 포함합니다:
- 브랜드 로고
- 구독 완료 메시지
- 앞으로 받을 콘텐츠 소개
- 구독 해지 안내

### 🚀 배포

1. **로컬 테스트**
   ```bash
   npm run server
   npm run dev
   ```

2. **프로덕션 배포**
   - 서버: Heroku, Vercel, AWS 등
   - 정적 파일: Netlify, Vercel 등

### 📞 지원

문의사항이 있으시면 언제든 연락주세요.
- 이메일: admin@technova.com
- 전화: +82-2-546-1520

---

© 2025 Technova Inc. All Rights Reserved. Made by The Grap
