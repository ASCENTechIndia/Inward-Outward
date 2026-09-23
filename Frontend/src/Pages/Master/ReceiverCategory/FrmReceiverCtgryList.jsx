import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmReceiverCtgryList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);

  const tableHeader = [
    "Select",
    "Receiver Category id",
    "Receiver Category Name",
  ];

  const fetchReceiverCategoryList = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getReceiverCategoryList");

      console.log("Receiver Category List:", res);

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item, index) => [
          <Link
            key={`${item.NUM_RECEIVERCATEGORY_ID}-${index}`}
            state={{ receiverCategoryId: item.NUM_RECEIVERCATEGORY_ID }}
            to={`/Masters/FrmReceiverCtgryMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_RECEIVERCATEGORY_ID || "",
          item.VAR_RECEIVERCATEGORY_NAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching receiver category list:", error);
      alert("Failed to fetch receiver category list.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceiverCategoryList();
  }, []);

  return (
    <Layout
      title="Receiver Category List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Receiver Category List",
      }}
    >
      <div>
        <div className="ml-auto">
          <Link to={`/Masters/ReceiverCtgryMaster`}>
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

export default FrmReceiverCtgryList;
