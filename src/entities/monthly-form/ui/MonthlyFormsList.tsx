import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { MonthlyForm } from "../config/types";
import { columns } from "../config/columns";

interface MonthlyFormsListProps {
  data: MonthlyForm[];
  isLoading: boolean;
  handleEdit: (monthlyForm: MonthlyForm) => void;
  handleView: (monthlyForm: MonthlyForm) => void;
}

export default function MonthlyFormsList({ data, isLoading, handleView, handleEdit }: MonthlyFormsListProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      mapColumn={(columns) => generateColumns(columns, handleView, handleEdit)}
      data={data}
      isLoading={isLoading}
    />
  );
}
