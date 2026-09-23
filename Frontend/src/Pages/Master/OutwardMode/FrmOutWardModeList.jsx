import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmOutWardModeList = () => {
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Outward Mode Id", "Outward Mode Name"];

  const fetchOutwardModeList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getOurwardList");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item, index) => [
          <Link
            key={`${item.NUM_OUTWARDMODE_ID}-${index}`}
            state={{ outwardModeId: item.NUM_OUTWARDMODE_ID }}
            to={`/Masters/FrmOutWardModeMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_OUTWARDMODE_ID || "",
          item.VAR_OUTWARDMODE_NAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching outward mode list:", error);
      alert(error.message);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutwardModeList();
  }, []);

  return (
    <Layout
      title="Outward Mode List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Outward Mode List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={`/Masters/FrmOutWardModeMaster`}>
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

export default FrmOutWardModeList;
