import { Divider, Form, Select, Space } from "antd";
import { months, projects, clusters, years } from "../config/project-report";
import ProjectReportsList from "./ProjectReportsList";
import { data } from "../api/project-report";
import { useState } from "react";
import { Page } from "@/shared/ui/page";
import { ExportProjectReportButton } from "@/feature/export-project-reports";

export default function ProjectReportsPage() {
  const [isProjectSelected, setIsProjectSelected] = useState(false);
  const [isStartMonthSelected, setIsStartMonthSelected] = useState(false);
  const [isEndMonthSelected, setIsEndMonthSelected] = useState(false);

  const [isStartYearSelected, setIsStartYearSelected] = useState(false);
  const [isEndYearSelected, setIsEndYearSelected] = useState(false);
  const [isClusterSelected, setIsClusterSelected] = useState(false);

  return (
    <>
      <Form>
        <Space style={{ paddingTop: "20px" }}>
          <Form.Item required label="Start year">
            <Select
              placeholder="Select start year"
              options={years}
              onChange={() => setIsStartYearSelected(true)}
            />
          </Form.Item>
          <Form.Item required label="Start month">
            <Select
              placeholder="Select start month"
              options={months}
              onChange={() => setIsStartMonthSelected(true)}
            />
          </Form.Item>
          <Form.Item required label="End year">
            <Select
              placeholder="Select end year"
              options={years}
              onChange={() => setIsEndYearSelected(true)}
            />
          </Form.Item>
          <Form.Item required label="End month">
            <Select
              placeholder="Select end month"
              options={months}
              onChange={() => setIsEndMonthSelected(true)}
            />
          </Form.Item>
          <Form.Item label="Cluster">
            <Select
              options={clusters}
              placeholder="Select cluster"
              onChange={() => setIsClusterSelected(true)}
            />
          </Form.Item>
          <Form.Item label="Project">
            <Select
              options={projects}
              placeholder="Select project"
              onChange={() => setIsProjectSelected(true)}
            />
          </Form.Item>
        </Space>
      </Form>
      <Divider style={{ marginTop: "5px" }} />
      {isStartYearSelected &&
        isEndYearSelected &&
        isStartMonthSelected &&
        isEndMonthSelected &&
        (isClusterSelected || isProjectSelected) && (
          <Page
            showPageHeader
            header={{
              title: "Project reports",
              extra: <ExportProjectReportButton data={data} isClusterSelected={isClusterSelected} isProjectSelected={isProjectSelected}/>,
            }}
            content={<ProjectReportsList data={data} />}
          />
        )}
    </>
  );
}
