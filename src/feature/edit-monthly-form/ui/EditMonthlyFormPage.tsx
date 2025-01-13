import { Page } from "@/shared/ui/page";
import EditMonthlyForm from "./EditMonthlyForm";
import { values } from "../api/dummy-data";
import { message } from "antd";

interface PageProps {
  id: string | string[];
}

export default function EditMonthlyFormPage({ id }: PageProps) {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1, duration: 2 });

  return (
    <>
      <Page
        showPageHeader
        header={{
          title: "Edit monthly form",
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },
            {
              title: "Monthly forms",
              href: "/monthly-form",
            },
            {
              title: `Form ${id}`, // Dynamically set the breadcrumb title based on `id`
              href: `/monthly-form/my-forms/${id}/edit`,
            },
          ],
        }}
        content={<EditMonthlyForm messageApi={messageApi} initialValues={values} />} // Pass `id` as a prop to the component
      />
    </>
  );
}
