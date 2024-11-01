import { ProjectsList as _ProjectsLists } from "@/entities/project";
import useProjectsList from "@/entities/project/api/project-list";

export default function ProjectsList({}) {
  const { projectsList, isProjectsListLoading } = useProjectsList({ condition: true });

  return <_ProjectsLists data={projectsList} isLoading={isProjectsListLoading} />;
}
