"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { ReportingStatusReportsList } from "@/widgets/reporting-status-reports";
import { useState } from "react";
import { ReportingStatusReport } from "@/entities/reporting-status-reports/config/types";
import { ExportMonthlyProjectReportButton } from "@/feature/export-project-monthly-reports";
Amplify.configure(outputs);

export default function ProjectReports() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [data, setData] = useState<ReportingStatusReport[]>();

  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: "Monthly report",
          extra: <ExportMonthlyProjectReportButton data={data} />,
        }}
        content={<ReportingStatusReportsList setData={setData} />}
      />
    </>
  );
}
