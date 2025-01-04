import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import { ProjectReport } from "../config/types";

interface ProjectReportProps {
  data: ProjectReport[];
}

export default function ProjectReportsList({ data }: ProjectReportProps) {
  return <EntityList rowKey="id" columns={columns} data={data} />;
}
