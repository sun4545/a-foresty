/**
 * UI Interactions Module
 * 사용자 인터랙션 관련 기능들을 관리하는 모듈
 */

class UIInteractions {
    constructor() {
        this.init();
    }

    /**
     * 초기화
     */
    init() {
        this.initSearchOverlay();
        this.initMobileMenu();
        this.initBlogDropdown();
        this.initColorExtraction();
    }

    /**
     * 검색 오버레이 초기화
     */
    initSearchOverlay() {
        const searchBtn = document.querySelector('.search-btn');
        const searchOverlay = document.querySelector('.search-overlay');
        const searchCloseBtn = document.querySelector('.search-close-btn');
        const searchInput = document.querySelector('.search-input');

        if (searchBtn && searchOverlay) {
            searchBtn.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                setTimeout(() => searchInput?.focus(), 100);
            });
        }

        if (searchCloseBtn && searchOverlay) {
            searchCloseBtn.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
            });
        }

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    /**
     * 모바일 메뉴 초기화
     */
    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileMenuCloseBtn = document.querySelector('.mobile-menu-close-btn');
        const mobileBlogToggle = document.querySelector('.mobile-blog-toggle');
        const mobileBlogDropdown = document.querySelector('.mobile-blog-dropdown');

        if (mobileMenuBtn && mobileMenuOverlay) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (mobileMenuCloseBtn && mobileMenuOverlay) {
            mobileMenuCloseBtn.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (mobileBlogToggle && mobileBlogDropdown) {
            mobileBlogToggle.addEventListener('click', () => {
                mobileBlogDropdown.classList.toggle('active');
            });
        }
    }

    /**
     * 블로그 드롭다운 초기화
     */
    initBlogDropdown() {
        const blogMenu = document.querySelector('.blog-menu');
        const blogDropdown = document.querySelector('.blog-dropdown');

        if (blogMenu && blogDropdown) {
            // 데스크톱에서만 작동
            if (window.innerWidth > 768) {
                blogMenu.addEventListener('mouseenter', () => {
                    blogDropdown.style.opacity = '1';
                    blogDropdown.style.visibility = 'visible';
                    blogDropdown.style.transform = 'translateY(0)';
                });

                const dropdownContainer = blogMenu.parentElement;
                dropdownContainer.addEventListener('mouseleave', () => {
                    blogDropdown.style.opacity = '0';
                    blogDropdown.style.visibility = 'hidden';
                    blogDropdown.style.transform = 'translateY(-10px)';
                });
            }
        }
    }

    /**
     * 색상 추출 초기화
     */
    initColorExtraction() {
        const heroImages = document.querySelectorAll('.hero-img');
        
        heroImages.forEach(img => {
            const heroBanner = img.closest('.hero-banner');
            if (heroBanner && window.colorExtractor) {
                window.colorExtractor.extractAndSetBackground(img, heroBanner);
            }
        });
    }

    /**
     * 스크롤 이벤트 처리
     */
    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    /**
     * 리사이즈 이벤트 처리
     */
    handleResize() {
        // 모바일 메뉴가 열려있을 때 데스크톱으로 전환되면 닫기
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        if (window.innerWidth > 768 && mobileMenuOverlay?.classList.contains('active')) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * 폼 제출 처리
     */
    handleFormSubmit(formSelector, successMessage = '메시지가 성공적으로 전송되었습니다!') {
        const form = document.querySelector(formSelector);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert(successMessage);
            });
        }
    }

    /**
     * 로딩 상태 관리
     */
    setLoadingState(isLoading) {
        const body = document.body;
        if (isLoading) {
            body.classList.add('loading');
        } else {
            body.classList.remove('loading');
        }
    }

    /**
     * 토스트 메시지 표시
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // 스타일 적용
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#4CAF50' : 
                           type === 'error' ? '#F44336' : '#2196F3'
        });

        document.body.appendChild(toast);

        // 애니메이션
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 자동 제거
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
}

// 전역 인스턴스 생성
window.uiInteractions = new UIInteractions();

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
    // 스크롤 이벤트
    window.addEventListener('scroll', () => {
        window.uiInteractions.handleScroll();
    });

    // 리사이즈 이벤트
    window.addEventListener('resize', () => {
        window.uiInteractions.handleResize();
    });

    // Contact 폼 제출 처리
    window.uiInteractions.handleFormSubmit('.contact-form');
}); 