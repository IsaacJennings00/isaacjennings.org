import { createFileRoute } from '@tanstack/react-router';
import { localePage, localeWrap } from '@/i18n/localePage';
import Enthusiast from '@/components/about/Enthusiast';
export const Route = createFileRoute('/about')({
  ...localePage('about'),
  component: localeWrap(Enthusiast),
});
