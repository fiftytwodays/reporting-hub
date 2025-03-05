import * as docx from "docx";
import React from "react";
import { saveAs } from "file-saver";
import { Project } from "@/entities/project/config/types";
import { Button } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import useFunctionalAreasList from "@/entities/functional-area/api/functional-areas-list";

const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
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
  projectDetails: Project | undefined;
}

const YearlyPlanExporter: React.FC<YearlyPlanExporterProps> = ({
  yearlyPlanDetails,
  projectDetails,
}) => {
  if (!yearlyPlanDetails) {
    return <div>No plan details available.</div>; // Handle the case where data is undefined
  }

  const { functionalAreasList } = useFunctionalAreasList({ condition: true });

  const { user, year, quarterlyPlans, comments } = yearlyPlanDetails;

  const projectName = projectDetails?.name; // Set default if projectId is undefined
  const projectLocation = projectDetails?.location; // Placeholder
  const projectFacilitator = user || ""; // Placeholder

  // Helper function to map quarter to human-readable format
  const getQuarterTitle = (quarter: number): string => {
    switch (quarter) {
      case 1:
        return `Apr-Jun ${new Date().getFullYear()}`;
      case 2:
        return `Jul-Sep ${new Date().getFullYear()}`;
      case 3:
        return `Oct-Dec ${new Date().getFullYear()}`;
      case 4:
        return `Jan-Mar ${new Date().getFullYear()}`;
      default:
        return `Quarter ${quarter}`;
    }
  };

  // Function to generate the Plan Table for each quarter
  const generatePlanTable = (plans: PlanDetails[]) => {
    const rows = plans.map((plan) => {
      const functionalArea = functionalAreasList.find(
        (area) => area.id === plan.functionalAreaId
      );
      return new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(plan.activity || "No activity")],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph(plan.month.join(", ") || "No months")],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [
              new Paragraph(functionalArea?.name || "No functional area"),
            ],
            width: { size: 25, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph(plan.isMajorGoal ? "Yes" : "No")],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph(plan.comments || "No comments")],
            width: { size: 15, type: WidthType.PERCENTAGE },
          }),
        ],
      });
    });

    // The table header needs to be created separately with bold text
    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Activity", bold: true })],
            }),
          ],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Months", bold: true })],
            }),
          ],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Functional area", bold: true })],
            }),
          ],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Major goal", bold: true })],
            }),
          ],
          width: { size: 10, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Comments", bold: true })],
            }),
          ],
          width: { size: 15, type: WidthType.PERCENTAGE },
        }),
      ],
    });

    // Return the full table with the header row and data rows
    return new Table({
      rows: [headerRow, ...rows],
      width: { size: 100, type: WidthType.PERCENTAGE },
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
              alignment: AlignmentType.CENTER,
              spacing: { before: 150, after: 150 },
            }),
            new Paragraph({
              text: "Project Details",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 100, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Name: ",
                  bold: true,
                }),
                new TextRun(projectName || "No project name"),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Location: ",
                  bold: true,
                }),
                new TextRun(projectLocation || "No location provided"),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Facilitator: ",
                  bold: true,
                }),
                new TextRun(projectFacilitator),
              ],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Plan Year: ",
                  bold: true,
                }),
                new TextRun(year || "No year provided"),
              ],
              spacing: { after: 50 },
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
                    alignment: "center",
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
    <Button
      type="primary"
      icon={<VerticalAlignBottomOutlined />}
      onClick={() => generateYearlyPlanDoc()}
    >
      Export yearly plan
    </Button>
  );
};

export default YearlyPlanExporter;
