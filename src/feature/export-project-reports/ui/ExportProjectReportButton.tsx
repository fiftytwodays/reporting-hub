import { Button, message, Modal } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { ProjectReport } from "@/entities/project-reports/config/types";
import { ReportingStatusReport } from "@/entities/reporting-status-reports/config/types";

interface ExportProjectReportButtonProps{
  data: ProjectReport[] | undefined;
}

export default function ExportProjectReportButton({data}: ExportProjectReportButtonProps) {

  const exportData = (data: any) => {
    message.success("Data exported successfully...")
  };

  return (
    <>
      <Button
        onClick={() => exportData(data)}
        type="primary"
        icon={<VerticalAlignBottomOutlined />}
      >
        Export
      </Button>
    </>
  );
}
