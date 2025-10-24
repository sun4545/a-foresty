import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getDatabase, ref, get, set, push, update, remove, query, orderByChild, limitToFirst, equalTo } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAciaoauPNymL2Hv0aLCIhNSfnFgX21gHM",
    authDomain: "technovaplace.firebaseapp.com",
    projectId: "technovaplace",
    storageBucket: "technovaplace.firebasestorage.app",
    messagingSenderId: "919368721193",
    appId: "1:919368721193:web:6d848c9fe010b4af008d38",
    measurementId: "G-QJGJFWE0KR",
    databaseURL: "https://technovaplace-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// 전역 Firebase 객체 생성
window.firebaseApp = app;
window.firebaseDB = database;

// 블로그 데이터베이스 관리 클래스 (Realtime Database용)
class BlogDatabase {
    constructor() {
        this.db = database;
        this.postsRef = ref(this.db, 'posts');
        this.categoriesRef = ref(this.db, 'categories');
        this.usersRef = ref(this.db, 'users');
    }

    async getPosts(options = {}) {
        try {
            let postsQuery = this.postsRef;
            
            if (options.status) {
                postsQuery = query(postsQuery, orderByChild('status'), equalTo(options.status));
            }
            
            if (options.limit) {
                postsQuery = query(postsQuery, limitToFirst(options.limit));
            }
            
            const snapshot = await get(postsQuery);
            const posts = [];
            
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    posts.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }
            
            // 정렬
            if (options.orderBy === 'publishedAt') {
                posts.sort((a, b) => {
                    const dateA = new Date(a.publishedAt);
                    const dateB = new Date(b.publishedAt);
                    return options.orderDirection === 'desc' ? dateB - dateA : dateA - dateB;
                });
            }
            
            return posts;
        } catch (error) {
            console.error('Error getting posts:', error);
            throw error;
        }
    }

    async getPost(postId) {
        try {
            const postRef = ref(this.db, `posts/${postId}`);
            const snapshot = await get(postRef);
            
            if (snapshot.exists()) {
                return {
                    id: snapshot.key,
                    ...snapshot.val()
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting post:', error);
            throw error;
        }
    }

    async createPost(postData) {
        try {
            const now = new Date().toISOString();
            const post = {
                ...postData,
                createdAt: now,
                updatedAt: now,
                viewCount: 0,
                likeCount: 0,
                commentCount: 0
            };
            
            const newPostRef = push(this.postsRef);
            await set(newPostRef, post);
            
            return {
                id: newPostRef.key,
                ...post
            };
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async updatePost(postId, postData) {
        try {
            const postRef = ref(this.db, `posts/${postId}`);
            const now = new Date().toISOString();
            
            await update(postRef, {
                ...postData,
                updatedAt: now
            });
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }

    async deletePost(postId) {
        try {
            const postRef = ref(this.db, `posts/${postId}`);
            await remove(postRef);
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }

    async getCategories() {
        try {
            const snapshot = await get(this.categoriesRef);
            const categories = [];
            
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    categories.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }
            
            return categories;
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    }

    async getPostsByCategory(categoryId) {
        try {
            const postsQuery = query(this.postsRef, orderByChild('categoryId'), equalTo(categoryId));
            const snapshot = await get(postsQuery);
            const posts = [];
            
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    posts.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }
            
            return posts;
        } catch (error) {
            console.error('Error getting posts by category:', error);
            throw error;
        }
    }
}

// 전역 블로그 데이터베이스 인스턴스 생성
window.blogDB = new BlogDatabase();

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 탭 기능 구현
    initializeTabs();
    
    // 스크롤 이벤트 처리
    initializeScrollEffects();
    
    // 구독 폼 처리
    initializeSubscribeForm();
    
    // 구독 팝업 처리
    initializeSubscribePopup();
    
    // 드롭다운 메뉴 처리
    initializeDropdownMenu();
    
    // 햄버거 메뉴 처리
    initializeHamburgerMenu();
    
    // Back to top 버튼 처리
    initializeBackToTop();
    
    // 부드러운 스크롤 처리
    initializeSmoothScroll();
});

// 탭 기능 초기화
function initializeTabs() {
    // 카테고리 탭
    const categoryTabs = document.querySelectorAll('.tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 기존 활성 탭 제거
            categoryTabs.forEach(t => t.classList.remove('active'));
            // 클릭된 탭 활성화
            this.classList.add('active');
            
            // 여기에 탭 변경 시 콘텐츠 필터링 로직 추가 가능
            console.log('Selected category:', this.textContent);
        });
    });
    
    // 하이라이트 탭
    const highlightTabs = document.querySelectorAll('.highlight-tab');
    highlightTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 기존 활성 탭 제거
            highlightTabs.forEach(t => t.classList.remove('active'));
            // 클릭된 탭 활성화
            this.classList.add('active');
            
            // 여기에 탭 변경 시 콘텐츠 필터링 로직 추가 가능
            console.log('Selected highlight category:', this.textContent);
        });
    });
}

// 스크롤 이벤트 처리
function initializeScrollEffects() {
    let lastScrollTop = 0;
    let isScrolling = false;
    
    console.log('Script.js: 스크롤 인터랙션 초기화됨');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.header');
        const categories = document.querySelector('.categories');
        
        console.log('Script.js: 스크롤 이벤트 발생', { scrollTop, lastScrollTop, isScrolling });
        
        // 스크롤 방향에 따른 클래스 토글
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 아래로 스크롤 - 헤더와 카테고리 모두 숨김
            if (!isScrolling) {
                console.log('Script.js: 헤더와 카테고리 숨김');
                header.classList.add('hidden');
                categories.classList.add('hidden');
                isScrolling = true;
            }
        } else if (scrollTop < lastScrollTop) {
            // 위로 스크롤 - 헤더와 카테고리 모두 표시
            console.log('Script.js: 헤더와 카테고리 표시');
            header.classList.remove('hidden');
            categories.classList.remove('hidden');
            isScrolling = false;
        }
        
        lastScrollTop = scrollTop;
        
        // 스크롤 진행률 표시 (선택사항)
        const scrollProgress = (scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        updateScrollProgress(scrollProgress);
    });
}

// 스크롤 진행률 업데이트
function updateScrollProgress(progress) {
    // 스크롤 진행률 바가 있다면 업데이트
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// 구독 폼 처리
function initializeSubscribeForm() {
    const subscribeForm = document.querySelector('.subscribe-form');
    const subscribeInput = document.querySelector('.subscribe-input');
    const subscribeButton = document.querySelector('.subscribe-button');
    
    console.log('🔧 구독 폼 초기화 시작');
    console.log('📋 subscribeForm:', !!subscribeForm);
    console.log('📋 subscribeInput:', !!subscribeInput);
    console.log('📋 subscribeButton:', !!subscribeButton);
    
    if (subscribeForm && subscribeInput && subscribeButton) {
        console.log('✅ 구독 폼 요소들을 모두 찾았습니다');
        
        subscribeButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 구독 버튼 클릭됨');
            
            const email = subscribeInput.value.trim();
            console.log('📧 입력된 이메일:', email);
            
            if (validateEmail(email)) {
                console.log('✅ 이메일 유효성 검사 통과');
                // 구독 처리 로직
                handleSubscribe(email);
            } else {
                console.log('❌ 이메일 유효성 검사 실패');
                showError('올바른 이메일 주소를 입력해주세요.');
            }
        });
        
        // 엔터 키 처리
        subscribeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('⌨️ 엔터 키 입력됨');
                subscribeButton.click();
            }
        });
        
        console.log('✅ 구독 폼 이벤트 리스너 설정 완료');
    } else {
        console.log('❌ 구독 폼 요소를 찾을 수 없습니다');
    }
}

// 이메일 유효성 검사
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 구독 처리
async function handleSubscribe(email) {
    // 로딩 상태 표시
    const subscribeButton = document.querySelector('.subscribe-button');
    const originalText = subscribeButton.textContent;
    subscribeButton.textContent = '구독 중...';
    subscribeButton.disabled = true;
    
    try {
        // 서버에 구독자 추가
        const data = await addSubscriberToServer(email);
        
        // 성공 메시지 표시
        showSuccess(data.message || '구독이 완료되었습니다!');
        
        // 폼 초기화
        document.querySelector('.subscribe-input').value = '';
        
    } catch (error) {
        console.error('구독 처리 오류:', error);
        showError(error.message || '구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        // 버튼 상태 복원
        subscribeButton.textContent = originalText;
        subscribeButton.disabled = false;
    }
}

// 구독 팝업 동적 생성 및 초기화
function initializeSubscribePopup() {
    const subscribeButtons = document.querySelectorAll('.cta-button, .mobile-subscribe-btn, .subscribe-button');
    
    console.log('🔧 구독 팝업 초기화 시작');
    console.log('📋 찾은 구독 버튼 수:', subscribeButtons.length);
    
    // 팝업이 없으면 동적으로 생성
    let subscribePopup = document.getElementById('subscribePopup');
    if (!subscribePopup) {
        console.log('📋 구독 팝업 요소가 없어서 동적 생성 중...');
        createSubscribePopup();
        subscribePopup = document.getElementById('subscribePopup');
    }
    
    // 구독 버튼 클릭 시 팝업 열기
    subscribeButtons.forEach((button, index) => {
        console.log(`🔗 구독 버튼 ${index + 1} 이벤트 리스너 추가`);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 구독 버튼 클릭됨!');
            openSubscribePopup();
        });
    });
    
    // 팝업 이벤트 리스너 설정
    setupPopupEventListeners();
}

// 구독 팝업 HTML 동적 생성
function createSubscribePopup() {
    const popupHTML = `
        <div class="subscribe-popup-overlay" id="subscribePopup">
            <div class="subscribe-popup-container">
                <div class="subscribe-popup-header">
                    <h2 class="subscribe-popup-title">콘텐츠 구독하기</h2>
                    <button class="subscribe-popup-close" id="closeSubscribePopup" aria-label="팝업 닫기">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="subscribe-popup-content">
                    <div class="subscribe-hero">
                        <div class="subscribe-hero-image">
                            <img src="asset/lightbulb_3d.png" alt="혁신적인 아이디어" class="hero-lightbulb">
                        </div>
                        <div class="subscribe-hero-content">
                            <h3 class="subscribe-hero-title">최신 기술 인사이트를 받아보세요</h3>
                            <p class="subscribe-hero-description">
                                AI, 클라우드, 보안 등 최신 기술 트렌드와<br>
                                실무 노하우를 이메일로 받아보세요.
                            </p>
                        </div>
                    </div>
                    
                    <div class="subscribe-form-section">
                        <form class="subscribe-popup-form" id="subscribePopupForm">
                            <div class="subscribe-input-group">
                                <input 
                                    type="email" 
                                    class="subscribe-popup-input" 
                                    id="subscribePopupEmail" 
                                    placeholder="이메일 주소를 입력해주세요"
                                    required
                                >
                                <button type="submit" class="subscribe-popup-button">
                                    구독하기
                                </button>
                            </div>
                            <p class="subscribe-privacy-text">
                                구독 신청 시 <a href="#" class="privacy-link">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // body에 팝업 추가
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    console.log('✅ 구독 팝업 동적 생성 완료');
}

// 팝업 이벤트 리스너 설정
function setupPopupEventListeners() {
    const subscribePopup = document.getElementById('subscribePopup');
    const closeSubscribePopup = document.getElementById('closeSubscribePopup');
    const subscribePopupForm = document.getElementById('subscribePopupForm');
    
    // 팝업 닫기 버튼
    if (closeSubscribePopup) {
        closeSubscribePopup.addEventListener('click', closeSubscribePopupHandler);
    }
    
    // 팝업 외부 클릭 시 닫기
    if (subscribePopup) {
        subscribePopup.addEventListener('click', function(e) {
            if (e.target === subscribePopup) {
                closeSubscribePopupHandler();
            }
        });
    }
    
    // ESC 키로 팝업 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && subscribePopup && subscribePopup.classList.contains('active')) {
            closeSubscribePopupHandler();
        }
    });
    
    // 구독 폼 제출 처리
    if (subscribePopupForm) {
        subscribePopupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSubscribePopup();
        });
    }
}

// 구독 팝업 열기
function openSubscribePopup() {
    console.log('🚀 구독 팝업 열기 시도');
    const subscribePopup = document.getElementById('subscribePopup');
    if (subscribePopup) {
        console.log('✅ 구독 팝업 요소 찾음, 활성화 중...');
        
        // 팝업이 열리기 전에 상태 초기화
        resetSubscribePopupState();
        
        subscribePopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
        
        // 이메일 입력 필드에 포커스
        const emailInput = document.getElementById('subscribePopupEmail');
        if (emailInput) {
            setTimeout(() => emailInput.focus(), 300);
            console.log('📧 이메일 입력 필드 포커스 설정');
        }
        
        console.log('🎉 구독 팝업 열기 완료');
    } else {
        console.error('❌ 구독 팝업 요소를 찾을 수 없음');
    }
}

// 구독 팝업 닫기
function closeSubscribePopupHandler() {
    const subscribePopup = document.getElementById('subscribePopup');
    if (subscribePopup) {
        subscribePopup.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복원
        
        // 폼 초기화
        const form = document.getElementById('subscribePopupForm');
        if (form) {
            form.reset();
        }
        
        // 상태 초기화는 다음에 팝업이 열릴 때 수행
    }
}

// 구독 팝업 폼 처리
function handleSubscribePopup() {
    const emailInput = document.getElementById('subscribePopupEmail');
    const submitButton = document.querySelector('.subscribe-popup-button');
    const email = emailInput.value.trim();
    
    if (!validateEmail(email)) {
        showPopupError('올바른 이메일 주소를 입력해주세요.');
        return;
    }
    
    // 로딩 상태
    const originalText = submitButton.textContent;
    submitButton.textContent = '구독 중...';
    submitButton.disabled = true;
    
    // 서버에 구독자 추가
    addSubscriberToServer(email).then((data) => {
        showSubscribeSuccess(data.message);
    }).catch((error) => {
        console.error('구독 처리 오류:', error);
        showPopupError(error.message || '구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// 서버에 구독자 추가
async function addSubscriberToServer(email) {
    try {
        const response = await fetch('https://192.168.0.15:8443/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '구독 처리 중 오류가 발생했습니다.');
        }
        
        return data;
    } catch (error) {
        console.error('서버 요청 오류:', error);
        throw error;
    }
}

// 구독 성공 상태 표시
function showSubscribeSuccess(message = '구독이 완료되었습니다!') {
    const popupContent = document.querySelector('.subscribe-popup-content');
    if (popupContent) {
        popupContent.innerHTML = `
            <div class="subscribe-success">
                <div class="subscribe-success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <h3 class="subscribe-success-title">${message}</h3>
                <p class="subscribe-success-message">
                    최신 기술 트렌드와 인사이트를 이메일로 받아보실 수 있습니다.<br>
                    첫 번째 뉴스레터를 곧 발송해드리겠습니다.
                </p>
            </div>
        `;
        
        // 3초 후 팝업 닫기
        setTimeout(() => {
            closeSubscribePopupHandler();
        }, 3000);
    }
}

// 팝업 에러 메시지 표시
function showPopupError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'popup-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #FEE2E2;
        color: #DC2626;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 16px;
        text-align: center;
    `;
    
    const form = document.getElementById('subscribePopupForm');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
        
        // 3초 후 에러 메시지 제거
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
}

// 구독 팝업 상태 초기화
function resetSubscribePopupState() {
    const popupContent = document.querySelector('.subscribe-popup-content');
    if (popupContent) {
        // 원래 내용으로 복원 (페이지 새로고침 없이)
        popupContent.innerHTML = `
            <div class="subscribe-hero">
                <div class="subscribe-hero-image">
                    <img src="asset/lightbulb_3d.png" alt="혁신적인 아이디어" class="hero-lightbulb">
                </div>
                <div class="subscribe-hero-content">
                    <h3 class="subscribe-hero-title">최신 기술 인사이트를 받아보세요</h3>
                    <p class="subscribe-hero-description">
                        AI, 클라우드, 보안 등 최신 기술 트렌드와<br>
                        실무 노하우를 이메일로 받아보세요.
                    </p>
                </div>
            </div>
            
            <div class="subscribe-form-section">
                <form class="subscribe-popup-form" id="subscribePopupForm">
                    <div class="subscribe-input-group">
                        <input 
                            type="email" 
                            class="subscribe-popup-input" 
                            id="subscribePopupEmail" 
                            placeholder="이메일 주소를 입력해주세요"
                            required
                        >
                        <button type="submit" class="subscribe-popup-button">
                            구독하기
                        </button>
                    </div>
                    <p class="subscribe-privacy-text">
                        구독 신청 시 <a href="#" class="privacy-link">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
                    </p>
                </form>
            </div>
        `;
        
        // 폼 이벤트 리스너 다시 추가
        const newForm = document.getElementById('subscribePopupForm');
        if (newForm) {
            newForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleSubscribePopup();
            });
        }
    }
}

// 에러 메시지 표시
function showError(message) {
    showMessage(message, 'error');
}

// 성공 메시지 표시
function showSuccess(message) {
    showMessage(message, 'success');
}

// 메시지 표시 함수
function showMessage(message, type) {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'error') {
        messageElement.style.backgroundColor = '#ff4757';
    } else {
        messageElement.style.backgroundColor = '#2ed573';
    }
    
    document.body.appendChild(messageElement);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        messageElement.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    }, 3000);
}

// 드롭다운 메뉴 처리
window.initializeDropdownMenu = function() {
    const blogMenu = document.querySelector('.blog-menu');
    const blogDropdown = document.querySelector('.blog-dropdown');
    const arrowIcon = document.querySelector('.blog-menu .arrow-icon');
    
    console.log('🔧 드롭다운 초기화 시작:', {
        blogMenu: !!blogMenu,
        blogDropdown: !!blogDropdown,
        arrowIcon: !!arrowIcon
    });
    
    if (blogMenu && blogDropdown) {
        // 초기 드롭다운 위치 설정
        function setDropdownPosition() {
            const blogMenuRect = blogMenu.getBoundingClientRect();
            blogDropdown.style.left = (blogMenuRect.left + blogMenuRect.width - 191) + 'px';
            blogDropdown.style.top = '78px';
            blogDropdown.style.position = 'fixed';
            blogDropdown.style.zIndex = '1000';
        }
        
        // 페이지 로드 시 초기 위치 설정
        setDropdownPosition();
        
        // 윈도우 리사이즈 시 위치 재설정
        window.addEventListener('resize', setDropdownPosition);
        
        // 기존 이벤트 리스너 제거를 위한 플래그
        if (blogMenu._dropdownInitialized) {
            console.log('🔄 드롭다운 이미 초기화됨, 재초기화 중...');
            return;
        }
        
        // 강력한 이벤트 처리
        function handleBlogMenuClick(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔥 블로그 메뉴 클릭됨');
            
            // 드롭다운 토글
            const isActive = blogMenu.classList.contains('active');
            console.log('📊 현재 상태:', { isActive });
            
            if (isActive) {
                // 드롭다운 닫기
                blogMenu.classList.remove('active');
                blogDropdown.classList.remove('active');
                blogMenu.setAttribute('aria-expanded', 'false');
                console.log('❌ 드롭다운 닫힘');
            } else {
                // 드롭다운 열기 - 위치 미리 설정
                setDropdownPosition();
                
                blogMenu.classList.add('active');
                blogDropdown.classList.add('active');
                blogMenu.setAttribute('aria-expanded', 'true');
                console.log('✅ 드롭다운 열림');
            }
            
            return false;
        }
        
        // 단일 이벤트 리스너만 등록
        blogMenu.addEventListener('click', handleBlogMenuClick, true);
        
        // 드롭다운 외부 클릭 시 닫기 (지연 실행으로 변경)
        document.addEventListener('click', function(e) {
            // 드롭다운이 열려있을 때만 실행
            if (blogMenu.classList.contains('active')) {
                if (!blogMenu.contains(e.target) && !blogDropdown.contains(e.target)) {
                    blogMenu.classList.remove('active');
                    blogDropdown.classList.remove('active');
                    blogMenu.setAttribute('aria-expanded', 'false');
                    console.log('❌ 외부 클릭으로 드롭다운 닫힘');
                }
            }
        });
        
        // ESC 키로 드롭다운 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                blogMenu.classList.remove('active');
                blogDropdown.classList.remove('active');
                blogMenu.setAttribute('aria-expanded', 'false');
                console.log('❌ ESC 키로 드롭다운 닫힘');
            }
        });
        
        // 초기화 완료 플래그 설정
        blogMenu._dropdownInitialized = true;
        
        console.log('✅ 드롭다운 초기화 완료');
    } else {
        console.error('❌ 드롭다운 요소들을 찾을 수 없음');
    }
}

// 부드러운 스크롤 처리
function initializeSmoothScroll() {
    // "Back to top" 링크들에 부드러운 스크롤 적용
    const backToTopLinks = document.querySelectorAll('.footer-link[href="#"]');
    backToTopLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// 카드 호버 효과 강화 (post-card 제외)
function initializeCardEffects() {
    // writer-card hover 효과 비활성화
    console.log('Card effects disabled');
}

// 이미지 지연 로딩
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 검색 기능 (향후 확장용)
function initializeSearch() {
    // 검색 기능 구현 예정
    console.log('Search functionality ready for implementation');
}

// 카테고리 필터링 (향후 확장용)
function filterByCategory(category) {
    // 카테고리별 콘텐츠 필터링 로직
    console.log('Filtering by category:', category);
}

// 페이지 로드 완료 후 추가 초기화
window.addEventListener('load', function() {
    // 카드 효과 초기화
    initializeCardEffects();
    
    // 지연 로딩 초기화
    initializeLazyLoading();
    
    // 검색 기능 초기화
    initializeSearch();
    
    // 페이지 로드 완료 표시
    document.body.classList.add('loaded');
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .header {
        transition: transform 0.3s ease;
    }
    

    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(style);

// Back to top 버튼 처리
function initializeBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 햄버거 메뉴 처리
function initializeHamburgerMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const body = document.body;
    
    if (hamburgerBtn && mobileMenuOverlay && mobileMenuClose) {
        // 햄버거 버튼 클릭 시 메뉴 열기
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            mobileMenuOverlay.classList.add('active');
            body.style.overflow = 'hidden'; // 스크롤 방지
        });
        
        // 닫기 버튼 클릭 시 메뉴 닫기
        mobileMenuClose.addEventListener('click', function() {
            closeMobileMenu();
        });
        
        // 오버레이 클릭 시 메뉴 닫기
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                closeMobileMenu();
            }
        });
        
        // ESC 키로 메뉴 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // 메뉴 닫기 함수
        function closeMobileMenu() {
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = ''; // 스크롤 복원
        }
    }
} 

// 페이지 로드 시 Firebase 데이터 로드
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Firebase 데이터 로드 시작...');
    
    try {
        // 최신 포스트 로드
        await loadLatestPosts();
        
        // 카테고리별 포스트 로드
        await loadCategoryPosts();
        
        console.log('✅ Firebase 데이터 로드 완료');
    } catch (error) {
        console.error('❌ Firebase 데이터 로드 오류:', error);
    }
});

// 페이지가 완전히 로드된 후에도 실행
window.addEventListener('load', async function() {
    console.log('🔄 페이지 완전 로드 후 Firebase 데이터 재로드...');
    
    try {
        // 최신 포스트 로드
        await loadLatestPosts();
        
        // 카테고리별 포스트 로드
        await loadCategoryPosts();
        
        console.log('✅ 페이지 완전 로드 후 Firebase 데이터 로드 완료');
    } catch (error) {
        console.error('❌ 페이지 완전 로드 후 Firebase 데이터 로드 오류:', error);
    }
});

// 최신 포스트 로드 함수
async function loadLatestPosts() {
    try {
        console.log('📝 최신 포스트 로드 시작...');
        
        const posts = await window.blogDB.getPosts({
            status: 'published',
            orderBy: 'publishedAt',
            orderDirection: 'desc',
            limit: 6
        });

        console.log('📊 로드된 포스트 수:', posts.length);
        console.log('📋 포스트 목록:', posts);

        const latestPostsContainer = document.querySelector('.recent-posts .posts-grid');
        console.log('🎯 포스트 컨테이너 찾음:', latestPostsContainer);
        
        if (latestPostsContainer && posts.length > 0) {
            const postsHTML = posts.map(post => `
                <a href="article-detail.html?id=${post.id}" class="post-card-link">
                    <article class="post-card">
                        <div class="post-image">
                            <img src="${post.heroImage || 'image/basic_4-3_1.jpg'}" alt="${post.title}">
                        </div>
                        <div class="post-content">
                            <span class="post-category">${getCategoryName(post.categoryId)}</span>
                            <h4 class="post-title">${post.title}</h4>
                            <div class="post-meta">
                                <span class="post-author">${post.authorName || 'Admin'}</span>
                                <span class="post-dot"></span>
                                <span class="post-date">${formatDate(post.publishedAt)}</span>
                            </div>
                        </div>
                    </article>
                </a>
            `).join('');
            
            console.log('🎨 생성된 HTML:', postsHTML);
            latestPostsContainer.innerHTML = postsHTML;
            console.log('✅ 최신 포스트 HTML 업데이트 완료');
        } else {
            console.log('⚠️ 포스트 컨테이너를 찾을 수 없거나 포스트가 없습니다.');
        }
    } catch (error) {
        console.error('❌ 최신 포스트 로드 오류:', error);
    }
}

// 카테고리별 포스트 로드 함수
async function loadCategoryPosts() {
    try {
        console.log('📂 카테고리별 포스트 로드 시작...');
        
        const categories = await window.blogDB.getCategories();
        console.log('📊 로드된 카테고리 수:', categories.length);
        console.log('📋 카테고리 목록:', categories);
        
        for (const category of categories) {
            console.log(`📁 카테고리 "${category.name}" 처리 중...`);
            
            const posts = await window.blogDB.getPostsByCategory(category.id);
            console.log(`📝 카테고리 "${category.name}"의 포스트 수:`, posts.length);
            
            const categoryContainer = document.querySelector(`[data-category="${category.id}"]`);
            console.log(`🎯 카테고리 컨테이너 찾음:`, categoryContainer);
            
            if (categoryContainer && posts.length > 0) {
                const postsHTML = posts.map(post => `
                    <a href="article-detail.html?id=${post.id}" class="highlight-post-link">
                        <article class="highlight-post">
                            <div class="highlight-content">
                                <span class="post-category">${category.name}</span>
                                <h4 class="post-title">${post.title}</h4>
                                <p class="post-excerpt">${post.excerpt || ''}</p>
                                <div class="post-meta">
                                    <span class="post-author">${post.authorName || 'Admin'}</span>
                                    <span class="post-dot"></span>
                                    <span class="post-date">${formatDate(post.publishedAt)}</span>
                                </div>
                            </div>
                            <div class="highlight-image">
                                <img src="${post.heroImage || 'image/basic_4-3_1.jpg'}" alt="${post.title}">
                            </div>
                        </article>
                    </a>
                `).join('');
                
                console.log(`🎨 카테고리 "${category.name}" HTML 생성 완료`);
                categoryContainer.innerHTML = postsHTML;
                console.log(`✅ 카테고리 "${category.name}" HTML 업데이트 완료`);
            } else {
                console.log(`⚠️ 카테고리 "${category.name}" 컨테이너를 찾을 수 없거나 포스트가 없습니다.`);
            }
        }
        
        console.log('✅ 카테고리별 포스트 로드 완료');
    } catch (error) {
        console.error('❌ 카테고리별 포스트 로드 오류:', error);
    }
}

// 카테고리명 가져오기 함수
function getCategoryName(categoryId) {
    const categoryMap = {
        'ai-machine-learning': 'AI & machine learning',
        'cybersecurity': 'Cybersecurity',
        'cloud-computing': 'Cloud computing',
        'data-analytics': 'Data & analytics',
        'team': 'Team'
    };
    return categoryMap[categoryId] || '미분류';
}

// 날짜 포맷 함수
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 검색 기능 초기화
function initializeSearchOverlay() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchCloseBtn = document.querySelector('.search-close-btn');
    const searchInput = document.querySelector('.search-input');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // 스크롤 방지
            setTimeout(() => searchInput?.focus(), 100);
        });
    }

    if (searchCloseBtn && searchOverlay) {
        searchCloseBtn.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = ''; // 스크롤 복원
        });
    }

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 검색 오버레이 클릭 시 닫기
    if (searchOverlay) {
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// 전역 함수 노출 (모듈 환경에서 사용하기 위해)
window.initializeScrollEffects = initializeScrollEffects;
window.initializeSmoothScroll = initializeSmoothScroll;
window.initializeDropdownMenu = initializeDropdownMenu;
window.initializeHamburgerMenu = initializeHamburgerMenu;
window.initializeBackToTop = initializeBackToTop;
window.initializeSubscribePopup = initializeSubscribePopup;
window.initializeSearchOverlay = initializeSearchOverlay;

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM 로드 완료, 초기화 시작...');
    
    // 검색 기능 초기화
    initializeSearchOverlay();
    
    // 구독 팝업 초기화
    initializeSubscribePopup();
    
    // 스크롤 효과 초기화
    initializeScrollEffects();
    
    // 드롭다운 메뉴 초기화
    initializeDropdownMenu();
    
    // 햄버거 메뉴 초기화
    initializeHamburgerMenu();
    
    // 백투탑 버튼 초기화
    initializeBackToTop();
    
    console.log('✅ 모든 초기화 완료');
});

 