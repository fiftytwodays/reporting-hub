import { Divider, Select, Space } from "antd";
import { months, projects } from "../config/project-report";
import ProjectReportsList from "./ProjectReportsList";
import { data } from "../api/project-report";
import { useState } from "react";

export default function ProjectReportsPage() {
  const [isProjectSelected, setIsProjectSelected] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);

  return (
    <>
      <Space>
        <Select
          options={projects}
          placeholder="Select project"
          onChange={() => setIsProjectSelected(true)}
        />
        <Select
          placeholder="Select month"
          options={months}
          onChange={() => setIsMonthSelected(true)}
        />
      </Space>
      <Divider />
      {isProjectSelected && isMonthSelected && (<ProjectReportsList
        data={data}
      />)}
    </>
  );
}
