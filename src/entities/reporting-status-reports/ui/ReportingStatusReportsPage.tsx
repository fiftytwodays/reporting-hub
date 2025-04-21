import { Divider, Select, Space } from "antd";
import { months, years } from "../config/reporting-status-report";
import { data } from "../api/reporting-status-reports-jwdnjn";
import dayjs from "dayjs";
import ReportingStatusReportsList from "./ReportingStatusReportsList";
import { ReportingStatusReport as ProjectReport } from "../config/types";
import useParameters from "@/entities/parameters/api/parameters-list";
import { useState } from "react";
import { useProjectReportStatus } from "../api/reporting-status-reports";

interface ReportingStatusReportsPageProps {
  setData: (record: ProjectReport[]) => void;
}

export default function ReportingStatusReportsPage({
  setData,
}: ReportingStatusReportsPageProps) {
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const { parametersList, isParametersListLoading } = useParameters({
    condition: true,
  });

  const {
    projectReportStatusReport,
    isreloadProjectReportStatusReportLoading,
    isreloadProjectReportStatusReportError,
  } = useProjectReportStatus({
    condition: isYearSelected && isMonthSelected,
    year: year,
    month: month,
  });

  const getYears = (baseYearParam: string | number) => {
    const baseYear = parseInt(baseYearParam.toString(), 10);
    const currentYear = isNaN(baseYear) ? new Date().getFullYear() : baseYear;

    return Array.from({ length: 10 }, (_, i) => {
      const year = currentYear + i;
      return {
        label: year.toString(),
        value: year.toString(),
      };
    });
  };

  const currentDate = dayjs();
  const currentMonth = currentDate.month(); // dayjs months are 0-indexed
  const currentYear =
    currentMonth == 0 ? currentDate.year() - 1 : currentDate.year();

  console.log("THe datakmdkm", projectReportStatusReport);

  const finalMonth = currentMonth > 0 ? currentMonth : 12;
  return (
    <>
      <Space>
        <Select
          options={getYears(
            parametersList?.startYear ?? new Date().getFullYear()
          )}
          placeholder="Select year"
          onChange={(value) => {
            setIsYearSelected(true);
            setYear(value);
          }}
        />
        <Select
          placeholder="Select month"
          options={months}
          onChange={(value) => {
            setIsMonthSelected(true);
            setMonth(value);
          }}
        />
      </Space>
      <Divider />
      {isYearSelected &&
        isMonthSelected &&
        !isreloadProjectReportStatusReportLoading && (
          <ReportingStatusReportsList
            data={projectReportStatusReport?.ReportingStatusReport || []}
          />
        )}
    </>
  );
}
