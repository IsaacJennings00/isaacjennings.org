import { createFileRoute } from '@tanstack/react-router';
import { localePagePrefixed, localeWrap } from '@/i18n/localePage';
import Enthusiast from '@/components/about/Enthusiast';
export const Route = createFileRoute('/$locale/about')({
  ...localePagePrefixed('about'),
  component: localeWrap(Enthusiast),
});
