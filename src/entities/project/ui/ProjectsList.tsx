import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import type { Project } from "../config/types";
import generateColumns from "../lib/generate-columns";

interface ProjectListProps {
  data: Project[];
  isLoading: boolean;
  handleEdit: (project: Project) => void;
  handleDelete: (project: Project) => void;
}

export default function ProjectsList({
  data,
  isLoading,
  handleDelete,
  handleEdit,
}: ProjectListProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      mapColumn={(columns): any =>
        generateColumns(columns, handleDelete, handleEdit)
      }
      data={data}
      isLoading={isLoading}
    />
  );
}
