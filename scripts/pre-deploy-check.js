#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 确保项目可以成功部署到 Vercel
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 开始部署前检查...\n');

let errors = 0;
let warnings = 0;

// 检查文件
function checkFile(path, description) {
  const fullPath = join(rootDir, path);
  if (existsSync(fullPath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}缺失: ${path}`);
    errors++;
    return false;
  }
}

// 检查环境变量
function checkEnvVariables() {
  console.log('📋 检查环境变量配置...\n');
  
  const envPath = join(rootDir, '.env');
  if (!existsSync(envPath)) {
    console.log('⚠️  .env 文件不存在（生产环境将使用 Vercel 环境变量）');
    warnings++;
    return;
  }

  const envContent = readFileSync(envPath, 'utf-8');
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      console.log(`✅ ${varName} 已配置`);
    } else {
      console.log(`❌ ${varName} 未配置`);
      errors++;
    }
  });

  console.log('\n⚠️  提醒：部署到 Vercel 时需要在 Vercel Dashboard 中配置这些环境变量');
}

// 检查 package.json
function checkPackageJson() {
  console.log('\n📦 检查 package.json...\n');
  
  const packagePath = join(rootDir, 'package.json');
  if (!existsSync(packagePath)) {
    console.log('❌ package.json 不存在');
    errors++;
    return;
  }

  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  // 检查脚本
  const requiredScripts = ['dev', 'build', 'preview'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ 脚本 "${script}" 已配置`);
    } else {
      console.log(`❌ 脚本 "${script}" 未配置`);
      errors++;
    }
  });

  // 检查关键依赖
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const requiredDeps = ['react', 'vite', '@supabase/supabase-js'];
  
  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ 依赖 "${dep}" 已安装`);
    } else {
      console.log(`❌ 依赖 "${dep}" 未安装`);
      errors++;
    }
  });
}

// 检查构建配置
function checkBuildConfig() {
  console.log('\n🔧 检查构建配置...\n');
  
  checkFile('vite.config.ts', 'Vite 配置文件');
  checkFile('tsconfig.json', 'TypeScript 配置文件');
  checkFile('vercel.json', 'Vercel 配置文件');
}

// 检查 .gitignore
function checkGitignore() {
  console.log('\n🔒 检查 .gitignore...\n');
  
  const gitignorePath = join(rootDir, '.gitignore');
  if (!existsSync(gitignorePath)) {
    console.log('❌ .gitignore 不存在');
    errors++;
    return;
  }

  const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
  const requiredIgnores = ['.env', 'node_modules', 'dist'];
  
  requiredIgnores.forEach(pattern => {
    if (gitignoreContent.includes(pattern)) {
      console.log(`✅ .gitignore 包含 "${pattern}"`);
    } else {
      console.log(`⚠️  .gitignore 不包含 "${pattern}"`);
      warnings++;
    }
  });
}

// 尝试构建
function tryBuild() {
  console.log('\n🏗️  尝试构建项目...\n');
  
  try {
    console.log('运行: npm run build');
    execSync('npm run build', { 
      cwd: rootDir, 
      stdio: 'inherit',
      encoding: 'utf-8'
    });
    console.log('\n✅ 构建成功！');
  } catch (error) {
    console.log('\n❌ 构建失败！');
    console.log('请修复构建错误后再部署。');
    errors++;
  }
}

// 检查 Git 状态
function checkGitStatus() {
  console.log('\n📝 检查 Git 状态...\n');
  
  try {
    const status = execSync('git status --porcelain', { 
      cwd: rootDir,
      encoding: 'utf-8'
    });
    
    if (status.trim()) {
      console.log('⚠️  有未提交的更改：');
      console.log(status);
      console.log('建议先提交所有更改再部署。');
      warnings++;
    } else {
      console.log('✅ 所有更改已提交');
    }
  } catch (error) {
    console.log('⚠️  无法检查 Git 状态（可能未初始化 Git）');
    warnings++;
  }
}

// 主检查流程
async function main() {
  checkEnvVariables();
  checkPackageJson();
  checkBuildConfig();
  checkGitignore();
  checkGitStatus();
  
  // 询问是否要尝试构建
  console.log('\n' + '='.repeat(50));
  console.log('是否要尝试构建项目？(y/n)');
  console.log('='.repeat(50));
  
  // 在 CI 环境中自动跳过
  if (process.env.CI) {
    console.log('CI 环境，跳过构建测试');
  } else {
    // 这里简化处理，直接尝试构建
    tryBuild();
  }

  // 输出结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 检查结果');
  console.log('='.repeat(50));

  if (errors === 0 && warnings === 0) {
    console.log('✅ 所有检查通过！可以部署到 Vercel。');
    console.log('\n下一步：');
    console.log('1. 确保代码已推送到 GitHub');
    console.log('2. 在 Vercel 中导入项目');
    console.log('3. 配置环境变量');
    console.log('4. 点击部署');
    console.log('\n查看详细指南：VERCEL_DEPLOYMENT.md');
  } else {
    if (errors > 0) {
      console.log(`❌ 发现 ${errors} 个错误`);
    }
    if (warnings > 0) {
      console.log(`⚠️  发现 ${warnings} 个警告`);
    }
    console.log('\n请修复上述问题后重新运行检查。');
    process.exit(1);
  }

  console.log('\n💡 提示：');
  console.log('- 查看 VERCEL_QUICK_DEPLOY.md 了解快速部署步骤');
  console.log('- 查看 VERCEL_DEPLOYMENT.md 了解详细配置');
  console.log('- 确保在 Vercel 中配置环境变量');
}

main().catch(error => {
  console.error('检查过程出错：', error);
  process.exit(1);
});
