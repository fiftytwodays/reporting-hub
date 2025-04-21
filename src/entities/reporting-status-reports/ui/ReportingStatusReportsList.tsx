import { columns } from "../config/columns";
import { EntityList } from "@/shared/ui/entity-list";
import { ReportingStatusReport } from "../config/types";
import ExpandedContent from "./ExpandedContent";
import generateColumns from "../lib/generate-columns";

interface ReportingStatusReportsProps {
  data: ReportingStatusReport[];
}

export default function ReportingStatusReportsList({
  data,
}: ReportingStatusReportsProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      expandable={{
        expandedRowRender: (record: ReportingStatusReport) => (
          <ExpandedContent record={record} />
        ),
      }}
      data={data}
      mapColumn={(columns): any => generateColumns(columns)}
    />
  );
}
