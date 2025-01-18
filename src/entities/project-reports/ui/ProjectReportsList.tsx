import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import { ProjectReport } from "../config/types";
import ProjectReports from "./ProjectReport";

interface ProjectReportProps {
  data: ProjectReport[];
}

export default function ProjectReportsList({ data }: ProjectReportProps) {
  return <ProjectReports />;
}
