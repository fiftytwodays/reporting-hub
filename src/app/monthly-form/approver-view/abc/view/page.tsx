"use client";
import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";
import ViewMonthlyFormPage from "@/feature/view-monthly-form-approver/ui/ViewMonthlyFormPage";

Amplify.configure(outputs);


const MonthlyFormApproverPage = () => {

  return (
      <ViewMonthlyFormPage id={"1"} />
  );
};

export default MonthlyFormApproverPage;

