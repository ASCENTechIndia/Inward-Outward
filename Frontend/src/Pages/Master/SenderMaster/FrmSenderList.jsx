import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmSenderList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Sender Id", "Sender Name"];

  const fetchSenderList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getSenderMasterList");

      if (res?.data?.success && res?.data?.data?.length > 0) {
        const data = res.data.data.map((item) => [
          <Link
            key={item.NUM_SENDER_ID}
            state={{ senderId: item.NUM_SENDER_ID }}
            to={`/Masters/FrmSenderMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_SENDER_ID || "",
          item.VAR_SENDER_NAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      setTableData([]);
      console.error("Error fetching sender list:", error);
      alert("Failed to fetch sender list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSenderList();
  }, []);

  return (
    <Layout
      title="Sender List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sender List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={"/Masters/FrmSenderMaster"}>
            <Button
              type="button"
              variant="primary"
              className="hover:cursor-pointer"
            >
              Add New
            </Button>
          </Link>
        </div>

        <div className="mt-3">
          <Table headers={tableHeader} data={tableData} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmSenderList;
