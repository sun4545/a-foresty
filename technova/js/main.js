/**
 * Main JavaScript File
 * 모든 모듈을 로드하고 초기화하는 메인 파일
 */

// External Libraries
import 'https://cdn.jsdelivr.net/npm/colorthief@2.4.0/dist/color-thief.min.js';

// Internal Modules
import './modules/colorExtractor.js';
import './modules/uiInteractions.js';

// Legacy Scripts (기존 파일들)
import '../js/font-mixer.js';
import '../js/search.js';

/**
 * Application Class
 * 전체 애플리케이션을 관리하는 메인 클래스
 */
class App {
    constructor() {
        this.modules = {};
        this.init();
    }

    /**
     * 애플리케이션 초기화
     */
    init() {
        this.loadModules();
        this.setupEventListeners();
        this.initializeComponents();
    }

    /**
     * 모듈 로드
     */
    loadModules() {
        // 모듈들이 이미 window 객체에 로드되어 있음
        this.modules.colorExtractor = window.colorExtractor;
        this.modules.uiInteractions = window.uiInteractions;
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // DOM 로드 완료 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }

        // 페이지 언로드 시 정리
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    /**
     * DOM 로드 완료 시 실행
     */
    onDOMReady() {
        this.initializeComponents();
        this.setupPerformanceMonitoring();
    }

    /**
     * 컴포넌트 초기화
     */
    initializeComponents() {
        // 폰트 믹서 초기화 (기존 스크립트)
        if (window.FontMixer) {
            window.FontMixer.init();
        }

        // 검색 기능 초기화 (기존 스크립트)
        if (window.SearchManager) {
            window.SearchManager.init();
        }

        // 색상 추출 초기화
        if (this.modules.colorExtractor) {
            this.modules.colorExtractor.init();
        }

        // UI 인터랙션 초기화
        if (this.modules.uiInteractions) {
            this.modules.uiInteractions.init();
        }
    }

    /**
     * 성능 모니터링 설정
     */
    setupPerformanceMonitoring() {
        // 페이지 로드 시간 측정
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`페이지 로드 시간: ${loadTime.toFixed(2)}ms`);
        });

        // 메모리 사용량 모니터링 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
            setInterval(() => {
                if (performance.memory) {
                    const memoryUsage = performance.memory;
                    console.log('메모리 사용량:', {
                        used: `${(memoryUsage.usedJSHeapSize / 1048576).toFixed(2)}MB`,
                        total: `${(memoryUsage.totalJSHeapSize / 1048576).toFixed(2)}MB`,
                        limit: `${(memoryUsage.jsHeapSizeLimit / 1048576).toFixed(2)}MB`
                    });
                }
            }, 30000); // 30초마다 체크
        }
    }

    /**
     * 에러 핸들링
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript 에러:', event.error);
            this.reportError(event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise 에러:', event.reason);
            this.reportError(event.reason);
        });
    }

    /**
     * 에러 리포트
     */
    reportError(error) {
        // 에러 로깅 또는 외부 서비스로 전송
        if (this.modules.uiInteractions) {
            this.modules.uiInteractions.showToast('오류가 발생했습니다.', 'error');
        }
    }

    /**
     * 정리 작업
     */
    cleanup() {
        // 이벤트 리스너 제거
        // 타이머 정리
        // 메모리 정리
    }

    /**
     * 개발 도구
     */
    getDebugInfo() {
        return {
            modules: Object.keys(this.modules),
            colorExtractor: !!this.modules.colorExtractor,
            uiInteractions: !!this.modules.uiInteractions,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
}

// 전역 앱 인스턴스 생성
window.app = new App();

// 개발 환경에서 디버그 정보 출력
if (process.env.NODE_ENV === 'development') {
    console.log('App 초기화 완료:', window.app.getDebugInfo());
} 