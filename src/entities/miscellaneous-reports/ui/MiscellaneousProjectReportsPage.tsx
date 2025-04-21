import { Button, Col, Divider, Row, Select, Space } from "antd";
import {
  months,
  years,
  miscellaneous,
} from "../config/miscellaneous-project-report";
import { data } from "../api/miscellaneous-project-report";
import { useState } from "react";
import MiscellaneousProjectReportsList from "./MiscellaneousProjectReportsList";
import { ExportMiscellaneousReportButton } from "@/feature/export-miscellaneous-reports";
import { getMiscellaneousProjectReportsList } from "../api/miscellaneous-project-reports";
import { Condiment } from "next/font/google";
import useParameters from "@/entities/parameters/api/parameters-list";

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
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [isReportTypeSelected, setIsReportTypeSelected] = useState(false);
  const [miscTitle, setMiscTitle] = useState<string>("");
  const [month, setMonth] = useState<string>("");
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

  const {
    miscellaneousProjectReport,
    isMiscellaneousProjectReportError,
    isMiscellaneousProjectReportLoading,
    reloadMiscellaneousReports,
  } = getMiscellaneousProjectReportsList({
    condition: !!miscTitle,
    year: year,
    month: month,
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
          {isYearSelected &&
            isMonthSelected &&
            isReportTypeSelected &&
            !isMiscellaneousProjectReportLoading && (
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
      {isYearSelected &&
        isMonthSelected &&
        isReportTypeSelected &&
        !isMiscellaneousProjectReportLoading && (
          <MiscellaneousProjectReportsList
            data={miscellaneousProjectReport?.MiscellaneousProjectReports ?? []}
            miscTitle={miscTitle}
          />
        )}
    </>
  );
}
