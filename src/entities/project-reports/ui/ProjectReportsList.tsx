import ProjectReports from "./ProjectReport";
import { message } from "antd";
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
  FileChild,
} from "docx";
import { saveAs } from "file-saver";
import { ProjectReport } from "@/entities/project-reports/config/types";

interface ProjectReportProps {
  data: ProjectReport[];
}

const createTable = (data: any[], columns: string[]) => {
  // Ensure there's data to work with
  if (!data || data.length === 0) {
    return [
      new Table({
        rows: [],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }),
    ]; // Return an empty table if no data
  }

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
  return [
    new Table({
      rows: [headerRow, ...tableRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
    }),
  ];
};

const exportDocument = (singleProjectReport: ProjectReport) => {
  const documentChildren: FileChild[] = []; // Make sure the type is an array of FileChild

  // Add Main Heading
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Project Report",
          bold: true,
          size: 20, // Set font size for the main heading
        }),
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  // Group data by project name (only for the single project)
  const projectName = singleProjectReport.project;
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

  // Group by facilitator (only for the single facilitator of the selected report)
  const facilitator = singleProjectReport.facilitator;
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

  // Add status, cluster, and region information
  documentChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Status: ${singleProjectReport.status} | Cluster: ${singleProjectReport.cluster} | Region: ${singleProjectReport.region}`,
          size: 14, // Set font size for status and region
        }),
      ],
      spacing: { after: 100 },
    })
  );

  // Add goals for the year and month
  Object.entries(singleProjectReport.goals).forEach(([year, months]) => {
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
          spacing: { before: 150, after: 50 },
        })
      );

      documentChildren.push(
        ...createTable(monthlyGoals, [
          "goal",
          "majorGoal",
          "functionalArea",
          "achieved",
          "reason",
          "comments",
        ])
      ); // Spread the array of Table returned by createTable
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
      spacing: { before: 150, after: 50 },
    })
  );
  documentChildren.push(
    ...createTable(singleProjectReport.nextMonth.goals, [
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
      spacing: { before: 150, after: 50 },
    })
  );
  documentChildren.push(
    ...createTable(singleProjectReport.nextMonth.additionalActivities, [
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
  singleProjectReport.praisePoints.forEach((point) => {
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
  singleProjectReport.prayerRequests.forEach((request) => {
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
          text: singleProjectReport.story,
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
          text: singleProjectReport.concerns,
          size: 14, // Set font size for concerns
        }),
      ],
      spacing: { after: 200 },
    })
  );

  return documentChildren; // Make sure this returns only a valid array of FileChild[]
};

const exportData = (report: ProjectReport | undefined) => {
  if (!report) {
    message.error("No data available to export.");
    return;
  }

  // Create a document with sections, since the document expects a sections property
  const doc = new Document({
    sections: [
      {
        properties: {}, // You can leave properties empty if not needed
        children: exportDocument(report), // Pass the content directly as children
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${report.project}_Report.docx`);
    message.success("Document exported successfully.");
  });
};

export default function ProjectReportsList({ data }: ProjectReportProps) {
  const handleExport = (id: number) => {
    const projectReport = data.find((report) => report.id === id);
    exportData(projectReport);
  };
  return <ProjectReports handleExport={handleExport} />;
}
