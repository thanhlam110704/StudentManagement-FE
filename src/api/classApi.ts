import axios from "axios";

const API_URL = "https://localhost:7063/api";

interface Filter {
  field: string;
  value: string;
  operator: string;
}

export const getClasses = async (
  page: number = 1,
  pageSize: number = 10,
  filters: Filter[] = [],
  sortBy: string = '',
  sortDirection: string = ''
): Promise<any> => {
  const params: Record<string, any> = {
    Top: pageSize,
    Offset: (page - 1) * pageSize,
    SortBy: sortBy,
    SortDirection: sortDirection,
  };

  filters.forEach((filter, index) => {
    if (filter.field && filter.value && filter.operator) {
      params[`filters[${index}][field]`] = filter.field;
      params[`filters[${index}][value]`] = filter.value;
      params[`filters[${index}][operator]`] = filter.operator;
    }
  });

  const response = await axios.get(`${API_URL}/Class`, { params });
  return response.data;
};

export const getClassDetail = async (id: string | number): Promise<any> => {
  const response = await axios.get(`${API_URL}/Class/${id}`);
  return response.data;
};

export const getStudentsListofClass = async (
  id: string | number,
  page: number = 1,
  pageSize: number = 10,
  filters: Filter[] = [],
  sortBy: string = '',
  sortDirection: string = ''
): Promise<any> => {
  const params: Record<string, any> = {
    Top: pageSize,
    Offset: (page - 1) * pageSize,
    SortBy: sortBy,
    SortDirection: sortDirection,
  };

  filters.forEach((filter, index) => {
    if (filter.field && filter.value && filter.operator) {
      params[`filters[${index}][field]`] = filter.field;
      params[`filters[${index}][value]`] = filter.value;
      params[`filters[${index}][operator]`] = filter.operator;
    }
  });
  const response = await axios.get(`${API_URL}/ClassStudent/class/${id}`, { params });
  return response.data;
};

export const createClass = async (classData: any): Promise<any> => {
  const response = await axios.post(`${API_URL}/Class`, classData);
  return response.data;
};

export const updateClass = async (id: string | number, classData: any): Promise<any> => {
  const response = await axios.put(`${API_URL}/Class/${id}`, classData);
  return response.data;
};

export const deleteClass = async (id: string | number): Promise<void> => {
  await axios.delete(`${API_URL}/Class/${id}`);
};