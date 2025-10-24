/**
 * Category Page JavaScript
 * 서브메인 페이지들에서 Firebase Realtime Database에서 카테고리별 게시글을 로드하는 스크립트
 */

class CategoryPage {
    constructor() {
        this.blogDB = null;
        this.currentCategory = this.getCategoryFromURL();
        this.init();
    }

    async init() {
        // Firebase 초기화 대기
        await this.waitForFirebase();
        
        // 카테고리별 게시글 로드
        await this.loadCategoryPosts();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
    }

    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.blogDB && window.firebaseDB) {
                    this.blogDB = window.blogDB;
                    console.log('✅ 카테고리 페이지 Firebase 연결 완료');
                    resolve();
                } else {
                    console.log('⏳ Firebase 초기화 대기 중...');
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    getCategoryFromURL() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // 파일명에서 카테고리 추출
        const categoryMap = {
            'ai-machine-learning.html': 'AI & Machine Learning',
            'cybersecurity.html': 'Cybersecurity',
            'cloud-computing.html': 'Cloud Computing',
            'data-analytics.html': 'Data & Analytics',
            'team.html': 'Team'
        };
        
        return categoryMap[filename] || 'General';
    }

    async loadCategoryPosts() {
        try {
            // Firebase에서 모든 게시글 가져오기
            const allPosts = await this.blogDB.getPosts({
                status: 'published',
                orderBy: 'publishedAt',
                orderDirection: 'desc'
            });
            
            console.log('📖 카테고리 페이지 게시글 로드:', allPosts);
            
            // 현재 카테고리에 맞는 게시글 필터링
            const categoryPosts = allPosts.filter(post => {
                if (!post.category) return false;
                return post.category.toLowerCase().includes(this.currentCategory.toLowerCase()) ||
                       this.currentCategory.toLowerCase().includes(post.category.toLowerCase());
            });
            
            console.log(`📝 ${this.currentCategory} 카테고리 게시글:`, categoryPosts);
            
            // 게시글 렌더링
            this.renderCategoryPosts(categoryPosts);
            
        } catch (error) {
            console.error('❌ 카테고리 게시글 로드 실패:', error);
            this.renderSamplePosts();
        }
    }

    renderCategoryPosts(posts) {
        // 메인 게시글 그리드 업데이트
        this.updateMainPostsGrid(posts);
        
        // 추가 게시글 업데이트
        this.updateAdditionalPosts(posts);
        
        // 게시글 수 표시 업데이트
        this.updatePostCount(posts.length);
    }

    updateMainPostsGrid(posts) {
        const postsGrid = document.querySelector('.posts-grid');
        if (!postsGrid) return;

        if (posts.length === 0) {
            postsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <h3>아직 게시글이 없습니다</h3>
                    <p>${this.currentCategory} 카테고리의 첫 번째 게시글을 작성해보세요!</p>
                    <a href="/admin.html" class="cta-button" style="display: inline-block; margin-top: 20px;">
                        게시글 작성하기
                    </a>
                </div>
            `;
            return;
        }

        // 기존 게시글 카드들 업데이트
        const postCards = postsGrid.querySelectorAll('.post-card-link');
        const maxCards = Math.min(postCards.length, posts.length);
        
        for (let i = 0; i < maxCards; i++) {
            const post = posts[i];
            const card = postCards[i];
            
            // 제목 업데이트
            const titleElement = card.querySelector('.post-title');
            if (titleElement) {
                titleElement.textContent = post.title;
            }

            // 링크 업데이트
            card.href = `article-detail.html?id=${post.id}`;

            // 카테고리 업데이트
            const categoryElement = card.querySelector('.post-category');
            if (categoryElement) {
                categoryElement.textContent = post.category || this.currentCategory;
            }

            // 작성자 업데이트
            const authorElement = card.querySelector('.post-author');
            if (authorElement && post.author) {
                authorElement.textContent = post.author.name;
            }

            // 날짜 업데이트
            const dateElement = card.querySelector('.post-date');
            if (dateElement && post.publishedAt) {
                const date = new Date(post.publishedAt);
                dateElement.textContent = date.toLocaleDateString();
            }

            // 이미지 업데이트 (있는 경우)
            const imageElement = card.querySelector('img');
            if (imageElement && post.heroImage) {
                imageElement.src = post.heroImage;
                imageElement.alt = post.title;
            }

            // 요약 업데이트
            const excerptElement = card.querySelector('.post-excerpt');
            if (excerptElement && post.excerpt) {
                excerptElement.textContent = post.excerpt;
            }
        }
    }

    updateAdditionalPosts(posts) {
        const additionalPosts = document.getElementById('additionalPosts');
        if (!additionalPosts) return;

        // 추가 게시글들 업데이트 (메인 그리드 이후의 게시글들)
        const postCards = additionalPosts.querySelectorAll('.post-card-link');
        const startIndex = Math.min(posts.length, 6); // 메인 그리드에 6개 표시
        
        for (let i = 0; i < postCards.length && (startIndex + i) < posts.length; i++) {
            const post = posts[startIndex + i];
            const card = postCards[i];
            
            // 제목 업데이트
            const titleElement = card.querySelector('.post-title');
            if (titleElement) {
                titleElement.textContent = post.title;
            }

            // 링크 업데이트
            card.href = `article-detail.html?id=${post.id}`;

            // 카테고리 업데이트
            const categoryElement = card.querySelector('.post-category');
            if (categoryElement) {
                categoryElement.textContent = post.category || this.currentCategory;
            }

            // 작성자 업데이트
            const authorElement = card.querySelector('.post-author');
            if (authorElement && post.author) {
                authorElement.textContent = post.author.name;
            }

            // 날짜 업데이트
            const dateElement = card.querySelector('.post-date');
            if (dateElement && post.publishedAt) {
                const date = new Date(post.publishedAt);
                dateElement.textContent = date.toLocaleDateString();
            }

            // 이미지 업데이트 (있는 경우)
            const imageElement = card.querySelector('img');
            if (imageElement && post.heroImage) {
                imageElement.src = post.heroImage;
                imageElement.alt = post.title;
            }

            // 요약 업데이트
            const excerptElement = card.querySelector('.post-excerpt');
            if (excerptElement && post.excerpt) {
                excerptElement.textContent = post.excerpt;
            }
        }
    }

    updatePostCount(count) {
        // 페이지 제목이나 헤더에 게시글 수 표시
        const titleElement = document.querySelector('.page-title, h1');
        if (titleElement) {
            const currentText = titleElement.textContent;
            if (!currentText.includes('(')) {
                titleElement.textContent = `${currentText} (${count} posts)`;
            }
        }
    }

    renderSamplePosts() {
        console.log('📝 샘플 게시글 표시');
        // 샘플 데이터는 기존 HTML에 이미 있으므로 그대로 유지
    }

    setupEventListeners() {
        // Load More 버튼 기능
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const additionalPosts = document.getElementById('additionalPosts');
        const postsGrid = document.querySelector('.posts-grid');
        
        if (loadMoreBtn && additionalPosts && postsGrid) {
            loadMoreBtn.addEventListener('click', function() {
                // 추가 포스트들을 posts-grid에 추가
                const postsToAdd = additionalPosts.querySelectorAll('.post-card-link');
                postsToAdd.forEach(post => {
                    postsGrid.appendChild(post.cloneNode(true));
                });
                
                // 추가 포스트 영역 숨기기
                additionalPosts.style.display = 'none';
                
                // 버튼 숨기기
                loadMoreBtn.style.display = 'none';
            });
        }

        // 새로고침 버튼 (개발용)
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '🔄 새로고침';
        refreshBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 10px 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        refreshBtn.addEventListener('click', () => this.loadCategoryPosts());
        document.body.appendChild(refreshBtn);
    }
}

// DOM이 로드된 후 카테고리 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    new CategoryPage();
});

