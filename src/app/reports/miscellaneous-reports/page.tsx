"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { CreateClusterModal } from "@/feature/create-cluster";
import ClustersList from "@/widgets/clusters-list/ui/ClustersList";
import { ProjectReportList } from "@/widgets/project-reports";
import MiscellaneousProjectReportsList from "@/widgets/miscellaneous-project-reports/ui/MiscellaneousProjectReportList";

Amplify.configure(outputs);

export default function ProjectReports() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Miscellaneous reports",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Miscellaneous reports",
            href: "/reports/miscellaneous-reports",
          },
        ],
      }}
      content={<MiscellaneousProjectReportsList />}
    />
    </>
  );
}
