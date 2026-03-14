import { useRouter } from 'next/router';
import { useEffect } from 'react';
/**
 * 白点鼠标跟随 + 页面跳转 loading 圆环
 * @returns
 */
const CursorDot = () => {
    const router = useRouter();
    useEffect(() => {
        // 创建小白点元素
        const dot = document.createElement('div');
        dot.classList.add('cursor-dot');
        document.body.appendChild(dot);

        // 创建 loading 圆环（SVG）
        const ring = document.createElement('div');
        ring.classList.add('cursor-loading-ring');
        ring.innerHTML = `<svg viewBox="0 0 50 50" width="36" height="36">
            <circle cx="25" cy="25" r="20" fill="none" stroke-width="3"
                stroke="url(#cursor-ring-gradient)" stroke-linecap="round"
                stroke-dasharray="80 126" />
            <defs>
                <linearGradient id="cursor-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffaa40" />
                    <stop offset="100%" stop-color="#9c40ff" />
                </linearGradient>
            </defs>
        </svg>`;
        document.body.appendChild(ring);

        // 鼠标坐标和缓动目标坐标
        let mouse = { x: -100, y: -100 }; // 初始位置在屏幕外
        let dotPos = { x: mouse.x, y: mouse.y };

        // 监听鼠标移动
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        document.addEventListener('mousemove', handleMouseMove);

        // 监听鼠标悬停在可点击对象上的事件
        const handleMouseEnter = () => {
            dot.classList.add('cursor-dot-hover');
        };
        const handleMouseLeave = () => {
            dot.classList.remove('cursor-dot-hover');
        };

        // 页面跳转 loading 状态
        const handleRouteStart = () => {
            ring.classList.add('cursor-loading-active');
        };
        const handleRouteEnd = () => {
            ring.classList.remove('cursor-loading-active');
        };
        router.events.on('routeChangeStart', handleRouteStart);
        router.events.on('routeChangeComplete', handleRouteEnd);
        router.events.on('routeChangeError', handleRouteEnd);

        // 为所有可点击元素和包含 hover 或 group-hover 类名的元素添加事件监听
        setTimeout(() => {
            const clickableElements = document.querySelectorAll(
                'a, button, [role="button"], [onclick], [cursor="pointer"], [class*="hover"], [class*="group-hover"], [class*="cursor-pointer"]'
            );
            clickableElements.forEach((el) => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        }, 200);

        // 动画循环：延迟更新小白点和 loading 圆环位置
        const updateDotPosition = () => {
            const damping = 0.2;
            dotPos.x += (mouse.x - dotPos.x) * damping;
            dotPos.y += (mouse.y - dotPos.y) * damping;

            dot.style.left = `${dotPos.x}px`;
            dot.style.top = `${dotPos.y}px`;
            ring.style.left = `${dotPos.x}px`;
            ring.style.top = `${dotPos.y}px`;

            requestAnimationFrame(updateDotPosition);
        };

        updateDotPosition();

        // 清理函数
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            router.events.off('routeChangeStart', handleRouteStart);
            router.events.off('routeChangeComplete', handleRouteEnd);
            router.events.off('routeChangeError', handleRouteEnd);
            const clickableElements = document.querySelectorAll(
                'a, button, [role="button"], [onclick], [cursor="pointer"], [class*="hover"], [class*="group-hover"], [class*="cursor-pointer"]'
            );
            clickableElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            document.body.removeChild(dot);
            document.body.removeChild(ring);
        };
    }, [router]);

    return (
        <style jsx global>{`
            .cursor-dot {
                position: fixed;
                width: 12px;
                height: 12px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 9999;
                transition: transform 100ms ease-out, width 200ms ease, height 200ms ease;
                mix-blend-mode: difference;
            }

            .cursor-dot-hover {
                border: 1px solid rgba(167, 167, 167, 0.14);
                width: 60px;
                height: 60px;
                background: hsla(0, 0%, 100%, 0.04);
                -webkit-backdrop-filter: blur(5px);
                backdrop-filter: blur(5px);
            }

            .dark .cursor-dot-hover {
                border: 1px solid rgba(66, 66, 66, 0.66);
            }

            /* Loading 圆环 */
            .cursor-loading-ring {
                position: fixed;
                pointer-events: none;
                transform: translate(-50%, -50%);
                z-index: 9998;
                opacity: 0;
                transition: opacity 200ms ease;
            }

            .cursor-loading-ring svg {
                animation: cursor-ring-spin 0.8s linear infinite;
            }

            .cursor-loading-active {
                opacity: 1;
            }

            @keyframes cursor-ring-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
    );
};

export default CursorDot;