import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import Table from "../../Components/Table";
import Excel from "../../Components/Excel/Excel";
import Pdf from "../../Components/PDF/Pdf";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import { useLoader } from "../../Context/LoaderContext";

// Convert ISO date → DD-MMM-YYYY (Oracle format)
const formatOracleDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

// Convert ISO date → DD-MM-YYYY (display)
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${d.getFullYear()}`;
};


const reportHeaders = [
  "अनुक्रमांक.",
  "आवक क्र.",
  "दिनांक",
  "पाठवणारा",
  "SubType",
  "दस्तऐवजचे प्रकार",
  "दस्तऐवजचे उपप्रकार",
  "संदर्भ क्र.",
  "संदर्भ दिनांक",
  "पासुन",
  "पत्ता",
  "मोबाईल क्र.",
  "विषय",
  "संलग्नक",
  "पत्र Type",
  "आवक प्रकार",
  "अर्जदाराचे नाव",
  "विभागाचे नाव",
];

const toOptions = (res, valueKey, labelKey) => {
  if (res?.data?.success && Array.isArray(res.data.data)) {
    return res.data.data.map((item) => ({
      value: String(item[valueKey]),
      label: item[labelKey],
    }));
  }
  return [];
};

const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};


const FrmInwardRegRpt = () => {
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const userDeptId = user?.deptId;
  const userDesigId = user?.desigId;
  const { setLoading } = useLoader();

  const [deptOptions, setDeptOptions] = useState([]);
  const [empOptions, setEmpOptions] = useState([]);
  const [senderOptions, setSenderOptions] = useState([]);
  const [senderSubTypeOptions, setSenderSubTypeOptions] = useState([]);
  const [docTypeOptions, setDocTypeOptions] = useState([]);
  const [docSubTypeOptions, setDocSubTypeOptions] = useState([]);

  const [ulbLogo, setUlbLogo] = useState("");
  const [municipalText, setMunicipalText ] = useState("");

  
  const [tableData, setTableData] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      reportType: "",
      includeDateFilter: false,
      fromDate: getToday(),
      toDate: getToday(),
      deptId: "",
      empId: "",
      senderId: "",
      senderSubTypeId: "",
      docTypeId: "",
      docSubTypeId: "",
    },
  });

  const watchReportType = watch("reportType");
  const watchIncludeDate = watch("includeDateFilter");
  const watchSender = watch("senderId");
  const watchFromDate = watch("fromDate");
  const watchToDate = watch("toDate");


  useEffect(() => {
    if (watchReportType === "1") {
      setValue("includeDateFilter", true);
    } else if (watchReportType !== "") {
      setValue("includeDateFilter", false);
    }
  }, [watchReportType, setValue]);

  const checkboxDisabled = watchReportType === "1";
  const checkboxChecked = watchReportType === "1" || watchIncludeDate === true;
  const datesDisabled = !(watchReportType === "1" || watchIncludeDate === true);


  useEffect(() => {
    setValue("deptId", "");
    setValue("empId", "");
    setValue("senderId", "");
    setValue("senderSubTypeId", "");
    setValue("docTypeId", "");
    setValue("docSubTypeId", "");
    setSenderSubTypeOptions([]);
    setTableData([]);
  }, [watchReportType, setValue]);

  
  useEffect(() => {
    if (!ulbid || !watchReportType) return;

    const loadDropdowns = async () => {
      try {
        setLoading(true);

        if (watchReportType === "2") {
          const res = await apiService.post("getDepartmentDropdown", {
            ulbid: Number(ulbid),
          });
          setDeptOptions(toOptions(res, "DEPTID", "DEPT_MARNAME"));
        } else if (watchReportType === "3") {
          const res = await apiService.post("getEmpDropdown", {
            ulbid: Number(ulbid),
            deptId: Number(userDeptId),
            desigId: Number(userDesigId),
          });
          setEmpOptions(toOptions(res, "NUM_USER_USERID", "VAR_USER_USERNAME"));
        } else if (watchReportType === "4") {
          const results = await Promise.allSettled([
            apiService.post("getSenderTypeDropdown", { ulbId: Number(ulbid) }),
            apiService.get("getDocumentTypeDropdown"),
            apiService.get("getDocumentSubTypeDropdown"),
          ]);

          if (results[0].status === "fulfilled") {
            setSenderOptions(toOptions(results[0].value, "SENDERID", "NAMES"));
          }
          if (results[1].status === "fulfilled") {
            setDocTypeOptions(
              toOptions(results[1].value, "NUM_DOCTYPE_ID", "VAR_DOCTYPE_NAME"),
            );
          }
          if (results[2].status === "fulfilled") {
            setDocSubTypeOptions(
              toOptions(
                results[2].value,
                "NUM_DOCSUBTYPE_ID",
                "VAR_DOCSUBTYPE_NAME",
              ),
            );
          }
        }
      } catch (err) {
        console.error("Dropdown load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDropdowns();
  }, [watchReportType, ulbid, userDeptId, userDesigId, setLoading]);


  useEffect(() => {
    if (!watchSender || !ulbid) {
      setSenderSubTypeOptions([]);
      return;
    }

    const fetchSubTypes = async () => {
      try {
        const res = await apiService.post("getSenderSubTypeConfigTableData", {
          ulbId: Number(ulbid),
          senderId: Number(watchSender),
        });
        setSenderSubTypeOptions(
          toOptions(res, "SENDSUBID", "VAR_SENDERSUBTYPE_NAME"),
        );
      } catch (err) {
        console.error("Subtype load error:", err);
      }
    };

    fetchSubTypes();
  }, [watchSender, ulbid]);

  const fetchLogoAndMunicipal = async () => {
    try {
      setLoading(true);

      const response = await apiService.post("textlogo", {
        "ulbId": Number(ulbid)
      });

      if (response.data.success) {
        setUlbLogo(response?.data?.data?.ULBLOGO);
        setMunicipalText(response?.data?.data?.ABC_MUNICIPAL_TEXT)
      } 
    } catch (error) {
      console.error(error);
    } finally { 
      setLoading(false);
    }
  }


  const onSubmit = async (data) => {
    if (!ulbid) {
      alert("UlbId is not set");
      return;
    }

    if (!data.reportType) {
      alert("कृपया निवडक वर्ग निवडा");
      return;
    }

   
    if (data.reportType === "2" && !data.deptId) {
      alert("कृपया विभाग निवडा");
      return;
    }
    if (data.reportType === "3" && !data.empId) {
      alert("कृपया कर्मचारी निवडा");
      return;
    }
    if (data.reportType === "4") {
      if (!data.senderId && !data.docTypeId && !data.docSubTypeId) {
        alert("कृपया किमान एक माहिती निवडा");
        return;
      }
    }

    // Date validation
    if (data.reportType === "1" || data.includeDateFilter) {
      if (!data.fromDate || !data.toDate) {
        alert("कृपया दिनांक निवडा");
        return;
      }
      if (new Date(data.fromDate) > new Date(data.toDate)) {
        alert("दिनांकापासून दिनांकापर्यंत पेक्षा मोठा असू शकत नाही");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        ulbid: Number(ulbid),
        reportType: Number(data.reportType),
        includeDateFilter:
          data.reportType === "1" ? true : data.includeDateFilter,
        fromDate: data.fromDate ? formatOracleDate(data.fromDate) : null,
        toDate: data.toDate ? formatOracleDate(data.toDate) : null,
        empId: data.empId ? String(data.empId) : null,
        deptId: data.deptId ? Number(data.deptId) : null,
        senderId: data.senderId ? Number(data.senderId) : null,
        senderSubTypeId: data.senderSubTypeId
          ? Number(data.senderSubTypeId)
          : null,
        docTypeId: data.docTypeId ? Number(data.docTypeId) : null,
        docSubTypeId: data.docSubTypeId ? Number(data.docSubTypeId) : null,
      };


      const res = await apiService.post("getInwardRegisterReport", payload);


      if (res?.data?.success && Array.isArray(res.data.data)) {
        if (res.data.data.length === 0) {
          alert("No records found.");
          setTableData([]);
          return;
        }

        const rows = res.data.data.map((row, idx) => [
          idx + 1,
          row.INWARDNO || "",
          formatDisplayDate(row.INWDATE),
          row.SENDERNAME || "",
          row.SENDER_SUBTYPE || "",
          row.DOC_NAME || "",
          row.DOC_SUBTYPE || "",
          row.REFNO || "",
          formatDisplayDate(row.REFDATE),
          row.INWARD_FROM || "",
          row.ADDRESS || "",
          row.MOBILE || "",
          row.SUBJECT || "",
          row.ATTACHMENT || "",
          row.LETTERTYPENAME || "",
          row.MODE_OF_INWARD || "",
          row.APPLINAME || "",
          row.DEPTNAME || "",
        ]);

        setTableData(rows);
      } else {
        alert(res?.data?.errorMessage || "Failed to fetch report");
        setTableData([]);
      }
    } catch (err) {
      console.error("Report submit error:", err);
      alert(err.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

 
  const handleReset = () => {
    reset({
      reportType: "",
      includeDateFilter: false,
      fromDate: "",
      toDate: "",
      deptId: "",
      empId: "",
      senderId: "",
      senderSubTypeId: "",
      docTypeId: "",
      docSubTypeId: "",
    });
    setTableData([]);
    setSenderSubTypeOptions([]);
    setDeptOptions([]);
    setEmpOptions([]);
    setSenderOptions([]);
    setDocTypeOptions([]);
    setDocSubTypeOptions([]);
  };


  const dateRangeText =
    watchReportType === "1" && watchFromDate && watchToDate
      ? `${formatDisplayDate(watchFromDate)} ते ${formatDisplayDate(watchToDate)}`
      : "";

  useEffect(() => {
    if (ulbid) {
      fetchLogoAndMunicipal();
    }
  }, [ulbid]);

  return (
    <Layout
      title="आवक रजिस्टर"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "आवक रजिस्टर",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    
          <div>
            <Label text="निवडक वर्ग : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.reportType ? "border-red-500" : ""}`}
              {...register("reportType", {
                required: "निवडक वर्ग आवश्यक आहे",
              })}
            >
              <option value="">--निवडा--</option>
              <option value="1">दिनांकानुसार</option>
              <option value="2">विभागानुसार</option>
              <option value="3">कर्मचा-यानुसार</option>
              <option value="4">वर्गानुसार</option>
            </select>
            {errors.reportType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.reportType.message}
              </p>
            )}
          </div>


          {watchReportType === "2" && (
            <div>
              <Label text="विभाग : " required />
              <select
                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...register("deptId", { required: true })}
              >
                <option value="">--निवडा--</option>
                {deptOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}


          {watchReportType === "3" && (
            <div>
              <Label text="कर्मचारी : " required />
              <select
                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...register("empId", { required: true })}
              >
                <option value="">--निवडा--</option>
                {empOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}


          {watchReportType === "4" && (
            <>
              <div>
                <Label text="पाठवणारा : " />
                <select
                  className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  {...register("senderId")}
                >
                  <option value="">--निवडा--</option>
                  {senderOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label text="उपप्रकार : " />
                <select
                  disabled={!watchSender}
                  className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/40
                    ${!watchSender ? "bg-slate-100 cursor-not-allowed pointer-events-none" : ""}`}
                  {...register("senderSubTypeId")}
                >
                  <option value="">
                    {watchSender ? "--निवडा--" : "-- Select Sender first --"}
                  </option>
                  {senderSubTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>


        {watchReportType === "4" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label text="दस्तऐवजचे प्रकार : " />
              <select
                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...register("docTypeId")}
              >
                <option value="">--निवडा--</option>
                {docTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label text="दस्तऐवजचे उपप्रकार : " />
              <select
                className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                {...register("docSubTypeId")}
              >
                <option value="">--निवडा--</option>
                {docSubTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={checkboxDisabled}
                checked={checkboxChecked}
                onChange={(e) =>
                  setValue("includeDateFilter", e.target.checked)
                }
                className="w-4 h-4 accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-slate-700">
                दिनांक वापरा
              </span>
            </label>
          </div>

          <div>
            <Label text="दिनांकापासून : " />
            <input
              type="date"
              disabled={datesDisabled}
              className={`form-input-box ${datesDisabled ? "bg-slate-100 cursor-not-allowed" : ""
                }`}
              {...register("fromDate")}
            />
          </div>

          <div>
            <Label text="दिनांकापर्यंत : " />
            <input
              type="date"
              disabled={datesDisabled}
              className={`form-input-box ${datesDisabled ? "bg-slate-100 cursor-not-allowed" : ""
                }`}
              {...register("toDate")}
            />
          </div>
        </div>


        <div className="flex justify-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            साठवा
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset}>
            बदल
          </Button>
        </div>

        {tableData.length > 0 && (
          <>
            <div className="flex justify-start gap-2 pt-4 border-t border-slate-200">
              <Excel
                tableHeader={reportHeaders}
                tableData={tableData}
                fileName={`InwardRegister_${new Date()
                  .toISOString()
                  .slice(0, 10)}.xlsx`}
                sheetName="Inward Register"
                title="आवक रजिस्टर"
              />

              <Pdf
                tableHeader={reportHeaders}
                tableData={tableData}
                fileName={`InwardRegister_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                ulbName={municipalText|| "Municipal Corporation"}
                logoUrl={ulbLogo || ""}
                reportTitle="आवक रजिस्टर"
                dateRange={dateRangeText}
                userName={user?.username || ""}
              />
            </div>

            <div className="mt-3">
              <Table
                headers={reportHeaders}
                data={tableData}
                showSearch={false}
              />
            </div>
          </>
        )}
      </form>
    </Layout>
  );
};

export default FrmInwardRegRpt;