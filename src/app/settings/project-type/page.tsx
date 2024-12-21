"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { CreateProjectTypeModal } from "@/feature/create-project-type";
import { ProjectTypesList } from "@/widgets/project-types-list";

Amplify.configure(outputs);

export default function ClusterList() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Project types",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Project types",
            href: "/settings/project-types",
          },
        ],
        extra: <CreateProjectTypeModal messageApi={messageApi} />,
      }}
      content={<ProjectTypesList />}
    />
    </>
  );
}
