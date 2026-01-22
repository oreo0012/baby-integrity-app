import { X, Plus, Minus } from 'lucide-react';
import { getScoreHistory, type ScoreHistoryItem } from '../lib/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  if (!isOpen) return null;

  const history = getScoreHistory();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

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
            <h2 className="text-gray-900 text-2xl font-bold">历史记录</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 历史列表 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {history.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                暂无记录
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item: ScoreHistoryItem) => (
                  <div
                    key={item.id}
                    className="bg-gray-100 rounded-2xl px-4 py-3"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {item.type === 'add' ? (
                          <Plus className="w-4 h-4 text-green-600" />
                        ) : (
                          <Minus className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-gray-800 font-medium">{item.itemName}</span>
                      </div>
                      <span className={`font-bold ${item.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.type === 'add' ? '+' : '-'}{item.scoreChange}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 ml-6">
                      <span>{formatDate(item.timestamp)}</span>
                      <span>{item.scoreBefore} → {item.scoreAfter}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
