export const columns = (miscTitle: string) => {
  const baseColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      hidden: true,
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      width: miscTitle === "Praise points/Prayer request" ? "16%" : "20%",
    },
    {
      title: "Facilitator",
      dataIndex: "facilitator",
      key: "facilitator",
      width: miscTitle === "Praise points/Prayer request" ? "16%" : "20%",
    },
  ];

  const additionalColumns =
    miscTitle === "Praise points/Prayer request"
      ? [
          {
            title: "Praise for",
            dataIndex: "praisePoints",
            key: "praisePoints",
            dataType: "array",
          },
          {
            title: "Pray for",
            dataIndex: "prayerRequests",
            key: "prayerRequests",
            dataType: "array",
          },
        ]
      : [
          {
            title: miscTitle,
            dataIndex: "type",
            key: "type",
            dataType: "array",
          },
        ];

  return [...baseColumns, ...additionalColumns];
};
