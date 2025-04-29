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
          title: "View monthly plan",
          breadcrumbs: [
            {
              title: "Home",
              href: "/",
            },
            {
              title: "Monthly plans",
              href: "/monthly-plans/my-plans",
            },
            {
              title: `Plan ${id}`, // Dynamically set the breadcrumb title based on `id`
              href: `/monthly-plans/my-plans/${id}/view`,
            },
          ],
        }}
        content={<ViewMonthlyForm id={id} />} // Pass `id` as a prop to the component
      />
    </>
  );
}
