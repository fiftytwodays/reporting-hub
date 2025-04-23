import { Descriptions, Space, Table } from "antd";
import { nextMonth, currentMonth } from "../config/expanded-content-columns";
import { Goal, ReportingStatusReport } from "../config/types";
import DescriptionsItem from "antd/es/descriptions/Item";

interface ExpandedContentProps {
  record: ReportingStatusReport;
}

export default function ExpandedContent({ record }: ExpandedContentProps) {
  return (
    <>
      <Descriptions size="small">
        <Descriptions.Item label="Project name">
          {record.project}
        </Descriptions.Item>
        <Descriptions.Item label="Name of report writer">
          {record.facilitator}
        </Descriptions.Item>
        <Descriptions.Item label="Region">{record.region}</Descriptions.Item>
        <Descriptions.Item label="Cluster">{record.cluster}</Descriptions.Item>
        <Descriptions.Item label="Date of report">
          {record.date}
        </Descriptions.Item>
        <Descriptions.Item label="Reporting month">
          {record.reportingMonth}
        </Descriptions.Item>
        <Descriptions.Item label="Year">{record.year}</Descriptions.Item>
      </Descriptions>

      <h3>Outcomes from the month just ended</h3>
      <Table
        rowKey="goal"
        columns={currentMonth}
        dataSource={record.goalsFromLastMonth || []}
        pagination={false}
      />

      <h3>Additional activities other than that was planned</h3>
      <Table<Goal>
        rowKey="goal"
        columns={nextMonth}
        dataSource={record.additionalActivities || []}
        pagination={false}
      />

      <h3>Goals for next month</h3>
      <Table<Goal>
        rowKey="goal"
        columns={nextMonth}
        dataSource={record.nextMonthGoal || []}
        pagination={false}
      />

      <h3>Additional activities for next month</h3>
      <Table<Goal>
        rowKey="goal"
        columns={nextMonth}
        dataSource={record.nextMonthAdditional || []}
        pagination={false}
      />

      {/* Praise Points / Prayer Requests Section */}
      <h3>Praise Points / Prayer Requests</h3>
      <h4>Praise for</h4>
      <ul>
        {record.praisePoints && record.praisePoints.length > 0 ? (
          record.praisePoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))
        ) : (
          <li>No praise points available.</li>
        )}
      </ul>

      <h4>Pray for</h4>
      <ul>
        {record.prayerRequests && record.prayerRequests.length > 0 ? (
          record.prayerRequests.map((request, index) => (
            <li key={index}>{request}</li>
          ))
        ) : (
          <li>No prayer requests available.</li>
        )}
      </ul>

      {/* Story / Struggles Section */}
      <h3>Story / Struggles</h3>
      <p>{record.story || "No story or testimony available."}</p>

      {/* Concerns / Struggles Section */}
      <h3>Concerns / Struggles</h3>
      <p>{record.concerns || "No concerns or struggles available."}</p>
    </>
  );
}
