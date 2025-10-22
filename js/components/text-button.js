// a.foresty Text button 컴포넌트 JavaScript

class TextButton {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      text: 'BACK TO TOP',
      theme: 'default', // 'default' | 'dark' | 'primary'
      size: 'default', // 'small' | 'default' | 'large'
      showLeftIcon: true,
      showRightIcon: true,
      disabled: false,
      onClick: null,
      onHover: null,
      onFocus: null,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  // Text button 렌더링
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.className = `text-button ${this.getThemeClass()} ${this.getSizeClass()}`;
    this.container.disabled = this.options.disabled;
    
    // Text button 구조 생성
    let html = '';
    
    // 왼쪽 아이콘
    if (this.options.showLeftIcon) {
      html += `
        <div class="text-button__icon ${this.options.showLeftIcon ? 'text-button__icon--visible' : ''}">
          <div class="text-button__icon-arrow"></div>
        </div>
      `;
    }
    
    // 텍스트
    html += `<span class="text-button__text">${this.options.text}</span>`;
    
    // 오른쪽 아이콘
    if (this.options.showRightIcon) {
      html += `
        <div class="text-button__icon-right">
          <div class="text-button__icon-right-arrow"></div>
        </div>
      `;
    }
    
    this.container.innerHTML = html;
  }
  
  // 테마 클래스 반환
  getThemeClass() {
    return this.options.theme !== 'default' ? `text-button--${this.options.theme}` : '';
  }
  
  // 사이즈 클래스 반환
  getSizeClass() {
    return this.options.size !== 'default' ? `text-button--${this.options.size}` : '';
  }
  
  // 이벤트 바인딩
  bindEvents() {
    if (!this.container) return;
    
    // 클릭 이벤트
    this.container.addEventListener('click', (e) => {
      if (!this.options.disabled) {
        this.handleClick();
      }
    });
    
    // 호버 이벤트
    this.container.addEventListener('mouseenter', () => {
      if (!this.options.disabled) {
        this.handleHover();
      }
    });
    
    this.container.addEventListener('mouseleave', () => {
      if (!this.options.disabled) {
        this.handleHoverLeave();
      }
    });
    
    // 포커스 이벤트
    this.container.addEventListener('focus', () => {
      if (!this.options.disabled) {
        this.handleFocus();
      }
    });
    
    this.container.addEventListener('blur', () => {
      if (!this.options.disabled) {
        this.handleBlur();
      }
    });
    
    // 키보드 이벤트
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!this.options.disabled) {
          this.handleClick();
        }
      }
    });
  }
  
  // 클릭 처리
  handleClick() {
    if (this.options.onClick) {
      this.options.onClick(this.options);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('textButtonClick', {
      detail: { button: this.options }
    }));
  }
  
  // 호버 처리
  handleHover() {
    if (this.options.onHover) {
      this.options.onHover(this.options);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('textButtonHover', {
      detail: { button: this.options }
    }));
  }
  
  // 호버 벗어남 처리
  handleHoverLeave() {
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('textButtonHoverLeave', {
      detail: { button: this.options }
    }));
  }
  
  // 포커스 처리
  handleFocus() {
    if (this.options.onFocus) {
      this.options.onFocus(this.options);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('textButtonFocus', {
      detail: { button: this.options }
    }));
  }
  
  // 포커스 벗어남 처리
  handleBlur() {
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('textButtonBlur', {
      detail: { button: this.options }
    }));
  }
  
  // 텍스트 업데이트
  updateText(text) {
    this.options.text = text;
    
    const textElement = this.container.querySelector('.text-button__text');
    if (textElement) {
      textElement.textContent = text;
    }
  }
  
  // 테마 업데이트
  updateTheme(theme) {
    this.options.theme = theme;
    this.container.className = `text-button ${this.getThemeClass()} ${this.getSizeClass()}`;
  }
  
  // 사이즈 업데이트
  updateSize(size) {
    this.options.size = size;
    this.container.className = `text-button ${this.getThemeClass()} ${this.getSizeClass()}`;
  }
  
  // 아이콘 표시/숨김
  updateIcons(showLeft, showRight) {
    this.options.showLeftIcon = showLeft;
    this.options.showRightIcon = showRight;
    this.render();
    this.bindEvents();
  }
  
  // 비활성화/활성화
  setDisabled(disabled) {
    this.options.disabled = disabled;
    this.container.disabled = disabled;
  }
  
  // 현재 상태 반환
  isDisabled() {
    return this.options.disabled;
  }
  
  // 버튼 데이터 반환
  getButtonData() {
    return { ...this.options };
  }
}

// 전역 Text Button 초기화 함수
function initTextButton() {
  // data-button 속성이 있는 모든 요소 초기화
  const buttonElements = document.querySelectorAll('[data-button]');
  
  buttonElements.forEach(element => {
    const text = element.getAttribute('data-text') || 'BACK TO TOP';
    const theme = element.getAttribute('data-theme') || 'default';
    const size = element.getAttribute('data-size') || 'default';
    const showLeftIcon = element.getAttribute('data-show-left-icon') !== 'false';
    const showRightIcon = element.getAttribute('data-show-right-icon') !== 'false';
    const disabled = element.hasAttribute('disabled');
    
    new TextButton(element, {
      text: text,
      theme: theme,
      size: size,
      showLeftIcon: showLeftIcon,
      showRightIcon: showRightIcon,
      disabled: disabled,
      onClick: (button) => {
        console.log('버튼 클릭:', button.text);
      },
      onHover: (button) => {
        console.log('버튼 호버:', button.text);
      },
      onFocus: (button) => {
        console.log('버튼 포커스:', button.text);
      }
    });
  });
}

// DOM이 로드된 후 Text Button 초기화
document.addEventListener('DOMContentLoaded', initTextButton);

// 전역에서 사용할 수 있도록 export
window.TextButton = TextButton;
