/**
 * 알리익스프레스 셀러 관리 포털 (aliexpress_sookyeong) 데이터 마스터 파일
 * Google Sheets 연동 및 콘텐츠 구조 개선 명세에 따라 정의된 스키마입니다.
 * 추후 Google Apps Script JSON API로 손쉽게 교체할 수 있도록 데이터 구조가 표준화되어 있습니다.
 */

// 1. 행사 마스터 데이터 (campaigns)
const campaigns = [
  {
    id: "2026-07-earlybird",
    title: "7월 얼리버드 전체",
    type: "얼리버드",
    round: "전체",
    applicationStart: "2026-06-20T08:00:00+09:00",
    applicationEnd: "2026-07-30T15:00:00+09:00",
    eventStart: "2026-06-30T16:00:00+09:00",
    eventEnd: "2026-08-01T15:59:00+09:00",
    applicationUrl: "https://gsp.aliexpress.com/apps/campaign/activity/agreement?activityId=30000213774",
    subsidy: true,
    targetProduct: "상품 등록 30일 이내, 판매량 0인 신규 상품",
    notice: "셀러 부담 할인율 30% 이상 필수 설정",
    priority: "important",
    visible: true,
    updatedAt: "2026-07-25"
  },
  {
    id: "2026-08-choice-day",
    title: "8월 초이스데이",
    type: "초이스데이",
    round: "전체",
    applicationStart: "2026-07-10T19:00:00+09:00",
    applicationEnd: "2026-07-27T22:59:00+09:00",
    eventStart: "2026-07-30T00:00:00+09:00",
    eventEnd: "2026-08-01T00:00:00+09:00",
    applicationUrl: "https://gsp.aliexpress.com/apps/campaign/activity/agreement?activityId=30000217192",
    subsidy: false,
    targetProduct: "전체 스토어 대표 경쟁력 상품",
    notice: "행사 시작 3일 전 직접 철회 시 30일간 행사진입 제한 패널티 발생",
    priority: "urgent",
    visible: true,
    updatedAt: "2026-07-25"
  },
  {
    id: "2026-08-100b-festa-828",
    title: "8월 천억페스타 828 프로모션",
    type: "천억페스타",
    round: "1차",
    applicationStart: "2026-07-16T00:00:00+09:00",
    applicationEnd: "2026-07-28T19:00:00+09:00",
    eventStart: "2026-08-17T00:00:00+09:00",
    eventEnd: "2026-08-31T23:59:00+09:00",
    applicationUrl: "https://gsp.aliexpress.com/apps/campaign/activity/agreement?activityId=30000217518",
    subsidy: true,
    targetProduct: "최근 판매량 및 배송률 조건 충족 상품",
    notice: "플랫폼 보조금 지원 예정 (사전 재고 확보 권장)",
    priority: "important",
    visible: true,
    updatedAt: "2026-07-25"
  },
  {
    id: "2026-08-100b-festa-all",
    title: "8월 천억페스타 전체",
    type: "천억페스타",
    round: "전체",
    applicationStart: "2026-07-10T16:00:00+09:00",
    applicationEnd: "2026-08-24T19:00:00+09:00",
    eventStart: "2026-08-01T00:00:00+09:00",
    eventEnd: "2026-08-31T23:59:00+09:00",
    applicationUrl: "https://gsp.aliexpress.com/apps/campaign/activity/agreement?activityId=30000217182",
    subsidy: true,
    targetProduct: "스토어 대표 메인 상품",
    notice: "8월 한 달간 진행되는 대형 대표 프로모션",
    priority: "normal",
    visible: true,
    updatedAt: "2026-07-25"
  }
];

// 2. 프로모션 가이드 및 정책 비교 데이터 (promotionPolicies)
const promotionPolicies = [
  {
    category: "천억페스타",
    recommendedTarget: "최근 판매량이 있고 가격 경쟁력이 높은 메인 상품",
    subsidy: "플랫폼 보조금 지원 가능",
    registrationCondition: "상품 등록 후 48시간 이상 경과",
    salesRequirement: "최근 30일 내 일정 판매량 기준 충족",
    priceCondition: "내부 가격 경쟁력 검수 통과 (경쟁력 있는 가격)",
    mainPurpose: "메인 프로모션 노출 및 대량 매출 확대",
    qualifications: [
      "최근 90일 스토어 평점 92% 이상",
      "최근 30일 SNAD 분쟁 발생률 8% 이하",
      "72시간 내 배송률 기준 충족",
      "무료배송 필수"
    ],
    warnings: [
      "가격 경쟁력이 부족하면 검수 과정에서 반려될 수 있음",
      "자유 노미네이션 방식은 공문이나 사은품 증정 소명이 불가능함",
      "무자격 상태 시 가격 수정이 아닌 재신청 필요"
    ]
  },
  {
    category: "얼리버드",
    recommendedTarget: "상품 등록 후 30일 이내의 판매량이 없는 신규 상품",
    subsidy: "플랫폼 보조금 일부 지원 가능",
    registrationCondition: "상품 등록 후 48시간 경과 및 30일 이내",
    salesRequirement: "판매량 0 (신규 상품 전용)",
    priceCondition: "셀러 부담 할인율 30% 이상 설정",
    mainPurpose: "신규 등록 상품의 초기 부스팅 및 첫 노출 확보",
    qualifications: [
      "최근 90일 스토어 평점 90% 이상",
      "최근 30일 SNAD 분쟁 발생률 8% 이하",
      "무료배송 필수"
    ],
    warnings: [
      "등록 후 30일이 지난 상품은 신청 불가",
      "판매량이 발생한 상품은 신청 불가 (천억페스타나 타 프로모션 이용)"
    ]
  }
];

// 3. 프로모션 철회 및 패널티 정책 데이터 (penaltyPolicies)
const penaltyPolicies = [
  {
    stage: "신청 기간 중",
    penalty: "없음 (자유롭게 철회 가능)",
    detail: "신청 마감 전 셀러 어드민에서 철회 시 별도 패널티가 부과되지 않습니다."
  },
  {
    stage: "신청 마감 후 ~ 승인 전",
    penalty: "행사별 상이 (월 5회까지 면책)",
    detail: "프로모션 단위 월 5회까지는 패널티가 없으나, 6회부터 30일간 패널티가 발생할 수 있습니다."
  },
  {
    stage: "승인 완료 후",
    penalty: "30일 ~ 최대 60일 참여 제한",
    detail: "S급/A+급 프로모션은 승인 후 철회 시 최대 60일, 일반 프로모션은 30일간 스토어 전체 행사 참여가 제한됩니다."
  },
  {
    stage: "행사 진행 중",
    penalty: "즉시 패널티 및 30일 제한",
    detail: "행사 진행 중 직접 철회는 절대 금지입니다. 부득이한 경우 셀러 어드민 직접 철회 대신 반드시 담당 CM에게 먼저 문의해야 합니다."
  }
];

// 4. 셀러 가이드북 및 온보딩 데이터 (sellerGuideSteps)
const sellerGuideBook = {
  version: "250728",
  downloadUrl: "https://naver.me/FxC92y0H",
  driveFolderUrl: "https://drive.google.com/drive/folders/1speHN9x9JZ3-J1uBHTKK_rs4dB6UPNQs?usp=drive_link"
};

const sellerGuideSteps = [
  {
    id: "step-1",
    stepNum: "1단계",
    title: "카카오톡 공지방 프로필명 설정",
    description: "공지방 프로필명을 반드시 kr로 시작하는 셀러 ID로 변경해 주세요.\n(확인 경로: 셀러시스템 → 오른쪽 상단 프로필 → 계정 → 계정 정보 → 기본 계정)",
    copyText: "셀러시스템 → 오른쪽 상단 프로필 → 계정 → 계정 정보 → 기본 계정",
    isMandatory: true
  },
  {
    id: "step-2",
    stepNum: "2단계",
    title: "공지방 필수 규칙 숙지",
    description: "· 공지방 링크 및 QR코드 외부 공유 절대 금지 (키셀러 대상 단체방)\n· 공지방 내 개별 질문 금지 (개별 문의는 담당 CM에게 진행)",
    isMandatory: true
  },
  {
    id: "step-3",
    stepNum: "3단계",
    title: "셀러 가이드북 다운로드 및 스토어 기본 세팅",
    description: "셀러 가이드북(ver. 250728)을 다운로드받아 기본 계정 및 관리자 권한을 세팅합니다.",
    guideUrl: "https://naver.me/FxC92y0H",
    isMandatory: true
  },
  {
    id: "step-4",
    stepNum: "4단계",
    title: "물류 설정 및 배송지 등록",
    description: "출고지 및 반품지 주소를 정확히 등록하고, 무료배송 옵션을 설정합니다.\n※ 행사 참여 상품은 무료배송이 필수입니다.",
    guideUrl: "https://drive.google.com/drive/folders/1speHN9x9JZ3-J1uBHTKK_rs4dB6UPNQs?usp=drive_link",
    isMandatory: true
  },
  {
    id: "step-5",
    stepNum: "5단계",
    title: "정산 계좌 등록 및 서류 제출",
    description: "원화 정산을 위한 사업자 통장 사본 및 사업자등록증 서류를 제출합니다.",
    guideUrl: "https://survey.alibaba.com/apps/zhiliao/wOnK1GfhR",
    isMandatory: true
  },
  {
    id: "step-6",
    stepNum: "6단계",
    title: "첫 프로모션 신청 및 가격/재고 점검",
    description: "진행 중인 행사 메뉴에서 신청 가능한 행사를 확인하고 가격 및 재고를 보수적으로 점검 후 신청합니다.",
    isMandatory: true
  }
];

// 5. 공지사항 데이터 (notices)
const notices = [
  {
    id: "notice-penalty-warning",
    level: "긴급",
    badgeClass: "badge-urgent",
    pinned: true,
    title: "[긴급/필독] 프로모션 철회 전 반드시 패널티를 확인하세요 (직접 철회 금지)",
    category: "규정",
    date: "2026-07-25",
    summary: "승인 완료 후 또는 행사 기간 중 철회하면 최대 60일 동안 스토어 전체 행사 참여가 제한됩니다.",
    content: `
1. 프로모션 참여 시 재고와 할인율을 보수적으로 설정해 주세요.
2. 재고 문제로 인한 행사 철회가 발생하지 않도록 사전 관리가 필수적입니다.
3. 셀러 어드민에서 직접 철회 버튼을 누르시면 시스템 자동 패널티(30일~60일 참여 제한)가 부과되며 면책이 불가능합니다.
4. 부득이하게 행사 철회가 필요한 경우 어드민에서 직접 철회하지 마시고, 즉시 담당 CM에게 문의하시기 바랍니다.

※ 핵심 경고: 셀러 어드민에서 직접 철회하지 마세요!
    `
  },
  {
    id: "notice-100b-rules-change",
    level: "중요",
    badgeClass: "badge-important",
    pinned: true,
    title: "[중요] 천억페스타 참여 규정 및 가이드 변경 안내",
    category: "규정",
    date: "2026-07-24",
    summary: "72시간 내 배송률, 최근 판매량 기준, 자유 노미네이션 운영 방식이 변경되었습니다.",
    content: `
주요 변경 사항:
· 72시간 내 배송률 기준 및 최근 30일 판매량 기준이 강화되었습니다.
· 자유 노미네이션 행사 참여 상품은 별도 가격 조정 기한이 주어지지 않습니다.
· 사은품 증정 및 공문 소명이 불가능하므로 신청 전 조건을 반드시 재확인해 주세요.
· 자격 미달 시 수정이 아닌 재신청을 진행해야 합니다.
    `
  },
  {
    id: "notice-profile-name",
    level: "중요",
    badgeClass: "badge-important",
    pinned: false,
    title: "[안내] 카카오톡 공지방 프로필명 설정 규칙",
    category: "기타",
    date: "2026-07-22",
    summary: "공지방 프로필명은 반드시 kr로 시작하는 셀러 ID로 변경해야 합니다.",
    content: "셀러 ID 확인 경로: 셀러시스템 → 오른쪽 상단 프로필 → 계정 → 계정 정보 → 기본 계정"
  }
];

// 6. 주요 링크 데이터 (usefulLinks)
const usefulLinks = [
  {
    id: "link-seller-cs",
    category: "고객지원",
    title: "판매자 고객센터",
    description: "FAQ, CS, 시스템 이슈 1:1 문의 포털",
    url: "https://so.aliexpress.com/s/HCportal?terminal=pc&language=ko_KR&_referer_path=%2Fm_apps%2Flocal-home%2Findex",
    checkedAt: "2026-07-25"
  },
  {
    id: "link-seller-guide-book",
    category: "셀러 가이드",
    title: "셀러 가이드북 (ver. 250728)",
    description: "신규 입점 및 스토어 운영 종합 가이드북 다운로드",
    url: "https://naver.me/FxC92y0H",
    checkedAt: "2026-07-25"
  },
  {
    id: "link-operating-rules",
    category: "운영 정책",
    title: "알리익스프레스 운영규칙",
    description: "플랫폼 운영 규정 및 셀러 준수사항 종합 안내",
    url: "https://rule.aliexpress.com/rule-channels/44048015/?tocUuid=AVy9uCyDJ2xD9cl-",
    checkedAt: "2026-07-25"
  },
  {
    id: "link-category-docs",
    category: "운영 정책",
    title: "카테고리별 인증서류 제출 안내",
    description: "카테고리별 필수 카테고리 영업/인증 서류 목록",
    url: "https://rule.aliexpress.com/rule-channels/44048015/?tocUuid=3owNAlVdTYuOAneR",
    checkedAt: "2026-07-25"
  },
  {
    id: "link-return-policy",
    category: "운영 정책",
    title: "반품 및 환불 정책",
    description: "Free Return 및 고객 변심/하자 반품 세부 지침",
    url: "https://rule.aliexpress.com/rule-channels/44048015/164300340",
    checkedAt: "2026-07-25"
  },
  {
    id: "link-business-doc-submit",
    category: "서류 및 신청",
    title: "사업자등록증 및 통장사본 제출",
    description: "입점 서류 및 정산 계좌 변경 서류 제출 서베이",
    url: "https://survey.alibaba.com/apps/zhiliao/wOnK1GfhR",
    checkedAt: "2026-07-25"
  },
  {
    id: "link-promo-sheet",
    category: "행사",
    title: "프로모션 안내 시트",
    description: "최신 프로모션 종합 정보 및 타겟 상품 안내 구글 시트",
    url: "https://docs.google.com/spreadsheets/d/1KVCO1Yu_tC9iXAhaoPz1OcyU584zvqK2q18KgkjV0FE/edit?gid=748161807#gid=748161807",
    checkedAt: "2026-07-25"
  },
  {
    id: "link-4pl-return",
    category: "물류",
    title: "4PL 반품 서비스 소개서",
    description: "알리익스프레스 전용 4PL 반품 물류 솔루션 가이드 PDF",
    url: "https://drive.google.com/file/d/1vcaLp2dmFj3ArC2u_n4HIVVICdyHjmyq/view?usp=drive_link",
    checkedAt: "2026-07-25"
  }
];

// 7. 통합 FAQ 마스터 데이터 (faqItems)
const faqItems = [
  // --- 행사 선택 & 신청 ---
  {
    id: "faq-event-select-1",
    category: "행사 선택",
    question: "천억페스타와 S급/A+ 프로모션 중 무엇을 우선 신청해야 하나요?",
    shortAnswer: "천억페스타를 우선 신청하는 것이 유리합니다.",
    answer: "천억페스타를 우선 신청하시는 것을 권장합니다.\n\n이유:\n1. 플랫폼 보조금 지원 가능성이 큽니다.\n2. 타 프로모션 참여의 선행 조건으로 활용되는 경우가 많습니다.\n3. 메인 프로모션으로 셀러 스토어 노출 기회가 가장 큽니다.",
    keywords: ["천억페스타", "S급", "우선순위", "보조금"],
    relatedCampaignType: "천억페스타"
  },
  {
    id: "faq-event-apply-1",
    category: "행사 신청",
    question: "신청 링크에 들어갔는데 신청 가능한 상품이 없습니다.",
    shortAnswer: "참여 조건을 만족하는 상품이 없거나 자격 검수 미달일 수 있습니다.",
    answer: "가능한 원인:\n· 행사 참여 조건(스토어 평점, 최근 판매량, 배송률) 미달\n· 무료배송 미설정\n· 상품 등록 후 48시간 미경과\n· 상품 가격 경쟁력 부족\n\n확인 경로:\n셀러 어드민 → 마케팅 프로모션 → 플랫폼 프로모션 → 자격 전체 → 상품 자격 요건 보기",
    keywords: ["신청 불가", "상품 없음", "자격 미달", "48시간"],
    relatedLink: "https://gsp.aliexpress.com/"
  },
  {
    id: "faq-event-withdraw-1",
    category: "철회·패널티",
    question: "행사 신청을 직접 취소(철회)하면 패널티가 있나요?",
    shortAnswer: "신청 상태, 승인 여부, 행사 시작 여부에 따라 달라지나 승인 후 철회 시 최대 60일 참여 제한 패널티가 부과됩니다.",
    answer: "· 신청 기간 중: 패널티 없음\n· 신청 마감 후 승인 전: 월 5회까지 패널티 없음 (6회부터 패널티 가능)\n· 승인 완료 후 / 행사 진행 중: S급/A+급 최대 60일, 일반 30일간 스토어 전체 행사 참여가 제한됩니다.\n\n※ 부득이한 경우 셀러 어드민에서 직접 철회하지 마시고 담당 CM에게 먼저 문의해 주세요.",
    keywords: ["행사 철회", "패널티", "30일", "60일", "CM문의"],
    relatedCampaignType: "천억페스타"
  },

  // --- 상품·스토어 ---
  {
    id: "faq-product-1",
    category: "상품·스토어",
    question: "검색해도 제 상품이 나오지 않습니다.",
    shortAnswer: "영문 상품명 번역 및 검색 알고리즘 노출 여부를 확인해 주세요.",
    answer: "현재 검색 알고리즘에서 해외직구 상품이 함께 검색될 수 있습니다. 셀러 어드민의 상품 편집 메뉴에서 영문 상품명이 정확하게 번역되어 있는지 확인해 주세요.",
    keywords: ["검색", "상품 노출", "영문 상품명"]
  },
  {
    id: "faq-product-2",
    category: "상품·스토어",
    question: "스토어당 최대 상품 등록 개수는 몇 개인가요?",
    shortAnswer: "스토어당 최대 3,000개까지 등록 가능합니다.",
    answer: "스토어당 최대 3,000개 상품을 등록할 수 있습니다.",
    keywords: ["상품 등록", "등록 제한", "3000개"]
  },
  {
    id: "faq-product-3",
    category: "상품·스토어",
    question: "스토어 평점은 어떻게 계산되나요?",
    shortAnswer: "4점 및 5점 리뷰 수 ÷ 전체 리뷰 수 (약 2일 소요).",
    answer: "스토어 평점 계산식:\n(4점 및 5점 리뷰 수) ÷ (전체 리뷰 수)\n※ 평점 반영에는 약 2일이 소요됩니다.",
    keywords: ["평점", "리뷰", "스토어 평점"]
  },

  // --- 물류·배송 ---
  {
    id: "faq-logistics-1",
    category: "물류·배송",
    question: "행사 참여 상품은 반드시 무료배송이어야 하나요?",
    shortAnswer: "네, 행사 참여 상품은 무료배송 설정이 필수입니다.",
    answer: "현재 운영 규정상 무료배송 상품만 행사 참여가 가능합니다. 행사 신청 전 배송 템플릿의 무료배송 설정을 반드시 확인해 주세요.",
    keywords: ["무료배송", "물류 설정", "배송비"]
  },
  {
    id: "faq-logistics-2",
    category: "물류·배송",
    question: "배송 지연 시 어떤 패널티가 있나요?",
    answer: "주문이 자동 취소될 수 있으며 스토어 배송률에 영향을 주어 향후 3개월 동안 행사 참여가 제한될 수 있습니다.",
    keywords: ["배송 지연", "자동 취소", "패널티", "3개월"]
  },

  // --- 가격·재고 ---
  {
    id: "faq-price-1",
    category: "가격·재고",
    question: "정산 일정 및 기준은 어떻게 되나요?",
    shortAnswer: "매월 1일과 15일 원화 정산 (고객 구매확정 후 7영업일).",
    answer: "정산은 매월 1일과 15일에 원화로 진행됩니다.\n정산 기준: 고객 구매확정 후 7영업일 기준입니다.",
    keywords: ["정산", "원화", "구매확정"]
  },
  {
    id: "faq-price-2",
    category: "가격·재고",
    question: "행사 신청 후 가격이나 재고를 수정할 수 있나요?",
    shortAnswer: "행사별로 상이하나 할인율 및 재고 상향만 가능한 경우가 많습니다.",
    answer: "프로모션에 따라 승인 후 단가 수정이 제한될 수 있습니다. 특히 천억페스타 자유 노미네이션 등은 별도 가격 조정 기한이 주어지지 않으므로 사전 확인이 필요합니다.",
    keywords: ["가격 수정", "재고 수정", "할인율"]
  },

  // --- 반품·환불 ---
  {
    id: "faq-return-1",
    category: "철회·패널티",
    question: "Free Return 서비스 이용 시 반품 배송비 부담 기준은?",
    answer: "Free Return 태그 상품 기준:\n· 1개월 내 1~3회 반품: 주문당 최초 1회 플랫폼 부담\n· 동일 주문 추가 반품 및 4회차 이상 반품: 고객 부담",
    keywords: ["Free Return", "반품 배송비", "무료 반품"]
  },
  {
    id: "faq-return-2",
    category: "철회·패널티",
    question: "자동환불 이의제기는 어떻게 하나요?",
    answer: "1. 배송 완료 증빙과 함께 이의제기를 접수합니다.\n2. 기각 시 판매자 고객센터에 2차 문의합니다.\n3. 해결되지 않을 경우 문의 메일 내용을 캡처하여 담당 CM에게 전달합니다.",
    keywords: ["자동환불", "이의제기", "증빙", "CM"]
  }
];

// 8. 최근 사이트 업데이트 이력 (updateHistory)
const updateHistory = [
  { date: "2026.07.25", text: "월간 행사 캘린더 기능 및 프로모션 가이드 비교표 업데이트" },
  { date: "2026.07.25", text: "8월 초이스데이 및 천억페스타 일정 데이터 동기화" },
  { date: "2026.07.24", text: "Free Return 반품 정책 및 철회 시점별 패널티 정리 표 추가" },
  { date: "2026.07.22", text: "자동환불 이의제기 절차 및 셀러 가이드북(ver 250728) 반영" }
];
