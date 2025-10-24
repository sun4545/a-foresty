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
    
    // Brand Story Section 01 초기화
    initBrandStorySection01();
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

// Brand Story Section 01 초기화 함수
function initBrandStorySection01() {
    const section = document.querySelector('.brand-story-section-01');
    const imageList = document.querySelector('.brand-story-01-image-list');
    const scrollContainer = document.querySelector('.brand-story-01-scroll-container');
    
    if (!section || !imageList || !scrollContainer) {
        console.log('Brand Story Section 01 요소를 찾을 수 없습니다.');
        return;
    }
    
    let isScrolling = false;
    let scrollProgress = 0;
    let maxScroll = 0;
    
    // 스크롤 가능한 최대 거리 계산
    function calculateMaxScroll() {
        const containerWidth = scrollContainer.offsetWidth;
        const listWidth = imageList.scrollWidth;
        maxScroll = listWidth - containerWidth;
    }
    
    
    // 초기 계산
    calculateMaxScroll();
    
    // 윈도우 리사이즈 시 재계산
    window.addEventListener('resize', calculateMaxScroll);
    
    // 스크롤 이벤트 처리
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const containerTop = scrollContainer.offsetTop;
                const containerHeight = scrollContainer.offsetHeight;
                const windowHeight = window.innerHeight;
                
                // 80px 패딩을 지나고 나서 sticky 적용
                const stickyStartPoint = containerTop - 80;
                
                // brand-story-01-container가 뷰포트에 들어왔는지 확인 (80px 패딩 고려)
                const containerInView = scrollTop >= stickyStartPoint && 
                                      scrollTop <= containerTop + containerHeight;
                
                if (containerInView) {
                    // brand-story-01-container가 뷰포트에 있을 때 sticky 적용
                    section.classList.add('sticky');
                    
                    // 스크롤 진행률 계산 (0 ~ 1) - 80px 패딩 고려
                    const containerScrollProgress = Math.max(0, Math.min(1, 
                        (scrollTop - stickyStartPoint) / (containerHeight + 80)
                    ));
                    
                    // 가로 스크롤 적용
                    scrollProgress = containerScrollProgress * maxScroll;
                    imageList.style.transform = `translateX(-${scrollProgress}px)`;
                    
                    console.log(`Brand Story Section 01 스크롤 진행률: ${(containerScrollProgress * 100).toFixed(1)}%`);
                } else {
                    // 섹션이 뷰포트를 벗어나면 sticky 해제
                    section.classList.remove('sticky');
                }
                
                isScrolling = false;
            });
        }
        isScrolling = true;
    }
    
    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    
    // 터치/마우스 드래그 지원 (모바일 및 데스크톱)
    let isDragging = false;
    let startX = 0;
    let startScrollProgress = 0;
    
    // 마우스 이벤트
    scrollContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startScrollProgress = scrollProgress;
        scrollContainer.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const newScrollProgress = Math.max(0, Math.min(maxScroll, startScrollProgress - deltaX));
        
        // 드래그 시 즉시 반응하되 부드러운 전환 적용
        scrollProgress = newScrollProgress;
        imageList.style.transform = `translateX(-${scrollProgress}px)`;
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        scrollContainer.style.cursor = 'grab';
    });
    
    // 터치 이벤트 (모바일)
    scrollContainer.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startScrollProgress = scrollProgress;
        e.preventDefault();
    });
    
    scrollContainer.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.touches[0].clientX - startX;
        const newScrollProgress = Math.max(0, Math.min(maxScroll, startScrollProgress - deltaX));
        
        // 터치 시 즉시 반응하되 부드러운 전환 적용
        scrollProgress = newScrollProgress;
        imageList.style.transform = `translateX(-${scrollProgress}px)`;
        e.preventDefault();
    });
    
    scrollContainer.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // 휠 이벤트 (가로 스크롤) - 횡스크롤 끝나면 세로 스크롤로 전환
    scrollContainer.addEventListener('wheel', function(e) {
        if (section.classList.contains('sticky')) {
            const deltaX = e.deltaX || e.deltaY;
            
            // 횡스크롤이 끝났는지 확인
            const isAtStart = scrollProgress <= 0;
            const isAtEnd = scrollProgress >= maxScroll;
            const isScrollingRight = deltaX > 0;
            const isScrollingLeft = deltaX < 0;
            
            // 횡스크롤이 끝났을 때는 페이지 스크롤 허용
            if ((isAtStart && isScrollingLeft) || (isAtEnd && isScrollingRight)) {
                // 페이지 스크롤 허용 (preventDefault 하지 않음)
                return;
            }
            
            // 횡스크롤이 가능한 경우에만 preventDefault
            e.preventDefault();
            
            // 더 느린 스크롤 속도로 조절 (현재의 60%)
            const scrollSpeed = 0.36;
            const newScrollProgress = Math.max(0, Math.min(maxScroll, scrollProgress + deltaX * scrollSpeed));
            
            scrollProgress = newScrollProgress;
            imageList.style.transform = `translateX(-${scrollProgress}px)`;
            
            // 횡스크롤이 끝에 도달했을 때 자동으로 세로 스크롤로 전환
            if (scrollProgress >= maxScroll) {
                // 다음 스크롤 이벤트에서 세로 스크롤 허용
                setTimeout(() => {
                    section.classList.remove('sticky');
                }, 100);
            }
        }
    });
    
    // 커서 스타일 설정
    scrollContainer.style.cursor = 'grab';
    
    console.log('Brand Story Section 01 기능이 초기화되었습니다.');
}
