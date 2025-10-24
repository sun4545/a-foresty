/**
 * Article Detail Page JavaScript
 * Firebase Realtime Database에서 게시글 데이터를 로드하고 표시하는 스크립트
 */

class ArticleDetailPage {
    constructor() {
        this.blogDB = null;
        this.currentPost = null;
        this.init();
    }

    async init() {
        // Firebase 초기화 대기
        await this.waitForFirebase();
        
        // URL에서 게시글 ID 가져오기
        const postId = this.getPostIdFromURL();
        
        if (postId) {
            // 특정 게시글 로드
            await this.loadPost(postId);
        } else {
            // 샘플 데이터로 기본 게시글 표시
            await this.loadSamplePost();
        }
        
        // 관련 게시글 로드
        await this.loadRelatedPosts();
        
        // 조회수 증가
        if (postId) {
            await this.incrementViewCount(postId);
        }
    }

    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (window.blogDB && window.firebaseDB) {
                    this.blogDB = window.blogDB;
                    resolve();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    getPostIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadPost(postId) {
        try {
            const post = await this.blogDB.getPost(postId);
            if (post) {
                this.currentPost = post;
                this.renderPost(post);
            } else {
                console.error('Post not found:', postId);
                await this.loadSamplePost();
            }
        } catch (error) {
            console.error('Error loading post:', error);
            await this.loadSamplePost();
        }
    }

    async loadSamplePost() {
        // 샘플 게시글 데이터
        const samplePost = {
            id: 'sample-1',
            title: '오늘날의 기업이 보안 전략을 근본적으로 재정의해야 하는 이유',
            category: 'Cybersecurity',
            author: {
                name: '김소피',
                avatar: 'image/profile1.png'
            },
            publishedAt: new Date('2025-06-07').toISOString(),
            heroImage: 'image/image1.jpg',
            content: `
                <p class="article-content-paragraph">
                    오랜 기간 동안 대부분의 기업은 '내부는 신뢰하고, 외부는 차단한다'는 경계 기반 보안 모델을 중심으로 IT 인프라를 구축해왔다. 하지만 원격 근무의 일상화, 클라우드 사용의 확산, 그리고 SaaS 환경의 확대는 더 이상 이러한 모델이 유효하지 않음을 증명하고 있다. 네트워크 내부라고 해서 반드시 안전하다는 보장은 없으며, 해커는 한 번의 침투만으로도 내부 전체에 접근할 수 있는 시대가 되었다.
                </p>

                <h2 class="article-content-heading">제로 트러스트란 무엇인가?</h2>

                <p class="article-content-paragraph">
                    '절대 신뢰하지 말고 항상 검증하라'는 원칙에 기반한 제로 트러스트(Zero Trust)는 사용자, 기기, 네트워크 요청 등 모든 요소를 매 순간 검증함으로써 보안 체계를 강화하는 접근법이다. 접근 권한은 최소한으로 제한되며, 사용자의 위치나 역할이 아닌 정밀한 인증과 실시간 정책에 기반해 결정된다. 이 방식은 기존 보안 체계를 뛰어넘는 통제력을 제공하며, 내부자 위협이나 계정 탈취 시도에 효과적으로 대응할 수 있다.
                </p>

                <p class="article-content-paragraph">
                    사이버 공격의 피해는 점점 더 커지고 있으며, 특히 랜섬웨어와 공급망 공격은 기업의 명성과 생존을 위협하고 있다. 제로 트러스트는 단순한 기술 트렌드가 아니라, 보안의 새로운 표준이다. 특히 GDPR, ISO27001 등 각종 컴플라이언스 요구사항을 충족하기 위한 유연하고 확장 가능한 보안 프레임워크로 각광받고 있다.
                </p>

                <h2 class="article-content-heading">왜 지금 도입해야 하는가?</h2>

                <p class="article-content-paragraph">
                    디지털 전환이 가속화되면서 기업의 보안 위험도 함께 증가하고 있다. 클라우드 서비스, 모바일 기기, IoT 기기 등 다양한 접점이 생기면서 공격 표면이 확대되었고, 이는 전통적인 보안 모델로는 대응하기 어려운 상황이다. 제로 트러스트는 이러한 새로운 환경에 최적화된 보안 접근법으로, 기업이 디지털 전환을 안전하게 진행할 수 있도록 지원한다.
                </p>
            `,
            viewCount: 1250,
            excerpt: '오랜 기간 동안 대부분의 기업은 경계 기반 보안 모델을 중심으로 IT 인프라를 구축해왔다. 하지만 원격 근무의 일상화, 클라우드 사용의 확산, 그리고 SaaS 환경의 확대는 더 이상 이러한 모델이 유효하지 않음을 증명하고 있다.'
        };

        this.currentPost = samplePost;
        this.renderPost(samplePost);
    }

    renderPost(post) {
        // 페이지 제목 업데이트
        document.title = `${post.title} - Technova Place`;

        // 카테고리 태그 업데이트
        const categoryTag = document.querySelector('.article-category-tag');
        if (categoryTag) {
            categoryTag.textContent = post.category;
        }

        // 게시글 제목 업데이트
        const title = document.querySelector('.article-main-title');
        if (title) {
            title.textContent = post.title;
        }

        // 작성자 정보 업데이트
        const authorName = document.querySelector('.author-name');
        const authorImage = document.querySelector('.author-image');
        if (authorName && post.author) {
            authorName.textContent = post.author.name;
        }
        if (authorImage && post.author) {
            authorImage.src = post.author.avatar;
            authorImage.alt = post.author.name;
        }

        // 게시일 업데이트
        const publishDate = document.querySelector('.article-date');
        if (publishDate && post.publishedAt) {
            const date = new Date(post.publishedAt);
            publishDate.textContent = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
        }

        // 히어로 이미지 업데이트
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && post.heroImage) {
            heroImage.src = post.heroImage;
            heroImage.alt = post.title;
        }

        // 게시글 내용 업데이트
        const articleNote = document.querySelector('.article-note');
        if (articleNote && post.content) {
            articleNote.innerHTML = post.content;
        }

        // 조회수 표시 (옵션)
        this.displayViewCount(post.viewCount);
    }

    displayViewCount(viewCount) {
        // 조회수를 표시할 요소가 있다면 업데이트
        const viewCountElement = document.querySelector('.article-view-count');
        if (viewCountElement && viewCount) {
            viewCountElement.textContent = `${viewCount.toLocaleString()} views`;
        }
    }

    async loadRelatedPosts() {
        try {
            // 같은 카테고리의 다른 게시글들 로드
            const relatedPosts = await this.blogDB.getPosts({
                category: this.currentPost?.category,
                limit: 3
            });

            // 현재 게시글 제외
            const filteredPosts = relatedPosts.filter(post => post.id !== this.currentPost?.id);
            
            this.renderRelatedPosts(filteredPosts);
        } catch (error) {
            console.error('Error loading related posts:', error);
            this.renderSampleRelatedPosts();
        }
    }

    renderRelatedPosts(posts) {
        const relatedArticlesContainer = document.querySelector('.related-articles');
        if (!relatedArticlesContainer) return;

        const relatedArticlesHTML = posts.map(post => `
            <a href="article-detail.html?id=${post.id}" class="related-article">
                <div class="related-article-image">
                    <img src="${post.heroImage || 'https://via.placeholder.com/380x285'}" alt="${post.category}">
                </div>
                <div class="related-article-content">
                    <div class="related-article-info">
                        <span class="related-article-category">${post.category}</span>
                        <h3 class="related-article-title">${post.title}</h3>
                    </div>
                    <div class="related-article-meta">
                        <span class="related-article-author">${post.author?.name || 'Unknown'}</span>
                        <span class="post-dot"></span>
                        <span class="related-article-date">${new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </a>
        `).join('');

        relatedArticlesContainer.innerHTML = relatedArticlesHTML;
    }

    renderSampleRelatedPosts() {
        // 샘플 관련 게시글 데이터
        const sampleRelatedPosts = [
            {
                id: 'related-1',
                title: '데이터 레이크 대 데이터 웨어하우스 : 과연 누가 승자일까',
                category: 'Data & analytics',
                author: { name: '김가람' },
                publishedAt: new Date('2025-06-07').toISOString(),
                heroImage: 'image/basic_4-3_1.jpg'
            },
            {
                id: 'related-2',
                title: '멀티 클라우드 전략 완전 해부',
                category: 'Cloud computing',
                author: { name: '김가람' },
                publishedAt: new Date('2025-06-07').toISOString(),
                heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=380&h=285&fit=crop'
            },
            {
                id: 'related-3',
                title: '금전적 보상없이, 이벤트 바이럴이 가능할까?',
                category: 'Team',
                author: { name: '테디킴' },
                publishedAt: new Date('2025-06-07').toISOString(),
                heroImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=380&h=285&fit=crop'
            }
        ];

        this.renderRelatedPosts(sampleRelatedPosts);
    }

    async incrementViewCount(postId) {
        try {
            await this.blogDB.incrementViewCount(postId);
        } catch (error) {
            console.error('Error incrementing view count:', error);
        }
    }
}

// DOM이 로드된 후 게시글 상세 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    new ArticleDetailPage();
    
    // script.js의 스크롤 인터랙션 초기화
    if (window.initializeScrollEffects) {
        window.initializeScrollEffects();
        console.log('Article Detail: 스크롤 인터랙션 초기화됨');
    }
    
    if (window.initializeSmoothScroll) {
        window.initializeSmoothScroll();
        console.log('Article Detail: 부드러운 스크롤 초기화됨');
    }
    
    console.log('Article Detail: 페이지 초기화 완료');
});

