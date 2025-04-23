import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { YearlyPlan } from "../config/types";

interface YearlyPlansListProps {
  data: YearlyPlan[];
  isLoading: boolean;
  type: string;
  userId: string;
  handleEdit: (yearlyPlan: YearlyPlan) => void;
  handleDelete: (yearlyPlan: YearlyPlan) => void;
  handleView: (yearlyPlan: YearlyPlan) => void;
}

export default function YearlyPlansList({ data, isLoading, handleDelete, handleEdit, handleView, type, userId }: YearlyPlansListProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      mapColumn={(columns): any => generateColumns(columns, handleDelete, handleEdit, handleView, type, userId)}
      data={data}
      isLoading={isLoading}

    />
  );
}
