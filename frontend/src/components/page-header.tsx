'use client';

import type { LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  Icon,
  actions
}: {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-title-wrap">
        <div className="page-icon">
          <Icon size={18} />
        </div>
        <div>
          <p className="page-kicker">Clinical Operations</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}
