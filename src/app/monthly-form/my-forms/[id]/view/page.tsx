"use client";
import ViewMonthlyFormPage from "@/feature/view-monthly-form/ui/ViewMonthlyFormPage";
import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";

Amplify.configure(outputs);


const MonthlyFormPage = () => {

  return (
      <ViewMonthlyFormPage id={"1"} />
  );
};

export default MonthlyFormPage;

