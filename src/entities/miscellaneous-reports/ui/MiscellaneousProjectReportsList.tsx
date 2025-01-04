import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import { MiscellaneousProjectReport } from "../config/types";

interface ProjectReportProps {
  data: MiscellaneousProjectReport[];
}

export default function MiscellaneousProjectReportsList({ data }: ProjectReportProps) {
  return <EntityList rowKey="id" columns={columns} data={data} />;
}
