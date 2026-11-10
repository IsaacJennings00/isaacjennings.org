import type { ComponentProps } from 'react';
import { LocaleLink } from '@/i18n/locale-link';
import type { PageDef } from '@/data/siteSections';

type Props = Omit<ComponentProps<typeof LocaleLink>, 'to'> & { section: PageDef };

/** In-app moons stay in the router. HelloNoon is a normal external link. */
export function SectionLink({ section, children, ...rest }: Props) {
  if (section.href) {
    return (
      <a href={section.href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <LocaleLink to={section.to} {...rest}>
      {children}
    </LocaleLink>
  );
}
