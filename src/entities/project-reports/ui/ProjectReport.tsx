import { Table } from "antd";
import { columns } from "../config/columns";
import { data } from "../api/project-report";
import { MinusCircleTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import ExpandedContent from "./ExpandedContent";
import generateColumns from "../lib/generate-columns";
import { ProjectReport } from "../config/types";
import { EntityList } from "@/shared/ui/entity-list";

interface ProjectReportsProps {
  handleExport: (data: ProjectReport) => void;
}

export default function ProjectReports({ handleExport }: ProjectReportsProps) {
  return (
    <EntityList
      rowKey="id"
      columns={columns}
      expandable={{
        expandedRowRender: (record: ProjectReport) => (
          <ExpandedContent record={record} />
        ),
      }}
      data={data}
      mapColumn={(columns): any => generateColumns(columns, handleExport)}
    />
  );
}
