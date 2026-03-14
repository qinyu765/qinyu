export interface TocItem {
  id: string;
  text: string;
  level: number;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .trim();
}

export function slugify(text: string): string {
  const normalized = text
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'section';
}

export function extractHeadings(markdown: string): TocItem[] {
  const lines = markdown.split(/\r?\n/);
  const headings: TocItem[] = [];
  const idCount = new Map<string, number>();
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = line.match(/^ {0,3}(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1].length;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    const baseId = slugify(text);
    const nextCount = (idCount.get(baseId) ?? 0) + 1;
    idCount.set(baseId, nextCount);
    const id = nextCount === 1 ? baseId : `${baseId}-${nextCount}`;

    headings.push({ id, text, level });
  }

  return headings;
}
