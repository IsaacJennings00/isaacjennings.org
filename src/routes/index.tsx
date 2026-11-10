import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie, getRequestHeader } from '@tanstack/react-start/server';
import { buildAlternateLinks, localeFromPrefix, pickLocaleFromAcceptLanguage } from '@/i18n/start-i18n';
import { localeWrap } from '@/i18n/localePage';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { isBotUserAgent } from '../lib/bot';
import { isBlogHost } from '@/lib/blogHost';
import { defaultLocale, prefixOf, type Locale } from '../lib/locales';
import MainPage from '@/components/home/MainPage';
import Notes from '@/components/blog/Notes';
import { blogCategoriesQueryOptions, postsListQueryOptions } from '@/data/blogList';
import { prefetchPageContent } from '@/data/pageContent';
import { blogListJsonLd, siteJsonLd } from '@/seo/seoMeta';
import { seoMetaFor } from '@/seo/pageSeo';

// server-only:讀 UA / cookie / Accept-Language → 決定首頁要導向哪個 locale。
// 包在 createServerFn 裡,server-only 的 header API 才不會被打進 client bundle。
const detectBlogHost = createServerFn({ method: 'GET' }).handler(() => isBlogHost(getRequestHeader('host')));

const detectLocale = createServerFn({ method: 'GET' }).handler((): Locale => {
  // bot 不導 → 讓爬蟲停在預設 zh-TW,各語言交給 hreflang 索引。
  if (isBotUserAgent(getRequestHeader('user-agent'))) return defaultLocale();
  // 使用者選過語言(cookie)優先;否則用瀏覽器 Accept-Language。
  const cookieRaw = getCookie('koim_locale');
  return (
    (cookieRaw ? localeFromPrefix(cookieRaw) : null) ??
    pickLocaleFromAcceptLanguage(getRequestHeader('accept-language'))
  );
});

// 預設語言(zh-TW)無前綴首頁 +「依 Accept-Language 自動導向」入口。
// `/` 不進 prerender(見 vite.config.start.ts 的 filter)→ 每次請求都在 server 跑 beforeLoad。
const BlogHome = localeWrap(Notes);

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const blog = typeof window !== 'undefined' ? isBlogHost(window.location.host) : await detectBlogHost();
    if (blog) return { surface: 'blog' as const };
    if (typeof window !== 'undefined') return { surface: 'home' as const };
    const target = await detectLocale();
    if (target !== defaultLocale()) throw redirect({ href: `/${prefixOf(target)}`, statusCode: 302 });
    return { surface: 'home' as const };
  },
  head: ({ match }) =>
    match.context.surface === 'blog'
      ? {
          meta: seoMetaFor('blog', defaultLocale(), '/'),
          scripts: [blogListJsonLd(defaultLocale())],
          links: buildAlternateLinks('blog', defaultLocale()),
        }
      : {
          meta: seoMetaFor('', defaultLocale(), '/'),
          scripts: [siteJsonLd(defaultLocale())],
          links: buildAlternateLinks('', defaultLocale()),
        },
  loader: ({ context }) =>
    context.surface === 'blog'
      ? Promise.all([
          context.queryClient.prefetchQuery(postsListQueryOptions(defaultLocale(), 'newest')),
          context.queryClient.prefetchQuery(blogCategoriesQueryOptions(defaultLocale())),
        ])
      : prefetchPageContent(context.queryClient, ''),
  component: function Home() {
    const { surface } = Route.useRouteContext();
    if (surface === 'blog') return <BlogHome />;
    return (
      <LocaleProvider locale={defaultLocale()}>
        <MainPage />
      </LocaleProvider>
    );
  },
});
