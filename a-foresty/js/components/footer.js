// a.foresty Footer 컴포넌트 JavaScript

class Footer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      theme: 'default', // 'default' | 'light' | 'primary'
      company: '(주)아르보포레스티아',
      ceo: '김그랩',
      registration: '000-00-00000',
      phone: '546-1520',
      email: 'hello@thegrap.com',
      address: '서울특별시 서초구 신반포로49길 12 아르보포레스티갤러리',
      copyright: 'ARBOR FORESTY ALL RIGHT RESERVED ©2025',
      madeBy: 'MADE BY THE GRAP',
      disclaimer: '※ 본 홈페이지 내 사용된 CG와 이미지, 내용, 문구 등은 소비자의 이해를 돕기 위해 제작된 것으로 실제와 다릅니다.',
      menuItems: [
        { text: 'About', href: '#about' },
        { text: 'Services', href: '#services' },
        { text: 'Contact', href: '#contact' }
      ],
      showBackToTop: true,
      showGalleryName: false,
      showExtendedDisclaimer: false,
      onMenuClick: null,
      onBackToTopClick: null,
      onEmailClick: null,
      onPhoneClick: null,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  // Footer 렌더링
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.className = `footer ${this.getThemeClass()}`;
    
    // Footer 구조 생성
    const html = `
      <!-- Left 섹션 -->
      <div class="footer__left">
        <!-- 로고 및 메뉴 섹션 -->
        <div class="footer__logo-section">
          <!-- 로고 -->
          <div class="footer__logo">
            <div class="footer__logo-text">Arbor Foresty</div>
          </div>
          
          <!-- 메뉴 -->
          <nav class="footer__menu">
            ${this.options.menuItems.map(item => 
              `<a href="${item.href}" class="footer__menu-item">${item.text}</a>`
            ).join('')}
          </nav>
        </div>
        
        <!-- 회사 정보 -->
        <div class="footer__company-info">
          <div class="footer__company-details">
            <span class="footer__company-name">${this.options.company}</span>
            <span class="footer__ceo">대표이사 : ${this.options.ceo}</span>
            <span class="footer__registration">등록번호 : ${this.options.registration}</span>
          </div>
          <p class="footer__disclaimer">${this.options.disclaimer}</p>
        </div>
      </div>
      
      <!-- Right 섹션 -->
      <div class="footer__right">
        <!-- 연락처 정보 -->
        <div class="footer__contact-section">
          <!-- 전화번호 -->
          <div class="footer__phone">
            <span class="footer__phone-label">관심고객 문의</span>
            <span class="footer__phone-number">${this.options.phone}</span>
          </div>
          
          <!-- 주소 및 이메일 -->
          <div class="footer__address">
            <p class="footer__address-text">${this.options.address}</p>
            <a href="mailto:${this.options.email}" class="footer__email">${this.options.email}</a>
          </div>
        </div>
        
        <!-- 저작권 -->
        <p class="footer__copyright">${this.options.copyright}</p>
      </div>
      
      <!-- Right Extended 섹션 -->
      <div class="footer__right-extended">
        ${this.options.showBackToTop ? `
          <!-- BACK TO TOP 버튼 -->
          <button class="footer__back-to-top text-button text-button--default" data-text-button="back-to-top" aria-label="맨 위로">
            <div class="text-button__icon">
              <div class="text-button__icon-arrow"></div>
            </div>
            <span class="text-button__text">BACK TO TOP</span>
            <div class="text-button__icon-right">
              <div class="text-button__icon-right-arrow"></div>
            </div>
          </button>
        ` : ''}
        
        <!-- 제작사 -->
        <p class="footer__made-by">${this.options.madeBy}</p>
        
        ${this.options.showGalleryName ? `
          <!-- 갤러리명 -->
          <p class="footer__gallery-name">아르보 포레스티 갤러리</p>
        ` : ''}
        
        ${this.options.showExtendedDisclaimer ? `
          <!-- 면책조항 확장 -->
          <p class="footer__disclaimer-extended">${this.options.disclaimer}</p>
        ` : ''}
      </div>
    `;
    
    this.container.innerHTML = html;
  }
  
  // 테마 클래스 반환
  getThemeClass() {
    return this.options.theme !== 'default' ? `footer--${this.options.theme}` : '';
  }
  
  // 이벤트 바인딩
  bindEvents() {
    if (!this.container) return;
    
    // 메뉴 클릭 이벤트
    const menuItems = this.container.querySelectorAll('.footer__menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        if (this.options.onMenuClick) {
          this.options.onMenuClick(e.target.textContent, e.target.href);
        }
        
        // 커스텀 이벤트 발생
        this.container.dispatchEvent(new CustomEvent('footerMenuClick', {
          detail: { text: e.target.textContent, href: e.target.href }
        }));
      });
    });
    
    // BACK TO TOP 버튼 클릭 이벤트
    const backToTopButton = this.container.querySelector('.footer__back-to-top');
    if (backToTopButton) {
      backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleBackToTop();
      });
    }
    
    // 이메일 클릭 이벤트
    const emailLink = this.container.querySelector('.footer__email');
    if (emailLink) {
      emailLink.addEventListener('click', (e) => {
        if (this.options.onEmailClick) {
          this.options.onEmailClick(this.options.email);
        }
        
        // 커스텀 이벤트 발생
        this.container.dispatchEvent(new CustomEvent('footerEmailClick', {
          detail: { email: this.options.email }
        }));
      });
    }
    
    // 전화번호 클릭 이벤트
    const phoneNumber = this.container.querySelector('.footer__phone-number');
    if (phoneNumber) {
      phoneNumber.addEventListener('click', (e) => {
        if (this.options.onPhoneClick) {
          this.options.onPhoneClick(this.options.phone);
        }
        
        // 커스텀 이벤트 발생
        this.container.dispatchEvent(new CustomEvent('footerPhoneClick', {
          detail: { phone: this.options.phone }
        }));
      });
    }
  }
  
  // BACK TO TOP 처리
  handleBackToTop() {
    if (this.options.onBackToTopClick) {
      this.options.onBackToTopClick();
    }
    
    // 부드러운 스크롤
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('footerBackToTop', {
      detail: { footer: this.options }
    }));
  }
  
  // 회사 정보 업데이트
  updateCompanyInfo(company, ceo, registration) {
    this.options.company = company;
    this.options.ceo = ceo;
    this.options.registration = registration;
    
    const companyName = this.container.querySelector('.footer__company-name');
    const ceoElement = this.container.querySelector('.footer__ceo');
    const registrationElement = this.container.querySelector('.footer__registration');
    
    if (companyName) companyName.textContent = company;
    if (ceoElement) ceoElement.textContent = `대표이사 : ${ceo}`;
    if (registrationElement) registrationElement.textContent = `등록번호 : ${registration}`;
  }
  
  // 연락처 정보 업데이트
  updateContactInfo(phone, email, address) {
    this.options.phone = phone;
    this.options.email = email;
    this.options.address = address;
    
    const phoneElement = this.container.querySelector('.footer__phone-number');
    const emailElement = this.container.querySelector('.footer__email');
    const addressElement = this.container.querySelector('.footer__address-text');
    
    if (phoneElement) phoneElement.textContent = phone;
    if (emailElement) {
      emailElement.textContent = email;
      emailElement.href = `mailto:${email}`;
    }
    if (addressElement) addressElement.textContent = address;
  }
  
  // 메뉴 아이템 업데이트
  updateMenuItems(menuItems) {
    this.options.menuItems = menuItems;
    
    const menuContainer = this.container.querySelector('.footer__menu');
    if (menuContainer) {
      menuContainer.innerHTML = menuItems.map(item => 
        `<a href="${item.href}" class="footer__menu-item">${item.text}</a>`
      ).join('');
      
      // 새로운 메뉴 아이템에 이벤트 바인딩
      const newMenuItems = menuContainer.querySelectorAll('.footer__menu-item');
      newMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
          if (this.options.onMenuClick) {
            this.options.onMenuClick(e.target.textContent, e.target.href);
          }
          
          this.container.dispatchEvent(new CustomEvent('footerMenuClick', {
            detail: { text: e.target.textContent, href: e.target.href }
          }));
        });
      });
    }
  }
  
  // 테마 업데이트
  updateTheme(theme) {
    this.options.theme = theme;
    this.container.className = `footer ${this.getThemeClass()}`;
  }
  
  // BACK TO TOP 버튼 표시/숨김
  setBackToTopVisible(visible) {
    this.options.showBackToTop = visible;
    const backToTopButton = this.container.querySelector('.footer__back-to-top');
    if (backToTopButton) {
      backToTopButton.style.display = visible ? 'flex' : 'none';
    }
  }
  
  // 갤러리명 표시/숨김
  setGalleryNameVisible(visible) {
    this.options.showGalleryName = visible;
    const galleryName = this.container.querySelector('.footer__gallery-name');
    if (galleryName) {
      galleryName.style.display = visible ? 'block' : 'none';
    }
  }
  
  // 확장 면책조항 표시/숨김
  setExtendedDisclaimerVisible(visible) {
    this.options.showExtendedDisclaimer = visible;
    const disclaimer = this.container.querySelector('.footer__disclaimer-extended');
    if (disclaimer) {
      disclaimer.style.display = visible ? 'block' : 'none';
    }
  }
  
  // Footer 데이터 반환
  getFooterData() {
    return { ...this.options };
  }
}

// 전역 Footer 초기화 함수
function initFooter() {
  // data-footer 속성이 있는 모든 요소 초기화
  const footerElements = document.querySelectorAll('[data-footer]');
  
  footerElements.forEach(element => {
    const theme = element.getAttribute('data-theme') || 'default';
    const company = element.getAttribute('data-company') || '(주)아르보포레스티아';
    const ceo = element.getAttribute('data-ceo') || '김그랩';
    const phone = element.getAttribute('data-phone') || '546-1520';
    const email = element.getAttribute('data-email') || 'hello@thegrap.com';
    const showBackToTop = element.getAttribute('data-show-back-to-top') !== 'false';
    
    new Footer(element, {
      theme: theme,
      company: company,
      ceo: ceo,
      phone: phone,
      email: email,
      showBackToTop: showBackToTop,
      onMenuClick: (text, href) => {
        console.log('Footer 메뉴 클릭:', text, href);
      },
      onBackToTopClick: () => {
        console.log('BACK TO TOP 클릭');
      },
      onEmailClick: (email) => {
        console.log('이메일 클릭:', email);
      },
      onPhoneClick: (phone) => {
        console.log('전화번호 클릭:', phone);
      }
    });
  });
}

// DOM이 로드된 후 Footer 초기화
document.addEventListener('DOMContentLoaded', initFooter);

// 전역에서 사용할 수 있도록 export
window.Footer = Footer;
