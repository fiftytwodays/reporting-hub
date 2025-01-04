import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import { ReportingStatusReport } from "../config/types";

interface ReportingStatusReportsProps {
  data: ReportingStatusReport[];
}

export default function ReportingStatusReportsList({ data }: ReportingStatusReportsProps) {
  return <EntityList rowKey="id" columns={columns} data={data} />;
}
