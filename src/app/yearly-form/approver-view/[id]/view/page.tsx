"use client";
import { Amplify } from "aws-amplify";

import { message } from "antd";
import Page from "@/shared/ui/page/ui/Page";
// import { CreateYearlyFormModal } from "@/feature/create-yearly-form";
import { CreateYearlyFormNew } from "@/feature/create-yearly-form";
import { MyFormsList } from "@/widgets/myforms-list";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useYearlyPlanDetails from "@/entities/yearly-form/api/yearlyplan-details";
// import {  useRouter } from "next/router";

import outputs from "@root/amplify_outputs.json";
import { ExportYearlyPlan } from "@/feature/export-yealy-plan";
import { useState, useEffect } from "react";
import useProjectDetail from "@/entities/project/api/project-details";
Amplify.configure(outputs);

interface PlanDetails {
  id: string;
  quarterlyPlanId: string;
  activity: string;
  month: string[];
  functionalAreaId: string;
  department?: string;
  comments?: string;
  isMajorGoal: boolean;
}

interface QuarterlyPlanDetails {
  id: string;
  yearlyPlanId: string;
  status?: string;
  reviewedBy?: string;
  approvedBy?: string;
  plans: PlanDetails[];
}

interface YearlyPlanDetails {
  id: string;
  user: string;
  userId: string;
  projectId?: string;
  comments?: string;
  status?: string;
  year?: string;
  reviewedBy?: string;
  approvedBy?: string;
  quarterlyPlans: Record<number, QuarterlyPlanDetails>; // Change: Key is quarter number
}

export default function MyForms({ params }: { params: { id: string } }) {
  const [yearlyPlanDetails, setyearlyPlanDetails] =
    useState<YearlyPlanDetails>();

  const id = params.id;
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 3,
  });

  const {
    yearlyPlanDetail,
  } = useYearlyPlanDetails({ condition: !!id }, id);

  // Conditionally call useProjectsDetails hook only if id is available
  const { projectData, isProjectsListLoading } = useProjectDetail({
    condition: !!id && !!yearlyPlanDetails?.projectId, // Only call when id and projectId are available
    projectId: yearlyPlanDetails?.projectId ?? "",
  });

  return (
    <>
      {contextHolder}
      <Page
        showPageHeader
        header={{
          title: `${
            yearlyPlanDetail?.projectName + " [" + yearlyPlanDetail?.year + "]"
          }`,
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },

            {
              title: "Yearly Plans",
              href: "/yearly-form/approver-view",
              menu: {
                items: [
                  {
                    key: "/yearly-form/my-forms",
                    label: "My Yearly Plans",
                  },
                  {
                    key: "/yearly-form/reviewer-view",
                    label: "Reviewer view",
                  },
                  {
                    key: "/yearly-form/approver-view",
                    label: "Approver view",
                  },
                ],
              },
            },
            {
              title: "Approver view",
              href: "/yearly-form/approver-view",
            },
          ],
          extra: (
            <ExportYearlyPlan
              yearlyPlanDetails={yearlyPlanDetails}
              projectDetails={projectData}
            />
          ),
        }}
        content={
          <CreateYearlyFormNew
            id={id}
            setyearlyPlanDetails={setyearlyPlanDetails}
            messageApi={messageApi}
            type="myformsview"
          />
        }
      />
    </>
  );
}
