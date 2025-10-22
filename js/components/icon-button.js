// a.foresty Icon Button 컴포넌트 JavaScript

class IconButton {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      icon: 'plus', // 'plus' | 'floor'
      size: 'medium', // 'small' | 'medium' | 'large'
      theme: 'default', // 'default' | 'dark' | 'primary'
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
  
  // Icon Button 렌더링
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.className = `icon-button__item ${this.getSizeClass()} ${this.getThemeClass()} ${this.getIconClass()}`;
    this.container.disabled = this.options.disabled;
    
    // Icon Button 구조 생성
    let iconHtml = '';
    
    if (this.options.icon === 'plus') {
      iconHtml = `
        <div class="icon-button__icon">
          <div class="icon-button__icon-line icon-button__icon-line--horizontal"></div>
          <div class="icon-button__icon-line icon-button__icon-line--vertical"></div>
        </div>
      `;
    } else if (this.options.icon === 'floor') {
      iconHtml = `
        <div class="icon-button__icon">
          <div class="icon-button__icon-square"></div>
        </div>
      `;
    }
    
    this.container.innerHTML = iconHtml;
  }
  
  // 사이즈 클래스 반환
  getSizeClass() {
    return `icon-button--${this.options.size}`;
  }
  
  // 테마 클래스 반환
  getThemeClass() {
    return this.options.theme !== 'default' ? `icon-button--${this.options.theme}` : '';
  }
  
  // 아이콘 클래스 반환
  getIconClass() {
    return `icon-button--${this.options.icon}`;
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
    this.container.dispatchEvent(new CustomEvent('iconButtonClick', {
      detail: { button: this.options }
    }));
  }
  
  // 호버 처리
  handleHover() {
    if (this.options.onHover) {
      this.options.onHover(this.options);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('iconButtonHover', {
      detail: { button: this.options }
    }));
  }
  
  // 호버 벗어남 처리
  handleHoverLeave() {
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('iconButtonHoverLeave', {
      detail: { button: this.options }
    }));
  }
  
  // 포커스 처리
  handleFocus() {
    if (this.options.onFocus) {
      this.options.onFocus(this.options);
    }
    
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('iconButtonFocus', {
      detail: { button: this.options }
    }));
  }
  
  // 포커스 벗어남 처리
  handleBlur() {
    // 커스텀 이벤트 발생
    this.container.dispatchEvent(new CustomEvent('iconButtonBlur', {
      detail: { button: this.options }
    }));
  }
  
  // 아이콘 업데이트
  updateIcon(icon) {
    this.options.icon = icon;
    this.container.className = `icon-button__item ${this.getSizeClass()} ${this.getThemeClass()} ${this.getIconClass()}`;
    this.render();
    this.bindEvents();
  }
  
  // 사이즈 업데이트
  updateSize(size) {
    this.options.size = size;
    this.container.className = `icon-button__item ${this.getSizeClass()} ${this.getThemeClass()} ${this.getIconClass()}`;
  }
  
  // 테마 업데이트
  updateTheme(theme) {
    this.options.theme = theme;
    this.container.className = `icon-button__item ${this.getSizeClass()} ${this.getThemeClass()} ${this.getIconClass()}`;
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

// Icon Button 그룹 클래스
class IconButtonGroup {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      buttons: [],
      layout: 'horizontal', // 'horizontal' | 'vertical'
      spacing: 'normal', // 'compact' | 'normal'
      ...options
    };
    
    this.buttons = [];
    this.init();
  }
  
  init() {
    this.render();
    this.bindEvents();
  }
  
  // Icon Button 그룹 렌더링
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    this.container.className = `icon-button-group ${this.getLayoutClass()} ${this.getSpacingClass()}`;
    
    this.options.buttons.forEach((buttonOptions, index) => {
      const buttonElement = document.createElement('button');
      buttonElement.className = 'icon-button__item';
      buttonElement.setAttribute('data-icon-button', `group-button-${index}`);
      
      this.container.appendChild(buttonElement);
      
      const button = new IconButton(buttonElement, buttonOptions);
      this.buttons.push(button);
    });
  }
  
  // 레이아웃 클래스 반환
  getLayoutClass() {
    return this.options.layout === 'vertical' ? 'icon-button-group--vertical' : '';
  }
  
  // 간격 클래스 반환
  getSpacingClass() {
    return this.options.spacing === 'compact' ? 'icon-button-group--compact' : '';
  }
  
  // 이벤트 바인딩
  bindEvents() {
    // 그룹 레벨 이벤트는 필요에 따라 추가
  }
  
  // 버튼 추가
  addButton(buttonOptions) {
    this.options.buttons.push(buttonOptions);
    this.render();
    this.bindEvents();
  }
  
  // 버튼 제거
  removeButton(index) {
    if (index >= 0 && index < this.options.buttons.length) {
      this.options.buttons.splice(index, 1);
      this.render();
      this.bindEvents();
    }
  }
  
  // 버튼 업데이트
  updateButton(index, buttonOptions) {
    if (index >= 0 && index < this.options.buttons.length) {
      this.options.buttons[index] = { ...this.options.buttons[index], ...buttonOptions };
      if (this.buttons[index]) {
        this.buttons[index].updateIcon(buttonOptions.icon);
        this.buttons[index].updateSize(buttonOptions.size);
        this.buttons[index].updateTheme(buttonOptions.theme);
      }
    }
  }
  
  // 모든 버튼 비활성화/활성화
  setAllDisabled(disabled) {
    this.buttons.forEach(button => {
      button.setDisabled(disabled);
    });
  }
}

// 전역 Icon Button 초기화 함수
function initIconButton() {
  // data-icon-button 속성이 있는 모든 요소 초기화
  const buttonElements = document.querySelectorAll('[data-icon-button]');
  
  buttonElements.forEach(element => {
    const icon = element.getAttribute('data-icon') || 'plus';
    const size = element.getAttribute('data-size') || 'medium';
    const theme = element.getAttribute('data-theme') || 'default';
    const disabled = element.hasAttribute('disabled');
    
    new IconButton(element, {
      icon: icon,
      size: size,
      theme: theme,
      disabled: disabled,
      onClick: (button) => {
        console.log('아이콘 버튼 클릭:', button.icon);
      },
      onHover: (button) => {
        console.log('아이콘 버튼 호버:', button.icon);
      },
      onFocus: (button) => {
        console.log('아이콘 버튼 포커스:', button.icon);
      }
    });
  });
}

// DOM이 로드된 후 Icon Button 초기화
document.addEventListener('DOMContentLoaded', initIconButton);

// 전역에서 사용할 수 있도록 export
window.IconButton = IconButton;
window.IconButtonGroup = IconButtonGroup;
