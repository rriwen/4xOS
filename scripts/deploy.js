const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// 检查环境变量
const requiredEnvVars = [
  'ALIYUN_ACCESS_KEY_ID',
  'ALIYUN_ACCESS_KEY_SECRET',
  'ALIYUN_OSS_BUCKET',
  'ALIYUN_OSS_REGION'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ 缺少必需的环境变量:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n请创建 .env 文件并填入配置信息。参考 .env.example 文件。');
  process.exit(1);
}

const isDryRun = process.argv.includes('--dry-run');

// 初始化 OSS 客户端
const client = new OSS({
  region: process.env.ALIYUN_OSS_REGION,
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  bucket: process.env.ALIYUN_OSS_BUCKET,
  endpoint: process.env.ALIYUN_OSS_ENDPOINT || undefined
});

// 递归获取目录下所有文件
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// 上传文件到 OSS
async function uploadFile(localPath, remotePath) {
  try {
    if (isDryRun) {
      console.log(`[预览] 将上传: ${localPath} -> ${remotePath}`);
      return { success: true };
    }

    const result = await client.put(remotePath, localPath);
    return { success: true, result };
  } catch (error) {
    console.error(`❌ 上传失败 ${localPath}:`, error.message);
    return { success: false, error };
  }
}

// 配置静态网站托管
async function configureStaticWebsite() {
  try {
    if (isDryRun) {
      console.log('[预览] 将配置静态网站托管:');
      console.log('  - 默认首页: index.html');
      console.log('  - 错误页面: index.html');
      return;
    }

    await client.putBucketWebsite(process.env.ALIYUN_OSS_BUCKET, {
      index: 'index.html',
      error: 'index.html'
    });
    console.log('✅ 静态网站托管配置成功');
  } catch (error) {
    console.error('❌ 配置静态网站托管失败:', error.message);
    throw error;
  }
}

// 主部署函数
async function deploy() {
  console.log('🚀 开始部署到阿里云 OSS...\n');

  if (isDryRun) {
    console.log('⚠️  预览模式（不会实际上传文件）\n');
  }

  // 检查 dist 目录是否存在
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('📦 dist 目录不存在，开始构建项目...\n');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('\n✅ 构建完成\n');
    } catch (error) {
      console.error('❌ 构建失败');
      process.exit(1);
    }
  }

  // 获取所有需要上传的文件
  const files = getAllFiles(distPath);
  const totalFiles = files.length;
  console.log(`📁 找到 ${totalFiles} 个文件需要上传\n`);

  if (totalFiles === 0) {
    console.error('❌ dist 目录为空，请先运行 npm run build');
    process.exit(1);
  }

  // 上传文件
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = path.relative(distPath, file);
    const remotePath = relativePath.replace(/\\/g, '/'); // Windows 路径转 Unix 路径

    process.stdout.write(`[${i + 1}/${totalFiles}] 上传 ${relativePath}... `);

    const result = await uploadFile(file, remotePath);
    if (result.success) {
      successCount++;
      console.log('✅');
    } else {
      failCount++;
      console.log('❌');
    }
  }

  console.log(`\n📊 上传统计:`);
  console.log(`   ✅ 成功: ${successCount}`);
  console.log(`   ❌ 失败: ${failCount}`);

  if (failCount > 0 && !isDryRun) {
    console.error('\n❌ 部分文件上传失败，请检查错误信息');
    process.exit(1);
  }

  // 配置静态网站托管
  if (!isDryRun) {
    console.log('\n⚙️  配置静态网站托管...');
    try {
      await configureStaticWebsite();
    } catch (error) {
      console.error('\n⚠️  静态网站托管配置失败，请手动在阿里云控制台配置');
    }
  } else {
    await configureStaticWebsite();
  }

  // 显示访问地址
  const bucketName = process.env.ALIYUN_OSS_BUCKET;
  const region = process.env.ALIYUN_OSS_REGION;
  const websiteUrl = `https://${bucketName}.${region}.aliyuncs.com`;
  
  console.log('\n🎉 部署完成！');
  console.log(`\n📌 OSS 访问地址: ${websiteUrl}`);
  console.log(`📌 如果已配置域名，访问: https://rriwen4x.me`);
  console.log('\n💡 提示:');
  console.log('   - 如果使用自定义域名，请确保已配置 CNAME 解析');
  console.log('   - 建议配置 CDN 加速以提升访问速度');
  console.log('   - 建议配置 SSL 证书启用 HTTPS');
}

// 执行部署
deploy().catch(error => {
  console.error('\n❌ 部署过程中发生错误:', error);
  process.exit(1);
});
