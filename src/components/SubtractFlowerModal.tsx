import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { type ScoreItem, getSubtractItems } from '../lib/data-manager';
import type { AnimationType } from './AnimationOverlay';

interface SubtractFlowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAnimation: (type: AnimationType, targetScore: number, minScore: number, maxScore: number, itemName: string) => void;
}

export function SubtractFlowerModal({ 
  isOpen, 
  onClose, 
  onPlayAnimation 
}: SubtractFlowerModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  if (!isOpen) return null;

  const subtractItems = getSubtractItems();

  const handleReasonClick = (item: ScoreItem) => {
    // 防止重复点击
    if (processingRef.current) {
      console.warn('[SubtractModal] 正在处理中，忽略点击');
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    console.log(`[SubtractModal] 开始处理: ${item.name}`);

    // 计算随机分值
    const targetScore = item.minScore + Math.floor(Math.random() * (item.maxScore - item.minScore + 1));
    
    // 立即关闭模态框
    onClose();
    
    // 延迟一帧确保模态框已关闭
    requestAnimationFrame(() => {
      // 播放动画，传递项目名称
      onPlayAnimation('flower-subtract', targetScore, item.minScore, item.maxScore, item.name);
      
      // 重置处理状态
      setTimeout(() => {
        processingRef.current = false;
        setIsProcessing(false);
      }, 100);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={isProcessing ? undefined : onClose}
      />
      
      <div className="relative w-full max-w-[390px] max-h-[90vh]">
        <div className="bg-white rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* 标题栏 */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
            <h2 className="text-gray-900 text-2xl font-bold">扣除红花</h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-800 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 选项列表 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-3">
              {subtractItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleReasonClick(item)}
                  disabled={isProcessing}
                  className="w-full bg-gray-100 hover:bg-gray-200 rounded-2xl px-5 py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src="/subtract-flower-icon.png" 
                      alt="扣花" 
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-gray-800 font-medium text-base text-left">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-gray-600 font-medium text-sm">
                    {item.minScore}~{item.maxScore}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
