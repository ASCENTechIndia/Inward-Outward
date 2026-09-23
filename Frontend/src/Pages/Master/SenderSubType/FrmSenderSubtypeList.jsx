import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import Table from "../../../Components/Table";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";

const FrmSenderSubtypeList = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [tableData, setTableData] = useState([]);
  const [senderOptions, setSenderOptions] = useState([]);
  const [selectedSender, setSelectedSender] = useState("");

  const tableHeader = [
    "Select",
    "Sender Id",
    "SubSender Id",
    "SubSender Name",
    "SubSender Status",
  ];

  const fetchSenderDropdown = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getSenderTypeDropdown");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const options = res.data.data.map((item) => ({
          value: String(item.NUM_SENDER_ID),
          label: item.VAR_SENDER_NAME,
        }));
        setSenderOptions(options);
      } else {
        setSenderOptions([]);
      }
    } catch (error) {
      console.error("Error fetching sender dropdown:", error);
      alert("Failed to fetch sender dropdown.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtypeList = async (senderId) => {
    if (!senderId) {
      setTableData([]);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        senderTypeId: Number(senderId),
      };

      const res = await apiService.post("getSenderSubTypeList", payload);

      if (res?.data?.success && res?.data?.data?.length > 0) {
        const data = res.data.data.map((item) => [
          <Link
            state={{
              senderId: item.NUM_SENDER_ID,
              senderSubTypeId: item.NUM_SENDERSUBTYPE_ID,
              subTypeName: item.SENDERSUBTYPENAME,
              status: item.ACTIVEFLAG,
            }}
            to={`/Masters/FrmSenderSubtypeMaster`}
            className="text-blue-600 underline hover:text-blue-800 font-medium"
          >
            Select
          </Link>,
          item.NUM_SENDER_ID || "",
          item.NUM_SENDERSUBTYPE_ID || "",
          item.SENDERSUBTYPENAME || "",
          item.ACTIVEFLAG || "",
        ]);
        setTableData(data);
      } else {
        alert("Record not found");
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching subtype list:", error);
      alert("Failed to fetch subtype list.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSenderChange = (e) => {
    const senderId = e.target.value;
    setSelectedSender(senderId);
    fetchSubtypeList(senderId);
  };

  useEffect(() => {
    fetchSenderDropdown();
  }, []);

  return (
    <Layout
      title="Sender Subtype List"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sender Subtype List",
      }}
    >
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          {/* Dropdown */}
          <div className="w-full sm:w-72">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Sender
            </label>
            <select
              value={selectedSender}
              onChange={handleSenderChange}
              className="form-input-box w-full shadow-sm border border-gray-400 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="">-- Select Sender --</option>
              {senderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:ml-auto">
            <Link to={`/Masters/FrmSenderSubtypeMaster`}>
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

export default FrmSenderSubtypeList;
