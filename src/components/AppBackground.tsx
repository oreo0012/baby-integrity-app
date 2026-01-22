import { type CSSProperties } from 'react';
import { backgroundConfig } from '../config/background';

interface AppBackgroundProps {
  children: React.ReactNode;
}

/**
 * 应用背景组件
 * 支持图片背景和渐变背景切换
 */
export default function AppBackground({ children }: AppBackgroundProps) {
  const { enabled, backgroundImage, fallbackImage, style, gradient } = backgroundConfig;

  // 构建背景样式
  const backgroundStyle: CSSProperties = enabled
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: style.size,
        backgroundPosition: style.position,
        backgroundRepeat: style.repeat,
        backgroundAttachment: style.fixed ? 'fixed' : 'scroll',
      }
    : {
        background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.via}, ${gradient.to})`,
      };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={backgroundStyle}
    >
      {enabled && (
        <picture className="hidden">
          <source srcSet={backgroundImage} type="image/webp" />
          <img src={fallbackImage} alt="" />
        </picture>
      )}
      {children}
    </div>
  );
}
