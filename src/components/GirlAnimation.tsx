import { useEffect, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

interface GirlAnimationProps {
  className?: string;
  score: number; // 当前分数，用于选择对应的常态动画
  tempAnimation?: 'celebrate' | 'sad' | null; // 临时动画（庆祝/打击）
  onTempAnimationEnd?: () => void; // 临时动画结束回调
}

/**
 * 小女孩常态循环动画组件
 * 根据分数自动选择对应的常态动画
 * 支持临时播放庆祝/打击动画
 * - 90-100分: 优秀状态
 * - 60-89分: 良好状态  
 * - 0-59分: 要加油状态
 */
export default function GirlAnimation({ 
  className = '', 
  score, 
  tempAnimation = null,
  onTempAnimationEnd 
}: GirlAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const onTempAnimationEndRef = useRef(onTempAnimationEnd);
  const scoreRef = useRef(score);
  const tempTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [opacity, setOpacity] = useState(1); // 控制透明度
  const [isTransitioning, setIsTransitioning] = useState(false); // 是否正在过渡
  const currentPathRef = useRef<string>(''); // 记录当前加载的动画路径，避免重复加载
  const isLoadingFromTempRef = useRef(false); // 标记是否从临时动画切换回来

  // 更新 refs
  useEffect(() => {
    onTempAnimationEndRef.current = onTempAnimationEnd;
    scoreRef.current = score;
  }, [onTempAnimationEnd, score]);

  // 根据分数选择常态动画
  const getStateAnimationPath = (currentScore: number): string => {
    if (currentScore >= 90) {
      console.log(`选择优秀动画 (分数: ${currentScore})`);
      return '/animations/girl-excellent.json';
    } else if (currentScore >= 60) {
      console.log(`选择良好动画 (分数: ${currentScore})`);
      return '/animations/girl-good.json';
    } else {
      console.log(`选择要加油动画 (分数: ${currentScore})`);
      return '/animations/girl-needwork.json';
    }
  };

  // 获取临时动画路径
  const getTempAnimationPath = (type: 'celebrate' | 'sad'): string => {
    return type === 'celebrate' 
      ? '/animations/girl-celebrate.json'
      : '/animations/girl-sad.json';
  };

  // 加载 Lottie 动画（带渐隐渐现效果）
  const loadAnimation = (path: string, loop: boolean = true, withFade: boolean = true) => {
    if (!containerRef.current) return;

    // 如果路径相同，不重复加载
    if (currentPathRef.current === path && animationRef.current) {
      console.log(`动画已加载，跳过: ${path}`);
      return;
    }

    const doLoad = () => {
      // 销毁旧动画
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }

      console.log(`加载 Lottie 动画: ${path}`);
      currentPathRef.current = path; // 记录当前路径

      // 加载新动画 - 使用 canvas 渲染器
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current!,
        renderer: 'canvas',
        loop: loop,
        autoplay: true,
        path: path,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true,
          progressiveLoad: true,
        }
      });

      // 如果是非循环动画，监听完成事件
      if (!loop && animationRef.current) {
        animationRef.current.addEventListener('complete', () => {
          console.log('临时动画播放完成');
          // 标记从临时动画切换回来
          isLoadingFromTempRef.current = true;
          // 动画完成后，加载常态动画（带渐变）
          const statePath = getStateAnimationPath(scoreRef.current);
          loadAnimation(statePath, true, true);
          onTempAnimationEndRef.current?.();
          // 延迟重置标记
          setTimeout(() => {
            isLoadingFromTempRef.current = false;
          }, 500);
        });
      }

      // 渐现
      if (withFade) {
        setTimeout(() => {
          setOpacity(1);
          setIsTransitioning(false);
        }, 50);
      } else {
        setOpacity(1);
        setIsTransitioning(false);
      }
    };

    if (withFade && !isTransitioning) {
      // 先渐隐
      setIsTransitioning(true);
      setOpacity(0);
      // 等待渐隐完成后加载新动画
      setTimeout(doLoad, 300); // 300ms 渐隐时间
    } else {
      doLoad();
    }
  };

  // 处理临时动画
  useEffect(() => {
    if (tempAnimation) {
      const tempPath = getTempAnimationPath(tempAnimation);
      console.log(`播放临时动画: ${tempAnimation}`);
      loadAnimation(tempPath, false, true); // 不循环，带渐变
    }
  }, [tempAnimation]);

  // 加载常态动画
  useEffect(() => {
    if (tempAnimation) {
      console.log('正在播放临时动画，跳过常态动画加载');
      return;
    }
    
    // 如果是从临时动画切换回来的，跳过（因为已经在 complete 事件中加载了）
    if (isLoadingFromTempRef.current) {
      console.log('从临时动画切换回来，跳过重复加载');
      return;
    }
    
    const animPath = getStateAnimationPath(score);
    console.log(`加载常态动画: 分数=${score}, 路径=${animPath}`);
    loadAnimation(animPath, true, true); // 循环播放，带渐变
  }, [score, tempAnimation]);

  // 清理
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
      if (tempTimerRef.current) {
        clearTimeout(tempTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full lottie-container transition-opacity duration-300"
        style={{
          imageRendering: 'crisp-edges',
          WebkitFontSmoothing: 'antialiased',
          opacity: opacity,
        }}
      />
    </div>
  );
}
