import { useTranslation } from 'react-i18next';
import { Card } from 'antd';
import { ExportOutlined, GithubOutlined, HeartOutlined, ReadOutlined } from '@ant-design/icons';

import { DOCS_URL, DONATE_URL, REPO_URL } from '@/constants/links';

const LINKS = [
  { key: 'documentation', href: DOCS_URL, icon: <ReadOutlined /> },
  { key: 'repository', href: REPO_URL, icon: <GithubOutlined /> },
  { key: 'support', href: DONATE_URL, icon: <HeartOutlined /> },
] as const;

export default function ResourceHubCard() {
  const { t } = useTranslation();

  return (
    <Card hoverable className="ov-hub-card" styles={{ body: { padding: 0 } }}>
      <div className="ov-vitals-card-head">
        <span className="ov-kicker">{t('pages.index.resourceHub')}</span>
      </div>

      <div className="ov-hub-list">
        {LINKS.map((link) => (
          <a
            key={link.key}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ov-hub-row"
          >
            <span className="ov-hub-row-icon">{link.icon}</span>
            <span className="ov-hub-row-label">{t(`pages.index.${link.key}`)}</span>
            <ExportOutlined className="ov-hub-row-ext" />
          </a>
        ))}
      </div>
    </Card>
  );
}
