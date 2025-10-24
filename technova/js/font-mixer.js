// Input 필드 폰트 분리 기능
document.addEventListener('DOMContentLoaded', function() {
    // subscribe-input에 폰트 분리 기능 적용
    const subscribeInput = document.querySelector('.subscribe-input');
    
    if (subscribeInput) {
        subscribeInput.addEventListener('input', function(e) {
            const value = e.target.value;
            const mixedValue = applyMixedFont(value);
            
            // 실제 값은 그대로 유지하고 표시만 변경
            e.target.style.fontFamily = 'Input Mixed Font, Hubot Sans, Pretendard Variable, sans-serif';
        });
        
        // 초기 로드 시에도 적용
        subscribeInput.style.fontFamily = 'Input Mixed Font, Hubot Sans, Pretendard Variable, sans-serif';
    }
});

// 문자열에서 숫자와 영문을 분리하여 폰트 적용
function applyMixedFont(text) {
    return text.replace(/(\d+)/g, '<span class="number-font">$1</span>')
               .replace(/([a-zA-Z]+)/g, '<span class="english-font">$1</span>');
}

// 모든 input 필드에 폰트 분리 기능 적용
function applyMixedFontToAllInputs() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.style.fontFamily = 'Input Mixed Font, Hubot Sans, Pretendard Variable, sans-serif';
        });
        
        // 초기 로드 시에도 적용
        input.style.fontFamily = 'Input Mixed Font, Hubot Sans, Pretendard Variable, sans-serif';
    });
}

// 페이지 로드 시 모든 input에 적용
document.addEventListener('DOMContentLoaded', applyMixedFontToAllInputs); 