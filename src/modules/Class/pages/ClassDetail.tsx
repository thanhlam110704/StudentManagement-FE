import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DetailComponent from "../../../components/DetailComponent";
import ClassDetailInfo from "../pages/ClassDetailInfo";
import ClassDetailList from "../pages/ClassDetailList";

interface Tab {
  label: string;
  key: string;
  component: React.ReactNode;
}

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab from query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get("tab");
  
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || "InfomationClass");

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab]);

  if (!id) {
    navigate("/class");
    return null;
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/class/${id}?tab=${key}`);
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