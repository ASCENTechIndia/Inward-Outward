import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmDocTypeList = () => {
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = ["Select", "Doc Type Id", "Doc Type Name"];

  const fetchDocTypeList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getDocTypeList");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item) => [
          <Link
            key={item.NUM_DOCTYPE_ID}
            state={{ docTypeId: item.NUM_DOCTYPE_ID }}
            to={`/Masters/FrmDocTypeMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_DOCTYPE_ID || "",
          item.VAR_DOCTYPE_NAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching doc type list:", error);
      alert(error.message);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocTypeList();
  }, []);

  return (
    <Layout
      title="Document Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Document Type List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={`/Masters/FrmDocTypeMaster`}>
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

export default FrmDocTypeList;
