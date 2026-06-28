import { useEffect, useState, useCallback } from 'react';
import { opportunitiesApi } from '../lib/api';
import { getSocket } from '../lib/socket';
import type { Opportunity } from '@opportunityos/shared';

import Briefing          from '../components/panels/Briefing';
import StatsBar          from '../components/panels/StatsBar';
import WeeklyPlan        from '../components/panels/WeeklyPlan';
import EligibilityEngine from '../components/panels/EligibilityEngine';
import OpportunityScore  from '../components/panels/OpportunityScore';
import SourcePlatforms   from '../components/panels/SourcePlatforms';
import CommunitySubmit   from '../components/panels/CommunitySubmit';
import OpportunityRadar  from '../components/panels/OpportunityRadar';
import AICopilot         from '../components/panels/AICopilot';
import KanbanBoard       from '../components/panels/KanbanBoard';
import GrowthAnalytics   from '../components/panels/GrowthAnalytics';
import RightPanel        from '../components/panels/RightPanel';

export default function CommandCenter() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOps = useCallback(async () => {
    try {
      const res = await opportunitiesApi.list({ sort: 'roi', limit: 20, actionableOnly: true });
      setOpportunities(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOps(); }, [fetchOps]);

  useEffect(() => {
    const socket = getSocket();
    socket.on('opportunity:new',     (op: Opportunity) => setOpportunities(p => [op, ...p]));
    socket.on('opportunity:updated', (op: Opportunity) => setOpportunities(p => p.map(o => o._id === op._id ? op : o)));
    return () => { socket.off('opportunity:new'); socket.off('opportunity:updated'); };
  }, []);

  const quickAction = async (id: string, status: string) => {
    try {
      await opportunitiesApi.update(id, { status: status as any });
      setOpportunities(p => p.map(o => o._id === id ? { ...o, status: status as any } : o));
    } catch (e) { console.error(e); }
  };

  const top5 = opportunities.slice(0, 5);
  const urgent = opportunities.filter(o => {
    const d = o.dates?.registrationDeadline ?? o.dates?.submissionDeadline;
    if (!d) return false;
    return (new Date(d).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 210px', minHeight: '100%' }}>
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, overflowX: 'hidden' }}>
        <Briefing        opportunities={top5} urgentCount={urgent.length} />
        <StatsBar        opportunities={opportunities} loading={loading} />
        <WeeklyPlan />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <EligibilityEngine opportunities={top5} />
          <OpportunityScore  opportunities={top5} />
        </div>
        <SourcePlatforms />
        <CommunitySubmit />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <OpportunityRadar opportunities={top5} onAction={quickAction} loading={loading} />
          <AICopilot />
        </div>
        <KanbanBoard     opportunities={opportunities} onAction={quickAction} />
        <GrowthAnalytics />
      </div>
      <RightPanel opportunities={top5} urgentCount={urgent.length} />
    </div>
  );
}