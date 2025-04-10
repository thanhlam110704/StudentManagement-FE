import React, { useEffect } from "react";
import { Form, Input, DatePicker, Button, Radio, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { createStudent, updateStudent } from "../api/studentApi";
import { handleApiError, ApiError } from "../../../utils/handleApiErrors";

export interface StudentFormValues {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  gender: boolean;
  dateOfBirth?: Dayjs;
}

interface StudentFormProps {
  initialValues?: StudentFormValues;
  onSuccess: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm<StudentFormValues>();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values: StudentFormValues) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      };

      let response;
      if (initialValues?.id) {
        response = await updateStudent(initialValues.id, formattedValues);
      } else {
        response = await createStudent(formattedValues);
      }

      if (response?.errors) {
        handleApiError({ response }, form);
      } else {
        message.success(initialValues ? "Student updated successfully" : "Student created successfully");
        onSuccess();
      }
    } catch (error) {
      message.error("Failed to save student");
      const fieldErrors = handleApiError(error as ApiError, form);
      if (!fieldErrors) {
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="name"
        label="Full Name"
        required={true}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        required={true}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        required={true}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>

      <Form.Item name="gender" label="Gender" required={true}>
        <Radio.Group>
          <Radio value={true}>Male</Radio>
          <Radio value={false}>Female</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="dateOfBirth" label="Birth Date" required={true}>
        <DatePicker
          format="DD/MM/YYYY"
          style={{ width: "100%" }}
          placeholder="Select birth date"
          
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Update" : "Create"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;