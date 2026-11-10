// 頁面登記表：站上每一個有自己位置的頁面在這裡登記一筆，其他地方都從這裡讀。
//   導覽列與「關於」「更多」選單（layout/SiteNav、NavMenus）、首頁的衛星（home/HomeOrbit）、
//   命令面板（layout/CommandPalette）、sitemap 與 llms.txt（server/routes）、站台設定的頁面開關。
// 文字在語系檔的 siteNav.<key>；caps 是旁邊那行等寬的英文小字，各語系一樣。
//
// ⚠ 這個檔不 import 任何東西：server/routes 用相對路徑讀它，不走 `@/` alias。
// ⚠ 後端有兩份跟這裡對應的清單（handlers/site_config.rs 的 TOGGLEABLE_PAGES、handlers/og.rs 的 PAGES），
//   siteSections.test.ts 會比對，改了這裡記得兩邊一起改。

export interface SiteSection {
  key: string;
  to: string;
  caps: string;
  /** 去掉語系前綴、沒有開頭斜線的路徑，屬於這一區就回 true */
  match: (bare: string) => boolean;
}

export interface PageDef extends SiteSection {
  /** Set for a moon that leaves the site. `to` is unused for routing. */
  href?: string;
  /** 放在哪裡：首頁、導覽列的主要分區（＝首頁的一顆衛星）、「關於」選單、「更多」選單 */
  group: 'home' | 'main' | 'about' | 'more';
  /**
   * 站台設定能不能關掉這一頁（後端 TOGGLEABLE_PAGES 要一致）。
   * 手記與關於不能關：手記是 RSS、電子報、文章頁的根；關於是「關於」選單的家，關掉它底下那幾頁會無處可放
   */
  toggleable: boolean;
  /** 命令面板的搜尋別名：打英文、打舊名字都找得到 */
  keywords: string;
  /** 有的話列進 sitemap */
  sitemap?: { priority: string; changefreq: string };
  /** 列進 llms.txt 的「主要頁面」。說明用站長寫的頁面介紹，沒寫就用 locales/<語系>/server.json 的 llms.pages */
  llms?: true;
}

const under =
  (...roots: string[]) =>
  (bare: string) =>
    roots.some((r) => bare === r || bare.startsWith(`${r}/`));

export const PAGES: PageDef[] = [
  {
    key: 'home',
    to: '/',
    caps: 'HOME',
    match: (bare) => bare === '',
    group: 'home',
    toggleable: false,
    keywords: 'home index 首頁 主頁',
    sitemap: { priority: '1.0', changefreq: 'weekly' },
  },

  // Inner to outer: Blog, About, HelloNoon. The last one leaves the site.
  {
    key: 'notes',
    to: '/blog',
    caps: 'BLOG',
    match: under('blog'),
    group: 'main',
    toggleable: false,
    keywords: 'blog posts notes',
    sitemap: { priority: '0.9', changefreq: 'daily' },
    llms: true,
  },
  {
    key: 'about',
    to: '/about',
    caps: 'ABOUT',
    match: under('about'),
    group: 'main',
    toggleable: false,
    keywords: 'about enthusiast',
    sitemap: { priority: '0.7', changefreq: 'monthly' },
    llms: true,
  },
  {
    key: 'hellonoon',
    to: 'https://hellonoon.studio',
    href: 'https://hellonoon.studio',
    caps: 'HELLO NOON',
    match: () => false,
    group: 'main',
    toggleable: false,
    keywords: 'hellonoon studio',
  },
];

/** 五個主要分區：導覽列上的五個字、首頁的五顆衛星 */
export const MAIN_SECTIONS: PageDef[] = PAGES.filter((p) => p.group === 'main');

/** 收在「關於」選單裡的頁面 */
export const ABOUT_SECTIONS: PageDef[] = PAGES.filter((p) => p.group === 'about');

/** 收在「更多」裡的頁面 */
export const MORE_SECTIONS: PageDef[] = PAGES.filter((p) => p.group === 'more');

/** 站台設定能關掉的頁面 */
export const TOGGLEABLE_KEYS: string[] = PAGES.filter((p) => p.toggleable).map((p) => p.key);
