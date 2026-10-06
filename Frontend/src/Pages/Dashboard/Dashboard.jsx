import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import { useAuth } from "../../Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StatCard from "../../Components/StatCard";
import Card from "../../Components/Card";
import PieChart from "../../Components/PieChart";
import Table from "../../Components/Table";
import { useNavigate } from "react-router-dom";
import apiService from "../../../apiService";
import { useLoader } from "../../Context/LoaderContext";

const formatDate = (date) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};



const getMonthDateRange = () => {
  const today = new Date();

  const startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  return {
    fromDate: formatDate(startDate),
    toDate: formatDate(today)
  };
};


const getYearDateRange = () => {
  const year = new Date().getFullYear();

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  return {
    fromDate: formatDate(startDate),
    toDate: formatDate(endDate)
  };
};

const Dashboard = () => {
  const { user } = useAuth();
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const ulbId = user?.ulbId;
  const userId = user?.userId;

  const [dayCount, setDayCount] = useState([]);
  const [weekCount, setWeekCount] = useState([]);
  const [monthCount, setMonthCount] = useState([]);
  const [yearCount, setYearCount] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [tableHeader, setTableHeader] = useState(["Department Name", "Total", "Open", "Closed", "Forward"]);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchDepartmentTableData = async () => {
    try {
      setLoading(true);

      const response = await apiService.get("getDashboardAllDepartmentList");

      if (response?.data?.success && Array.isArray(response?.data?.data)) {
        const formatted = response.data.data.map(item => ([
          item.DEPTNAME,
          item.TOTAL,
          item.INW_OPEN,
          item.INW_CLOSE,
          item.INW_FORWARD
        ]));

        const formattedPieChartData = response.data.data.map(item => ({
          name: item.DEPTNAME,
          value: item.TOTAL
        }))

        setTableData(formatted);
        setPieChartData(formattedPieChartData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchCardData = async () => {
    try {
      setLoading(true);
      
      const payload = {
        "fromMonth": getMonthDateRange().fromDate,
        "toMonth": getMonthDateRange().toDate,
        "fromYear": getYearDateRange().fromDate,
        "toYear": getYearDateRange().toDate
      }

      const response = await apiService.post("getDashboardSummaryCounts", payload);

      if (response?.data?.success) {
        setDayCount([
          { category: "Inward", count: response.data.data.today.inward },
          { category: "Outward", count: response.data.data.today.close }
        ]);

        setWeekCount([
          { category: "Inward", count: response.data.data.week.inward },
          { category: "Outward", count: response.data.data.week.close }
        ]);

        setMonthCount([
          { category: "Inward", count: response.data.data.month.inward },
          { category: "Outward", count: response.data.data.month.close }
        ]);

        setYearCount([
          { category: "Inward", count: response.data.data.year.inward},
          { category: "Outward", count: response.data.data.year.close}
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDepartmentTableData();
    fetchCardData();
  }, [user]);

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
            gradient="linear-gradient(135deg, #F1F2FA 0%, #E2E4F4 100%)"
            categories={dayCount}
          />

          <StatCard
            title="Week"
            gradient="linear-gradient(135deg, #FFF8E8 0%, #FFECC7 100%)"
            categories={weekCount}
          />

          <StatCard
            title="Month"
            gradient="linear-gradient(135deg, #FFF0F1 0%, #FFE1E4 100%)"
            categories={monthCount}
          />

          <StatCard
            title="Year"
            gradient="linear-gradient(135deg, #E9FFF2 0%, #D5F9E4 100%)"
            categories={yearCount}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card title="All Departments: Statistical View">
            <PieChart
              data={pieChartData}
            />
          </Card>

          <Card title="All Departments: Status View">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    {tableHeader.map(
                      (header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-sm font-bold text-slate-600 text-left"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {row[0]}
                      </td>

                      {row.slice(1).map((value, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-3 text-sm text-slate-700 text-center"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-slate-100">
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">
                      Total
                    </td>

                    {[1, 2, 3, 4].map((columnIndex) => (
                      <td
                        key={columnIndex}
                        className="px-4 py-3 text-sm font-bold text-slate-800 text-center"
                      >
                        {tableData.reduce(
                          (sum, row) => sum + Number(row[columnIndex] || 0),
                          0
                        )}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;
