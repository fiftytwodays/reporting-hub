"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { ReportingStatusReportsList } from "@/widgets/reporting-status-reports";
import { ExportProjectReportButton } from "@/feature/export-project-reports";
import { useState } from "react";
import { ProjectReport } from "@/entities/project-reports/config/types";
import { data as record } from "@/entities/reporting-status-reports/api/reporting-status-reports";
Amplify.configure(outputs);

export default function ProjectReports() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });
  const [data, setData] = useState<ProjectReport[]>();
  
  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: "Monthly report",
          extra: <ExportProjectReportButton data={data} />,
        }}
        content={<ReportingStatusReportsList setData={setData}/>}
      />
    </>
  );
}
