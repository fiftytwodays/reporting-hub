import type { Project } from "./types";

type ColumnConfig<T> = {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: any) => React.ReactElement; // Optional render function, taking any type and returning a string
};

export const columns: ColumnConfig<Project>[] = [
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
  },
  {
    title: "Location",
    dataIndex: "Location",
    key: "Location",
  },
  {
    title: "Project type",
    dataIndex: "ProjectType",
    key: "ProjectType",
  },
  {
    title: "Cluster",
    dataIndex: "Cluster",
    key: "Cluster",
  },
  {
    title: "Description",
    dataIndex: "Description",
    key: "Description",
  },
  // {
  //   title: "Actions",
  //   dataIndex: "Actions",
  //   key: "Actions",
  //   render: (actions: string) => (
  //     <Button >Click Me</Button>
  //   )
  // }
];
