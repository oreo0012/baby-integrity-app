import { useEffect, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

export default function TestFlowerAnimation() {
  const addContainerRef = useRef<HTMLDivElement>(null);
  const subtractContainerRef = useRef<HTMLDivElement>(null);
  const addAnimationRef = useRef<AnimationItem | null>(null);
  const subtractAnimationRef = useRef<AnimationItem | null>(null);
  const [addLoaded, setAddLoaded] = useState(false);
  const [subtractLoaded, setSubtractLoaded] = useState(false);

  useEffect(() => {
    // 加载送花动画
    if (addContainerRef.current) {
      console.log('加载送花动画...');
      addAnimationRef.current = lottie.loadAnimation({
        container: addContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/animations/flower_add.json',
      });

      addAnimationRef.current.addEventListener('DOMLoaded', () => {
        console.log('送花动画加载成功！');
        setAddLoaded(true);
      });

      addAnimationRef.current.addEventListener('data_failed', () => {
        console.error('送花动画加载失败！');
      });
    }

    // 加载扣花动画
    if (subtractContainerRef.current) {
      console.log('加载扣花动画...');
      subtractAnimationRef.current = lottie.loadAnimation({
        container: subtractContainerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/animations/flower_subtract.json',
      });

      subtractAnimationRef.current.addEventListener('DOMLoaded', () => {
        console.log('扣花动画加载成功！');
        setSubtractLoaded(true);
      });

      subtractAnimationRef.current.addEventListener('data_failed', () => {
        console.error('扣花动画加载失败！');
      });
    }

    return () => {
      if (addAnimationRef.current) {
        addAnimationRef.current.destroy();
      }
      if (subtractAnimationRef.current) {
        subtractAnimationRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">送花/扣花动画测试</h1>
        
        <div className="grid grid-cols-2 gap-6">
          {/* 送花动画 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-pink-500 mb-4">
              送花动画 {addLoaded ? '✅' : '⏳'}
            </h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <div 
                ref={addContainerRef} 
                className="w-full"
                style={{ height: '400px' }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div>路径: /animations/flower_add.json</div>
              <div>状态: {addLoaded ? '已加载' : '加载中...'}</div>
            </div>
          </div>

          {/* 扣花动画 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-cyan-500 mb-4">
              扣花动画 {subtractLoaded ? '✅' : '⏳'}
            </h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <div 
                ref={subtractContainerRef} 
                className="w-full"
                style={{ height: '400px' }}
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div>路径: /animations/flower_subtract.json</div>
              <div>状态: {subtractLoaded ? '已加载' : '加载中...'}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">调试信息</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• 打开浏览器控制台查看详细日志</div>
            <div>• 检查 Network 标签页查看 JSON 文件是否成功加载</div>
            <div>• 如果看不到动画，检查 JSON 文件路径是否正确</div>
          </div>
        </div>
      </div>
    </div>
  );
}
