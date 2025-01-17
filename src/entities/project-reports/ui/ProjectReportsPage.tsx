import { Divider, Form, Select, Space } from "antd";
import { months, projects, clusters, years } from "../config/project-report";
import ProjectReportsList from "./ProjectReportsList";
import { data } from "../api/project-report";
import { useState } from "react";

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
        <Space>
          <Form.Item required>
            <Select
              placeholder="Select start year"
              options={years}
              onChange={() => setIsStartYearSelected(true)}
            />
          </Form.Item>
          <Form.Item required>
            <Select
              placeholder="Select end year"
              options={years}
              onChange={() => setIsEndYearSelected(true)}
            />
          </Form.Item>
          <Form.Item required>
            <Select
              placeholder="Select start month"
              options={months}
              onChange={() => setIsStartMonthSelected(true)}
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="Select end month"
              options={months}
              onChange={() => setIsEndMonthSelected(true)}
            />
          </Form.Item>
          <Form.Item>
            <Select
              options={clusters}
              placeholder="Select cluster"
              onChange={() => setIsClusterSelected(true)}
            />
          </Form.Item>
          <Form.Item>
            <Select
              options={projects}
              placeholder="Select project"
              onChange={() => setIsProjectSelected(true)}
            />
          </Form.Item>
        </Space>
      </Form>
      <Divider />
      { isStartYearSelected && isEndYearSelected && isStartMonthSelected && isEndMonthSelected && (isClusterSelected || isProjectSelected) && (
        <ProjectReportsList data={data} />
      )}
    </>
  );
}
