import { ProjectReport } from "@/entities/project-reports/config/types";
import ReportingStatusReportsPage from "@/entities/reporting-status-reports/ui/ReportingStatusReportsPage";

interface ReportingStatusReportsListProps {
  setData: (record: ProjectReport[]) => void;
}

export default function ReportingStatusReportsList({
  setData,
}: ReportingStatusReportsListProps) {
  return (
    <>
      <ReportingStatusReportsPage setData={setData} />
    </>
  );
}
