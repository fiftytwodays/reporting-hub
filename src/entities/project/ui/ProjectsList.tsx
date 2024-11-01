import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import type { Project } from "../config/types";

interface ProjectListProps {
  data: Project[];
  isLoading: boolean;
}

export default function ProjectsList({ data, isLoading }: ProjectListProps) {
  return (
    <EntityList
      rowKey="Name"
      key="projects-list"
      columns={columns}
      data={data}
      isLoading={isLoading}
    />
  );
}
