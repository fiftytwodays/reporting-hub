import { Descriptions, Space, Table } from "antd";
import { nextMonth, currentMonth } from "../config/expanded-content-columns";
import { MonthlyGoal, NextMonthGoal, ProjectReport } from "../config/types";
import DescriptionsItem from "antd/es/descriptions/Item";

interface ExpandedContentProps {
  record: ProjectReport;
}

export default function ExpandedContent({ record }: ExpandedContentProps) {


  return (
    <>
      <Descriptions size="small">
        <Descriptions.Item label="Project name">{record.project}</Descriptions.Item>
        <Descriptions.Item label="Name of report writer">{record.facilitator}</Descriptions.Item>
        <Descriptions.Item label="Region">{record.region}</Descriptions.Item>
        <Descriptions.Item label="Cluster">{record.cluster}</Descriptions.Item>
        <Descriptions.Item label="Date of report">{record.date}</Descriptions.Item>
        <Descriptions.Item label="Reporting month">{record.reportingMonth}</Descriptions.Item>
        <Descriptions.Item label="Year">{record.year}</Descriptions.Item>
      </Descriptions>
      <h3>Outcomes from the month just ended</h3>
      <Table
        rowKey="goal"
        columns={currentMonth}
        dataSource={record.goalsFromLastMonth}
        pagination={false} 
      />
      <h3>Additional activities other than that was planned</h3>
      <Table<MonthlyGoal>
        rowKey="goal"
        columns={currentMonth}
        dataSource={record.additionalActivities}
        pagination={false} 
      />
      <h3>Goals for next month</h3>
      <Table<NextMonthGoal>
        rowKey="goal"
        columns={nextMonth}
        dataSource={record.nextMonthGoal}
        pagination={false} 
      />
      <h3>Additional activities for next month</h3>
      <Table<NextMonthGoal>
        rowKey="goal"
        columns={nextMonth}
        dataSource={record.nextMonthAdditional}
        pagination={false} 
      />
    </>
  );
}
