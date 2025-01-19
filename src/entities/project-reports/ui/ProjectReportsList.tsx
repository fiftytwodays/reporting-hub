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
} from "docx";
import { saveAs } from "file-saver";
import { ProjectReport } from "@/entities/project-reports/config/types";

interface ProjectReportProps {
  data: ProjectReport[];
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

const exportDocument = (report: ProjectReport) => {
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

    new Paragraph({
      children: [new TextRun({ text: report.project, size: 24, bold: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: `Facilitator: ${report.facilitator}`,
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
    new Paragraph({ text: `Date: ${report.date}`, bullet: { level: 0 } }),
    new Paragraph({
      text: `Reporting Month: ${report.reportingMonth}`,
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: `Year: ${report.year}`,
      bullet: { level: 0 },
      spacing: { after: 200 },
    }),

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

    createTable(report.nextMonthGoal, ["goal", "functionalArea", "comments"]),

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
  ];

  return documentContent;
};

const exportData = (report: ProjectReport | undefined) => {
  if (!report) {
    message.error("No data available to export.");
    return;
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: exportDocument(report),
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
