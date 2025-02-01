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
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";
import {
  ProjectReport,
  MonthlyGoal,
  NextMonthGoal,
} from "@/entities/project-reports/config/types";

interface ExportProjectReportButtonProps {
  data: ProjectReport[] | undefined;
  isProjectSelected: boolean;
  isClusterSelected: boolean;
}

// Helper function to create a table from the given data
const createTable = (data: any[], columns: string[]) => {
  // Ensure there's data to work with
  if (!data || data.length === 0) return null;

  // Create table rows for each entry in the data
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

  // Create header row with columns
  const headerRow = new TableRow({
    children: columns.map((col) => {
      return new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: col.replace(/([A-Z])/g, " $1").toUpperCase(), // Formatting column name for readability
                bold: true, // Apply bold styling here
                size: 14, // Set font size for header
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        width: { size: 20, type: WidthType.PERCENTAGE }, // Adjust width
      });
    }),
  });

  // Return the final table with header row and data rows
  return new Table({
    rows: [headerRow, ...tableRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
};

const exportDocument = (projectReports: ProjectReport[], heading: string) => {
  const documentChildren = [];

  // Add Main Heading
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: heading,
          bold: true,
          size: 20, // Set font size for the main heading
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  // Group data by project name
  const projectsGrouped = projectReports.reduce((acc, report) => {
    if (!acc[report.project]) acc[report.project] = [];
    acc[report.project].push(report);
    return acc;
  }, {} as Record<string, ProjectReport[]>);

  Object.entries(projectsGrouped).forEach(([projectName, reports]) => {
    // Add delimiter before the project name

    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: projectName,
            bold: true,
            size: 18, // Set font size for the project name
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
      })
    );

    // Group by facilitator
    const facilitatorsGrouped = reports.reduce((acc, report) => {
      if (!acc[report.facilitator]) acc[report.facilitator] = [];
      acc[report.facilitator].push(report);
      return acc;
    }, {} as Record<string, ProjectReport[]>);

    Object.entries(facilitatorsGrouped).forEach(
      ([facilitator, facilitatorReports]) => {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Facilitator: ${facilitator}`,
                bold: true,
                size: 16, // Set font size for facilitator
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );

        facilitatorReports.forEach((report, index) => {
          // Add status, cluster, and region information
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Status: ${report.status} | Cluster: ${report.cluster} | Region: ${report.region}`,
                  size: 14, // Set font size for status and region
                }),
              ],
              spacing: { after: 100 },
            })
          );

          // Add goals for the year and month
          Object.entries(report.goals).forEach(([year, months]) => {
            Object.entries(months).forEach(([month, monthlyGoals]) => {
              documentChildren.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${month} ${year} Goals`,
                      bold: true,
                      size: 14, // Set font size for goals heading
                    }),
                  ],
                  heading: HeadingLevel.HEADING_3,
                  spacing: { before: 200, after: 100 },
                })
              );

              documentChildren.push(
                createTable(monthlyGoals, [
                  "goal",
                  "majorGoal",
                  "functionalArea",
                  "achieved",
                  "reason",
                  "comments",
                ])
              );
            });
          });

          // Next Quarter Goals
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Next Quarter Goals",
                  bold: true,
                  size: 14, // Set font size for section title
                }),
              ],
              spacing: { before: 200, after: 50 },
            })
          );
          documentChildren.push(
            createTable(report.nextMonth.goals, [
              "goal",
              "majorGoal",
              "functionalArea",
              "comments",
            ])
          );

          // Next Quarter Additional Activities
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Next Quarter Additional Activities",
                  bold: true,
                  size: 14, // Set font size for section title
                }),
              ],
              spacing: { before: 200, after: 50 },
            })
          );
          documentChildren.push(
            createTable(report.nextMonth.additionalActivities, [
              "goal",
              "majorGoal",
              "functionalArea",
              "comments",
            ])
          );

          // Praise Points
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Praise Points:",
                  bold: true,
                  size: 14, // Set font size for section title
                }),
              ],
              spacing: { before: 200, after: 50 },
            })
          );
          report.praisePoints.forEach((point) => {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `- ${point}`,
                    size: 14, // Set font size for praise points
                  }),
                ],
                spacing: { after: 50 },
              })
            );
          });

          // Prayer Requests
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Prayer Requests:",
                  bold: true,
                  size: 14, // Set font size for section title
                }),
              ],
              spacing: { before: 200, after: 50 },
            })
          );
          report.prayerRequests.forEach((request) => {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `- ${request}`,
                    size: 14, // Set font size for prayer requests
                  }),
                ],
                spacing: { after: 50 },
              })
            );
          });

          // Story or Testimony
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Story/Testimony:",
                  bold: true,
                  size: 14, // Set font size for section title
                }),
              ],
              spacing: { before: 200, after: 50 },
            })
          );
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: report.story,
                  size: 14, // Set font size for story
                }),
              ],
              spacing: { after: 100 },
            })
          );

          // Concerns
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Concerns/Struggles:",
                  bold: true,
                  size: 14, // Set font size for section title
                }),
              ],
              spacing: { before: 200, after: 50 },
            })
          );
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: report.concerns,
                  size: 14, // Set font size for concerns
                }),
              ],
              spacing: { after: 200 },
            })
          );

          // Add a delimiter between reports of different facilitators
          if (index !== facilitatorReports.length - 1) {
            documentChildren.push(
              new Paragraph({
                text: "==============================================================",
                spacing: { before: 200, after: 200 },
              })
            );
          }
          documentChildren.push(
            new Paragraph({
              text: "-------------------------------------------------------------------------------------------------------------------------------------",
              spacing: { before: 300, after: 100 },
            })
          );
        });
      }
    );
  });

  return documentChildren;
};

export default function ExportProjectReportButton({
  data,
  isProjectSelected,
  isClusterSelected,
}: ExportProjectReportButtonProps) {
  let headingText = "Project Report"; // Default heading

  if (isClusterSelected) {
    headingText = "Cluster Report";
  } else if (isProjectSelected) {
    headingText = "Project Report";
  }
  const exportData = (data: ProjectReport[] | undefined) => {
    if (!data) {
      message.error("No data available to export.");
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: exportDocument(data, headingText),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const fileName = isClusterSelected
        ? "cluster_report.docx"
        : "project_report.docx";
      saveAs(blob, fileName);
    });
  };

  return (
    <Button
      type="primary"
      icon={<VerticalAlignBottomOutlined />}
      onClick={() => exportData(data)}
    >
      Export Project Report
    </Button>
  );
}
