import { Page } from "@/shared/ui/page";
import ViewMonthlyForm from "./view-monthly-form";

interface PageProps {
  id: string | string[];
}

export default function ViewMonthlyFormPage({ id }: PageProps) {
  return (
    <>
      <Page
        showPageHeader
        header={{
          title: "View monthly form",
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
              href: `/monthly-form/my-forms/${id}/view`,
            },
          ],
        }}
        content={<ViewMonthlyForm id={id} />} // Pass `id` as a prop to the component
      />
    </>
  );
}
