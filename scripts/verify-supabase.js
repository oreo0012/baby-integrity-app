#!/usr/bin/env node

/**
 * Supabase 部署验证脚本
 * 检查所有必要的文件和配置是否正确
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 开始验证 Supabase 部署...\n');

let errors = 0;
let warnings = 0;

// 检查文件是否存在
function checkFile(path, description, required = true) {
  const fullPath = join(rootDir, path);
  if (existsSync(fullPath)) {
    console.log(`✅ ${description}: ${path}`);
    return true;
  } else {
    if (required) {
      console.log(`❌ ${description}缺失: ${path}`);
      errors++;
    } else {
      console.log(`⚠️  ${description}缺失（可选）: ${path}`);
      warnings++;
    }
    return false;
  }
}

// 检查环境变量
function checkEnvFile() {
  const envPath = join(rootDir, '.env');
  if (!existsSync(envPath)) {
    console.log('❌ .env 文件不存在');
    errors++;
    return;
  }

  const envContent = readFileSync(envPath, 'utf-8');
  
  if (envContent.includes('VITE_SUPABASE_URL=')) {
    console.log('✅ VITE_SUPABASE_URL 已配置');
  } else {
    console.log('❌ VITE_SUPABASE_URL 未配置');
    errors++;
  }

  if (envContent.includes('VITE_SUPABASE_ANON_KEY=')) {
    console.log('✅ VITE_SUPABASE_ANON_KEY 已配置');
  } else {
    console.log('❌ VITE_SUPABASE_ANON_KEY 未配置');
    errors++;
  }
}

// 检查 package.json 依赖
function checkDependencies() {
  const packagePath = join(rootDir, 'package.json');
  if (!existsSync(packagePath)) {
    console.log('❌ package.json 不存在');
    errors++;
    return;
  }

  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  if (deps['@supabase/supabase-js']) {
    console.log('✅ @supabase/supabase-js 已安装');
  } else {
    console.log('❌ @supabase/supabase-js 未安装');
    errors++;
  }
}

console.log('📦 检查核心文件...\n');

// 核心 Supabase 文件
checkFile('src/lib/supabase.ts', 'Supabase 客户端配置');
checkFile('src/lib/supabase-storage.ts', 'Supabase 存储层');
checkFile('src/lib/supabase-config.ts', 'Supabase 配置管理');
checkFile('src/lib/supabase-data-manager.ts', 'Supabase 数据管理器');

console.log('\n🔌 检查适配器文件...\n');

// 适配器文件
checkFile('src/lib/storage-adapter.ts', '存储适配器');
checkFile('src/lib/config-adapter.ts', '配置适配器');

console.log('\n🔐 检查认证文件...\n');

// 认证相关文件
checkFile('src/contexts/AuthContext.tsx', '认证上下文');
checkFile('src/components/AuthModal.tsx', '认证模态框');
checkFile('src/components/SettingsModal.tsx', '设置模态框');

console.log('\n⚙️  检查配置文件...\n');

// 配置文件
checkEnvFile();
checkFile('.env.example', '环境变量示例');
checkFile('.gitignore', 'Git 忽略配置');

console.log('\n📚 检查文档文件...\n');

// 文档文件
checkFile('SUPABASE_DEPLOYMENT.md', '部署文档');
checkFile('SUPABASE_INTEGRATION_GUIDE.md', '集成指南');
checkFile('SUPABASE_CHECKLIST.md', '检查清单');
checkFile('SUPABASE_README.md', 'Supabase 说明');

console.log('\n📦 检查依赖...\n');

checkDependencies();

console.log('\n' + '='.repeat(50));
console.log('📊 验证结果');
console.log('='.repeat(50));

if (errors === 0 && warnings === 0) {
  console.log('✅ 所有检查通过！Supabase 部署完成。');
  console.log('\n下一步：');
  console.log('1. 查看 SUPABASE_INTEGRATION_GUIDE.md 了解如何集成');
  console.log('2. 运行 npm run dev 启动开发服务器');
  console.log('3. 在应用中测试本地和云端模式');
} else {
  if (errors > 0) {
    console.log(`❌ 发现 ${errors} 个错误`);
  }
  if (warnings > 0) {
    console.log(`⚠️  发现 ${warnings} 个警告`);
  }
  console.log('\n请修复上述问题后重新运行验证。');
  process.exit(1);
}

console.log('\n💡 提示：');
console.log('- 确保 .env 文件不要提交到 Git');
console.log('- 查看 SUPABASE_CHECKLIST.md 了解待完成的集成步骤');
console.log('- 如有问题，请查看 SUPABASE_DEPLOYMENT.md');
