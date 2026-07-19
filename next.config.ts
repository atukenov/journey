import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Фото хранятся локально (в т.ч. SVG-плейсхолдеры) и должны
  // открываться офлайн — оптимизатор изображений не нужен.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
