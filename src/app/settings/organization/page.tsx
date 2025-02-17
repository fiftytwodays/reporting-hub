"use client";

import { Amplify } from "aws-amplify";

import Page from "@/shared/ui/page/ui/Page";
import { OrganizationsList } from "@/widgets/organizations-list";
import outputs from "@root/amplify_outputs.json";
import { message } from "antd";
import { useState } from "react";
import { EditButton } from "@/feature/edit-organization";

Amplify.configure(outputs);

export default function OrganizationList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: "Oraganization",
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },

            {
              title: "Organization",
              href: "/settings/organization",
            },
          ],
          extra: (
            <EditButton setIsEditing={setIsEditing} isEnabled={isEnabled} />
          ),
        }}
        content={
          <OrganizationsList
            setIsEnabled={setIsEnabled}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
          />
        }
      />
    </>
  );
}
