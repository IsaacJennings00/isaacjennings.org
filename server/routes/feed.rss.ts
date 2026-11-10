import { defineEventHandler, sendRedirect } from 'nitro/h3';

// The old static blog published feed.rss at the host root.
export default defineEventHandler((event) => sendRedirect(event, '/rss', 301));
