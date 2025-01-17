import { Divider, Select, Space } from "antd";
import { months } from "../config/reporting-status-report";
import { data } from "../api/reporting-status-reports";
import dayjs from "dayjs";
import ReportingStatusReportsList from "./ReportingStatusReportsList";

export default function ReportingStatusReportsPage() {
  const currentDate = dayjs();
  const currentMonth = currentDate.month(); // dayjs months are 0-indexed

  // Adjust for January (month 1) when subtracting 1 month
  const finalMonth = currentMonth > 0 ? currentMonth : 12;

  return (
    <>
      <Space>
        <Select
          placeholder="Select month"
          options={months}
          // onChange={}
          defaultValue={finalMonth}
        />
      </Space>
      <Divider />
      <ReportingStatusReportsList data={data} />
    </>
  );
}
