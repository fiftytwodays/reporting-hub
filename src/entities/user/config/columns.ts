import { formatDate } from "@/shared/lib/format-date";
import { Column } from "@/shared/ui/entity-list/config/types";

export const columns: Column[] = [
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
  { title: "Actions", actions: ["view", "edit", "delete"], key: "actions" },
];
