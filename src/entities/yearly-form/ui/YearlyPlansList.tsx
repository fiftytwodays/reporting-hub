import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { YearlyPlan } from "../config/types";

interface YearlyPlansListProps {
  data: YearlyPlan[];
  isLoading: boolean;
  handleEdit: (yearlyPlan: YearlyPlan) => void;
  handleDelete: (yearlyPlan: YearlyPlan) => void;
}

export default function YearlyPlansList({ data, isLoading, handleDelete, handleEdit }: YearlyPlansListProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      mapColumn={(columns) => generateColumns(columns, handleDelete, handleEdit)}
      data={data}
      isLoading={isLoading}

    />
  );
}
