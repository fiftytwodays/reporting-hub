import { Button, message } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  AlignmentType,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import {
  ProjectReport,
  MonthlyGoal,
  NextMonthGoal,
} from "@/entities/project-reports/config/types";

interface ExportProjectReportButtonProps {
  data: ProjectReport[] | undefined;
}

const createTable = (data: any[], columns: string[]) => {
  const tableRows = data.map((item) => {
    return new TableRow({
      children: columns.map((col) => {
        return new TableCell({
          children: [
            new Paragraph({
              text: item[col] || "",
              alignment: AlignmentType.LEFT,
            }),
          ],
          width: { size: 25, type: WidthType.PERCENTAGE },
        });
      }),
    });
  });

  const headerRow = new TableRow({
    children: columns.map((col) => {
      return new TableCell({
        children: [
          new Paragraph({
            text: col,
            // bold: true,
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: { size: 25, type: WidthType.PERCENTAGE },
      });
    }),
  });

  return new Table({
    rows: [headerRow, ...tableRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
};

export default function ExportProjectReportButton({
  data,
}: ExportProjectReportButtonProps) {
  const exportDocument = (projectReports: ProjectReport[]) => {
    const groupedReports = projectReports.reduce((acc, report) => {
      if (!acc[report.project]) {
        acc[report.project] = [];
      }
      acc[report.project].push(report);
      return acc;
    }, {} as Record<string, ProjectReport[]>);

    const documentContent = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: "Heading1",
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Project Report",
            size: 32,
            bold: true,
          }),
        ],
      }),

      // Loop through projects and create content for each project
      ...Object.entries(groupedReports).flatMap(([projectName, reports]) => [
        // Center and highlight project name with larger font size
        new Paragraph({
          children: [new TextRun({ text: projectName, size: 24, bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "───────────────────────────────────────────────────────────────",
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),

        // Loop through the reports and create content for each facilitator
        ...reports.flatMap((report) => [
          // Facilitator and other details
          new Paragraph({
            children: [
              new TextRun({
                text: `Facilitator: ${report.facilitator}`,
                size: 16,
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: `Cluster: ${report.cluster}`,
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: `Region: ${report.region}`,
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: `Status: ${report.status}`,
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: `Date: ${report.date}`,
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: `Reporting Month: ${report.reportingMonth}`,
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: `Year: ${report.year}`,
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          // Add sections without dashed lines between the headings and content
          new Paragraph({
            children: [
              new TextRun({
                text: "Outcomes from the month just ended",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { after: 200 },
          }),

          createTable(report.goalsFromLastMonth, [
            "goal",
            "functionalArea",
            "achieved",
            "reason",
            "comments",
          ]),

          new Paragraph({
            text: "",
            style: "Line",
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Additional activities other than that was planned",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { after: 200 },
          }),

          createTable(report.additionalActivities, [
            "goal",
            "functionalArea",
            "achieved",
            "reason",
            "comments",
          ]),

          new Paragraph({
            text: "",
            style: "Line",
            spacing: { after: 300 },
          }),

          // Goals for next month section

          new Paragraph({
            children: [
              new TextRun({
                text: "Goals for next month",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { after: 200 },
          }),

          createTable(report.nextMonthGoal, [
            "goal",
            "functionalArea",
            "comments",
          ]),

          new Paragraph({
            text: "",
            style: "Line",
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Additional activities for next month",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { after: 200 },
          }),

          createTable(report.nextMonthAdditional, [
            "goal",
            "functionalArea",
            "comments",
          ]),

          new Paragraph({
            text: "",
            style: "Line",
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Praise Points / Prayer Requests",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Praise for",
                size: 16,
                bold: true,
              }),
            ],
            heading: "Heading3",
            spacing: { after: 100 },
          }),

          ...(report.praisePoints && report.praisePoints.length > 0
            ? report.praisePoints.map(
                (point, index) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: point,
                        size: 14,
                      }),
                    ],
                    bullet: { level: 1 },
                    spacing: { after: 100 },
                  })
              )
            : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "No praise points available.",
                      size: 14,
                    }),
                  ],
                }),
              ]),

          new Paragraph({
            children: [
              new TextRun({
                text: "Pray for",
                size: 16,
                bold: true,
              }),
            ],
            heading: "Heading3",
            spacing: { after: 100 },
          }),
          ...(report.prayerRequests && report.prayerRequests.length > 0
            ? report.prayerRequests.map(
                (request, index) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: request,
                        size: 14,
                      }),
                    ],
                    bullet: { level: 1 },
                    spacing: { after: 100 },
                  })
              )
            : [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "No prayer requests available.",
                      size: 14,
                    }),
                  ],
                }),
              ]),

          new Paragraph({
            children: [
              new TextRun({
                text: "Story / Struggles",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: report.story || "No story or testimony available.",
                size: 14,
              }),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Concerns / Struggles",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { after: 300 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: report.concerns || "No concerns or struggles available.",
                size: 14,
              }),
            ],
            spacing: { after: 300 },
          }),

          // Dashed line after the facilitator section ends
          new Paragraph({
            text: "─────────────────────────────────────",
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
        ]),
      ]),
    ];

    return documentContent;
  };

  const exportData = (data: ProjectReport[] | undefined) => {
    if (!data) {
      message.error("No data available to export.");
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: exportDocument(data),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "ProjectReports.docx");
      message.success("Document exported successfully.");
    });
  };

  return (
    <Button
      onClick={() => exportData(data)}
      type="primary"
      icon={<VerticalAlignBottomOutlined />}
    >
      Export
    </Button>
  );
}
