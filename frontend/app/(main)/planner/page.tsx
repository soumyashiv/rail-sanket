import { PageHeader } from '@/components/page-header'
import { PlannerView } from '@/components/planner/planner-view'

export default function PlannerPage() {
  return (
    <div>
      <PageHeader
        badge="WEEKLY OPERATIONAL PLAN · 14–20 SEP 2026"
        title="Auto Block Planner & Gantt Horizon"
        description="The constraint-based optimizer fits maintenance blocks into feasible windows between train paths, respecting corridor capacity, block-type compatibility, and safety buffers. Switch between Timeline Gantt and Physical Track Network schematic."
      />
      <PlannerView />
    </div>
  )
}
