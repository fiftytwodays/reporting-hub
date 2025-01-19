import { Divider, Select, Space } from "antd";
import { months, years } from "../config/reporting-status-report";
import { data } from "../api/reporting-status-reports";
import dayjs from "dayjs";
import ReportingStatusReportsList from "./ReportingStatusReportsList";
import { ProjectReport } from "@/entities/project-reports/config/types";

interface ReportingStatusReportsPageProps {
  setData: (record: ProjectReport[]) => void;
}

export default function ReportingStatusReportsPage({
  setData,
}: ReportingStatusReportsPageProps) {
  const currentDate = dayjs();
  const currentMonth = currentDate.month(); // dayjs months are 0-indexed
  const currentYear =
    currentMonth == 0 ? currentDate.year() - 1 : currentDate.year();
  setData(data);
  const finalMonth = currentMonth > 0 ? currentMonth : 12;

  return (
    <>
      <Space>
        <Select
          placeholder="Select year"
          options={years}
          // onChange={}
          defaultValue={currentYear}
        />
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
