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
      : miscTitle === "Concerns/Struggles"
      ? [
          {
            title: "Concerns/Struggles",
            dataIndex: "concerns",
            key: "concerns",
            dataType: "string",
          },
        ]
      : [
          {
            title: "Stories/Testimony",
            dataIndex: "story",
            key: "story",
            dataType: "string",
          },
        ];

  return [...baseColumns, ...additionalColumns];
};
