import { EntityList } from "@/shared/ui/entity-list";
import generateColumns from "../lib/generate-columns";
import { MonthlyForm } from "../config/types";
import { columns } from "../config/columns";

interface MonthlyFormsListProps {
  data: MonthlyForm[];
  isLoading: boolean;
<<<<<<< HEAD
}

export default function MonthlyFormsList({ data, isLoading }: MonthlyFormsListProps) {
=======
  handleEdit: (monthlyForm: MonthlyForm) => void;
  handleView: (monthlyForm: MonthlyForm) => void;
}

export default function MonthlyFormsList({ data, isLoading, handleView, handleEdit }: MonthlyFormsListProps) {
>>>>>>> 623b5ed (feat(monthly-form-proto): Design prototype for monthly form)
  return (
    <EntityList
      rowKey="id"
      columns={columns}
<<<<<<< HEAD
      mapColumn={(columns) => generateColumns(columns)}
=======
      mapColumn={(columns) => generateColumns(columns, handleView, handleEdit)}
>>>>>>> 623b5ed (feat(monthly-form-proto): Design prototype for monthly form)
      data={data}
      isLoading={isLoading}
    />
  );
}
