import React, { useState, useEffect, useRef } from "react";
import { Descriptions, message } from "antd";
import { formatDate } from "../../../utils/dateConvert";
import { getStudentDetail } from "../api/studentApi";
import { StudentInfo } from "../model/student";

interface StudentDetailInfoProps {
  studentId: string | number;
}

const StudentDetailInfo: React.FC<StudentDetailInfoProps> = ({ studentId }) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const hasFetched = useRef<boolean>(false);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    const fetchStudentDetail = async () => {
      try {
        const data: StudentInfo = await getStudentDetail(studentId);
        setStudentInfo(data);
      } catch (error) {
        message.error("Failed to load student details.");
      }
    };

    fetchStudentDetail();
  }, [studentId]);

  if (!studentInfo) {
    return <p>Loading...</p>;
  }

  return (
    <Descriptions bordered column={1} className="info-table">
      <Descriptions.Item label="Full Name">{studentInfo.name}</Descriptions.Item>
      <Descriptions.Item label="Email">{studentInfo.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{studentInfo.phone}</Descriptions.Item>
      <Descriptions.Item label="Gender">{studentInfo.gender ? "Male" : "Female"}</Descriptions.Item>
      <Descriptions.Item label="Birth Date">{formatDate(studentInfo.dateOfBirth)}</Descriptions.Item>
    </Descriptions>
  );
};

export default StudentDetailInfo;