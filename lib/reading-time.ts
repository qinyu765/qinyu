export function estimateReadingTime(markdown: string): number {
  const clean = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '')
    .replace(/!?\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~|>]/g, '');

  const cn = (clean.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) ?? []).length;
  const en = (clean.match(/[a-zA-Z]+/g) ?? []).length;

  return Math.max(1, Math.ceil(cn / 400 + en / 200));
}
