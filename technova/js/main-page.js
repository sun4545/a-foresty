/**
 * Main Page JavaScript
 * Firebase Realtime Database에서 게시글을 로드하고 메인 페이지에 표시하는 스크립트
 */

class MainPage {
    constructor() {
        this.blogDB = null;
        this.init();
    }

    async init() {
        // Firebase 초기화 대기
        await this.waitForFirebase();
        
        // 게시글 로드
        await this.loadPosts();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
    }

    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.blogDB && window.firebaseDB) {
                    this.blogDB = window.blogDB;
                    console.log('✅ 메인 페이지 Firebase 연결 완료');
                    resolve();
                } else {
                    console.log('⏳ Firebase 초기화 대기 중...');
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    async loadPosts() {
        try {
            // Firebase에서 게시글 데이터 가져오기
            const posts = await this.blogDB.getPosts({
                status: 'published',
                orderBy: 'publishedAt',
                orderDirection: 'desc',
                limit: 10
            });
            
            console.log('📖 메인 페이지 게시글 로드:', posts);
            
            // 게시글이 있으면 메인 페이지에 표시
            if (posts.length > 0) {
                this.renderPosts(posts);
            } else {
                console.log('📝 게시글이 없습니다. 어드민에서 게시글을 작성해주세요.');
            }
            
        } catch (error) {
            console.error('❌ 게시글 로드 실패:', error);
        }
    }

    renderPosts(posts) {
        // 메인 페이지의 게시글 섹션들에 Firebase 데이터 표시
        this.renderFeaturedPosts(posts);
        this.renderCategoryPosts(posts);
    }

    renderFeaturedPosts(posts) {
        // Featured Posts 섹션 업데이트
        const featuredSection = document.querySelector('.featured-posts');
        if (!featuredSection) return;

        const featuredPosts = posts.slice(0, 3); // 상위 3개 게시글
        
        featuredPosts.forEach((post, index) => {
            const postElement = featuredSection.querySelector(`.featured-post:nth-child(${index + 1})`);
            if (postElement) {
                // 제목 업데이트
                const titleElement = postElement.querySelector('.featured-post-title');
                if (titleElement) {
                    titleElement.textContent = post.title;
                }

                // 링크 업데이트
                const linkElement = postElement.querySelector('a');
                if (linkElement) {
                    linkElement.href = `article-detail.html?id=${post.id}`;
                }

                // 카테고리 업데이트
                const categoryElement = postElement.querySelector('.featured-post-category');
                if (categoryElement) {
                    categoryElement.textContent = post.category || 'General';
                }

                // 작성자 업데이트
                const authorElement = postElement.querySelector('.featured-post-author');
                if (authorElement && post.author) {
                    authorElement.textContent = post.author.name;
                }

                // 날짜 업데이트
                const dateElement = postElement.querySelector('.featured-post-date');
                if (dateElement && post.publishedAt) {
                    const date = new Date(post.publishedAt);
                    dateElement.textContent = date.toLocaleDateString();
                }

                // 이미지 업데이트 (있는 경우)
                const imageElement = postElement.querySelector('img');
                if (imageElement && post.heroImage) {
                    imageElement.src = post.heroImage;
                    imageElement.alt = post.title;
                }
            }
        });
    }

    renderCategoryPosts(posts) {
        // 카테고리별 게시글 섹션 업데이트
        const categorySections = document.querySelectorAll('.highlight-posts');
        
        categorySections.forEach(section => {
            const category = section.getAttribute('data-category');
            const categoryPosts = posts.filter(post => 
                post.category && post.category.toLowerCase().includes(category.toLowerCase())
            );

            if (categoryPosts.length > 0) {
                const postElements = section.querySelectorAll('.highlight-post');
                
                categoryPosts.slice(0, postElements.length).forEach((post, index) => {
                    const postElement = postElements[index];
                    if (postElement) {
                        // 제목 업데이트
                        const titleElement = postElement.querySelector('.highlight-post-title');
                        if (titleElement) {
                            titleElement.textContent = post.title;
                        }

                        // 링크 업데이트
                        const linkElement = postElement.querySelector('a');
                        if (linkElement) {
                            linkElement.href = `article-detail.html?id=${post.id}`;
                        }

                        // 카테고리 업데이트
                        const categoryElement = postElement.querySelector('.highlight-post-category');
                        if (categoryElement) {
                            categoryElement.textContent = post.category || 'General';
                        }

                        // 작성자 업데이트
                        const authorElement = postElement.querySelector('.highlight-post-author');
                        if (authorElement && post.author) {
                            authorElement.textContent = post.author.name;
                        }

                        // 날짜 업데이트
                        const dateElement = postElement.querySelector('.highlight-post-date');
                        if (dateElement && post.publishedAt) {
                            const date = new Date(post.publishedAt);
                            dateElement.textContent = date.toLocaleDateString();
                        }

                        // 이미지 업데이트 (있는 경우)
                        const imageElement = postElement.querySelector('img');
                        if (imageElement && post.heroImage) {
                            imageElement.src = post.heroImage;
                            imageElement.alt = post.title;
                        }
                    }
                });
            }
        });
    }

    setupEventListeners() {
        // 이벤트 리스너 설정 (필요시 추가)
    }
}

// DOM이 로드된 후 메인 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    new MainPage();
});
