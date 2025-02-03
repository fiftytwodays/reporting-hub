import { Descriptions, Table } from "antd";
import { nextMonth, currentMonth } from "../config/expanded-content-columns";
import { MonthlyGoal, NextMonthGoal, ProjectReport } from "../config/types";

interface ExpandedContentProps {
  record: ProjectReport;
}

export default function ExpandedContent({ record }: ExpandedContentProps) {
  const renderGoalsTables = (year: string, monthGoals: MonthlyGoal[]) => (
    <>
      <h3>
        Outcomes for{" "}
        {monthGoals.length > 0
          ? `${monthGoals[0].goal} (${year})`
          : `Year ${year}`}
      </h3>
      <Table
        rowKey="goal"
        columns={currentMonth}
        dataSource={monthGoals}
        pagination={false}
      />
    </>
  );

  const renderAdditionalActivitiesTables = (
    year: string,
    monthActivities: MonthlyGoal[]
  ) => (
    <>
      <h3>
        Additional activities for{" "}
        {monthActivities.length > 0
          ? `${monthActivities[0].goal} (${year})`
          : `Year ${year}`}
      </h3>
      <Table<MonthlyGoal>
        rowKey="goal"
        columns={currentMonth}
        dataSource={monthActivities}
        pagination={false}
      />
    </>
  );

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
        {/* <Descriptions.Item label="Date of report">
          {record.date}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Reporting month">
          {record.reportingMonth}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Year">{record.year}</Descriptions.Item> */}
      </Descriptions>

      {/* Rendering goals for each year */}
      {Object.entries(record.goals).map(([year, months]) => (
        <div key={year}>
          {Object.entries(months).map(([month, monthGoals]) => (
            <div key={`${year}-${month}`}>
              <h3>
                Outcomes for {month} {year}
              </h3>
              <Table
                rowKey="goal"
                columns={currentMonth}
                dataSource={monthGoals}
                pagination={false}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Rendering additional activities for each year */}
      {Object.entries(record.goals).map(([year, months]) => (
        <div key={`${year}-activities`}>
          {Object.entries(months).map(([month, monthActivities]) => (
            <div key={`${year}-${month}-activities`}>
              <h3>
                Additional activities for {month} {year}
              </h3>
              <Table<MonthlyGoal>
                rowKey="goal"
                columns={currentMonth}
                dataSource={monthActivities}
                pagination={false}
              />
            </div>
          ))}
        </div>
      ))}

      {/* Next month goals */}
      <h3>Goals for next quarter</h3>
      <Table<NextMonthGoal>
        rowKey="goal"
        columns={nextMonth}
        dataSource={record.nextMonth.goals}
        pagination={false}
      />

      {/* Next month additional activities */}
      <h3>Additional activities for next quarter</h3>
      <Table<NextMonthGoal>
        rowKey="goal"
        columns={nextMonth}
        dataSource={record.nextMonth.additionalActivities}
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
