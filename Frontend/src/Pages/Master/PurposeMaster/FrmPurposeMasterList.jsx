import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmPurposeMasterList = () => {
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Purpose Id", "Purpose Name"];

  const fetchPurposeList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("gerPurposeMasterList");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item) => [
          <Link
            key={item.NUM_PURPOSE_ID}
            state={{ purposeId: item.NUM_PURPOSE_ID }}
            to={`/Masters/FrmPurposeMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_PURPOSE_ID || "",
          item.VAR_PURPOSE_NAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching purpose list:", error);
      alert("Failed to fetch purpose list.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurposeList();
  }, []);

  return (
    <Layout
      title="Purpose List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Purpose List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={`/Masters/FrmPurposeMaster`}>
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

export default FrmPurposeMasterList;
