import { formatDate } from "@/shared/lib/format-date";
import { Column } from "@/shared/ui/entity-list/config/types";

export const columns: Column[] = [
  {
    title: "Given Name",
    dataIndex: "GivenName",
    key: "GivenName",
  },
  {
    title: "Family Name",
    dataIndex: "FamilyName",
    key: "FamilyName",
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
    title: "User Status",
    dataIndex: "UserStatus",
    key: "UserStatus",
  },
  {
    title: "Created",
    dataIndex: "UserCreateDate",
    key: "UserCreateDate",
    render: (date: string) => formatDate(date),
  },
  {
    title: "Actions",
    actions: ["view", "edit", "reset-password", "disable", "enable", "delete"],
    key: "actions",
  },
];
