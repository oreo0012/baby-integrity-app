import { useEffect } from 'react';

/**
 * 动画预加载组件
 * 在应用启动时预加载所有 Lottie JSON 动画文件
 */
export default function AnimationPreloader() {
  useEffect(() => {
    const animations = [
      // 常态动画
      '/animations/girl-excellent.json',
      '/animations/girl-good.json',
      '/animations/girl-needwork.json',
      // 送花/扣花动画
      '/animations/flower_add.json',
      '/animations/flower_subtract.json',
      // 人物庆祝/打击动画
      '/animations/girl-celebrate.json',
      '/animations/girl-sad.json',
    ];

    let loadedCount = 0;

    const preloadJson = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        fetch(src)
          .then(response => response.json())
          .then(() => {
            loadedCount++;
            console.log(`[Preloader] 已加载: ${src} (${loadedCount}/${animations.length})`);
            resolve();
          })
          .catch((error) => {
            console.error(`[Preloader] 加载失败: ${src}`, error);
            loadedCount++;
            resolve(); // 即使失败也继续
          });
      });
    };

    const preloadAll = async () => {
      console.log('[Preloader] 开始预加载 Lottie 动画...');
      await Promise.all(animations.map(preloadJson));
      console.log('[Preloader] 所有 Lottie 动画预加载完成！');
    };

    preloadAll();
  }, []);

  // 不显示任何 UI，静默预加载
  return null;
}
