import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmReceiverSubCatList = () => {
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const tableHeader = [
    "Select",
    "Category Id",
    "Sub Category Id",
    "Category Name",
    "Sub Category Name",
  ];

  const fetchCategoryDropdown = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getReciverCategoryDropdown");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const options = res.data.data.map((item) => ({
          value: String(item.NUM_RECEIVERCATEGORY_ID),
          label: item.VAR_RECEIVERCATEGORY_NAME,
        }));
        setCategoryOptions(options);
      } else {
        setCategoryOptions([]);
      }
    } catch (error) {
      console.error("Error fetching category dropdown:", error);
      alert(error.message || "Failed to fetch category dropdown.");
      setCategoryOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReceiverSubCatList = async (categoryId) => {
    if (!categoryId) {
      setTableData([]);
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post("getReceiverSubCategoryList", {
        receiverCategoryId: Number(categoryId),
      });

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item, index) => [
          <Link
            key={`${item.NUM_RECEIVERSUBCAT_ID}-${index}`}
            state={{
              receiverCategoryId: item.NUM_RECEIVERCATEGORY_ID,
              receiverSubCatId: item.NUM_RECEIVERSUBCAT_ID,
              receiverSubCatName: item.VAR_RECEIVERSUBCAT_NAME,
            }}
            to={`/Masters/FrmReceiverSubCatMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_RECEIVERCATEGORY_ID || "",
          item.NUM_RECEIVERSUBCAT_ID || "",
          item.VAR_RECEIVERCATEGORY_NAME || "",
          item.VAR_RECEIVERSUBCAT_NAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching sub category list:", error);
      alert(error.message || "Failed to fetch sub category list.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchReceiverSubCatList(categoryId);
  };

  useEffect(() => {
    fetchCategoryDropdown();
  }, []);

  return (
    <Layout
      title="Receiver Sub Category List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Receiver Sub Category List",
      }}
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="w-full sm:w-72">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Receiver Category
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="form-input-box w-full shadow-sm border border-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="">-- Select Category --</option>
              {categoryOptions.map((opt, idx) => (
                <option key={`${opt.value}-${idx}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:ml-auto">
            <Link to={`/Masters/FrmReceiverSubCatMaster`}>
              <Button
                type="button"
                variant="primary"
                className="hover:cursor-pointer"
              >
                Add New
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-3">
          <Table headers={tableHeader} data={tableData} />
        </div>
      </div>
    </Layout>
  );
};

export default FrmReceiverSubCatList;
