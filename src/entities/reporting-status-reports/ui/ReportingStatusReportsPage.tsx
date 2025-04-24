import { Divider, Select, Space, Spin } from "antd";
import { months, years } from "../config/reporting-status-report";
import dayjs from "dayjs";
import ReportingStatusReportsList from "./ReportingStatusReportsList";
import {
  ReportingStatusReport as ProjectReport,
  ReportingStatusReport,
} from "../config/types";
import useParameters from "@/entities/parameters/api/parameters-list";
import { useEffect, useState } from "react";
import { useProjectReportStatus } from "../api/reporting-status-reports";

interface ReportingStatusReportsPageProps {
  setData: (record: ReportingStatusReport[]) => void;
}

export default function ReportingStatusReportsPage({
  setData,
}: ReportingStatusReportsPageProps) {
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<string>("");
  const { parametersList, isParametersListLoading } = useParameters({
    condition: true,
  });

  useEffect(() => {
    const currentDate = dayjs();
    const currentYear = currentDate.year().toString();
    const currentDay = currentDate.date();
    const currentMonth = currentDate.month() + 1;
    const startDate = Number(parametersList?.monthlyFormStartDate || 0);
    const calculatedMonth =
      currentDay > startDate ? currentMonth : currentMonth - 1;

    const finalMonth = calculatedMonth > 0 ? calculatedMonth : 12;
    // Set selected values
    setYear(currentYear);
    setMonth(finalMonth);
  }, [parametersList]);

  const {
    projectReportStatusReport,
    isreloadProjectReportStatusReportLoading,
    isreloadProjectReportStatusReportError,
  } = useProjectReportStatus({
    condition: true,
    year: year,
    month: month?.toString() || "",
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

  const finalMonth = currentMonth > 0 ? currentMonth : 12;
  useEffect(() => {
    setData(projectReportStatusReport?.ReportingStatusReport || []);
  }, [projectReportStatusReport]);

  return (
    <>
      <Space>
        <Select
          options={getYears(
            parametersList?.startYear ?? new Date().getFullYear()
          )}
          placeholder="Select year"
          onChange={(value) => {
            setYear(value);
          }}
          value={year}
        />
        <Select
          placeholder="Select month"
          options={months}
          onChange={(value) => {
            setMonth(value);
          }}
          value={month}
        />
      </Space>
      <Divider />
      {isreloadProjectReportStatusReportLoading ? (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
          <Spin size="default" />
        </div>
      ) : (
        <ReportingStatusReportsList
          data={projectReportStatusReport?.ReportingStatusReport || []}
        />
      )}
    </>
  );
}
