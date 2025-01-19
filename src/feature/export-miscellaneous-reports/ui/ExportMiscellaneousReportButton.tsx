import { Button, message, Modal } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { MiscellaneousProjectReport } from "@/entities/miscellaneous-reports/config/types";

interface ExportMiscellaneousReportButtonProps{
  data: MiscellaneousProjectReport[] | undefined;
}

export default function ExportMiscellaneousReportButton({data}: ExportMiscellaneousReportButtonProps) {

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
