import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Progress } from 'antd';
import { DashboardOutlined, DatabaseOutlined, HddOutlined, SwapOutlined } from '@ant-design/icons';

import { CPUFormatter, SizeFormatter } from '@/utils';
import type { Status } from '@/models/status';

interface VitalRowProps {
  icon: ReactNode;
  label: string;
  percent: number;
  color: string;
  detail: string;
}

function VitalRow({ icon, label, percent, color, detail }: VitalRowProps) {
  return (
    <div className="ov-vital-row">
      <div className="ov-vital-row-head">
        <span className="ov-vital-row-label">
          <span className="ov-vital-row-icon" style={{ color }}>{icon}</span>
          {label}
        </span>
        <span className="ov-vital-row-percent">{percent.toFixed(1)}%</span>
      </div>
      <Progress percent={percent} showInfo={false} strokeColor={color} size="small" />
      <div className="ov-vital-row-detail">{detail}</div>
    </div>
  );
}

interface SystemVitalsCardProps {
  status: Status;
}

export default function SystemVitalsCard({ status }: SystemVitalsCardProps) {
  const { t } = useTranslation();
  const totalDisk = status.disk.total;
  const freeDisk = Math.max(0, totalDisk - status.disk.current);

  return (
    <Card hoverable className="ov-vitals-card" styles={{ body: { padding: 0 } }}>
      <div className="ov-vitals-card-head">
        <span className="ov-kicker">{t('pages.index.systemLoad')}</span>
      </div>

      <div className="ov-vitals-card-rows">
        <VitalRow
          icon={<DashboardOutlined />}
          label={t('pages.index.cpu')}
          percent={status.cpu.percent}
          color={status.cpu.color}
          detail={`${CPUFormatter.cpuCoreFormat(status.cpuCores)} / ${status.logicalPro}T · ${CPUFormatter.cpuSpeedFormat(status.cpuSpeedMhz)}`}
        />
        <VitalRow
          icon={<DatabaseOutlined />}
          label={t('pages.index.memory')}
          percent={status.mem.percent}
          color={status.mem.color}
          detail={`${SizeFormatter.sizeFormat(status.mem.current)} / ${SizeFormatter.sizeFormat(status.mem.total)}`}
        />
        <VitalRow
          icon={<SwapOutlined />}
          label={t('pages.index.swap')}
          percent={status.swap.percent}
          color={status.swap.color}
          detail={`${SizeFormatter.sizeFormat(status.swap.current)} / ${SizeFormatter.sizeFormat(status.swap.total)}`}
        />
        <VitalRow
          icon={<HddOutlined />}
          label={t('pages.index.storage')}
          percent={status.disk.percent}
          color={status.disk.color}
          detail={`${t('pages.index.free')} ${SizeFormatter.sizeFormat(freeDisk)} / ${SizeFormatter.sizeFormat(totalDisk)}`}
        />
      </div>
    </Card>
  );
}
