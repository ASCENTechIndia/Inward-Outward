import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";

const FrmDocumentSubTypeList = () => {
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);
  const [docTypeOptions, setDocTypeOptions] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("");

  const tableHeader = [
    "Select",
    "Doc Type Id",
    "Doc Type Name",
    "Doc SubType Id",
    "Doc SubType Name",
  ];

  const fetchDocTypeDropdown = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getDocumentTypeDropdown");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const options = res.data.data.map((item) => ({
          value: String(item.NUM_DOCTYPE_ID),
          label: item.VAR_DOCTYPE_NAME,
        }));
        setDocTypeOptions(options);
      } else {
        setDocTypeOptions([]);
      }
    } catch (error) {
      console.error("Error fetching doc type dropdown:", error);
      alert(error.message || "Failed to fetch doc type dropdown.");
      setDocTypeOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocSubTypeList = async (docTypeId) => {
    if (!docTypeId) {
      setTableData([]);
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post("getDocumentSubTypeList", {
        docTypeId: Number(docTypeId),
      });

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const data = res.data.data.map((item) => [
          <Link
            key={item.NUM_DOCSUBTYPE_ID}
            state={{
              docTypeId: item.NUM_DOCTYPE_ID,
              docSubTypeId: item.NUM_DOCSUBTYPE_ID,
              docSubTypeName: item.DOCSUBTYPENAME,
              mode: 2
            }}
            to={`/Masters/FrmDocumentSubTypeMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_DOCTYPE_ID || "",
          item.VAR_DOCTYPE_NAME || "",
          item.NUM_DOCSUBTYPE_ID || "",
          item.DOCSUBTYPENAME || "",
        ]);
        setTableData(data);
      } else {
        alert("No record found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching doc subtype list:", error);
      alert(error.message || "Failed to fetch doc subtype list.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDocTypeChange = (e) => {
    const docTypeId = e.target.value;
    setSelectedDocType(docTypeId);
    fetchDocSubTypeList(docTypeId);
  };

  useEffect(() => {
    fetchDocTypeDropdown();
  }, []);

  return (
    <Layout
      title="Document Sub Type List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Document Sub Type List",
      }}
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="w-full sm:w-72">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Document Type
            </label>
            <select
              value={selectedDocType}
              onChange={handleDocTypeChange}
              className="form-input-box w-full shadow-sm border border-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="">-- Select Document Type --</option>
              {docTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:ml-auto">
            <Link
              to={`/Masters/FrmDocumentSubTypeMaster`}
              state={
                selectedDocType ? { docTypeId: Number(selectedDocType) } : {}
              }
            >
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

export default FrmDocumentSubTypeList;
