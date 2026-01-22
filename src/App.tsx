import { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';
import { RewardsModal } from './components/RewardsModal';
import { AddFlowerModal } from './components/AddFlowerModal';
import { SubtractFlowerModal } from './components/SubtractFlowerModal';
import { HistoryModal } from './components/HistoryModal';
import { getCurrentScoreData, getCurrentRewards } from './lib/data-manager';
import { getCurrentScore, setCurrentScore, addScoreHistoryItem, type ScoreHistoryItem } from './lib/storage';
import GirlAnimation from './components/GirlAnimation';
import AppBackground from './components/AppBackground';
import AnimationOverlay, { type AnimationType } from './components/AnimationOverlay';
import AnimationPreloader from './components/AnimationPreloader';

function App() {
  const [score, setScore] = useState(100);
  const [maxScore] = useState(100);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isAddFlowerOpen, setIsAddFlowerOpen] = useState(false);
  const [isSubtractFlowerOpen, setIsSubtractFlowerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType | null>(null);
  const [tempGirlAnimation, setTempGirlAnimation] = useState<'celebrate' | 'sad' | null>(null);
  const [animationScoreData, setAnimationScoreData] = useState({ target: 0, min: 0, max: 0 });

  useEffect(() => {
    loadScore();
  }, []);

  const loadScore = async () => {
    const currentScore = await getCurrentScoreData();
    setScore(currentScore);
    const currentRewards = await getCurrentRewards();
    setRewards(currentRewards);
  };

  const handleViewRewards = () => {
    loadScore();
    setIsRewardsOpen(true);
  };

  // 播放动画 - 在调用前已经更新了分数
  const playAnimation = (type: AnimationType, targetScore: number, minScore: number, maxScore: number, itemName: string) => {
    console.log(`[App] 开始播放 ${type} 动画, 项目: ${itemName}, 分值: ${targetScore}`);
    
    // 立即更新分数和历史记录
    const scoreBefore = getCurrentScore();
    let scoreAfter: number;
    
    if (type === 'flower-add') {
      scoreAfter = Math.min(scoreBefore + targetScore, 100);
      setCurrentScore(scoreAfter);
      
      const historyItem: ScoreHistoryItem = {
        id: `history-${Date.now()}`,
        type: 'add',
        itemName: itemName,
        scoreChange: targetScore,
        scoreBefore,
        scoreAfter,
        timestamp: Date.now(),
      };
      addScoreHistoryItem(historyItem);
      
      console.log(`[App] 送花成功！+${targetScore}分，${scoreBefore} → ${scoreAfter}`);
    } else {
      scoreAfter = Math.max(scoreBefore - targetScore, 0);
      setCurrentScore(scoreAfter);
      
      const historyItem: ScoreHistoryItem = {
        id: `history-${Date.now()}`,
        type: 'subtract',
        itemName: itemName,
        scoreChange: targetScore,
        scoreBefore,
        scoreAfter,
        timestamp: Date.now(),
      };
      addScoreHistoryItem(historyItem);
      
      console.log(`[App] 扣花成功！-${targetScore}分，${scoreBefore} → ${scoreAfter}`);
    }
    
    // 更新UI
    loadScore();
    
    // 然后播放动画
    setCurrentAnimation(type);
    setAnimationScoreData({ target: targetScore, min: minScore, max: maxScore });
  };

  // 滚动完成回调 - 同时开始播放人物动画和送花/扣花动画
  const handleRollingComplete = () => {
    console.log('[App] 滚动完成，同时开始播放人物动画和送花/扣花动画');
    
    // 根据动画类型播放对应的人物动画
    if (currentAnimation === 'flower-add') {
      console.log('[App] 开始播放庆祝动画');
      setTempGirlAnimation('celebrate');
    } else if (currentAnimation === 'flower-subtract') {
      console.log('[App] 开始播放打击动画');
      setTempGirlAnimation('sad');
    }
  };

  // 送花/扣花动画完成回调
  const handleAnimationComplete = () => {
    console.log(`[App] ${currentAnimation} 叠加层动画完成`);
    setCurrentAnimation(null);
    // 不再在这里触发人物动画，因为已经在 handleRollingComplete 中触发了
  };

  // 人物动画结束回调
  const handleTempAnimationEnd = () => {
    console.log('[App] 人物动画结束');
    setTempGirlAnimation(null);
    setAnimationScoreData({ target: 0, min: 0, max: 0 });
  };

  const percentage = (score / maxScore) * 100;

  // 根据分段设置进度条颜色和评级文字
  const getProgressColor = () => {
    if (score >= 90) return 'from-green-400 to-green-500';
    if (score >= 60) return 'from-blue-400 to-blue-500';
    return 'from-red-400 to-red-500';
  };

  const getRatingText = () => {
    if (score >= 90) return { text: '优秀', color: 'text-green-500' };
    if (score >= 60) return { text: '良好', color: 'text-blue-500' };
    return { text: '要努力', color: 'text-red-500' };
  };

  const rating = getRatingText();

  return (
    <AppBackground>
      {/* 预加载所有动画 */}
      <AnimationPreloader />
      
      <div className="w-full max-w-[390px] min-h-screen bg-transparent rounded-3xl shadow-2xl overflow-hidden flex flex-col relative py-4">
        
        {/* 历史记录按钮 */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {/* 测试按钮 - 开发时可以取消注释 */}
          {/* 
          <button
            onClick={() => setIsFlowerTestMode(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 shadow-lg flex items-center justify-center transition-all text-white font-bold"
            title="送花/扣花测试"
          >
            🌸
          </button>
          <button
            onClick={() => setIsTestMode(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 shadow-lg flex items-center justify-center transition-all text-white font-bold"
            title="动画测试"
          >
            🎬
          </button>
          */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 shadow-lg flex items-center justify-center transition-all"
          >
            <img 
              src="/history-icon.svg" 
              alt="历史记录" 
              className="brightness-0 invert"
              style={{ width: '28px', height: '28px' }}
            />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-[280px] h-auto aspect-[9/16] max-h-[500px]">
            <GirlAnimation 
              className="w-full h-full drop-shadow-lg" 
              score={score}
              tempAnimation={tempGirlAnimation}
              onTempAnimationEnd={handleTempAnimationEnd}
            />
          </div>
        </div>

        <div className="px-6 pb-6 mt-auto">
          <div className="bg-white rounded-[32px] p-5 shadow-xl">
            {/* 分数和权益按钮 */}
            <div className="flex justify-between items-center mb-3">
              <div className="text-base font-medium text-gray-800">
                我的小红花
              </div>
              <button
                onClick={handleViewRewards}
                className="rounded-full border-2 border-pink-400 text-pink-500 hover:bg-pink-50 px-4 py-1.5 text-sm font-medium transition-colors"
              >
                权益
              </button>
            </div>

            {/* 分数和评级 */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-bold text-4xl text-gray-900">{score}</span>
              <span className={`font-bold text-lg ${rating.color}`}>{rating.text}</span>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsSubtractFlowerOpen(true)}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-[28px] shadow-lg text-base font-medium transition-all flex items-center justify-center gap-2"
              >
                <Minus className="w-4 h-4" />
                扣花
              </button>

              <button
                onClick={() => setIsAddFlowerOpen(true)}
                className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white py-3 rounded-[28px] shadow-lg text-base font-medium transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                送花
              </button>
            </div>
          </div>
        </div>
      </div>

      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        rewards={rewards}
      />

      <AddFlowerModal
        isOpen={isAddFlowerOpen}
        onClose={() => setIsAddFlowerOpen(false)}
        onPlayAnimation={playAnimation}
      />

      <SubtractFlowerModal
        isOpen={isSubtractFlowerOpen}
        onClose={() => setIsSubtractFlowerOpen(false)}
        onPlayAnimation={playAnimation}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      <AnimationOverlay
        type={currentAnimation}
        targetScore={animationScoreData.target}
        minScore={animationScoreData.min}
        maxScore={animationScoreData.max}
        onRollingComplete={handleRollingComplete}
        onAnimationComplete={handleAnimationComplete}
      />
    </AppBackground>
  );
}

export default App;
