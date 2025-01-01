import { message, Select } from "antd";
import { useState } from "react";
import { data } from "@/entities/monthly-form/api/monthly-forms-list";
import { MonthlyForm } from "@/entities/monthly-form/config/types";
import { MonthlyFormsList as _MonthlyFormsList } from "@/entities/monthly-form";
import { projects } from "../config/projects";

interface Data {
  projectAlpha: MonthlyForm[];
  projectBeta: MonthlyForm[];
  projectGamma: MonthlyForm[];
  projectDelta: MonthlyForm[];
}

export default function MonthlyFormsList() {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount: 1,
    duration: 2,
  });

  // Use keyof Data to restrict the selectedProject to the keys of Data
  const [selectedProject, setSelectedProject] = useState<keyof Data | null>(null);

  const [selectedMonthlyForm, setSelectedMonthlyForm] = useState<MonthlyForm | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleEdit = (monthlyForm: MonthlyForm) => {
    setSelectedMonthlyForm(monthlyForm);
    setIsEditModalVisible(true);
  };

  const handleView = async (monthlyForm: MonthlyForm) => {
    setSelectedMonthlyForm(monthlyForm);
    setIsEditModalVisible(true);
  };

  return (
    <>
      {contextHolder}
      <Select
        options={projects}
        onChange={(value: keyof Data) => setSelectedProject(value)} // Type assertion to keyof Data
        placeholder="Select Project"
        style={{ width: 200 }}
      />

      {/* Only render the MonthlyFormsList when a project is selected */}
      {selectedProject && (
        <_MonthlyFormsList
          data={data[selectedProject] || []} // Safe access of data[selectedProject]
          isLoading={false}
          handleEdit={handleEdit}
          handleView={handleView}
        />
      )}

      {/* Modal logic if needed */}
      {/* {isEditModalVisible && selectedMonthlyForm && (
        <EditMonthlyFormModal
          monthlyFormDetails={selectedMonthlyForm}
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          messageApi={messageApi}
        />
      )} */}
    </>
  );
}
