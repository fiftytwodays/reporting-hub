import { Button, message } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { MiscellaneousProjectReport } from "@/entities/miscellaneous-reports/config/types";

interface ExportMiscellaneousReportButtonProps {
  data: MiscellaneousProjectReport[] | undefined;
  miscTitle: string;
  year: string;
  month: string;
}

export default function ExportMiscellaneousReportButton({
  data,
  miscTitle,
  year,
  month,
}: ExportMiscellaneousReportButtonProps) {
  const exportDocument = (projectReports: MiscellaneousProjectReport[]) => {
    console.log("Misc title is ", miscTitle);
    const groupedReports = projectReports.reduce((acc, report) => {
      if (!acc[report.project]) {
        acc[report.project] = [];
      }
      acc[report.project].push(report);
      return acc;
    }, {} as Record<string, MiscellaneousProjectReport[]>);

    const documentContent = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: "Heading1",
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Miscellaneous Report",
            size: 32,
            bold: true,
          }),
        ],
      }),

      new Paragraph({
        text: `Month: ${month}`,
        spacing: { after: 200 },
        bullet: { level: 0 },
      }),
      new Paragraph({
        text: `Year: ${year}`,
        bullet: { level: 0 },
        spacing: { after: 200 },
      }),

      // Loop through projects and create content for each project
      ...Object.entries(groupedReports).flatMap(([projectName, reports]) => [
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

        // Conditional sections based on miscTitle
        ...reports.flatMap((report) => {
          const sections: Paragraph[] = [];

          if (miscTitle === "Praise points/Prayer request") {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Praise points / Prayer requests",
                    size: 18,
                    bold: true,
                  }),
                ],
                heading: "Heading2",
                spacing: { after: 200 },
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
                spacing: { after: 200 },
              }),
              ...(report.praisePoints?.length
                ? report.praisePoints.map(
                    (point) =>
                      new Paragraph({
                        children: [new TextRun({ text: point, size: 14 })],
                        bullet: { level: 1 },
                        spacing: { after: 200 },
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
                      spacing: { after: 200 },
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
                spacing: { after: 200 },
              }),
              ...(report.prayerRequests?.length
                ? report.prayerRequests.map(
                    (request) =>
                      new Paragraph({
                        children: [new TextRun({ text: request, size: 14 })],
                        bullet: { level: 1 },
                        spacing: { after: 200 },
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
                      spacing: { after: 200 },
                    }),
                  ])
            );
          }

          if (miscTitle === "Concerns/Struggles") {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Concerns / Struggles",
                    size: 18,
                    bold: true,
                  }),
                ],
                heading: "Heading2",
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text:
                      report.concerns || "No concerns or struggles available.",
                    size: 14,
                  }),
                ],
                spacing: { after: 200 },
              })
            );
          }

          if (miscTitle === "Stories/Testimony") {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Stories / Testimony",
                    size: 18,
                    bold: true,
                  }),
                ],
                heading: "Heading2",
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: report.story || "No story or testimony available.",
                    size: 14,
                  }),
                ],
                spacing: { after: 200 },
              })
            );
          }
          return sections;
        }),
      ]),
    ];

    return documentContent;
  };

  const exportData = (data: MiscellaneousProjectReport[] | undefined) => {
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
      saveAs(blob, `MiscellaneousReport-${miscTitle}-${month}-${year}.docx`);
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
