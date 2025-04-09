import { FormInstance } from "antd";

export interface ApiError {
  response?: {
    status: number;
    data: {
      type?: string;
      title?: string;
      status?: number;
      errors?: Record<string, string[]>; 
    };
  };
}

interface FieldErrors {
  [key: string]: string;
}

export const handleApiError = (
  error: ApiError,
  form: FormInstance,
  setFormErrors?: (errors: FieldErrors) => void
): FieldErrors | null => {
  if (error?.response?.status === 400 && error?.response?.data?.errors) {
    const { type, title, status, errors } = error.response.data;

    console.log({
      type,
      title,
      status,
      errors,
    });

    const fieldErrors: FieldErrors = {};

    Object.entries(errors).forEach(([field, errorMessages]) => {
      const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
      fieldErrors[fieldName] = errorMessages.join(', ');
    });

    form.setFields(
      Object.entries(fieldErrors).map(([name, error]) => ({
        name,
        errors: [error],
      }))
    );

    if (setFormErrors) {
      setFormErrors(fieldErrors);
    }

    return fieldErrors;
  }

  return null;
};