import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import MenuComponent from "./components/MenuComponent";
import StudentTable from "./pages/Student/StudentTable";
import StudentDetail from "./pages/Student/StudentDetail";
import ClassTable from "./pages/Class/ClassTable";
import ClassDetail from "./pages/Class/ClassDetail";
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
              <Route path="/class/:id/:tab" element={<ClassDetail />} />
              <Route path="/student" element={<StudentTable />} />
              <Route path="/student/:id/:tab" element={<StudentDetail />} />
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
