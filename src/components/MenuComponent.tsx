import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserOutlined, BookOutlined, HomeOutlined } from "@ant-design/icons";
import { Menu, Layout, Switch } from "antd";
import "../styles/menu.component.css";

const { Sider } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const MenuComponent: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [collapsed, setCollapsed] = useState<boolean>(window.innerWidth < 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems: MenuItem[] = [
    { key: "", label: "Home", icon: <HomeOutlined /> },
    { key: "class", label: "Class Management", icon: <BookOutlined /> },
    { key: "student", label: "Student Management", icon: <UserOutlined /> },
  ];

  const changeTheme = (value: boolean) => setTheme(value ? "dark" : "light");
  const handleMenuClick = (e: { key: string }) => navigate(`/${e.key}`);
  const selectedKey = location.pathname.includes("/class")
    ? "class"
    : location.pathname.includes("/student")
    ? "student"
    : location.pathname.substring(1) || "";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value: boolean) => setCollapsed(value)}
      theme={theme}
      className="menu-sider"
    >
      <div className={`menu-header ${theme}`}>
        {collapsed ? "🎓" : "Management"}
        {!collapsed && (
          <Switch
            checked={theme === "dark"}
            onChange={changeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            className="theme-switch"
          />
        )}
      </div>

      <Menu
        theme={theme}
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={[""]}
        items={menuItems}
        onClick={handleMenuClick}
        className="menu-content"
      />
    </Sider>
  );
};

export default MenuComponent;