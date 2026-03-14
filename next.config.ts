import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // output: export 仅在生产构建时启用，dev 模式下中文 slug 与 generateStaticParams 存在兼容性问题
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' as const } : {}),
  images: {
    unoptimized: true,
  },
}

export default nextConfig
