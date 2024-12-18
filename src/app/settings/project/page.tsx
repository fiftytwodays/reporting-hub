"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { ProjectsList } from "@/widgets/projects-list";
import { CreateProjectModal } from "@/feature/create-project"

Amplify.configure(outputs);

export default function ProjectList() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Projects",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Projects",
            href: "/settings/project",
          },
        ],
        extra: <CreateProjectModal messageApi={messageApi} />,
      }}
      content={<ProjectsList />}
    />
    </>
  );
}
