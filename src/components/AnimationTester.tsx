import { useEffect, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

interface AnimationTesterProps {
  jsonPath: string;
  title?: string;
}

export default function AnimationTester({ jsonPath, title = '动画测试' }: AnimationTesterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const [animationInfo, setAnimationInfo] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 加载动画
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: loop,
      autoplay: true,
      path: jsonPath,
    });

    // 设置速度
    animationRef.current.setSpeed(speed);

    // 获取动画信息
    animationRef.current.addEventListener('DOMLoaded', () => {
      if (animationRef.current) {
        const duration = animationRef.current.getDuration();
        const frameRate = animationRef.current.frameRate;
        const totalFrames = animationRef.current.totalFrames;
        
        setAnimationInfo({
          duration: duration.toFixed(2),
          frameRate: frameRate,
          totalFrames: totalFrames,
        });
      }
    });

    return () => {
      animationRef.current?.destroy();
    };
  }, [jsonPath, loop]);

  // 更新速度
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.setSpeed(speed);
    }
  }, [speed]);

  const handlePlayPause = () => {
    if (!animationRef.current) return;
    
    if (isPlaying) {
      animationRef.current.pause();
    } else {
      animationRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!animationRef.current) return;
    animationRef.current.goToAndPlay(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* 动画显示区域 */}
          <div className="bg-gray-50 rounded-xl p-8 mb-6 flex items-center justify-center">
            <div 
              ref={containerRef} 
              className="w-full max-w-md"
              style={{ aspectRatio: '1/1' }}
            />
          </div>

          {/* 控制面板 */}
          <div className="space-y-4">
            {/* 播放控制 */}
            <div className="flex gap-3">
              <button
                onClick={handlePlayPause}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 rounded-xl font-medium transition-all"
              >
                {isPlaying ? '暂停' : '播放'}
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-medium transition-all"
              >
                重新播放
              </button>
            </div>

            {/* 速度控制 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                播放速度: {speed}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1x</span>
                <span>3x</span>
              </div>
            </div>

            {/* 循环控制 */}
            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
                <span className="ml-2 text-gray-700 font-medium">循环播放</span>
              </label>
            </div>
          </div>
        </div>

        {/* 动画信息 */}
        {animationInfo && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">动画信息</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">时长</div>
                <div className="text-2xl font-bold text-pink-600">{animationInfo.duration}s</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">帧率</div>
                <div className="text-2xl font-bold text-blue-600">{animationInfo.frameRate} fps</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">总帧数</div>
                <div className="text-2xl font-bold text-purple-600">{animationInfo.totalFrames}</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">文件路径</div>
              <div className="text-sm font-mono text-gray-800 break-all">{jsonPath}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
