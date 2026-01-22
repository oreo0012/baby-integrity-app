import { useState, useCallback, useRef } from 'react';

export type AnimationState = 'idle' | 'rolling' | 'flower' | 'character' | 'complete';

interface AnimationFlowState {
  state: AnimationState;
  isPlaying: boolean;
  currentType: 'add' | 'subtract' | null;
  targetScore: number;
  minScore: number;
  maxScore: number;
}

/**
 * 动画流程管理 Hook
 * 统一管理送花/扣花的完整动画流程
 */
export function useAnimationFlow() {
  const [flowState, setFlowState] = useState<AnimationFlowState>({
    state: 'idle',
    isPlaying: false,
    currentType: null,
    targetScore: 0,
    minScore: 0,
    maxScore: 0
  });

  const isPlayingRef = useRef(false);

  // 开始动画流程
  const startFlow = useCallback((
    type: 'add' | 'subtract',
    targetScore: number,
    minScore: number,
    maxScore: number
  ) => {
    // 防止重复触发
    if (isPlayingRef.current) {
      console.warn('动画正在播放中，忽略新的请求');
      return false;
    }

    console.log(`开始动画流程: ${type}, 目标分值: ${targetScore}`);
    isPlayingRef.current = true;
    
    setFlowState({
      state: 'rolling',
      isPlaying: true,
      currentType: type,
      targetScore,
      minScore,
      maxScore
    });

    return true;
  }, []);

  // 进入送花/扣花动画阶段
  const enterFlowerStage = useCallback(() => {
    console.log('进入送花/扣花动画阶段');
    setFlowState(prev => ({ ...prev, state: 'flower' }));
  }, []);

  // 进入人物动画阶段
  const enterCharacterStage = useCallback(() => {
    console.log('进入人物动画阶段');
    setFlowState(prev => ({ ...prev, state: 'character' }));
  }, []);

  // 完成动画流程
  const completeFlow = useCallback(() => {
    console.log('动画流程完成');
    isPlayingRef.current = false;
    setFlowState({
      state: 'idle',
      isPlaying: false,
      currentType: null,
      targetScore: 0,
      minScore: 0,
      maxScore: 0
    });
  }, []);

  // 重置流程（用于错误恢复）
  const resetFlow = useCallback(() => {
    console.log('重置动画流程');
    isPlayingRef.current = false;
    setFlowState({
      state: 'idle',
      isPlaying: false,
      currentType: null,
      targetScore: 0,
      minScore: 0,
      maxScore: 0
    });
  }, []);

  return {
    flowState,
    startFlow,
    enterFlowerStage,
    enterCharacterStage,
    completeFlow,
    resetFlow
  };
}
