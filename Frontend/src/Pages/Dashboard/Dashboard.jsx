import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatCard from "../../Components/StatCard";
import Card from "../../Components/Card";
import PieChart from "../../Components/PieChart";
import Table from "../../Components/Table";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout
      title="Dashboard"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Dashboard",
      }}
    >
      <ToastContainer position="top-right" autoClose={8000} />
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <StatCard
            title="Today"
            gradient="linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)"
            categories={[
              { category: "Inward", count: 10 },
              { category: "Outward", count: 5 },
            ]}
          />

          <StatCard
            title="Week"
            gradient="linear-gradient(135deg, #f2fff7 0%, #e4f8ed 100%)"
            categories={[
              { category: "Inward", count: 50 },
              { category: "Outward", count: 25 },
            ]}
          />

          <StatCard
            title="Month"
            gradient="linear-gradient(135deg, #fff9ed 0%, #fff1d6 100%)"
            categories={[
              { category: "Inward", count: 150 },
              { category: "Outward", count: 80 },
            ]}
          />

          <StatCard
            title="Year"
            gradient="linear-gradient(135deg, #faf3ff 0%, #f2e5ff 100%)"
            categories={[
              { category: "Inward", count: 1200 },
              { category: "Outward", count: 850 },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card title="All Departments: Statistical View">
            <PieChart
              data={[
                { name: "Inward", value: 125 },
                { name: "Outward", value: 75 },
              ]}
            />
          </Card>
          <Card
            title={"All Departments: Status View"}
          >
            <Table 
              headers={[
                "Department Name",
                "Total",
                "Open",
                "Closed",
                "Forward"
              ]}

              data={[
                ["Encroachment", 3, 1, 2, 0],
                ["Property", 21, 11, 9, 1]
              ]}

              showTotal={true}
              totalColumns={[1,2,3,4]}
              showSearch={false}
            />
          </Card>
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;
