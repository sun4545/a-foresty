// a.foresty News list 컴포넌트 JavaScript

class NewsList {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      image: '',
      title: '',
      date: '',
      source: '',
      category: '',
      size: 'default', // 'small' | 'default' | 'large'
      link: '',
      onTitleClick: null,
      onImageClick: null,
      onNewsClick: null,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  // News list 렌더링
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.className = `news-list ${this.getSizeClass()}`;
    
    // 이미지 설정
    if (this.options.image) {
      this.container.style.setProperty('--news-image', `url('${this.options.image}')`);
    }
    
    // News list 구조 생성
    this.container.innerHTML = `
      <div class="news-list__image-container">
        <div class="news-list__image" style="background-image: var(--news-image, url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'));"></div>
        ${this.options.category ? `<div class="news-list__category">${this.options.category}</div>` : ''}
      </div>
      <div class="news-list__text">
        <h3 class="news-list__title">${this.options.title || '숲의 본질을 담은 도시의 쉼표'}</h3>
        <div class="news-list__meta">
          <span class="news-list__date">${this.options.date || '2025.09.18'}</span>
          <span class="news-list__source">${this.options.source || '조선비즈'}</span>
        </div>
      </div>
    `;
  }
  
  // 사이즈 클래스 반환
  getSizeClass() {
    return this.options.size !== 'default' ? `news-list--${this.options.size}` : '';
  }
  
  // 이벤트 바인딩
  bindEvents() {
    if (!this.container) return;
    
    // 제목 클릭 이벤트
    const titleElement = this.container.querySelector('.news-list__title');
    if (titleElement) {
      titleElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleTitleClick();
      });
    }
    
    // 이미지 클릭 이벤트
    const imageElement = this.container.querySelector('.news-list__image');
    if (imageElement) {
      imageElement.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleImageClick();
      });
    }
    
    // 전체 뉴스 클릭 이벤트
    this.container.addEventListener('click', (e) => {
      if (!e.target.closest('.news-list__title') && !e.target.closest('.news-list__image')) {
        this.handleNewsClick();
      }
    });
    
    // 키보드 이벤트
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleNewsClick();
      }
    });
    
    // 호버 이벤트
    this.container.addEventListener('mouseenter', () => {
      this.handleHoverEnter();
    });
    
    this.container.addEventListener('mouseleave', () => {
      this.handleHoverLeave();
    });
  }
  
  // 제목 클릭 처리
  handleTitleClick() {
    if (this.options.onTitleClick) {
      this.options.onTitleClick(this.options);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('newsTitleClick', {
      detail: { news: this.options }
    }));
  }
  
  // 이미지 클릭 처리
  handleImageClick() {
    if (this.options.onImageClick) {
      this.options.onImageClick(this.options);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('newsImageClick', {
      detail: { news: this.options }
    }));
  }
  
  // 뉴스 클릭 처리
  handleNewsClick() {
    if (this.options.onNewsClick) {
      this.options.onNewsClick(this.options);
    }
    
    // 링크가 있으면 이동
    if (this.options.link) {
      window.open(this.options.link, '_blank');
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('newsClick', {
      detail: { news: this.options }
    }));
  }
  
  // 호버 진입 처리
  handleHoverEnter() {
    this.container.classList.add('news-list--hover');
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('newsHoverEnter', {
      detail: { news: this.options }
    }));
  }
  
  // 호버 벗어남 처리
  handleHoverLeave() {
    this.container.classList.remove('news-list--hover');
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('newsHoverLeave', {
      detail: { news: this.options }
    }));
  }
  
  // 이미지 업데이트
  updateImage(imageUrl) {
    this.options.image = imageUrl;
    this.container.style.setProperty('--news-image', `url('${imageUrl}')`);
    
    const imageElement = this.container.querySelector('.news-list__image');
    if (imageElement) {
      imageElement.style.backgroundImage = `url('${imageUrl}')`;
    }
  }
  
  // 제목 업데이트
  updateTitle(title) {
    this.options.title = title;
    
    const titleElement = this.container.querySelector('.news-list__title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }
  
  // 날짜 업데이트
  updateDate(date) {
    this.options.date = date;
    
    const dateElement = this.container.querySelector('.news-list__date');
    if (dateElement) {
      dateElement.textContent = date;
    }
  }
  
  // 출처 업데이트
  updateSource(source) {
    this.options.source = source;
    
    const sourceElement = this.container.querySelector('.news-list__source');
    if (sourceElement) {
      sourceElement.textContent = source;
    }
  }
  
  // 카테고리 업데이트
  updateCategory(category) {
    this.options.category = category;
    
    let categoryElement = this.container.querySelector('.news-list__category');
    if (category) {
      if (!categoryElement) {
        const imageContainer = this.container.querySelector('.news-list__image-container');
        if (imageContainer) {
          imageContainer.insertAdjacentHTML('beforeend', `<div class="news-list__category">${category}</div>`);
        }
      } else {
        categoryElement.textContent = category;
      }
    } else if (categoryElement) {
      categoryElement.remove();
    }
  }
  
  // 링크 업데이트
  updateLink(link) {
    this.options.link = link;
  }
  
  // 사이즈 업데이트
  updateSize(size) {
    this.options.size = size;
    this.container.className = `news-list ${this.getSizeClass()}`;
  }
  
  // 뉴스 데이터 업데이트
  updateNews(newsData) {
    this.options = { ...this.options, ...newsData };
    this.render();
    this.bindEvents();
  }
  
  // 현재 뉴스 데이터 반환
  getNewsData() {
    return { ...this.options };
  }
}

// 전역 News List 초기화 함수
function initNewsList() {
  // data-news 속성이 있는 모든 요소 초기화
  const newsElements = document.querySelectorAll('[data-news]');
  
  newsElements.forEach(element => {
    const image = element.getAttribute('data-image') || '';
    const title = element.getAttribute('data-title') || '';
    const date = element.getAttribute('data-date') || '';
    const source = element.getAttribute('data-source') || '';
    const category = element.getAttribute('data-category') || '';
    const size = element.getAttribute('data-size') || 'default';
    const link = element.getAttribute('data-link') || '';
    
    new NewsList(element, {
      image: image,
      title: title,
      date: date,
      source: source,
      category: category,
      size: size,
      link: link,
      onTitleClick: (news) => {
        console.log('제목 클릭:', news.title);
      },
      onImageClick: (news) => {
        console.log('이미지 클릭:', news.title);
      },
      onNewsClick: (news) => {
        console.log('뉴스 클릭:', news.title);
      }
    });
  });
}

// DOM이 로드된 후 News List 초기화
document.addEventListener('DOMContentLoaded', initNewsList);

// 전역에서 사용할 수 있도록 export
window.NewsList = NewsList;
