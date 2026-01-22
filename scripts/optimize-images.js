/**
 * 图片优化脚本
 * 自动将 JPG/PNG 转换为 WebP 格式
 * 
 * 使用方法:
 * node scripts/optimize-images.js
 */

import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 配置
const CONFIG = {
  inputDir: './public',
  outputDir: './public',
  quality: 85,
  extensions: ['.jpg', '.jpeg', '.png'],
  skipIfExists: true,
  // FFmpeg 路径 (Windows winget 安装位置)
  ffmpegPath: process.env.FFMPEG_PATH || 'ffmpeg',
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查 FFmpeg 是否安装
async function checkFFmpeg() {
  try {
    await execAsync(`"${CONFIG.ffmpegPath}" -version`);
    return true;
  } catch {
    // 尝试 Windows winget 安装的常见路径
    const wingetPath = 'C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin\\ffmpeg.exe';
    try {
      await execAsync(`"${wingetPath}" -version`);
      CONFIG.ffmpegPath = wingetPath;
      return true;
    } catch {
      return false;
    }
  }
}

// 获取文件大小
async function getFileSize(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

// 格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// 转换图片为 WebP
async function convertToWebP(inputPath, outputPath) {
  const command = `"${CONFIG.ffmpegPath}" -i "${inputPath}" -c:v libwebp -quality ${CONFIG.quality} -y "${outputPath}"`;
  
  try {
    await execAsync(command);
    return true;
  } catch (error) {
    log(`转换失败: ${error.message}`, 'red');
    return false;
  }
}

// 处理单个文件
async function processFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  
  if (!CONFIG.extensions.includes(ext)) {
    return;
  }

  const fileName = basename(filePath, ext);
  const outputPath = join(CONFIG.outputDir, `${fileName}.webp`);

  // 检查是否已存在
  if (CONFIG.skipIfExists) {
    const outputSize = await getFileSize(outputPath);
    if (outputSize > 0) {
      log(`⏭️  跳过 (已存在): ${fileName}.webp`, 'yellow');
      return;
    }
  }

  log(`🔄 转换中: ${basename(filePath)}`, 'blue');

  const inputSize = await getFileSize(filePath);
  const success = await convertToWebP(filePath, outputPath);

  if (success) {
    const outputSize = await getFileSize(outputPath);
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);
    
    log(
      `✅ 完成: ${fileName}.webp (${formatSize(inputSize)} → ${formatSize(outputSize)}, 节省 ${savings}%)`,
      'green'
    );
  }
}

// 扫描目录
async function scanDirectory(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // 跳过 node_modules 等目录
        if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
          const subFiles = await scanDirectory(fullPath);
          files.push(...subFiles);
        }
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    log(`读取目录失败: ${error.message}`, 'red');
  }
  
  return files;
}

// 主函数
async function main() {
  log('\n🖼️  图片优化工具\n', 'blue');

  // 检查 FFmpeg
  const hasFFmpeg = await checkFFmpeg();
  
  if (!hasFFmpeg) {
    log('❌ 错误: 未找到 FFmpeg', 'red');
    log('\n请先安装 FFmpeg:', 'yellow');
    log('  Windows: winget install FFmpeg', 'yellow');
    log('  或访问: https://ffmpeg.org/download.html\n', 'yellow');
    process.exit(1);
  }

  log('✅ FFmpeg 已安装\n', 'green');

  // 扫描文件
  log(`📁 扫描目录: ${CONFIG.inputDir}\n`, 'blue');
  const files = await scanDirectory(CONFIG.inputDir);
  
  const imageFiles = files.filter(f => 
    CONFIG.extensions.includes(extname(f).toLowerCase())
  );

  if (imageFiles.length === 0) {
    log('⚠️  未找到需要转换的图片', 'yellow');
    return;
  }

  log(`找到 ${imageFiles.length} 个图片文件\n`, 'blue');

  // 处理所有文件
  for (const file of imageFiles) {
    await processFile(file);
  }

  log('\n✨ 优化完成!\n', 'green');
}

// 运行
main().catch(error => {
  log(`\n❌ 发生错误: ${error.message}\n`, 'red');
  process.exit(1);
});
