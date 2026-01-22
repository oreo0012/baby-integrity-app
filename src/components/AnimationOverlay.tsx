import { useEffect, useState, useRef, useCallback } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

export type AnimationType = 'flower-add' | 'flower-subtract';

interface AnimationOverlayProps {
  type: AnimationType | null;
  targetScore: number;
  minScore: number;
  maxScore: number;
  onRollingComplete: () => void;
  onAnimationComplete: () => void;
}

// 动画配置 - 移到组件外部避免重新创建
const ANIMATION_CONFIG: Record<AnimationType, { path: string; duration: number }> = {
  'flower-add': { path: '/animations/flower_add.json', duration: 1400 },
  'flower-subtract': { path: '/animations/flower_subtract.json', duration: 1400 }
};

/**
 * 动画叠加层组件
 * 用于显示送花/扣花动画和随机分值滚动效果
 */
export default function AnimationOverlay({ 
  type, 
  targetScore, 
  minScore, 
  maxScore, 
  onRollingComplete,
  onAnimationComplete 
}: AnimationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const onRollingCompleteRef = useRef(onRollingComplete);
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 更新 refs
  useEffect(() => {
    onRollingCompleteRef.current = onRollingComplete;
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [onRollingComplete, onAnimationComplete]);

  // 清理所有定时器
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  // 加载 Lottie 动画
  const loadAnimation = useCallback((path: string) => {
    if (!containerRef.current) {
      console.error('[Overlay] 容器不存在，无法加载动画');
      return;
    }

    // 销毁旧动画
    if (animationRef.current) {
      animationRef.current.destroy();
      animationRef.current = null;
    }

    console.log(`[Overlay] 开始加载 Lottie 动画: ${path}`);

    try {
      // 加载新动画 - 使用 canvas 渲染器以获得更好的性能和质量
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'canvas', // 使用 canvas 渲染器，比 svg 更流畅
        loop: false,
        autoplay: true,
        path: path,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true,
          progressiveLoad: true,
        }
      });

      animationRef.current.addEventListener('DOMLoaded', () => {
        console.log('[Overlay] Lottie 动画加载成功');
      });

      animationRef.current.addEventListener('data_failed', () => {
        console.error('[Overlay] Lottie 动画加载失败');
      });
    } catch (error) {
      console.error('[Overlay] 加载动画时出错:', error);
    }
  }, []);

  // 当 showAnimation 变为 true 时加载动画
  useEffect(() => {
    if (showAnimation && type && containerRef.current) {
      const config = ANIMATION_CONFIG[type];
      console.log(`[Overlay] showAnimation=true, 准备加载动画: ${config.path}`);
      // 延迟加载确保 DOM 已渲染
      const timer = setTimeout(() => {
        loadAnimation(config.path);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showAnimation, type, loadAnimation]);

  useEffect(() => {
    if (!type) {
      clearAllTimers();
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
      setIsVisible(false);
      setIsRolling(false);
      setDisplayScore(0);
      setShowAnimation(false);
      return;
    }

    const config = ANIMATION_CONFIG[type];
    console.log(`[Overlay] 开始播放: ${type}, 目标: ${targetScore}, 动画路径: ${config.path}`);
    
    setIsVisible(true);
    setFadeOut(false);
    setIsRolling(true);
    setDisplayScore(minScore);
    setShowAnimation(false);

    // 1. 随机数字滚动（1秒）
    const rollInterval = setInterval(() => {
      const randomValue = minScore + Math.floor(Math.random() * (maxScore - minScore + 1));
      setDisplayScore(randomValue);
    }, 100);

    const rollTimer = setTimeout(() => {
      clearInterval(rollInterval);
      setDisplayScore(targetScore);
      setIsRolling(false);
      console.log(`[Overlay] 滚动结束: ${targetScore}`);
      onRollingCompleteRef.current();
      
      // 滚动结束后，显示动画容器
      console.log('[Overlay] 设置 showAnimation=true');
      setShowAnimation(true);
    }, 1000);

    timersRef.current.push(rollTimer);
    
    // 2. 等待动画播放完成 + 停留
    const completeTimer = setTimeout(() => {
      console.log(`[Overlay] 动画完成，开始渐隐`);
      setFadeOut(true);
      
      // 3. 渐隐后通知完成
      const fadeTimer = setTimeout(() => {
        console.log(`[Overlay] 完全结束`);
        if (animationRef.current) {
          animationRef.current.destroy();
          animationRef.current = null;
        }
        setIsVisible(false);
        setIsRolling(false);
        setDisplayScore(0);
        setShowAnimation(false);
        onAnimationCompleteRef.current();
      }, 500);
      
      timersRef.current.push(fadeTimer);
    }, 1000 + config.duration + 1000);

    timersRef.current.push(completeTimer);

    return () => {
      clearInterval(rollInterval);
      clearAllTimers();
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [type, targetScore, minScore, maxScore, clearAllTimers]);

  if (!isVisible || !type) {
    return null;
  }

  const isAdd = type === 'flower-add';

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 随机分值显示 - 向上移动到顶部区域 */}
      {displayScore > 0 && (
        <div className="mt-16 mb-4">
          <div className="bg-white/95 rounded-3xl px-12 py-6 shadow-2xl">
            <div className={`text-6xl font-bold ${
              isRolling ? 'animate-pulse' : ''
            } ${isAdd ? 'text-pink-500' : 'text-cyan-500'}`}>
              {isAdd ? '+' : '-'}{displayScore}
            </div>
          </div>
        </div>
      )}
      
      {/* 送花/扣花动画 - 只在滚动结束后显示 */}
      {showAnimation && (
        <div className="w-full max-w-[500px] flex items-center justify-center">
          <div 
            ref={containerRef} 
            className="w-full lottie-container"
            style={{ 
              height: '500px',
              imageRendering: 'crisp-edges',
              WebkitFontSmoothing: 'antialiased',
            }}
          />
        </div>
      )}
    </div>
  );
}
