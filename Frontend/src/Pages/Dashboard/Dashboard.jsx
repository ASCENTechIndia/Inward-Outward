import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout
      title=""
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "",
      }}
    >
      <ToastContainer position="top-right" autoClose={8000} />
      <div style={{ display: "none" }}></div>
    </Layout>
  );
};

export default Dashboard;
