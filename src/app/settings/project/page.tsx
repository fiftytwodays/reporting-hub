"use client";

import { Amplify } from "aws-amplify";

import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { ProjectsList } from "@/widgets/projects-list";

Amplify.configure(outputs);

export default function ProjectList() {
  return (
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
      }}
      content={<ProjectsList />}
    />
  );
}
