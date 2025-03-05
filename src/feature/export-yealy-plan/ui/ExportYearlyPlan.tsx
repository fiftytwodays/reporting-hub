import * as docx from "docx";
import React, { useState } from "react";
import { saveAs } from "file-saver"; // Optional, for browser download
import { Project } from "@/entities/project/config/types";
import useProjectsDetails from "../api/project-details";

const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
} = docx;

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

interface YearlyPlanExporterProps {
  yearlyPlanDetails: YearlyPlanDetails | undefined;
}

const YearlyPlanExporter: React.FC<YearlyPlanExporterProps> = ({
  yearlyPlanDetails,
}) => {
  if (!yearlyPlanDetails) {
    return <div>No plan details available.</div>; // Handle the case where data is undefined
  }

  const { projectsList, isProjectsListLoading } = useProjectsDetails({
    condition: true,
    projectId: yearlyPlanDetails.projectId ?? "",
  });

  const { user, year, quarterlyPlans, comments } = yearlyPlanDetails;

  const projectName = projectsList?.name; // Set default if projectId is undefined
  const projectLocation = projectsList?.location; // Placeholder
  const projectFacilitator = user || ""; // Placeholder

  // Helper function to map quarter to human-readable format
  const getQuarterTitle = (quarter: number): string => {
    switch (quarter) {
      case 1:
        return `Jan-Mar ${new Date().getFullYear()}`;
      case 2:
        return `Apr-Jun ${new Date().getFullYear()}`;
      case 3:
        return `Jul-Sep ${new Date().getFullYear()}`;
      case 4:
        return `Oct-Dec ${new Date().getFullYear()}`;
      default:
        return `Quarter ${quarter}`;
    }
  };

  // Function to generate the Plan Table for each quarter
  const generatePlanTable = (plans: PlanDetails[]) => {
    const rows = plans.map((plan) => {
      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(plan.activity)],
          }),
          new TableCell({
            children: [new Paragraph(plan.month.join(", "))],
          }),
          new TableCell({
            children: [new Paragraph(plan.functionalAreaId)],
          }),
          new TableCell({
            children: [new Paragraph(plan.isMajorGoal ? "Yes" : "No")],
          }),
          new TableCell({
            children: [new Paragraph(plan.comments || "No comments")],
          }),
        ],
      });
    });

    return new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Activity")],
            }),
            new TableCell({
              children: [new Paragraph("Months")],
            }),
            new TableCell({
              children: [new Paragraph("Functional Area ID")],
            }),
            new TableCell({
              children: [new Paragraph("Major Goal")],
            }),
            new TableCell({
              children: [new Paragraph("Comments")],
            }),
          ],
        }),
        ...rows,
      ],
    });
  };

  const generateYearlyPlanDoc = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `${projectName} Yearly Plan`,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: "Project Details",
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: `Project Name: ${projectName}`,
            }),
            new Paragraph({
              text: `Project Location: ${projectLocation}`,
            }),
            new Paragraph({
              text: `Project Facilitator: ${projectFacilitator}`,
            }),
            new Paragraph({
              text: `Plan Year: ${year}`,
            }),

            // Loop through each quarter and create the sections
            ...Object.entries(quarterlyPlans)
              .map(([quarter, quarterlyPlan]) => {
                const quarterTitle = getQuarterTitle(parseInt(quarter));
                const planTable = generatePlanTable(quarterlyPlan.plans);

                return [
                  new Paragraph({
                    text: quarterTitle,
                    heading: HeadingLevel.HEADING_2,
                  }),
                  planTable,
                ];
              })
              .flat(),

            new Paragraph({
              text: "Comments",
              heading: HeadingLevel.HEADING_2,
            }),

            new Paragraph({
              text: comments || "No additional comments provided.",
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Yearly-plan-${year}-${projectName}.docx`);
    });
  };

  return (
    <div>
      <h1>Export Yearly Plan</h1>
      <p>Project: {projectName}</p>
      <p>Year: {year}</p>
      <button onClick={generateYearlyPlanDoc}>Export Yearly Plan</button>
    </div>
  );
};

export default YearlyPlanExporter;
