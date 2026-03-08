/**
 * 图片优化脚本：将 public/images 下的 JPG/JPEG 转换为 WebP 格式
 * - Favorites 图片：最大宽度 800px，WebP 质量 80
 * - 头像图片：最大 200x200，WebP 质量 85
 *
 * 用法: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');

// 配置：不同目录使用不同的压缩参数
const CONFIG = {
  // Favorites 卡片图片：展示尺寸最大约 256px，留 800px 满足高清屏
  Favorites: { maxWidth: 800, quality: 80 },
  // 头像：展示尺寸 96px，留 200px 满足高清屏
  avatar: { maxWidth: 200, maxHeight: 200, quality: 85 },
};

async function processFile(inputPath, outputPath, options) {
  const { maxWidth, maxHeight, quality } = options;
  let pipeline = sharp(inputPath);
  
  // 获取原始图片信息
  const metadata = await pipeline.metadata();
  
  // 按需缩放
  if (maxHeight) {
    // 头像：正方形裁剪
    pipeline = pipeline.resize(maxWidth, maxHeight, { fit: 'cover' });
  } else if (metadata.width && metadata.width > maxWidth) {
    // 其他图片：仅在超出最大宽度时缩放
    pipeline = pipeline.resize(maxWidth, undefined, { withoutEnlargement: true });
  }

  await pipeline
    .webp({ quality })
    .toFile(outputPath);

  // 输出对比信息
  const inputStat = await stat(inputPath);
  const outputStat = await stat(outputPath);
  const saved = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);
  console.log(
    `✅ ${path.basename(inputPath)} (${(inputStat.size / 1024).toFixed(1)} KB) → ` +
    `${path.basename(outputPath)} (${(outputStat.size / 1024).toFixed(1)} KB) | 节省 ${saved}%`
  );
}

async function main() {
  console.log('🖼️  开始图片优化...\n');

  // 1. 处理 Favorites 目录
  const favDir = path.join(PUBLIC_IMAGES, 'Favorites');
  const favFiles = await readdir(favDir);
  
  for (const file of favFiles) {
    if (!/\.(jpg|jpeg)$/i.test(file)) continue;
    const inputPath = path.join(favDir, file);
    const outputName = file.replace(/\.(jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(favDir, outputName);
    await processFile(inputPath, outputPath, CONFIG.Favorites);
  }

  // 2. 处理头像
  const avatarInput = path.join(PUBLIC_IMAGES, 'user_admin.jpg');
  const avatarOutput = path.join(PUBLIC_IMAGES, 'user_admin.webp');
  try {
    await processFile(avatarInput, avatarOutput, CONFIG.avatar);
  } catch (e) {
    console.log(`⚠️  跳过头像: ${e.message}`);
  }

  console.log('\n🎉 图片优化完成！');
}

main().catch(console.error);
