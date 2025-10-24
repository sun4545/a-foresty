// 검색 오버레이 기능
document.addEventListener('DOMContentLoaded', function() {
    const searchOverlay = document.querySelector('.search-overlay');
    const searchBtns = document.querySelectorAll('.search-btn');
    const searchCloseBtn = document.querySelector('.search-close-btn');
    const searchInput = document.querySelector('.search-input');
    const searchRecent = document.getElementById('searchRecent');
    const searchResults = document.getElementById('searchResults');
    const searchResultsList = document.getElementById('searchResultsList');

    // 모든 검색 버튼에 클릭 이벤트 추가
    searchBtns.forEach(function(searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
            document.body.style.overflow = 'hidden'; // 스크롤 방지
            document.documentElement.style.overflow = 'hidden'; // html 스크롤도 방지
        });
    });

    // 검색창 닫기 버튼 클릭 시 오버레이 닫기
    searchCloseBtn.addEventListener('click', function() {
        closeSearchOverlay();
    });

    // ESC 키로 검색창 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
    });

    // 검색창 외부 클릭 시 닫기
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearchOverlay();
        }
    });

    

    // 검색어 입력 시 실시간 검색
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim();
        
        if (query === '') {
            showRecentPosts();
        } else {
            performSearch(query);
        }
    });

    // 검색창 닫기 함수
    function closeSearchOverlay() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        document.body.style.overflow = ''; // 스크롤 복원
        document.documentElement.style.overflow = ''; // html 스크롤도 복원
        showRecentPosts();
    }

    // Recent posts 보여주기
    function showRecentPosts() {
        searchRecent.style.display = 'block';
        searchResults.style.display = 'none';
    }

    // 검색 실행
    function performSearch(query) {
        searchRecent.style.display = 'none';
        searchResults.style.display = 'block';
        
        // 실제 검색 로직 (여기서는 예시 데이터 사용)
        const searchData = [
            {
                image: '../image/basic_4-3_1.jpg',
                category: 'Data & analytics',
                title: '데이터 레이크 대 데이터 웨어하우스 : 과연 누가 승자일까',
                author: '윤테크',
                date: '2025년 6월 7일'
            },
            {
                image: '../image/basic_4-3_2.jpg',
                category: 'Cloud computing',
                title: '멀티 클라우드 전략 완전 해부',
                author: '김가람',
                date: '2025년 6월 7일'
            },
            {
                image: '../image/basic_4-3_3.jpg',
                category: 'Team',
                title: '금전적 보상없이, 이벤트 바이럴이 가능할까?',
                author: '테디킴',
                date: '2025년 6월 7일'
            },
            {
                image: '../image/cardlist_4-3_1.jpg',
                category: 'AI & machine learning',
                title: '생성형 AI가 바꾸는 콘텐츠 생산의 표준',
                author: '강레오',
                date: '2025년 6월 7일'
            },
            {
                image: '../image/cardlist_4-3_2.jpg',
                category: 'AI & machine learning',
                title: 'AI 거버넌스가 기업 경쟁력을 결정한다',
                author: '제임스오',
                date: '2025년 6월 7일'
            }
        ];

        // 검색어로 필터링 (제목, 카테고리, 작성자에서 검색)
        const filteredResults = searchData.filter(item => {
            const searchText = `${item.title} ${item.category} ${item.author}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        displaySearchResults(filteredResults, query);
    }

    // 텍스트 하이라이트 함수
    function highlightText(text, query) {
        if (!query || query.trim() === '') return text;
        
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    // 검색 결과 표시
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResultsList.innerHTML = `
                <div class="search-no-results">
                    <p>"${query}"에 대한 검색 결과가 없습니다.</p>
                    <p>다른 키워드로 검색해보세요.</p>
                </div>
            `;
        } else {
                                    searchResultsList.innerHTML = results.map(item => `
                            <a href="#" class="search-result-item">
                                <div class="search-result-image">
                                    <img src="${item.image}" alt="${item.category}">
                                </div>
                                <div class="search-result-content">
                                    <span class="search-result-category">${highlightText(item.category, query)}</span>
                                    <h4 class="search-result-title">${highlightText(item.title, query)}</h4>
                                </div>
                            </a>
                        `).join('');
        }
    }
});

// 모바일 메뉴 드롭다운 기능
document.addEventListener('DOMContentLoaded', function() {
    const blogDropdownTrigger = document.querySelector('.blog-dropdown-trigger');
    const mobileBlogDropdown = document.querySelector('.mobile-blog-dropdown');
    
    if (blogDropdownTrigger && mobileBlogDropdown) {
        blogDropdownTrigger.addEventListener('click', function() {
            blogDropdownTrigger.classList.toggle('active');
            mobileBlogDropdown.classList.toggle('active');
        });
    }
}); 