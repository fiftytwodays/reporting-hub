import { formatDate } from "@/shared/lib/format-date";
import type { User } from "./types";

type ColumnConfig<T> = {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: any) => string; // Optional render function, taking any type and returning a string
};

export const columns: ColumnConfig<User>[] = [
  {
    title: "Username",
    dataIndex: "Username",
    key: "Username",
  },
  {
    title: "Email",
    dataIndex: "Email",
    key: "Email",
  },
  {
    title: "Enabled",
    dataIndex: "Enabled",
    key: "Enabled",
    render: (enabled: boolean) => (enabled ? "Yes" : "No"),
  },
  {
    title: "Created",
    dataIndex: "UserCreateDate",
    key: "UserCreateDate",
    render: (date: string) => formatDate(date),
  },
  {
    title: "Last Modified",
    dataIndex: "UserLastModifiedDate",
    key: "UserLastModifiedDate",
    render: (date: string) => formatDate(date),
  },
  {
    title: "User Status",
    dataIndex: "UserStatus",
    key: "UserStatus",
  },
];
