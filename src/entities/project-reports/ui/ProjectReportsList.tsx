import { ProjectReport } from "../config/types";
import ProjectReports from "./ProjectReport";
import { message } from "antd";

interface ProjectReportProps {
  data: ProjectReport[];
}

export default function ProjectReportsList({ data }: ProjectReportProps) {

  const handleExport = () => {
    message.success("Data exported successfully...")
  }

  return <ProjectReports handleExport={handleExport}/>;
}
