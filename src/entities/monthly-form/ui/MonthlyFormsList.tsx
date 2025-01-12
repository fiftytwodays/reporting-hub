import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { MonthlyForm } from "../config/types";
import { columns } from "../config/columns";

interface MonthlyFormsListProps {
  data: MonthlyForm[];
  isLoading: boolean;
}

export default function MonthlyFormsList({ data, isLoading }: MonthlyFormsListProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      mapColumn={(columns) => generateColumns(columns)}
      data={data}
      isLoading={isLoading}
    />
  );
}
