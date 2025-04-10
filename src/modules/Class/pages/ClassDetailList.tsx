import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Button, Popconfirm, message, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { AgGridReact } from "@ag-grid-community/react";
import AddStudentModal from "../../ClassStudent/modal-form/AddStudentModal";
import { fetchAvailableStudents, removeStudentFromClass } from "../../ClassStudent/api/classStudentApi";
import { getStudentsListofClass } from "../api/classApi";
import { textFilterParams, dateFilterParams, numberFilterParams } from "../../../utils/filterParams";
import { getFilterModel } from '../../../utils/filterModel';
import { formatDate } from "../../../utils/dateConvert";
import { GridApi, GridReadyEvent, ColDef } from "@ag-grid-community/core";

interface Student {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

interface Filter {
  field: string;
  value: string;
  operator: string;
}

interface ClassDetailListProps {
  classId: string | number;
}

const ClassDetailList: React.FC<ClassDetailListProps> = ({ classId }) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filter, setFilter] = useState<Filter[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(""); 
  const hasFetched = useRef<boolean>(false);

  const loadAvailableStudents = useCallback(async () => {
    try {
      const data: Student[] = await fetchAvailableStudents(classId);
      setAvailableStudents(data);
    } catch (error: any) {
      message.error(error.response?.data?.message);
    }
  }, [classId]);

  const loadStudentList = useCallback(async () => {
    setLoading(true);
    try {
      const data: { data: Student[]; totalRecords: number } = await getStudentsListofClass(
        classId,
        currentPage,
        pageSize,
        filter,
        sortBy,
        sortDirection
      );
      setStudents(data.data);
      setTotalItems(data.totalRecords);
      hasFetched.current = false;
    } catch (error) {
      message.error("Fail to load list of student!");
    } finally {
      setLoading(false);
    }
  }, [classId, currentPage, pageSize, filter, sortBy, sortDirection]);

  useEffect(() => {
    if (!hasFetched.current) {
      loadStudentList();
      hasFetched.current = true;
    }
  }, [loadStudentList]);

  const handleRemoveStudent = useCallback(async (studentId: string | number) => {
    try {
      await removeStudentFromClass(studentId, classId);
      message.success("Đã xóa sinh viên thành công!");
      loadStudentList();
    } catch (error) {
      message.error("Lỗi khi xóa sinh viên!");
    }
  }, [classId, loadStudentList]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleFilterChange = () => {
    if (gridApi) {
      const filters = getFilterModel(gridApi);
      setFilter(filters.length > 0 ? filters : []);
    }
  };

  const handleSortChange = (params: { api: GridApi }) => {
    const columnState = params.api.getColumnState();
    const sortedColumn = columnState.find((col) => col.sort === "asc" || col.sort === "desc");
    if (sortedColumn) {
      setSortBy(sortedColumn.colId);
      setSortDirection(sortedColumn.sort as "asc" | "desc");
    } else {
      setSortBy('');
      setSortDirection('');
    }
  };

  const columnDefs: ColDef<Student>[] = useMemo(() => [
    {
      headerName: "ID",
      field: "id",
      width: 80,
      sortable: true,
      filterParams: numberFilterParams,
    } as ColDef<Student>,
    {
      headerName: "Full Name",
      field: "name",
      width: 160,
      filter: true,
      filterParams: textFilterParams,
    } as ColDef<Student>,
    {
      headerName: "Email",
      field: "email",
      width: 160,
      filter: true,
      filterParams: textFilterParams,
    } as ColDef<Student>,
    {
      headerName: "Phone",
      field: "phone",
      width: 160,
      filter: true,
      filterParams: textFilterParams,
    } as ColDef<Student>,
    {
      headerName: "Date of Birth",
      field: "dateOfBirth",
      valueFormatter: (params) => formatDate(params.value as string),
      width: 150,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    } as ColDef<Student>,
    {
      headerName: "Created At",
      field: "createdAt",
      valueFormatter: (params) => formatDate(params.value as string),
      width: 150,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    } as ColDef<Student>,
    {
      headerName: "Updated At",
      field: "updatedAt",
      valueFormatter: (params) => formatDate(params.value as string),
      width: 150,
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    } as ColDef<Student>,
    {
      headerName: "Actions",
      width: 140,
      cellRenderer: (params: { data: Student }) => (
        <Popconfirm
          title="Are you sure to remove this student?"
          onConfirm={() => handleRemoveStudent(params.data.id)}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    } as ColDef<Student>,
  ], [handleRemoveStudent]);

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalOpen(true);
          loadAvailableStudents();
        }}
        className="add-button-detail"
      >
        Add Student
      </Button>

      <div className="ag-theme-alpine" style={{ height: 'auto', width: '100%' }}>
        <AgGridReact<Student>
          className="detail-table"
          rowData={students}
          columnDefs={columnDefs}
          pagination={true}
          loading={loading}
          paginationPageSize={pageSize}
          suppressPaginationPanel={true}
          defaultColDef={{ resizable: true, sortable: true, filter: true }}
          domLayout="autoHeight"
          onGridReady={(params: GridReadyEvent) => setGridApi(params.api)}
          onFilterChanged={handleFilterChange}
          onSortChanged={handleSortChange}
        />
      </div>

      <div className="pagination-container-detail">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          showSizeChanger={true}
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={handlePageChange}
        />
      </div>

      <AddStudentModal
        classId={classId}
        availableStudents={availableStudents}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadStudentList}
      />
    </>
  );
};

export default ClassDetailList;