import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetailComponent from "../../../components/DetailComponent";
import StudentDetailInfo from "../pages/StudentDetailInfo";
import StudentDetailList from "../pages/StudentDetailList";
import { Tab } from "../model/student";

const StudentDetail: React.FC = () => {
  const { id, tab } = useParams<{ id?: string; tab?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(tab || "InfomationStudent");

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab, activeTab]);

  if (!id) {
    navigate("/student");
    return null;
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/student/${id}?tab=${key}`);
  };

  const tabs: Tab[] = [
    {
      label: "Student Information",
      key: "InfomationStudent",
      component: <StudentDetailInfo studentId={id} />,
    },
    {
      label: "List of Classes",
      key: "ListOfClasses",
      component: <StudentDetailList studentId={id} />,
    },
  ];

  return (
    <DetailComponent
      title="Student"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
};

export default StudentDetail;