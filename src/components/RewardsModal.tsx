import { X } from 'lucide-react';
import { Button } from './ui/button';
import type { Reward } from '../lib/config';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Reward[];
}

export function RewardsModal({ isOpen, onClose, rewards }: RewardsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[390px] max-h-[90vh]">
        <div className="bg-white rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* 标题栏 */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
            <h2 className="text-gray-900 text-2xl font-bold">我的权益</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 权益列表 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-2xl px-5 py-4 flex justify-between items-center"
                >
                  <div className="text-gray-800 font-medium">{reward.name}</div>
                  <div className="text-gray-900 font-bold text-lg">
                    {typeof reward.value === 'boolean' 
                      ? (reward.value ? '允许' : '禁止')
                      : `${reward.value}${reward.unit}`
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
