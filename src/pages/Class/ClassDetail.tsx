import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DetailComponent from "../../components/DetailComponent";
import ClassDetailInfo from "../../pages/Class/ClassDetailInfo";
import ClassDetailList from "../../pages/Class/ClassDetailList";

interface Tab {
  label: string;
  key: string;
  component: React.ReactNode;
}

const ClassDetail: React.FC = () => {
  const { id, tab } = useParams<{ id?: string; tab?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(tab || "InfomationClass");

  // Move useEffect to top level
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab, activeTab]);

  // Handle undefined id
  if (!id) {
    navigate("/class");
    return null;
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/class/${id}/${key}`);
  };

  const tabs: Tab[] = [
    {
      label: "Class Information",
      key: "InfomationClass",
      component: <ClassDetailInfo classId={id} />,
    },
    {
      label: "List of Students",
      key: "ListofStudents",
      component: <ClassDetailList classId={id} />,
    },
  ];

  return (
    <DetailComponent
      title="Class"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    />
  );
};

export default ClassDetail;