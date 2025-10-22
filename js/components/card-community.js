// a.foresty Card/Community 컴포넌트 JavaScript

class CardCommunity {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      image: '',
      content: '',
      size: 'default', // 'small' | 'default' | 'large'
      state: 'default', // 'default' | 'click'
      onToggle: null,
      onExpand: null,
      onCollapse: null,
      ...options
    };
    
    this.isExpanded = this.options.state === 'click';
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  // Card 렌더링
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.className = `card-community ${this.getSizeClass()} ${this.getStateClass()}`;
    
    // 이미지 설정
    if (this.options.image) {
      this.container.style.setProperty('--card-image', `url('${this.options.image}')`);
    }
    
    // Card 구조 생성
    this.container.innerHTML = `
      <div class="card-community__image" style="background-image: var(--card-image, url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'));"></div>
      <div class="card-community__hover">
        <div class="card-community__text">
          <div class="card-community__content">
            ${this.options.content || '도심의 소음으로부터 벗어나 온전한 휴식을 누릴 수 있는 공간입니다. 인피니티 풀에서는 계절의 변화를 느끼며 여유로운 수영을, 프라이빗 사우나와 릴렉세이션 룸에서는 지친 몸의 피로를 완벽하게 해소할 수 있습니다.'}
          </div>
        </div>
        <div class="card-community__button-area">
          <button class="card-community__button" aria-label="${this.isExpanded ? '카드 축소' : '카드 확장'}">
            <div class="card-community__icon">
              <div class="card-community__icon-line card-community__icon-line--horizontal"></div>
              <div class="card-community__icon-line card-community__icon-line--vertical" style="visibility: ${this.isExpanded ? 'hidden' : 'visible'};"></div>
            </div>
          </button>
        </div>
      </div>
    `;
  }
  
  // 사이즈 클래스 반환
  getSizeClass() {
    return this.options.size !== 'default' ? `card-community--${this.options.size}` : '';
  }
  
  // 상태 클래스 반환
  getStateClass() {
    return this.isExpanded ? 'card-community--click' : 'card-community--default';
  }
  
  // 이벤트 바인딩
  bindEvents() {
    if (!this.container) return;
    
    // Card 클릭 이벤트
    this.container.addEventListener('click', (e) => {
      // 버튼 클릭 시에만 토글
      if (e.target.closest('.card-community__button')) {
        e.stopPropagation();
        this.toggle();
      }
    });
    
    // 키보드 이벤트
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
    
    // 호버 이벤트 (터치 디바이스 제외)
    if (!('ontouchstart' in window)) {
      this.container.addEventListener('mouseenter', () => {
        if (!this.isExpanded) {
          this.expand();
        }
      });
      
      this.container.addEventListener('mouseleave', () => {
        if (!this.isExpanded) {
          this.collapse();
        }
      });
    }
  }
  
  // Card 토글
  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }
  
  // Card 확장
  expand() {
    this.isExpanded = true;
    this.updateState();
    
    // 콜백 함수 실행
    if (this.options.onExpand) {
      this.options.onExpand();
    }
    
    if (this.options.onToggle) {
      this.options.onToggle(true);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('cardExpand', {
      detail: { expanded: true }
    }));
  }
  
  // Card 축소
  collapse() {
    this.isExpanded = false;
    this.updateState();
    
    // 콜백 함수 실행
    if (this.options.onCollapse) {
      this.options.onCollapse();
    }
    
    if (this.options.onToggle) {
      this.options.onToggle(false);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('cardCollapse', {
      detail: { expanded: false }
    }));
  }
  
  // 상태 업데이트
  updateState() {
    this.container.className = `card-community ${this.getSizeClass()} ${this.getStateClass()}`;
    
    const button = this.container.querySelector('.card-community__button');
    const verticalLine = this.container.querySelector('.card-community__icon-line--vertical');
    
    if (button) {
      button.setAttribute('aria-label', this.isExpanded ? '카드 축소' : '카드 확장');
    }
    
    if (verticalLine) {
      verticalLine.style.visibility = this.isExpanded ? 'hidden' : 'visible';
    }
  }
  
  // 이미지 업데이트
  updateImage(imageUrl) {
    this.options.image = imageUrl;
    this.container.style.setProperty('--card-image', `url('${imageUrl}')`);
    
    const imageElement = this.container.querySelector('.card-community__image');
    if (imageElement) {
      imageElement.style.backgroundImage = `url('${imageUrl}')`;
    }
  }
  
  // 콘텐츠 업데이트
  updateContent(content) {
    this.options.content = content;
    
    const contentElement = this.container.querySelector('.card-community__content');
    if (contentElement) {
      contentElement.textContent = content;
    }
  }
  
  // 사이즈 업데이트
  updateSize(size) {
    this.options.size = size;
    this.container.className = `card-community ${this.getSizeClass()} ${this.getStateClass()}`;
  }
  
  // 현재 상태 반환
  isCardExpanded() {
    return this.isExpanded;
  }
  
  // Card 강제 확장
  forceExpand() {
    this.isExpanded = true;
    this.updateState();
  }
  
  // Card 강제 축소
  forceCollapse() {
    this.isExpanded = false;
    this.updateState();
  }
}

// 전역 Card Community 초기화 함수
function initCardCommunity() {
  // data-card 속성이 있는 모든 요소 초기화
  const cardElements = document.querySelectorAll('[data-card]');
  
  cardElements.forEach(element => {
    const image = element.getAttribute('data-image') || '';
    const content = element.getAttribute('data-content') || '';
    const size = element.getAttribute('data-size') || 'default';
    const state = element.getAttribute('data-state') || 'default';
    
    new CardCommunity(element, {
      image: image,
      content: content,
      size: size,
      state: state,
      onToggle: (expanded) => {
        console.log(`카드 ${expanded ? '확장' : '축소'}`);
      }
    });
  });
}

// DOM이 로드된 후 Card Community 초기화
document.addEventListener('DOMContentLoaded', initCardCommunity);

// 전역에서 사용할 수 있도록 export
window.CardCommunity = CardCommunity;
