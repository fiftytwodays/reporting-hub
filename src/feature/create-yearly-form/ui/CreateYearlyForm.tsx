import { Button, Col, Collapse, CollapseProps, Flex, Form, Input, Row, Space } from "antd";
import Projects from "./Projects";
import QuarterlyPlan from "./QuarterlyPlan";
// import useCreateProject from "../api/create-yearly-form";
// import useProjectsList from "@/entities/project/api/project-list";
// import useRegionsList from "@/entities/region/api/region-list";
// import useCreateRegion from "../api/create-yearly-form";

interface CreateYearlyFormProps {
  onCreateYearlyFormModalClose: () => void;
  messageApi: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

interface FormValues {
  // year: string;
  project: string;
  
}

const CreateYearlyForm: React.FC<CreateYearlyFormProps> = ({
  onCreateYearlyFormModalClose,
  messageApi,
}) => {
  
  let currentYear: number = new Date().getFullYear();
  let nextYear: number = currentYear + 1;
  const [form] = Form.useForm<FormValues>();

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Apr - Jun',
      children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: '2',
      label: 'Jul - Sep',
      children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: '3',
      label: 'Oct - Dec',
      children: <QuarterlyPlan form={form} quarter={1}/>,
    },
    {
      key: '4',
      label: 'Jan - Mar',
      children: <QuarterlyPlan form={form} quarter={1}/>,
    },
  ];


  // const { reloadRegionsList } = useRegionsList({condition: true});

  // const { createRegion, isCreating } = useCreateRegion();

  const handleFinish = async (values: FormValues) => {
    // const payload = {
    //   project: values.project,
    //   description: values.regionDescription,
    // };

    // try {
    //   const data = await createRegion(payload);
    //   if (data) {
    //     messageApi.success("Region has been created successfully.");
    //     reloadRegionsList();
    //     onCreateRegionModalClose();
    //     form.resetFields();
    //   }
    // } catch (error: any) {
    //   if (error?.status === 409) {
    //     messageApi.error(
    //       "Region name already in use. Please try again with a different region name."
    //     );
    //   } else {
    //     messageApi.error("Unable to create the region. Please try again.");
    //   }
    // }
  };

  return (
    <Form form={form} onFinish={handleFinish}>
    <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: "Year is required" }]}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <Input disabled value={`${currentYear} - ${nextYear}`} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Projects"
            name="project"
            rules={[{ required: true, message: "Project is required" }]}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
          >
            <Projects form={form}/>
          </Form.Item>
        </Col>
        </Row>
      <Row>
        <Col xs={24} sm={24}>
          {/* <Form.Item
            label="Region description"
            name="regionDescription"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input.TextArea />
          </Form.Item> */}
      <Collapse items={items} defaultActiveKey={['1']} />
        </Col>
      </Row>

      {/* <Flex justify="space-between">
        <Button type="default" onClick={() => form.resetFields()}>
          Reset
        </Button>
        <Space>
          <Button onClick={onCreateRegionModalClose} type="default">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating}
          >
            Save
          </Button>
        </Space>
      </Flex> */}
    </Form>
  );
};

export default CreateYearlyForm;
