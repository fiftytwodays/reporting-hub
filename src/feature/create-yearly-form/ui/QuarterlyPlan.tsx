import React from "react";
import { FormInstance } from "antd/es/form";
import { Form, Input } from 'antd';

interface QuarterlyPlanProps {
    form: FormInstance;
    quarter: number;
}

interface FormValues {
    // year: string;
    activity: string;
    project: string;
    functionalArea: string;
    month: string[];
    department: string;
    comment: string;
    plans: string[];

}

const QuarterlyPlan: React.FC<QuarterlyPlanProps> = ({ form, quarter }) => {
    const [planForm] = Form.useForm<FormValues>();
    return (
        <Form form={planForm}>
            <Form.List name="plans">
                {(fields) => (

                    <>

                        {fields.map((field) => (
                            <Form.Item
                                {...field}
                                label="Activity"
                                name={[field.name, 'activity']}
                                rules={[{ required: true, message: 'Missing activity' }]}
                            >

                                <Input placeholder="test" />
                            </Form.Item>
                        ))

                        }
                    </>
                )}


            </Form.List>
        </Form>
    );
};
export default QuarterlyPlan;