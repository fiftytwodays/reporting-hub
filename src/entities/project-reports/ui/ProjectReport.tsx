import { Table } from "antd";
import { columns } from "../config/columns";
import { data } from "../api/project-report";
import { MinusCircleTwoTone, PlusCircleTwoTone } from "@ant-design/icons";
import ExpandedContent from "./ExpandedContent";


export default function ProjectReports() {

    return(
        <Table
        rowKey="id"
        columns={columns}
        expandable={{
          expandedRowRender: (record) => <ExpandedContent record={record}/>,
        }}
        dataSource={data}
      />
    );

  }