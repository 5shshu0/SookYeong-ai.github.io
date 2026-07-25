/**
 * 알리익스프레스 셀러 관리 포털 (aliexpress_sookyeong) 메인 애플리케이션 JS
 * Google Sheets Integration Brief 스키마 및 월간 캘린더 엔진 포함
 */

// 글로벌 상태 (달력 현재 연/월)
let currentCalendarYear = 2026;
let currentCalendarMonth = 6; // 0-based (6 = 7월)

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHomeSection();
  initCampaignsSection();
  initPromotionGuideSection();
  initGettingStartedSection();
  initNoticesSection();
  initLinksSection();
  initFaqSection();
  initGlobalCopyHandler();
  initModalListeners();
  
  // 1초마다 마감 카운트다운 갱신
  setInterval(() => {
    updateCountdowns();
  }, 1000);
});

/* ==========================================================================
   1. 데이터 로더 추상화 계층 (추후 Google Apps Script JSON API 대체 가능)
   ========================================================================== */
function getCampaignsData() {
  return (typeof campaigns !== 'undefined') ? campaigns : [];
}

function getNoticesData() {
  return (typeof notices !== 'undefined') ? notices : [];
}

function getFaqData() {
  return (typeof faqItems !== 'undefined') ? faqItems : [];
}

function getPoliciesData() {
  return (typeof promotionPolicies !== 'undefined') ? promotionPolicies : [];
}

function getGuideStepsData() {
  return (typeof sellerGuideSteps !== 'undefined') ? sellerGuideSteps : [];
}

function getUsefulLinksData() {
  return (typeof usefulLinks !== 'undefined') ? usefulLinks : [];
}

function getRecentUpdatesData() {
  return (typeof updateHistory !== 'undefined') ? updateHistory : [];
}

/* ==========================================================================
   2. 네비게이션 및 페이지 전환 (SPA)
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSectionId = link.getAttribute('data-section');
      if (targetSectionId) {
        switchSection(targetSectionId);
      }
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  });

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }
}

function switchSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav-link');

  sections.forEach(section => {
    if (section.id === sectionId) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  navLinks.forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   3. 행사 상태 및 마감 카운트다운 계산
   ========================================================================== */
function calculateCampaignStatus(campaign) {
  const now = new Date();
  const appStart = new Date(campaign.applicationStart);
  const appEnd = new Date(campaign.applicationEnd);
  const eventStart = new Date(campaign.eventStart);
  const eventEnd = new Date(campaign.eventEnd);

  const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

  if (now < appStart) {
    return { code: 'upcoming', label: '신청 예정', badgeClass: 'badge-upcoming', isApplyable: false };
  } else if (now >= appStart && now <= appEnd) {
    if (appEnd - now <= threeDaysMs) {
      return { code: 'imminent', label: '마감 임박', badgeClass: 'badge-imminent', isApplyable: true };
    }
    return { code: 'open', label: '신청 가능', badgeClass: 'badge-open', isApplyable: true };
  } else if (now > appEnd && now < eventStart) {
    return { code: 'closed', label: '신청 마감', badgeClass: 'badge-closed', isApplyable: false };
  } else if (now >= eventStart && now <= eventEnd) {
    return { code: 'running', label: '행사 진행 중', badgeClass: 'badge-running', isApplyable: false };
  } else {
    return { code: 'ended', label: '행사 종료', badgeClass: 'badge-ended', isApplyable: false };
  }
}

function formatCountdown(endDateString) {
  const now = new Date();
  const endDate = new Date(endDateString);
  const diffMs = endDate - now;

  if (diffMs <= 0) return '신청 마감됨';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `신청 마감까지 ${days}일 ${hours}시간`;
  }
  return `신청 마감까지 ${hours}시간 ${mins}분`;
}

function updateCountdowns() {
  const countdownEls = document.querySelectorAll('[data-countdown-end]');
  countdownEls.forEach(el => {
    const endDate = el.getAttribute('data-countdown-end');
    if (endDate) {
      el.textContent = formatCountdown(endDate);
    }
  });
}

function formatDateDisplay(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${mins}`;
}

/* ==========================================================================
   4. 홈 화면 초기화
   ========================================================================== */
function initHomeSection() {
  const homeCampaignContainer = document.getElementById('home-campaign-grid');
  const data = getCampaignsData();

  if (homeCampaignContainer && data.length > 0) {
    const sorted = [...data].sort((a, b) => new Date(a.applicationEnd) - new Date(b.applicationEnd));
    const top3 = sorted.slice(0, 3);
    homeCampaignContainer.innerHTML = top3.map(c => createCampaignCardHtml(c)).join('');
  }

  const recentUpdatesContainer = document.getElementById('recent-updates-list');
  const updates = getRecentUpdatesData();
  if (recentUpdatesContainer && updates.length > 0) {
    recentUpdatesContainer.innerHTML = updates.map(up => `
      <li>
        <span class="date">${up.date}</span>
        <span class="text">${up.text}</span>
      </li>
    `).join('');
  }
}

/* ==========================================================================
   5. 진행 중인 행사 섹션 & 뷰 스위처 & 캘린더 엔진
   ========================================================================== */
function initCampaignsSection() {
  const campaignsGrid = document.getElementById('campaigns-grid');
  const filterBtns = document.querySelectorAll('#campaign-filter-tabs .filter-btn');
  const btnListView = document.getElementById('btn-view-list');
  const btnCalendarView = document.getElementById('btn-view-calendar');
  const listViewContainer = document.getElementById('campaign-list-view');
  const calendarViewContainer = document.getElementById('campaign-calendar-view');

  // 뷰 스위처 이벤트
  if (btnListView && btnCalendarView) {
    btnListView.addEventListener('click', () => {
      btnListView.classList.add('active');
      btnCalendarView.classList.remove('active');
      listViewContainer.style.display = 'block';
      calendarViewContainer.style.display = 'none';
    });

    btnCalendarView.addEventListener('click', () => {
      btnCalendarView.classList.add('active');
      btnListView.classList.remove('active');
      calendarViewContainer.style.display = 'block';
      listViewContainer.style.display = 'none';
      renderCalendar(currentCalendarYear, currentCalendarMonth);
    });
  }

  const renderList = (filter = 'all') => {
    let list = [...getCampaignsData()];
    list.sort((a, b) => new Date(a.applicationEnd) - new Date(b.applicationEnd));

    if (filter !== 'all') {
      list = list.filter(c => {
        const status = calculateCampaignStatus(c);
        return status.code === filter;
      });
    }

    if (list.length === 0) {
      campaignsGrid.innerHTML = `<div class="empty-results">해당 조건에 부합하는 행사가 없습니다.</div>`;
    } else {
      campaignsGrid.innerHTML = list.map(c => createCampaignCardHtml(c)).join('');
    }
  };

  renderList('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      renderList(filterValue);
    });
  });

  // 달력 이전달/다음달 이동 버튼 이벤트
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentCalendarMonth--;
      if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
      }
      renderCalendar(currentCalendarYear, currentCalendarMonth);
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentCalendarMonth++;
      if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
      }
      renderCalendar(currentCalendarYear, currentCalendarMonth);
    });
  }
}

function createCampaignCardHtml(campaign) {
  const status = calculateCampaignStatus(campaign);
  const isApplyable = status.isApplyable;
  const countdownText = isApplyable ? formatCountdown(campaign.applicationEnd) : '신청 대상 아님';

  return `
    <div class="card campaign-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <span class="badge ${status.badgeClass}">${status.label}</span>
        <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">${campaign.type}</span>
      </div>
      <h3 class="card-title">${campaign.title}</h3>
      ${isApplyable ? `<div class="countdown-box" data-countdown-end="${campaign.applicationEnd}">${countdownText}</div>` : ''}
      <ul class="campaign-info-list">
        <li>
          <span class="label">신청 기간</span>
          <span class="value">${formatDateDisplay(campaign.applicationStart)} ~ ${formatDateDisplay(campaign.applicationEnd)}</span>
        </li>
        <li>
          <span class="label">행사 기간</span>
          <span class="value">${formatDateDisplay(campaign.eventStart)} ~ ${formatDateDisplay(campaign.eventEnd)}</span>
        </li>
        ${campaign.targetProduct ? `<li><span class="label">대상 상품</span><span class="value">${campaign.targetProduct}</span></li>` : ''}
        ${campaign.notice ? `<li style="flex-direction: column; gap: 4px; margin-top: 8px;"><span class="label" style="color: #DC2626;">💡 유의사항</span><span class="value" style="font-weight: 500;">${campaign.notice}</span></li>` : ''}
      </ul>
      <a href="${campaign.applicationUrl}" target="_blank" rel="noopener noreferrer" class="btn-apply ${!isApplyable ? 'disabled' : ''}">
        ${isApplyable ? '행사 신청하기 ➔' : status.label}
      </a>
    </div>
  `;
}

/* ==========================================================================
   6. 월간 캘린더 드로잉 엔진
   ========================================================================== */
function renderCalendar(year, month) {
  const monthTitleEl = document.getElementById('calendar-month-title');
  const calendarGridEl = document.getElementById('calendar-grid-cells');

  if (!calendarGridEl) return;

  if (monthTitleEl) {
    monthTitleEl.textContent = `${year}년 ${month + 1}월`;
  }

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (일) ~ 6 (토)
  const totalDays = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonthToday = (today.getFullYear() === year && today.getMonth() === month);

  const campaignsList = getCampaignsData();

  let html = '';

  // 1. 이전 달 채우기 셀
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    html += `<div class="calendar-day-cell other-month"><div class="day-number">${dayNum}</div></div>`;
  }

  // 2. 현재 달 셀 Drawing
  for (let day = 1; day <= totalDays; day++) {
    const cellDate = new Date(year, month, day);
    const isToday = isCurrentMonthToday && (today.getDate() === day);

    // 날짜별 매칭되는 행사 찾기
    const matchingEvents = [];

    campaignsList.forEach(c => {
      const appStart = new Date(c.applicationStart);
      const appEnd = new Date(c.applicationEnd);
      const eventStart = new Date(c.eventStart);
      const eventEnd = new Date(c.eventEnd);

      // 날짜 범위 비교 (시작일 00:00부터 종료일 23:59까지)
      const cellStart = new Date(year, month, day, 0, 0, 0);
      const cellEnd = new Date(year, month, day, 23, 59, 59);

      const inAppPeriod = (cellStart <= appEnd && cellEnd >= appStart);
      const inEventPeriod = (cellStart <= eventEnd && cellEnd >= eventStart);

      if (inAppPeriod) {
        matchingEvents.push({ campaign: c, periodType: 'app' });
      }
      if (inEventPeriod) {
        matchingEvents.push({ campaign: c, periodType: 'event' });
      }
    });

    let eventPillsHtml = '';
    matchingEvents.forEach(item => {
      const c = item.campaign;
      let colorClass = 'event-type-etc';
      if (c.type === '천억페스타') colorClass = 'event-type-100b';
      else if (c.type === '얼리버드') colorClass = 'event-type-early';
      else if (c.type === '초이스데이') colorClass = 'event-type-choice';
      else if (c.type === '페이데이') colorClass = 'event-type-payday';

      const periodClass = (item.periodType === 'app') ? 'pill-app-period' : 'pill-event-period';
      const labelPrefix = (item.periodType === 'app') ? '[신청]' : '[행사]';

      eventPillsHtml += `
        <div class="calendar-event-pill ${colorClass} ${periodClass}" data-id="${c.id}" title="${labelPrefix} ${c.title}">
          ${labelPrefix} ${c.title}
        </div>
      `;
    });

    html += `
      <div class="calendar-day-cell ${isToday ? 'today' : ''}">
        <div class="day-number">${day}</div>
        ${eventPillsHtml}
      </div>
    `;
  }

  // 3. 다음 달 채우기 셀
  const totalRenderedCells = startDayOfWeek + totalDays;
  const nextMonthCells = (42 - totalRenderedCells) % 7; // 6주 그리드 유지
  for (let day = 1; day <= nextMonthCells; day++) {
    html += `<div class="calendar-day-cell other-month"><div class="day-number">${day}</div></div>`;
  }

  calendarGridEl.innerHTML = html;

  // 이벤트 릴 알림 팝업 바인딩
  const pills = calendarGridEl.querySelectorAll('.calendar-event-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.getAttribute('data-id');
      openEventModal(id);
    });
  });
}

/* ==========================================================================
   7. 행사 상세 모달 팝업
   ========================================================================== */
function initModalListeners() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('open');
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  }
}

function openEventModal(campaignId) {
  const backdrop = document.getElementById('modal-backdrop');
  const modalContent = document.getElementById('modal-content');
  const campaign = getCampaignsData().find(c => c.id === campaignId);

  if (!campaign || !modalContent || !backdrop) return;

  const status = calculateCampaignStatus(campaign);

  modalContent.innerHTML = `
    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px;">
      <span class="badge ${status.badgeClass}">${status.label}</span>
      <span style="font-weight: 700; color: var(--text-muted);">${campaign.type} (${campaign.round})</span>
    </div>
    <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 16px;">${campaign.title}</h2>
    <ul class="campaign-info-list" style="margin-bottom: 24px;">
      <li><span class="label">신청 기간</span><span class="value">${formatDateDisplay(campaign.applicationStart)} ~ ${formatDateDisplay(campaign.applicationEnd)}</span></li>
      <li><span class="label">행사 기간</span><span class="value">${formatDateDisplay(campaign.eventStart)} ~ ${formatDateDisplay(campaign.eventEnd)}</span></li>
      <li><span class="label">플랫폼 보조금</span><span class="value">${campaign.subsidy ? '지원 가능 (Y)' : '해당 없음 (N)'}</span></li>
      <li><span class="label">참여 대상</span><span class="value">${campaign.targetProduct || '자격 요건 충족 상품'}</span></li>
      <li style="flex-direction: column; gap: 4px; margin-top: 10px;">
        <span class="label" style="color: #DC2626;">💡 주요 유의사항</span>
        <span class="value" style="font-weight: 500;">${campaign.notice}</span>
      </li>
    </ul>
    <a href="${campaign.applicationUrl}" target="_blank" rel="noopener noreferrer" class="btn-apply ${!status.isApplyable ? 'disabled' : ''}">
      ${status.isApplyable ? '행사 신청 페이지 이동 ➔' : status.label}
    </a>
  `;

  backdrop.classList.add('open');
}

/* ==========================================================================
   8. 프로모션 가이드 섹션 (천억페스타 vs 얼리버드 비교)
   ========================================================================== */
function initPromotionGuideSection() {
  const guideContainer = document.getElementById('promotion-guide-container');
  const policies = getPoliciesData();

  if (!guideContainer || policies.length === 0) return;

  const policy100b = policies.find(p => p.category === '천억페스타') || {};
  const early = policies.find(p => p.category === '얼리버드') || {};

  guideContainer.innerHTML = `
    <div class="table-responsive">
      <table class="comparison-table">
        <thead>
          <tr>
            <th>구분</th>
            <th style="color: var(--type-100b);">천억페스타</th>
            <th style="color: var(--type-early);">얼리버드</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>추천 상품</strong></td>
            <td>${policy100b.recommendedTarget || '-'}</td>
            <td>${early.recommendedTarget || '-'}</td>
          </tr>
          <tr>
            <td><strong>플랫폼 보조금</strong></td>
            <td><strong style="color: #065F46;">${policy100b.subsidy || '-'}</strong></td>
            <td>${early.subsidy || '-'}</td>
          </tr>
          <tr>
            <td><strong>등록 시간 조건</strong></td>
            <td>${policy100b.registrationCondition || '-'}</td>
            <td>${early.registrationCondition || '-'}</td>
          </tr>
          <tr>
            <td><strong>판매량 조건</strong></td>
            <td>${policy100b.salesRequirement || '-'}</td>
            <td><strong style="color: var(--primary-color);">${early.salesRequirement || '-'}</strong></td>
          </tr>
          <tr>
            <td><strong>가격 및 할인 조건</strong></td>
            <td>${policy100b.priceCondition || '-'}</td>
            <td>${early.priceCondition || '-'}</td>
          </tr>
          <tr>
            <td><strong>주요 목표</strong></td>
            <td>${policy100b.mainPurpose || '-'}</td>
            <td>${early.mainPurpose || '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================================================
   9. 처음 시작하기 (온보딩 체크리스트)
   ========================================================================== */
function initGettingStartedSection() {
  const container = document.getElementById('checklist-container');
  const steps = getGuideStepsData();
  if (!container || steps.length === 0) return;

  const STORAGE_KEY = 'aliexpress_checklist_state';
  let savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  const renderChecklist = () => {
    container.innerHTML = steps.map(step => {
      const isChecked = !!savedState[step.id];
      return `
        <div class="checklist-item ${isChecked ? 'completed' : ''}" id="checklist-item-${step.id}">
          <input type="checkbox" class="checklist-checkbox" id="chk-${step.id}" data-id="${step.id}" ${isChecked ? 'checked' : ''} />
          <div class="checklist-content">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
              <span class="badge badge-general" style="background-color: #334155;">${step.stepNum}</span>
              <h3 class="checklist-title" style="margin: 0;">${step.title}</h3>
            </div>
            <div class="checklist-desc">${step.description}</div>
            ${step.copyText ? `<button class="banner-path-btn copy-btn" data-copy="${step.copyText}">📋 셀러 ID 확인경로 복사</button>` : ''}
            ${step.guideUrl ? `<a href="${step.guideUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 8px; color: var(--primary-color); font-weight: 600; font-size: 0.9rem;">관련 가이드 링크 열기 ➔</a>` : ''}
          </div>
        </div>
      `;
    }).join('');

    const checkboxes = container.querySelectorAll('.checklist-checkbox');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const checked = e.target.checked;
        savedState[id] = checked;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
        
        const itemEl = document.getElementById(`checklist-item-${id}`);
        if (itemEl) {
          if (checked) itemEl.classList.add('completed');
          else itemEl.classList.remove('completed');
        }
      });
    });
  };

  renderChecklist();
}

/* ==========================================================================
   10. 운영 공지 페이지 & 패널티 표
   ========================================================================== */
function initNoticesSection() {
  const container = document.getElementById('notices-container');
  const noticesList = getNoticesData();

  if (!container || noticesList.length === 0) return;

  container.innerHTML = noticesList.map(n => `
    <div class="notice-box ${n.badgeClass}">
      <div class="notice-header">
        <span class="badge ${n.badgeClass}">${n.level}</span>
        <h3 class="notice-title">${n.title}</h3>
        <span style="margin-left: auto; font-size: 0.85rem; color: var(--text-muted);">${n.date}</span>
      </div>
      <div class="notice-body">${n.content}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   11. 주요 링크 페이지
   ========================================================================== */
function initLinksSection() {
  const container = document.getElementById('links-container');
  const linksList = getUsefulLinksData();
  if (!container || linksList.length === 0) return;

  const grouped = {};
  linksList.forEach(link => {
    if (!grouped[link.category]) grouped[link.category] = [];
    grouped[link.category].push(link);
  });

  let html = '';
  for (const category in grouped) {
    html += `
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 16px; border-left: 4px solid var(--primary-color); padding-left: 10px;">${category}</h3>
        <div class="card-grid">
          ${grouped[category].map(link => `
            <div class="card">
              <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">${link.title}</h4>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px; flex-grow: 1;">${link.description}</p>
              <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-apply" style="background-color: #334155;">
                바로가기 ➔
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

/* ==========================================================================
   12. FAQ 검색 및 아코디언
   ========================================================================== */
function initFaqSection() {
  const accordionContainer = document.getElementById('faq-accordion-list');
  const searchInput = document.getElementById('faq-search-input');
  const categoryTabs = document.querySelectorAll('#faq-category-tabs .filter-btn');
  const faqList = getFaqData();

  if (!accordionContainer || faqList.length === 0) return;

  let currentCategory = 'all';
  let currentQuery = '';

  const renderFaq = () => {
    let list = [...faqList];

    if (currentCategory !== 'all') {
      list = list.filter(item => item.category === currentCategory);
    }

    if (currentQuery.trim() !== '') {
      const q = currentQuery.toLowerCase().trim();
      list = list.filter(item => {
        const questionMatch = item.question.toLowerCase().includes(q);
        const answerMatch = item.answer.toLowerCase().includes(q);
        const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(q));
        const categoryMatch = item.category.toLowerCase().includes(q);
        return questionMatch || answerMatch || keywordMatch || categoryMatch;
      });
    }

    if (list.length === 0) {
      accordionContainer.innerHTML = `
        <div class="empty-results">
          검색 결과가 없습니다. 다른 키워드로 검색하거나 담당 CM에게 문의해 주세요.
        </div>
      `;
      return;
    }

    accordionContainer.innerHTML = list.map(item => `
      <div class="accordion-item" id="faq-${item.id}">
        <button class="accordion-header" aria-expanded="false">
          <span>[${item.category}] ${item.question}</span>
          <span class="accordion-icon">▼</span>
        </button>
        <div class="accordion-body">
          ${item.answer}
          <div class="faq-keywords">
            ${item.keywords.map(k => `<span class="keyword-tag">#${k}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    const headers = accordionContainer.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');
        
        if (isOpen) {
          item.classList.remove('open');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  renderFaq();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value;
      renderFaq();
    });
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderFaq();
    });
  });
}

/* ==========================================================================
   13. 클립보드 복사 전용 핸들러
   ========================================================================== */
function initGlobalCopyHandler() {
  document.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      const textToCopy = copyBtn.getAttribute('data-copy');
      if (textToCopy) {
        copyToClipboard(textToCopy);
      }
    }
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('클립보드에 복사되었습니다!');
  }).catch(() => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('클립보드에 복사되었습니다!');
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}
