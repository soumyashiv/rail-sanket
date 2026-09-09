import { PageHeader } from '@/components/page-header'
import { PlannerView } from '@/components/planner/planner-view'

export default function PlannerPage() {
  return (
    <div>
      <PageHeader
        badge="Week 38 · 14–20 Sep 2026"
        title="Block Planner"
        description="Schedule and deconflict corridor maintenance windows between train paths."
      />
      <PlannerView />
    </div>
  )
}
