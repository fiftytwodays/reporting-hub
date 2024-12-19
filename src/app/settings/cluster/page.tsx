"use client";

import { Amplify } from "aws-amplify";

import { message } from "antd";
import outputs from "@root/amplify_outputs.json";
import Page from "@/shared/ui/page/ui/Page";
import { CreateClusterModal } from "@/feature/create-cluster";
import ClustersList from "@/widgets/clusters-list/ui/ClustersList";

Amplify.configure(outputs);

export default function ClusterList() {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });
  return (
    <>
     {contextHolder}
    <Page
    showPageHeader
      header={{
        title: "Clusters",
        breadcrumbs: [
          {
            title: "Home",
            href: "/",
          },

          {
            title: "Clusters",
            href: "/settings/clusters",
          },
        ],
        extra: <CreateClusterModal messageApi={messageApi} />,
      }}
      content={<ClustersList />}
    />
    </>
  );
}
