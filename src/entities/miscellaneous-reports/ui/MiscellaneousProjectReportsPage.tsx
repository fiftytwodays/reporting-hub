import { Button, Col, Divider, Row, Select, Space } from "antd";
import {
  months,
  years,
  miscellaneous,
} from "../config/miscellaneous-project-report";
import { data } from "../api/miscellaneous-project-report";
import { useEffect, useState } from "react";
import MiscellaneousProjectReportsList from "./MiscellaneousProjectReportsList";
import { ExportMiscellaneousReportButton } from "@/feature/export-miscellaneous-reports";
import { getMiscellaneousProjectReportsList } from "../api/miscellaneous-project-reports";
import { Condiment } from "next/font/google";
import useParameters from "@/entities/parameters/api/parameters-list";
import dayjs from "dayjs";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthName = (month: number) =>
  monthNames[month - 1] || "Invalid month";

export default function MiscellaneousProjectReportsPage() {
  const [isReportTypeSelected, setIsReportTypeSelected] = useState(false);
  const [miscTitle, setMiscTitle] = useState<string>("");
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<string>("");

  const { parametersList, isParametersListLoading } = useParameters({
    condition: true,
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
    miscellaneousProjectReport,
    isMiscellaneousProjectReportError,
    isMiscellaneousProjectReportLoading,
    reloadMiscellaneousReports,
  } = getMiscellaneousProjectReportsList({
    condition: !!miscTitle,
    year: year,
    month: month?.toString() || "",
  });

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>
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

            <Select
              placeholder="Select report type"
              options={miscellaneous}
              onChange={(value) => {
                setIsReportTypeSelected(true);
                setMiscTitle(value);
              }}
            />
          </Space>
        </Col>
        <Col>
          {!isMiscellaneousProjectReportLoading && (
            <ExportMiscellaneousReportButton
              data={
                miscellaneousProjectReport?.MiscellaneousProjectReports ?? []
              }
              miscTitle={miscTitle}
              month={getMonthName(Number(month))}
              year={year}
            />
          )}
        </Col>
      </Row>
      <Divider />
      {isReportTypeSelected && !isMiscellaneousProjectReportLoading && (
        <MiscellaneousProjectReportsList
          data={miscellaneousProjectReport?.MiscellaneousProjectReports ?? []}
          miscTitle={miscTitle}
        />
      )}
    </>
  );
}
