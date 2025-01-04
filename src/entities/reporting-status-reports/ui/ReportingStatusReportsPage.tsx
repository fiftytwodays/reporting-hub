import { Divider, Select, Space } from "antd";
import { months } from "../config/reporting-status-report";
import { data } from "../api/reporting-status-reports";
import { useState } from "react";
import ReportingStatusReportsList from "./ReportingStatusReportsList";

export default function ReportingStatusReportsPage() {
  const [isMonthSelected, setIsMonthSelected] = useState(false);

  return (
    <>
      <Space>
        <Select
          placeholder="Select month"
          options={months}
          onChange={() => setIsMonthSelected(true)}
        />
      </Space>
      <Divider />
      {isMonthSelected && <ReportingStatusReportsList data={data} />}
    </>
  );
}
