import { ReportingStatusReport as ProjectReport } from "@/entities/reporting-status-reports/config/types";
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

interface ExportProjectReportButtonProps {
  data: ProjectReport[] | undefined;
}

const createTable = (data: any[], columns: string[]) => {
  const tableRows = data.map((item) => {
    return new TableRow({
      children: columns.map((col) => {
        // Check for 'majorGoal' and 'achieved' columns and handle boolean conversion
        const cellValue =
          col === "majorGoal" || col === "achieved"
            ? item[col]
              ? "Yes"
              : "No"
            : item[col] || ""; // Default to empty string if value is undefined
        return new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellValue, // Use transformed value
                  size: 14, // Set font size for content in table
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
          ],
          width: { size: 20, type: WidthType.PERCENTAGE }, // Adjust width
        });
      }),
    });
  });

  const headerRow = new TableRow({
    children: columns.map((col) => {
      return new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text:
                  col === "activityName"
                    ? "GOAL"
                    : col.replace(/([A-Z])/g, " $1").toUpperCase(), // Formatting column name for readability
                bold: true, // Apply bold styling here
                size: 14, // Set font size for header
              }),
            ],
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
            text: "Monthly project report",
            size: 22,
            bold: true,
          }),
        ],
      }),

      // Loop through projects and create content for each project
      ...Object.entries(groupedReports).flatMap(([projectName, reports]) => [
        // Center and highlight project name with larger font size
        new Paragraph({
          children: [new TextRun({ text: projectName, size: 20, bold: true })],
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
            spacing: { before: 100, after: 100 },
          }),

          report.goalsFromLastMonth
            ? createTable(report.goalsFromLastMonth, [
                "activityName",
                "majorGoal",
                "functionalArea",
                "achieved",
                "reason",
                "comments",
              ])
            : new Paragraph({
                children: [
                  new TextRun({
                    text: "No data available for goals from last month.",
                    size: 14,
                  }),
                ],
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
            spacing: { before: 100, after: 100 },
          }),

          createTable(report.additionalActivities ?? [], [
            "activity",
            "majorGoal",
            "functionalArea",
            "achieved",
            "reason",
            "comments",
          ]),

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
            spacing: { before: 100, after: 100 },
          }),

          createTable(report.nextMonthGoal ?? [], [
            "activity",
            "majorGoal",
            "functionalArea",
            "comments",
          ]),

          new Paragraph({
            children: [
              new TextRun({
                text: "Additional activities for next month",
                size: 18,
                bold: true,
              }),
            ],
            heading: "Heading2",
            spacing: { before: 100, after: 100 },
          }),

          createTable(report.nextMonthAdditional ?? [], [
            "activity",
            "majorGoal",
            "functionalArea",
            "comments",
          ]),

          new Paragraph({
            children: [
              new TextRun({
                text: "Praise Points:",
                bold: true,
                size: 14, // Set font size for section title
              }),
            ],
            spacing: { before: 100, after: 50 },
          }),

          ...(report.praisePoints && report.praisePoints.length > 0
            ? report.praisePoints.map(
                (point, index) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `- ${point}`,
                        size: 14,
                      }),
                    ],
                    spacing: { after: 50 },
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
                text: "Prayer Requests:",
                bold: true,
                size: 14, // Set font size for section title
              }),
            ],
            spacing: { before: 100, after: 100 },
          }),
          ...(report.prayerRequests && report.prayerRequests.length > 0
            ? report.prayerRequests.map(
                (request, index) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `- ${request}`,
                        size: 14,
                      }),
                    ],
                    spacing: { after: 50 },
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
                text: "Story/Testimony:",
                bold: true,
                size: 14, // Set font size for section title
              }),
            ],
            spacing: { before: 100, after: 100 },
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
                text: "Concerns/Struggles:",
                bold: true,
                size: 14, // Set font size for section title
              }),
            ],
            spacing: { before: 100, after: 100 },
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
      saveAs(blob, "MOnthlyProjectReports.docx");
      message.success("Document exported successfully.");
    });
  };

  return (
    <Button
      onClick={() => exportData(data)}
      type="primary"
      icon={<VerticalAlignBottomOutlined />}
    >
      Export monthly reports
    </Button>
  );
}
