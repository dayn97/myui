import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

const TITLE_KEYS: Record<string, string> = {
  '/': 'menu.dashboard',
  '/inbounds': 'menu.inbounds',
  '/clients': 'menu.clients',
  '/groups': 'menu.groups',
  '/servers': 'menu.servers',
  // Keep descriptive titles for legacy bookmarks while their routes are hidden
  // from navigation (nodes redirects to servers; hosts is intentionally absent).
  '/nodes': 'menu.nodes',
  '/hosts': 'menu.hosts',
  '/settings': 'menu.settings',
  '/xray': 'menu.xray',
  '/outbound': 'menu.outbounds',
  '/routing': 'menu.routing',
  '/api-docs': 'menu.apiDocs',
};

export function usePageTitle() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const key = TITLE_KEYS[pathname];
    const title = key ? t(key) : '3X-UI';
    const host = window.location.hostname;
    document.title = host ? `${host} - ${title}` : title;
  }, [pathname, t]);
}
