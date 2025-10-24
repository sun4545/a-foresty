// a.foresty Navbar 컴포넌트 JavaScript

class Navbar {
  constructor() {
    this.navbar = document.getElementById('main-navbar');
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.menu = document.getElementById('navbar-menu');
    this.isMenuOpen = false;
    
    this.init();
  }
  
  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupResizeHandler();
  }
  
  // 스크롤 효과 설정
  setupScrollEffect() {
    if (!this.navbar) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // 스크롤 방향 감지
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤 - 네비게이션 숨기기
        this.navbar.style.transform = 'translateY(-100%)';
      } else {
        // 위로 스크롤 - 네비게이션 보이기
        this.navbar.style.transform = 'translateY(0)';
      }
      
      // 스크롤 위치에 따른 배경색 변경
      if (currentScrollY > 50) {
        this.navbar.classList.add('navbar--scrolled');
      } else {
        this.navbar.classList.remove('navbar--scrolled');
      }
      
      lastScrollY = currentScrollY;
    });
  }
  
  // 모바일 메뉴 설정
  setupMobileMenu() {
    if (!this.mobileToggle || !this.menu) return;
    
    this.mobileToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && 
          !this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
    
    // ESC 키로 메뉴 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }
  
  // 모바일 메뉴 토글
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  // 모바일 메뉴 열기
  openMobileMenu() {
    this.menu.classList.add('navbar__menu--open');
    this.mobileToggle.setAttribute('aria-label', '메뉴 닫기');
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.isMenuOpen = true;
    
    // 햄버거 메뉴 애니메이션
    const spans = this.mobileToggle.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  }
  
  // 모바일 메뉴 닫기
  closeMobileMenu() {
    this.menu.classList.remove('navbar__menu--open');
    this.mobileToggle.setAttribute('aria-label', '메뉴 열기');
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.isMenuOpen = false;
    
    // 햄버거 메뉴 애니메이션 리셋
    const spans = this.mobileToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
  
  // 리사이즈 핸들러
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      // 데스크톱으로 전환 시 모바일 메뉴 닫기
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }
  
  // 네비게이션 항목 클릭 시 스무스 스크롤
  setupSmoothScroll() {
    const menuItems = this.menu?.querySelectorAll('a[href^="#"]');
    
    menuItems?.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = item.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // 모바일 메뉴 닫기
          if (this.isMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });
    });
  }
}

// DOM이 로드된 후 Navbar 초기화
document.addEventListener('DOMContentLoaded', () => {
  new Navbar();
});

// 전역에서 사용할 수 있도록 export
window.Navbar = Navbar;
