import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 动画配置
const animations = [
  // 常态动画（循环播放）
  { 
    name: '优秀_常态', 
    input: 'D:\\AiPorject\\BabyIntegrityPlan\\图片素材\\GIF\\优秀_常态\\优秀_常态_%05d.png',
    output: 'girl-excellent.gif',
    frames: 169,
    loop: true
  },
  { 
    name: '良好_常态', 
    input: 'D:\\AiPorject\\BabyIntegrityPlan\\图片素材\\GIF\\良好_常态\\常态_良好_%05d.png',
    output: 'girl-good.gif',
    frames: 168,
    loop: true
  },
  { 
    name: '要加油_常态', 
    input: 'D:\\AiPorject\\BabyIntegrityPlan\\图片素材\\GIF\\要加油_常态\\要加油_常态_%05d.png',
    output: 'girl-needwork.gif',
    frames: 168,
    loop: true
  },
  
  // 送花/扣花动画（播放1次）
  { 
    name: '送花', 
    input: 'D:\\AiPorject\\BabyIntegrityPlan\\图片素材\\GIF\\送花\\送花_%05d.png',
    output: 'flower-add.gif',
    frames: 34,
    loop: false
  },
  { 
    name: '扣花', 
    input: 'D:\\AiPorject\\BabyIntegrityPlan\\图片素材\\GIF\\扣花\\扣花_%05d.png',
    output: 'flower-subtract.gif',
    frames: 34,
    loop: false
  },
  
  // 人物加扣分动画（播放1次）
  { 
    name: '送花_庆祝', 
    input: 'D:\\AiPorject\\BabyIntegrityPlan\\图片素材\\GIF\\送花_庆祝\\送花_庆祝_%05d.png',
    output: 'girl-celebrate.gif',
    frames: 94,
    loop: false
  },
  { 
    name: '扣花_打击', 
    input: 'D:\\AiPorject\\BabyIntegrityPlan\\图片素材\\GIF\\扣花_打击\\扣花_打击_%05d.png',
    output: 'girl-sad.gif',
    frames: 94,
    loop: false
  }
];

const outputDir = path.join(__dirname, '../public/animations');

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 开始批量转换动画...\n');

animations.forEach((anim, index) => {
  console.log(`[${index + 1}/${animations.length}] 转换: ${anim.name}`);
  console.log(`  帧数: ${anim.frames}`);
  console.log(`  循环: ${anim.loop ? '是' : '否'}`);
  
  const outputPath = path.join(outputDir, anim.output);
  
  // FFmpeg 命令：24fps, 352px 宽度, 优化调色板
  // -loop 0: 无限循环（常态动画）
  // -loop -1: 不循环，只播放1次（送花/扣花/庆祝/打击动画）
  const loopValue = anim.loop ? '0' : '-1';
  const command = `ffmpeg -y -framerate 24 -i "${anim.input}" -vf "scale=352:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" -loop ${loopValue} "${outputPath}"`;
  
  try {
    execSync(command, { stdio: 'pipe' });
    
    // 获取文件大小
    const stats = fs.statSync(outputPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    
    console.log(`  ✅ 完成: ${anim.output} (${sizeMB} MB)\n`);
  } catch (error) {
    console.error(`  ❌ 失败: ${error.message}\n`);
  }
});

console.log('🎉 所有动画转换完成！');
console.log(`📁 输出目录: ${outputDir}`);
