import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import MenuComponent from "./components/MenuComponent";
import StudentTable from "./modules/Student/pages/StudentTable";
import StudentDetail from "./modules/Student/pages/StudentDetail";
import ClassTable from "./modules/Class/pages/ClassTable";
import ClassDetail from "./modules/Class/pages/ClassDetail";
import "./styles/app.css";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <MenuComponent />
        <Layout className="site-layout">
          <Content className="app-content">
            <Routes>
              <Route path="/class" element={<ClassTable />} />
              <Route path="/class/:id" element={<ClassDetail />} />
              <Route path="/student" element={<StudentTable />} />
              <Route path="/student/:id" element={<StudentDetail />} />
              <Route
                path="/"
                element={
                  <div className="welcome-container">
                    <h2>Welcome To Management System</h2>
                  </div>
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
