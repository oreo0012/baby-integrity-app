/**
 * 背景图片配置
 * 
 * 使用说明:
 * 1. 将背景图片放到 public 目录
 * 2. 修改下面的 backgroundImage 路径
 * 3. 支持 JPG, PNG, WebP 格式
 */

export const backgroundConfig = {
  // 背景图片路径 (相对于 public 目录)
  backgroundImage: '/background.webp',
  
  // 降级图片 (如果浏览器不支持 WebP)
  fallbackImage: '/background.jpg',
  
  // 背景样式配置
  style: {
    // 背景大小: 'cover' | 'contain' | 'auto'
    size: 'cover' as const,
    
    // 背景位置: 'center' | 'top' | 'bottom' | 'left' | 'right'
    position: 'center' as const,
    
    // 背景重复: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
    repeat: 'no-repeat' as const,
    
    // 背景固定: true | false
    fixed: false,
  },
  
  // 是否使用图片背景 (false 则使用渐变色)
  enabled: true,
  
  // 渐变色背景 (当 enabled 为 false 时使用)
  gradient: {
    from: '#FFC7E3',
    via: '#FFB6D9',
    to: '#FFC7E3',
  },
};
