import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import { MiscellaneousProjectReport } from "../config/types";
import mapToAntDColumns from "../lib/map-to-antd-columns";

interface ProjectReportProps {
  data: MiscellaneousProjectReport[];
  miscTitle: string;
}

export default function MiscellaneousProjectReportsList({
  data,
  miscTitle,
}: ProjectReportProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns(miscTitle)}
      data={data}
      mapColumn={mapToAntDColumns}
    />
  );
}
