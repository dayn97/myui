import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Layout,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudDownloadOutlined,
  CloudServerOutlined,
  CloudUploadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { useNodesQuery } from '@/api/queries/useNodesQuery';
import type { NodeRecord } from '@/api/queries/useNodesQuery';
import AppSidebar from '@/layouts/AppSidebar';
import './ServersPage.css';

function clampPercent(value?: number) {
  return Math.max(0, Math.min(100, value ?? 0));
}

function formatRate(value?: number) {
  const bytes = Math.max(0, value ?? 0);
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB/s`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB/s`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
  return `${Math.round(bytes)} B/s`;
}

function formatUptime(seconds?: number) {
  const total = Math.max(0, seconds ?? 0);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function ServerCard({ server }: { server: NodeRecord }) {
  const { t } = useTranslation();
  const online = server.enable !== false && server.status === 'online';
  const address = [server.address, server.port].filter(Boolean).join(':');

  return (
    <Card className="server-monitor-card">
      <div className="server-monitor-head">
        <Space size={10}>
          <CloudServerOutlined className="server-monitor-icon" />
          <div>
            <Typography.Title level={5}>{server.name || address || t('menu.servers')}</Typography.Title>
            <Typography.Text type="secondary">{server.remark || address || '-'}</Typography.Text>
          </div>
        </Space>
        <Tag color={online ? 'success' : 'error'} icon={online ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {t(online ? 'online' : 'offline')}
        </Tag>
      </div>

      <div className="server-monitor-resources">
        <div><span>CPU</span><Progress percent={Math.round(clampPercent(server.cpuPct))} size="small" /></div>
        <div><span>{t('pages.servers.memory', { defaultValue: 'Memory' })}</span><Progress percent={Math.round(clampPercent(server.memPct))} size="small" /></div>
      </div>

      <Row gutter={[12, 12]} className="server-monitor-stats">
        <Col xs={12} md={6}><Statistic title={t('pages.servers.upload', { defaultValue: 'Upload' })} value={formatRate(server.netUp)} prefix={<CloudUploadOutlined />} /></Col>
        <Col xs={12} md={6}><Statistic title={t('pages.servers.download', { defaultValue: 'Download' })} value={formatRate(server.netDown)} prefix={<CloudDownloadOutlined />} /></Col>
        <Col xs={12} md={6}><Statistic title={t('pages.servers.latency', { defaultValue: 'Latency' })} value={server.latencyMs ?? 0} suffix="ms" /></Col>
        <Col xs={12} md={6}><Statistic title={t('pages.servers.uptime', { defaultValue: 'Uptime' })} value={formatUptime(server.uptimeSecs)} /></Col>
      </Row>

      {server.lastError && !online ? <Alert type="warning" showIcon title={server.lastError} /> : null}
    </Card>
  );
}

export default function ServersPage() {
  const { t } = useTranslation();
  const { nodes, totals, loading, fetched, fetchError, refetch } = useNodesQuery();
  const servers = useMemo(() => nodes.filter((node) => !node.transitive), [nodes]);

  return (
    <Layout className="page-layout">
      <AppSidebar />
      <Layout.Content className="page-content server-monitor-page">
        <div className="server-monitor-title">
          <div>
            <Typography.Title level={2}>{t('menu.servers')}</Typography.Title>
            <Typography.Text type="secondary">{t('pages.servers.description', { defaultValue: 'Lightweight health and resource monitoring for your servers.' })}</Typography.Text>
          </div>
          <Button icon={<ReloadOutlined />} loading={loading} onClick={() => refetch()}>{t('refresh')}</Button>
        </div>

        <Row gutter={[12, 12]} className="server-monitor-summary">
          <Col xs={12} md={6}><Card><Statistic title={t('pages.servers.total', { defaultValue: 'Servers' })} value={totals.total} /></Card></Col>
          <Col xs={12} md={6}><Card><Statistic title={t('online')} value={totals.online} valueStyle={{ color: '#3fba83' }} /></Card></Col>
          <Col xs={12} md={6}><Card><Statistic title={t('offline')} value={totals.offline} valueStyle={{ color: '#e85d75' }} /></Card></Col>
          <Col xs={12} md={6}><Card><Statistic title={t('pages.servers.avgLatency', { defaultValue: 'Avg Latency' })} value={totals.avgLatency} suffix="ms" /></Card></Col>
        </Row>

        {fetchError ? <Alert type="error" showIcon title={fetchError} /> : null}
        {!fetched && loading ? <div className="server-monitor-loading"><Spin size="large" /></div> : null}
        {fetched && servers.length === 0 ? <Card><Empty description={t('pages.servers.empty', { defaultValue: 'No monitored servers yet.' })} /></Card> : null}
        <div className="server-monitor-grid">
          {servers.map((server) => <ServerCard key={server.id || server.guid} server={server} />)}
        </div>
      </Layout.Content>
    </Layout>
  );
}
