"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { CreateRegionModal } from "@/feature/create-region";
import { RegionsList } from "@/widgets/regions-list";

Amplify.configure(outputs);

export default function ClusterList() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Regions",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Regions",
            href: "/settings/regions",
          },
        ],
        extra: <CreateRegionModal messageApi={messageApi} />,
      }}
      content={<RegionsList />}
    />
    </>
  );
}
