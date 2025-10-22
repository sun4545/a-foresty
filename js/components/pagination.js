// a.foresty Pagination 컴포넌트 JavaScript

class Pagination {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      totalPages: 5,
      currentPage: 1,
      onPageChange: null,
      theme: 'light', // 'light' | 'dark'
      size: 'default', // 'small' | 'default' | 'large'
      ...options
    };
    
    this.currentPage = this.options.currentPage;
    this.totalPages = this.options.totalPages;
    
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  // Pagination 렌더링
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.className = `pagination ${this.getThemeClass()} ${this.getSizeClass()}`;
    
    for (let i = 1; i <= this.totalPages; i++) {
      const dot = this.createDot(i);
      this.container.appendChild(dot);
    }
  }
  
  // Dot 요소 생성
  createDot(pageNumber) {
    const dot = document.createElement('div');
    dot.className = `pagination__dot ${pageNumber === this.currentPage ? 'pagination__dot--active' : 'pagination__dot--inactive'}`;
    dot.setAttribute('data-index', pageNumber - 1);
    dot.setAttribute('aria-label', `페이지 ${pageNumber}`);
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    
    return dot;
  }
  
  // 테마 클래스 반환
  getThemeClass() {
    return this.options.theme === 'dark' ? 'pagination--dark' : '';
  }
  
  // 사이즈 클래스 반환
  getSizeClass() {
    return this.options.size !== 'default' ? `pagination--${this.options.size}` : '';
  }
  
  // 이벤트 바인딩
  bindEvents() {
    if (!this.container) return;
    
    // Dot 클릭 이벤트
    this.container.addEventListener('click', (e) => {
      const dot = e.target.closest('.pagination__dot');
      if (dot) {
        const pageNumber = parseInt(dot.getAttribute('data-index')) + 1;
        this.goToPage(pageNumber);
      }
    });
    
    // 키보드 이벤트
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const dot = e.target.closest('.pagination__dot');
        if (dot) {
          const pageNumber = parseInt(dot.getAttribute('data-index')) + 1;
          this.goToPage(pageNumber);
        }
      }
      
      // 화살표 키 네비게이션
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        const newPage = Math.max(1, Math.min(this.totalPages, this.currentPage + direction));
        this.goToPage(newPage);
      }
    });
  }
  
  // 페이지 이동
  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.currentPage) {
      return;
    }
    
    this.currentPage = pageNumber;
    this.updateActiveDot();
    
    // 콜백 함수 실행
    if (this.options.onPageChange) {
      this.options.onPageChange(pageNumber);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('pageChange', {
      detail: { page: pageNumber, totalPages: this.totalPages }
    }));
  }
  
  // 활성 Dot 업데이트
  updateActiveDot() {
    const dots = this.container.querySelectorAll('.pagination__dot');
    
    dots.forEach((dot, index) => {
      const pageNumber = index + 1;
      if (pageNumber === this.currentPage) {
        dot.classList.remove('pagination__dot--inactive');
        dot.classList.add('pagination__dot--active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('pagination__dot--active');
        dot.classList.add('pagination__dot--inactive');
        dot.removeAttribute('aria-current');
      }
    });
  }
  
  // 다음 페이지
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  // 이전 페이지
  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  // 첫 페이지
  firstPage() {
    this.goToPage(1);
  }
  
  // 마지막 페이지
  lastPage() {
    this.goToPage(this.totalPages);
  }
  
  // 총 페이지 수 업데이트
  updateTotalPages(totalPages) {
    this.totalPages = totalPages;
    this.currentPage = Math.min(this.currentPage, totalPages);
    this.render();
    this.bindEvents();
  }
  
  // 현재 페이지 반환
  getCurrentPage() {
    return this.currentPage;
  }
  
  // 총 페이지 수 반환
  getTotalPages() {
    return this.totalPages;
  }
}

// 전역 Pagination 초기화 함수
function initPagination() {
  // data-pagination 속성이 있는 모든 요소 초기화
  const paginationElements = document.querySelectorAll('[data-pagination]');
  
  paginationElements.forEach(element => {
    const totalPages = parseInt(element.getAttribute('data-total-pages')) || 5;
    const currentPage = parseInt(element.getAttribute('data-current-page')) || 1;
    
    new Pagination(element, {
      totalPages: totalPages,
      currentPage: currentPage,
      onPageChange: (page) => {
        console.log(`페이지 ${page}로 이동`);
      }
    });
  });
}

// DOM이 로드된 후 Pagination 초기화
document.addEventListener('DOMContentLoaded', initPagination);

// 전역에서 사용할 수 있도록 export
window.Pagination = Pagination;
