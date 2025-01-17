import { Divider, Select, Space } from "antd";
import {
  months,
  years,
  miscellaneous,
} from "../config/miscellaneous-project-report";
import { data } from "../api/miscellaneous-project-report";
import { useState } from "react";
import MiscellaneousProjectReportsList from "./MiscellaneousProjectReportsList";

export default function MiscellaneousProjectReportsPage() {
  const [isYearSelected, setIsYearSelected] = useState(false);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [isReportTypeSelected, setIsReportTypeSelected] = useState(false);
  const [miscTitle, setMiscTitle] = useState<string>("");

  return (
    <>
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
      <Divider />
      {isYearSelected && isMonthSelected && isReportTypeSelected && (
        <MiscellaneousProjectReportsList data={data} miscTitle={miscTitle}/>
      )}
    </>
  );
}
