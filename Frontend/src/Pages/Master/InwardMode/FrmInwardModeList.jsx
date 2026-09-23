import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmInwardModeList = () => {
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Inward Mode Id", "Inward Mode Name"];

  const fetchInwardModeList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getInwardModeList");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item) => [
          <Link
            key={item.NUM_INWARDMODE_ID}
            state={{ inwardModeId: item.NUM_INWARDMODE_ID }}
            to={`/Masters/FrmInwardModeMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_INWARDMODE_ID || "",
          item.VAR_INWARDMODE_NAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching inward mode list:", error);
      alert("Failed to fetch inward mode list.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInwardModeList();
  }, []);

  return (
    <Layout
      title="Inward Mode List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Inward Mode List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={`/Masters/FrmInwardModeMaster`}>
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

export default FrmInwardModeList;
