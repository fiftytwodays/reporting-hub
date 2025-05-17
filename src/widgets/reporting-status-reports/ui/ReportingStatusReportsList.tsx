import ReportingStatusReportsPage from "@/entities/reporting-status-reports/ui/ReportingStatusReportsPage";
import { ReportingStatusReport as ProjectReport } from "@/entities/reporting-status-reports/config/types";

interface ReportingStatusReportsListProps {
  setData: (record: ProjectReport[]) => void;
}

export default function ReportingStatusReportsList({
  setData,
}: ReportingStatusReportsListProps) {

  return (
    <>
      <ReportingStatusReportsPage
        setData={setData}
      />
    </>
  );
}
