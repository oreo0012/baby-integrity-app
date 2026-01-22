import { useState } from 'react';
import { X, Cloud, HardDrive, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStorageMode, setStorageMode, type StorageMode } from '@/lib/storage-adapter';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export default function SettingsModal({ isOpen, onClose, onOpenAuth }: SettingsModalProps) {
  const { user, profile, signOut } = useAuth();
  const [storageMode, setStorageModeState] = useState<StorageMode>(getStorageMode());

  if (!isOpen) return null;

  const handleStorageModeChange = (mode: StorageMode) => {
    setStorageMode(mode);
    setStorageModeState(mode);
    // 提示用户刷新页面
    if (confirm('切换存储模式需要刷新页面，是否继续？')) {
      window.location.reload();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">设置</h2>

        {/* 存储模式选择 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">数据存储方式</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleStorageModeChange('local')}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                storageMode === 'local'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <HardDrive className={`w-5 h-5 ${storageMode === 'local' ? 'text-pink-600' : 'text-gray-400'}`} />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-800">本地存储</div>
                <div className="text-xs text-gray-500">数据保存在本设备</div>
              </div>
            </button>

            <button
              onClick={() => handleStorageModeChange('supabase')}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                storageMode === 'supabase'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Cloud className={`w-5 h-5 ${storageMode === 'supabase' ? 'text-pink-600' : 'text-gray-400'}`} />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-800">云端同步</div>
                <div className="text-xs text-gray-500">数据保存在云端，多设备同步</div>
              </div>
            </button>
          </div>
        </div>

        {/* 账号信息 */}
        {storageMode === 'supabase' && (
          <div className="border-t pt-6">
            {user && profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{profile.child_name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
              >
                登录 / 注册
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
