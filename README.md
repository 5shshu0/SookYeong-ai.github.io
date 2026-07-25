# aliexpress_sookyeong - 알리익스프레스 한국 셀러 관리 포털

알리익스프레스 한국 셀러가 자주 확인해야 하는 **행사 일정, 월간 캘린더, 운영 공지, 프로모션 가이드, 주요 링크, FAQ**를 한곳에서 쉽고 빠르게 확인할 수 있도록 구축한 정적 웹 포털입니다.

---

## 📌 주요 특징 및 신규 기능 (Google Sheets Brief 반영)

- **프레임워크 프리**: 순수 HTML5, CSS3, Vanilla JavaScript로 개발되어 매우 가볍고 빠릅니다.
- **월간 행사 캘린더 (목록 보기 / 달력 보기)**:
  - 행사 메뉴에서 버튼 하나로 목록 보기와 **인터랙티브 캘린더**를 전환할 수 있습니다.
  - 행사 유형별 색상 구분(천억페스타 Red, 얼리버드 Green, 초이스데이 Blue, 페이데이 Purple 등) 및 **신청 기간(점선)**과 **행사 기간(실선)**이 visual pill 형태로 안내됩니다.
  - 날짜/행사 클릭 시 상세 모달 팝업이 제공됩니다.
- **프로모션 가이드 & 비교 매트릭스**:
  - 천억페스타 vs 얼리버드 간 추천 상품, 보조금 지원 여부, 등록 조건, 판매량 기준, 가격 조건 비교표 제공.
- **행사 철회 및 패널티 정리 표**:
  - 신청 기간 중, 승인 전/후, 행사 진행 중 등 시점별 패널티 규정을 표로 제공하여 셀러 귀책 철회를 방지합니다.
- **Google Sheets Apps Script JSON API 확장 대비 구조**:
  - 데이터 로딩 로직(`getCampaignsData()`, `getNoticesData()`, `getFaqData()` 등)이 모듈화되어 있어 추후 Google Apps Script JSON API 엔드포인트 연결이 매우 쉽습니다.

---

## 📁 폴더 및 파일 구조

```text
Sunwook-ai.github.io/
├── index.html          # 메인 레이아웃 및 7대 메뉴 (홈, 행사, 가이드, 시작하기, 공지, 링크, FAQ)
├── css/
│   └── style.css       # 반응형 대시보드 및 월간 캘린더, 비교표 스타일시트
├── js/
│   ├── data.js         # 행사 마감, 프로모션 정책, 공지, FAQ 등 종합 데이터 관리 파일
│   └── app.js          # 캘린더 엔진, SPA 페이지 전환, 자동 상태 계산, 카운트다운, 검색 로직
└── README.md           # 프로젝트 안내 문서
```

---

## 🚀 배포 및 업데이트 방법

1. `js/data.js` 파일에서 신규 행사 및 공지사항 데이터 수정
2. `git add .` -> `git commit -m "Update portal data"` -> `git push origin main`
3. `https://sunwook-ai.github.io` 주소로 자동 배포 완료!
