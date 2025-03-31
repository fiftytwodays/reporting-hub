"use client";
import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";
import EditMonthlyFormPage from "@/feature/edit-monthly-form/ui/EditMonthlyFormPage";

Amplify.configure(outputs);

const EditMonthlyForm = () => {
  return <EditMonthlyFormPage id={"1"} />;
};

export default EditMonthlyForm;
