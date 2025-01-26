export const currentMonth = [
  {
    title: "Goal",
    dataIndex: "goal",
    key: "goal",
    width: "20%",
  },
  {
    title: "Major goal",
    dataIndex: "majorGoal",
    key: "majorGoal",
    width: "10%",
    render: (text: boolean) => (text ? "Yes" : "No"),
  },
  {
    title: "Functional area",
    dataIndex: "functionalArea",
    key: "functionalArea",
    width: "20%",
  },
  {
    title: "Achieved",
    dataIndex: "achieved",
    key: "achieved",
    width: "10%",
    render: (text: boolean) => (text ? "Yes" : "No"),
  },
  {
    title: "Reason",
    dataIndex: "reason",
    key: "reason",
    width: "20%",
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
    width: "20%",
  },
];

export const nextMonth = [
  {
    title: "Goal",
    dataIndex: "goal",
    key: "goal",
    width: "25%",
  },
  {
    title: "Major goal",
    dataIndex: "majorGoal",
    key: "majorGoal",
    width: "10%",
    render: (text: boolean) => (text ? "Yes" : "No"),
  },
  {
    title: "Functional area",
    dataIndex: "functionalArea",
    key: "functionalArea",
    width: "25%",
  },
  {
    title: "Comments",
    dataIndex: "comments",
    key: "comments",
    width: "40%",
  },
];
