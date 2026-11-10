/** blog.isaacjennings.org serves the same app, with / as the blog index. */
export const BLOG_HOST = 'blog.isaacjennings.org';

export function isBlogHost(host: string | null | undefined): boolean {
  return (host ?? '').split(':')[0].toLowerCase() === BLOG_HOST;
}
