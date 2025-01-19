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

export default function MiscellaneousProjectReportsPage() {
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [isReportTypeSelected, setIsReportTypeSelected] = useState(false);
  const [miscTitle, setMiscTitle] = useState<string>("");

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Select
              options={years}
              placeholder="Select year"
              onChange={() => setIsYearSelected(true)}
            />
            <Select
              placeholder="Select month"
              options={months}
              onChange={() => setIsMonthSelected(true)}
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
          {isYearSelected && isMonthSelected && isReportTypeSelected && (
            <ExportMiscellaneousReportButton data={data} />
          )}
        </Col>
      </Row>
      <Divider />
      {isYearSelected && isMonthSelected && isReportTypeSelected && (
        <MiscellaneousProjectReportsList data={data} miscTitle={miscTitle} />
      )}
    </>
  );
}
