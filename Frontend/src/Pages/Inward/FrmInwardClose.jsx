import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import * as XLSX from "xlsx";

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

const FrmInwardClose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const invardNo = location?.state?.invardNo;

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      inwardId: "",
      inwardNo: "",
      sender: "",
      subtype: "",
      docType: "",
      docSubType: "",
      refNo: "",
      refDate: "",
      from: "",
      subject: "",
      letterType: "",
    },
  });

  const [tableData, setTableData] = useState([]);
  const [showInwardDetailsModal, setShowInwardDetailsModal] = useState(false);

  const [pendingPopupData, setPendingPopupData] = useState(null);

  const [senderOptions, setSenderOptions] = useState([]);
  const [subTypeOptions, setSubTypeOptions] = useState([]);
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [documentSubTypeOptions, setDocumentSubTypeOptions] = useState([]);

  const fetchSendersDropdown = async () => {
    const response = await apiService.post("getSendersDropdown", {
      ulbid: Number(ulbid),
    });
    if (!response?.data?.success) return [];
    return (response.data.data || []).map((item) => ({
      label: item.VAR_SENDER_NAME || "",
      value: String(item.NUM_SENDER_ID ?? ""),
    }));
  };

  const fetchSubTypesDropdown = async (senderId) => {
    const response = await apiService.post("getSubTypesDropdown", {
      ulbid: Number(ulbid),
      senderId: Number(senderId),
    });
    if (!response?.data?.success) return [];
    return (response.data.data || []).map((item) => ({
      label: item.VAR_SENDERSUBTYPE_NAME || "",
      value: String(item.NUM_SENDERSUBTYPE_ID ?? ""),
    }));
  };

  const fetchDocumentTypeDropdown = async () => {
    const response = await apiService.get("getDocumentTypeDropdown");
    if (!response?.data?.success) return [];
    return (response.data.data || []).map((item) => ({
      label: item.VAR_DOCTYPE_NAME || "",
      value: String(item.NUM_DOCTYPE_ID ?? ""),
    }));
  };

  const fetchDocumentSubTypeDropdown = async () => {
    const response = await apiService.get("getDocumentSubTypeDropdown");
    if (!response?.data?.success) return [];
    return (response.data.data || []).map((item) => ({
      label: item.VAR_DOCSUBTYPE_NAME || "",
      value: String(item.NUM_DOCSUBTYPE_ID ?? ""),
    }));
  };

  const fetchInwardCloseList = async () => {
    try {
      setLoading(true);
      const payload = {
        ulbid: Number(ulbid),
        inwardNo: invardNo || "",
        userId: String(userId),
      };

      const response = await apiService.post("getInwardCloseList", payload);

      if (response?.data?.success && response?.data?.data?.length > 0) {
        const formatted = response.data.data.map((item, index) => ({
          srNo: index + 1,
          inwardId: item.INWARDID,
          inwardNo: item.INWORD_NO || "-",
          inwardDate: formatDateForDisplay(item.INWARDDATE),
          refNo: item.REF_NO || "-",
          refDate: formatDateForDisplay(item.REF_DATE),
          mobileNo: item.MOBILE_NO || "-",
          subject: item.SUBJECT || "-",
          letterType: item.VAR_LETTERTYPE_TYPE || item.LETTERTYPE || "-",
        }));
        setTableData(formatted);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching inward close list:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInwardClosePopupData = async (row) => {
    try {
      setLoading(true);

      reset();
      setPendingPopupData(null);
      setSubTypeOptions([]);

      const payload = {
        ulbid: Number(ulbid),
        inwardNo: row.inwardNo,
        inwardId: row.inwardId,
      };

      const response = await apiService.post(
        "getInwardClosePopupData",
        payload,
      );

      if (response?.data?.success && response?.data?.data?.length > 0) {
        const data = response.data.data[0];

        setValue("inwardId", data.NUM_INWARD_INWARDID || "");
        setValue("inwardNo", data.NUM_INWARD_INWARDNO || "");
        setValue("refNo", data.VAR_INWARD_REFNO || "");
        setValue("refDate", formatDateForInput(data.DATE_INWARD_REFDATE));
        setValue("from", data.VAR_INWARD_FROM || "");
        setValue("subject", data.VAR_INWARD_SUBJECT || "");
        setValue(
          "letterType",
          data.VAR_LETTERTYPE_TYPE || data.VAR_INWARD_LETTERTYPE || "",
        );

        if (data.NUM_INWARD_SENDERID) {
          try {
            const subTypes = await fetchSubTypesDropdown(
              data.NUM_INWARD_SENDERID,
            );
            setSubTypeOptions(subTypes);
          } catch (err) {
            console.error("Error fetching sub types:", err);
            setSubTypeOptions([]);
          }
        }

        setPendingPopupData(data);

        setShowInwardDetailsModal(true);
      } else {
        alert("No details found");
      }
    } catch (error) {
      console.error(error);
      alert(error?.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pendingPopupData) return;

    if (senderOptions.length > 0 && pendingPopupData.NUM_INWARD_SENDERID) {
      setValue("sender", String(pendingPopupData.NUM_INWARD_SENDERID));
    }

    if (
      subTypeOptions.length > 0 &&
      pendingPopupData.NUM_INWARD_SENDERSUBTYPEID
    ) {
      setValue("subtype", String(pendingPopupData.NUM_INWARD_SENDERSUBTYPEID));
    }

    if (documentTypeOptions.length > 0 && pendingPopupData.NUM_INWARD_DOCTYPE) {
      setValue("docType", String(pendingPopupData.NUM_INWARD_DOCTYPE));
    }

    if (
      documentSubTypeOptions.length > 0 &&
      pendingPopupData.NUM_INWARD_DOCSUBTYPE
    ) {
      setValue("docSubType", String(pendingPopupData.NUM_INWARD_DOCSUBTYPE));
    }
  }, [
    pendingPopupData,
    senderOptions,
    subTypeOptions,
    documentTypeOptions,
    documentSubTypeOptions,
    setValue,
  ]);

  const handleExportToExcel = () => {
    if (!tableData || tableData.length === 0) {
      alert("Export करण्यासाठी कोणताही डेटा उपलब्ध नाही.");
      return;
    }

    const excelData = tableData.map((item, index) => ({
      अनुक्रमांक: index + 1,
      "आवक क्र.": item.inwardNo || "-",
      तारीख: item.inwardDate || "-",
      "संदर्भ क्रमांक": item.refNo || "-",
      "संदर्भ दिनांक": item.refDate || "-",
      "मोबाईल क्र": item.mobileNo || "-",
      विषय: item.subject || "-",
      "पत्राचे प्रकार": item.letterType || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 15 },
      { wch: 40 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "आवक तपशील");

    XLSX.writeFile(
      workbook,
      `आवक_तपशील_${new Date().toISOString().slice(0, 10)}_${invardNo || ""}.xlsx`,
    );
  };

  const handleModalSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        IN_USERID: String(userId),
        IN_inwardid: Number(data.inwardId),
        IN_INWARDNO: data.inwardNo,
        in_orgId: Number(ulbid),
      };

      const response = await apiService.post("aoio_inwardclose_ins", payload);

      if (response?.data?.success) {
        alert(
          response.data.errorMessage || "Inward details updated successfully",
        );
        setShowInwardDetailsModal(false);
        reset();
        navigate("/Inward/FrmInwardDtlsClose");
      } else {
        alert(
          response?.data?.errorMessage || "Failed to update inward details",
        );
      }
    } catch (error) {
      console.error("Error submitting inward close:", error);
      alert(error?.message || "Failed to update inward close details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ulbid) return;

    const loadAllDropdowns = async () => {
      const results = await Promise.allSettled([
        fetchSendersDropdown(),
        fetchDocumentTypeDropdown(),
        fetchDocumentSubTypeDropdown(),
      ]);

      const [senders, docTypes, docSubTypes] = results;

      if (senders.status === "fulfilled") {
        setSenderOptions(senders.value);
      } else {
        console.error("Senders dropdown failed:", senders.reason);
        setSenderOptions([]);
      }

      if (docTypes.status === "fulfilled") {
        setDocumentTypeOptions(docTypes.value);
      } else {
        console.error("Document types dropdown failed:", docTypes.reason);
        setDocumentTypeOptions([]);
      }

      if (docSubTypes.status === "fulfilled") {
        setDocumentSubTypeOptions(docSubTypes.value);
      } else {
        console.error(
          "Document sub types dropdown failed:",
          docSubTypes.reason,
        );
        setDocumentSubTypeOptions([]);
      }
    };

    loadAllDropdowns();
  }, [ulbid]);

  useEffect(() => {
    if (ulbid && userId && invardNo) {
      fetchInwardCloseList();
    }
  }, [ulbid, userId, invardNo]);

  return (
    <Layout
      title="Inward Close"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        currrent: "Inward Close",
      }}
    >
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="आवक क्र. : " />
            <input
              type="text"
              placeholder="Enter Inward Number"
              className="form-input-box"
              value={invardNo || ""}
              disabled
              readOnly
            />
          </div>
          <div>
            <div className="flex items-end gap-3">
              <Button type="button" onClick={fetchInwardCloseList}>
                शोधा
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/Inward/FrmInwardDtls")}
              >
                मागे
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Button type="button" onClick={handleExportToExcel}>
            Export to Excel
          </Button>
        </div>

        <div className="mt-3">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] table-fixed border-collapse">
                <thead className="bg-slate-100/95">
                  <tr className="border-b border-slate-200">
                    {[
                      "अनुक्रमांक",
                      "आवक क्र.",
                      "तारीख",
                      "संदर्भ क्रमांक",
                      "संदर्भ दिनांक",
                      "मोबाईल क्र",
                      "विषय",
                      "पत्राचे प्रकार",
                      "निवडा",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((item) => (
                      <tr
                        key={item.inwardId}
                        className="border-b border-slate-100 hover:bg-slate-50/60"
                      >
                        <td className="px-3 py-2 text-center">{item.srNo}</td>
                        <td className="px-3 py-2 text-center">
                          {item.inwardNo}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.inwardDate}
                        </td>
                        <td className="px-3 py-2 text-center">{item.refNo}</td>
                        <td className="px-3 py-2 text-center">
                          {item.refDate}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.mobileNo}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.subject}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.letterType}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex justify-center items-center px-3 py-2">
                            <button
                              type="button"
                              className="p-1.5 rounded-md text-blue-600 border border-blue-300 hover:bg-blue-50 active:scale-[0.95] transition-all"
                              onClick={() => fetchInwardClosePopupData(item)}
                            >
                              Select
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-3 py-6 text-center text-slate-500"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showInwardDetailsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowInwardDetailsModal(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 flex-shrink-0">
                <h3 className="text-base font-semibold text-slate-800">
                  आवक तपशील
                </h3>
                <button
                  type="button"
                  onClick={() => setShowInwardDetailsModal(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form
                onSubmit={handleSubmit(handleModalSubmit)}
                className="flex flex-col flex-1 min-h-0"
              >
                <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <Label text="आवक क्र.: " />
                      <input
                        type="text"
                        className="form-input-box w-full bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("inwardNo")}
                      />
                    </div>

                    <div className="min-w-0">
                      <Label text="पाठवणारा : " />
                      <select
                        className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("sender")}
                      >
                        <option value="">-- Select --</option>
                        {senderOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="min-w-0">
                      <Label text="उपप्रकार : " />
                      <select
                        className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("subtype")}
                      >
                        <option value="">-- Select --</option>
                        {subTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="min-w-0">
                      <Label text="दस्तऐवजचे प्रकार : " />
                      <select
                        className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("docType")}
                      >
                        <option value="">-- Select --</option>
                        {documentTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="min-w-0">
                      <Label text="दस्तऐवजचे उपप्रकार : " />
                      <select
                        className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("docSubType")}
                      >
                        <option value="">-- Select --</option>
                        {documentSubTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="min-w-0">
                      <Label text="संदर्भ क्रमांक : " />
                      <input
                        type="text"
                        className="form-input-box w-full bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("refNo")}
                      />
                    </div>

                    {/* ONLY EDITABLE FIELD */}
                    <div className="min-w-0">
                      <Label text="संदर्भ दिनांक : " />
                      <input
                        type="date"
                        className="form-input-box w-full"
                        {...register("refDate")}
                      />
                    </div>

                    <div className="min-w-0">
                      <Label text="पासून : " />
                      <input
                        type="text"
                        className="form-input-box w-full bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("from")}
                      />
                    </div>

                    <div className="min-w-0">
                      <Label text="विषय : " />
                      <input
                        type="text"
                        className="form-input-box w-full bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("subject")}
                      />
                    </div>

                    <div className="min-w-0">
                      <Label text="पत्राचे प्रकार : " />
                      <input
                        type="text"
                        className="form-input-box w-full bg-slate-100 cursor-not-allowed"
                        disabled
                        {...register("letterType")}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                  <Button type="submit">साठवा</Button>
                  <Button
                    type="button"
                    onClick={() => setShowInwardDetailsModal(false)}
                  >
                    बंद
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FrmInwardClose;
