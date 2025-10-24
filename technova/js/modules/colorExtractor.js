/**
 * Color Extractor Module
 * 이미지에서 주요 색상을 추출하고 배경색을 동적으로 설정하는 모듈
 */

class ColorExtractor {
    constructor() {
        this.colorThief = new ColorThief();
    }

    /**
     * RGB를 HSV로 변환
     */
    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        const sum = max + min;

        let h = 0;
        let s = 0;
        const v = max;

        if (diff !== 0) {
            s = max === 0 ? 0 : diff / max;

            switch (max) {
                case r:
                    h = (g - b) / diff + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / diff + 2;
                    break;
                case b:
                    h = (r - g) / diff + 4;
                    break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, v: v * 100 };
    }

    /**
     * 상대 휘도 계산
     */
    getRelativeLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    /**
     * 대비 비율 계산
     */
    calculateContrastRatio(color1, color2) {
        const l1 = this.getRelativeLuminance(color1[0], color1[1], color1[2]);
        const l2 = this.getRelativeLuminance(color2[0], color2[1], color2[2]);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * 접근 가능한 색상 찾기
     */
    findAccessibleColor(palette, targetColor = [255, 255, 255]) {
        const accessibleColors = [];

        for (const color of palette) {
            const hsv = this.rgbToHsv(color[0], color[1], color[2]);
            const contrastRatio = this.calculateContrastRatio(color, targetColor);

            // 조건 1: 대비 비율 4.5 이상
            if (contrastRatio >= 4.5) {
                // 조건 2: 채도 50% 이상 (유채색 우선)
                if (hsv.s >= 50) {
                    // 조건 3: 밝기 30% 이상
                    if (hsv.v >= 30) {
                        accessibleColors.push({
                            color: color,
                            hsv: hsv,
                            contrastRatio: contrastRatio,
                            score: hsv.s + hsv.v // 채도와 밝기의 합으로 점수 계산
                        });
                    }
                }
            }
        }

        // 점수가 높은 순으로 정렬
        accessibleColors.sort((a, b) => b.score - a.score);

        return accessibleColors.length > 0 ? accessibleColors[0].color : null;
    }

    /**
     * 이미지에서 색상 추출 및 배경 설정
     */
    extractAndSetBackground(imageElement, heroContainer) {
        if (!imageElement.complete) {
            imageElement.addEventListener('load', () => {
                this.processImage(imageElement, heroContainer);
            });
        } else {
            this.processImage(imageElement, heroContainer);
        }
    }

    /**
     * 이미지 처리
     */
    processImage(imageElement, heroContainer) {
        try {
            const palette = this.colorThief.getPalette(imageElement, 8);
            const dominantColor = this.findAccessibleColor(palette);

            if (dominantColor) {
                const [r, g, b] = dominantColor;
                const gradient = `linear-gradient(112.15deg, rgba(${r}, ${g}, ${b}, 0.9) 16.48%, rgba(${r}, ${g}, ${b}, 0.8) 87.74%)`;
                
                heroContainer.style.background = gradient;
                
                // 호버 섀도우 색상 설정
                this.setHoverShadow(heroContainer, dominantColor);
            }
        } catch (error) {
            console.warn('색상 추출 실패:', error);
        }
    }

    /**
     * 호버 섀도우 색상 설정
     */
    setHoverShadow(heroContainer, color) {
        const [r, g, b] = color;
        const darkerColor = [
            Math.max(0, r - 40),
            Math.max(0, g - 40),
            Math.max(0, b - 40)
        ];

        const shadowColor = `rgba(${darkerColor[0]}, ${darkerColor[1]}, ${darkerColor[2]}, 0.3)`;
        const blackShadow = 'rgba(0, 0, 0, 0.1)';
        
        const shadowStyle = `
            .hero-banner:hover {
                box-shadow: 0 8px 32px ${shadowColor}, 0 4px 16px ${blackShadow} !important;
            }
        `;

        // 기존 스타일 제거
        const existingStyle = document.getElementById('hover-shadow-style');
        if (existingStyle) {
            existingStyle.remove();
        }

        // 새 스타일 추가
        const styleElement = document.createElement('style');
        styleElement.id = 'hover-shadow-style';
        styleElement.textContent = shadowStyle;
        document.head.appendChild(styleElement);
    }
}

// 전역 인스턴스 생성
window.colorExtractor = new ColorExtractor(); 