// a.foresty 메인 JavaScript 파일

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('a.foresty 웹페이지가 로드되었습니다.');
    
    // 기본 초기화 함수
    init();
});

// 초기화 함수
function init() {
    // 반응형 처리
    handleResponsive();
    
    // 이벤트 리스너 등록
    setupEventListeners();
    
    // Navbar 스크롤 기능 초기화
    initNavbarScroll();
    
    // Hero 캐러셀 기능 초기화
    initHeroCarousel();
}

// 반응형 처리 함수
function handleResponsive() {
    // 화면 크기 변경 감지
    window.addEventListener('resize', function() {
        console.log('화면 크기가 변경되었습니다:', window.innerWidth);
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 필요한 이벤트 리스너들을 여기에 추가
    console.log('이벤트 리스너가 설정되었습니다.');
}

// Navbar 스크롤 기능 초기화
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let isScrolling = false;
    
    if (!navbar) return;
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollThreshold = 100; // 100px 이상 스크롤 시 배경 적용
                
                // 스크롤 위치에 따른 배경 적용
                if (scrollTop > scrollThreshold) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // 스크롤 방향 감지
                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    // 스크롤 다운 - navbar 숨기기
                    navbar.classList.add('scroll-down');
                    navbar.classList.remove('scroll-up');
                } else {
                    // 스크롤 업 - navbar 보이기
                    navbar.classList.add('scroll-up');
                    navbar.classList.remove('scroll-down');
                }
                
                lastScrollTop = scrollTop;
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
    
    console.log('Navbar 스크롤 기능이 초기화되었습니다.');
}

// Hero 캐러셀 기능 초기화
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    if (totalSlides === 0) {
        console.log('Hero 배경 슬라이드를 찾을 수 없습니다.');
        return;
    }
    
    // 3초 간격으로 슬라이드 전환
    setInterval(function() {
        // 현재 슬라이드에서 active 클래스 제거
        slides[currentSlide].classList.remove('active');
        
        // 다음 슬라이드로 이동
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // 새로운 슬라이드에 active 클래스 추가
        slides[currentSlide].classList.add('active');
        
        console.log(`Hero 슬라이드 전환: ${currentSlide + 1}/${totalSlides}`);
    }, 3000); // 3초 간격
    
    console.log('Hero 캐러셀 기능이 초기화되었습니다.');
}
