// Favorites 图片扫描与分类逻辑，从 Home.tsx 提取

// 使用 import.meta.glob 自动获取 public/images/Favorites 下的所有文件
// 键为形如 "/public/images/Favorites/LaLaLand_Movie.jpg" 的路径
const favoritesFiles = import.meta.glob('/public/images/Favorites/*.{jpg,jpeg,png,gif,webp}', { eager: true });

export interface FavoriteGroup {
  prefix: string;
  images: string[];
}

export interface CategoryGroup {
  category: string;
  groups: FavoriteGroup[];
}

const categorizedFavorites: CategoryGroup[] = [];

Object.keys(favoritesFiles).forEach(filepath => {
  // filepath like "/public/images/Favorites/LaLaLand_Movie.jpg"
  const filename = filepath.split('/').pop();
  if (!filename) return;
  
  // 按照 "_" 切割
  const nameWithoutExt = filename.split('.')[0];
  const parts = nameWithoutExt.split('_');
  const category = parts.pop() || 'Other';
  const prefix = parts[0] || nameWithoutExt; // 第一部分作为相同前缀判断依据
  const imgSrc = filepath.replace('/public', '');

  let categoryObj = categorizedFavorites.find(c => c.category === category);
  if (!categoryObj) {
    categoryObj = { category, groups: [] };
    categorizedFavorites.push(categoryObj);
  }

  let groupObj = categoryObj.groups.find(g => g.prefix === prefix);
  if (groupObj) {
    groupObj.images.push(imgSrc);
  } else {
    categoryObj.groups.push({ prefix, images: [imgSrc] });
  }
});

// 对外提供，为了保证分类展示顺序的一致性，按字母顺序进行排序
categorizedFavorites.sort((a, b) => a.category.localeCompare(b.category));

export { categorizedFavorites };
