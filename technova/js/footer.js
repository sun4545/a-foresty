// 푸터 컴포넌트 동적 삽입
function insertFooter() {
    // 현재 페이지 경로에 따라 asset 경로 조정
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const assetPath = isInPagesFolder ? '../asset' : 'asset';
    
    const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-content">
                    <div class="footer-col">
                        <div class="footer-logo">
                            <img src="${assetPath}/Logo.svg" alt="technova place" class="footer-logo-img">
                        </div>
                        <div class="footer-info">
                            <p class="footer-phone"><span class="english-font">+</span><span class="number-font">82</span><span class="english-font">-</span><span class="number-font">2</span><span class="english-font">-</span><span class="number-font">546</span><span class="english-font">-</span><span class="number-font">1520</span></p>
                            <p class="footer-address">서울특별시 서초구 신반포로49길 12 (주)테크노바</p>
                        </div>
                    </div>
                    <div class="footer-col">
                        <div class="footer-links">
                            <div class="footer-link-group">
                                <a href="#" class="footer-link">이용약관</a>
                                <a href="#" class="footer-link">개인정보처리방침</a>
                            </div>
                        </div>
                    </div>
                    <div class="footer-col">
                        <div class="footer-links">
                            <div class="footer-link-group">
                                <a href="#" class="footer-link footer-link-with-icon">
                                    <span>회사 홈페이지</span>
                                    <img src="${assetPath}/icon/Property 1=bx-arrow-link.svg" alt="외부 링크" class="link-icon">
                                </a>
                                <a href="#" class="footer-link footer-link-with-icon">
                                    <span>채용</span>
                                    <img src="${assetPath}/icon/Property 1=bx-arrow-link.svg" alt="외부 링크" class="link-icon">
                                </a>
                            </div>
                            <div class="footer-back-to-top">
                                <button class="back-to-top-btn" aria-label="맨 위로 이동">
                                    <span>Back to top</span>
                                    <img src="${assetPath}/icon/Property 1=top.svg" alt="맨 위로 이동" class="back-to-top-icon">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p><span class="english-font">&copy;</span> <span class="english-font">technova Inc. All Rights Reserved. Made by The Grap</span></p>
                </div>
            </div>
            <div class="deco-left"></div>
            <div class="deco-right"></div>
        </footer>
    `;
    
    // 기존 푸터가 있다면 제거
    const existingFooter = document.querySelector('.footer');
    if (existingFooter) {
        existingFooter.remove();
    }
    
    // 새 푸터 삽입
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    
    // Back to top 버튼 기능 추가
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    console.log('✅ 푸터 컴포넌트가 성공적으로 삽입되었습니다.');
}

// 페이지 로드 시 푸터 삽입
document.addEventListener('DOMContentLoaded', insertFooter);

// 동적으로 다시 삽입할 수 있도록 전역 함수로 노출
window.insertFooter = insertFooter;
