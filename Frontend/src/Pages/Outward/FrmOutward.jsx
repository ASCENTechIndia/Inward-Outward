import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import { useLoader } from "../../Context/LoaderContext";
import GetIPAddress from "../../utils/ipHelper";

// Get today's date in YYYY-MM-DD format
const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// Empty CC row template
const emptyCcRow = {
  prabhag: "",
  ccDepartment: "",
  purpose: "",
  designation: "",
  employeeName: "",
};

const FrmOutward = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ulbid = user?.ulbId;
  const userId = user?.userId;
  const { setLoading } = useLoader();

  const [ccModalOpen, setCcModalOpen] = useState(false);

  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [receiverSubCategoryOptions, setReceiverSubCategoryOptions] = useState(
    [],
  );
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [documentSubTypeOptions, setDocumentSubTypeOptions] = useState([]);
  const [outwardTypeOptions, setOutwardTypeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [prabhagOptions, setPrabhagOptions] = useState([]);
  const [ccDepartmentOptions, setCcDepartmentOptions] = useState([]);
  const [purposeOptions, setPurposeOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [employeeOptionsMap, setEmployeeOptionsMap] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      deptOutwardNo: "",
      date: getToday(),
      mainReceiverCategory: "",
      receiverSubCategory: "",
      documentType: "",
      documentSubType: "",
      relatedInwardNo: "",
      referenceDate: "",
      receiverName: "",
      address: "",
      subject: "",
      outwardType: "",
      department: "",
      remarks: "",
      cc: [{ ...emptyCcRow }],
    },
  });

  const watchMainCategory = watch("mainReceiverCategory");

  const {
    fields: ccFields,
    append: appendCc,
    remove: removeCc,
  } = useFieldArray({
    control,
    name: "cc",
  });

  const toOptions = (res, valueKey, labelKey) => {
    if (res?.data?.success && Array.isArray(res.data.data)) {
      return res.data.data.map((item) => ({
        value: String(item[valueKey]),
        label: item[labelKey],
      }));
    }
    return [];
  };

  useEffect(() => {
    if (!ulbid) return;

    const fetchAllDropdowns = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          apiService.post("getMainReceiverCategoryDropdown", {
            ulbId: Number(ulbid),
          }),
          apiService.get("getDocumentTypeDropdown"),
          apiService.get("getDocumentSubTypeDropdown"),
          apiService.get("getOutwardTypeDropdown"),
          apiService.post("getDepartmentDropdown", { ulbid: Number(ulbid) }),
          apiService.post("getPrabhagDropdown", { ulbid: Number(ulbid) }),
          apiService.post("getCcDepartmentDropdown", { ulbid: Number(ulbid) }),
          apiService.get("getCcPurposeDropdown"),
          apiService.post("getCcDesignationDropdown", { ulbid: Number(ulbid) }),
        ]);

        const [
          mainCatRes,
          docTypeRes,
          docSubTypeRes,
          outwardTypeRes,
          deptRes,
          prabhagRes,
          ccDeptRes,
          purposeRes,
          desigRes,
        ] = results;

        // Parse each — ignore failures silently (leave empty)
        if (mainCatRes.status === "fulfilled") {
          setMainCategoryOptions(
            toOptions(mainCatRes.value, "NUM_SENDER_ID", "VAR_SENDER_NAME"),
          );
        }
        if (docTypeRes.status === "fulfilled") {
          setDocumentTypeOptions(
            toOptions(docTypeRes.value, "NUM_DOCTYPE_ID", "VAR_DOCTYPE_NAME"),
          );
        }
        if (docSubTypeRes.status === "fulfilled") {
          setDocumentSubTypeOptions(
            toOptions(
              docSubTypeRes.value,
              "NUM_DOCSUBTYPE_ID",
              "VAR_DOCSUBTYPE_NAME",
            ),
          );
        }
        if (outwardTypeRes.status === "fulfilled") {
          setOutwardTypeOptions(
            toOptions(
              outwardTypeRes.value,
              "NUM_OUTWARDMODE_ID",
              "VAR_OUTWARDMODE_NAME",
            ),
          );
        }
        if (deptRes.status === "fulfilled") {
          setDepartmentOptions(
            toOptions(deptRes.value, "DEPTID", "DEPT_MARNAME"),
          );
        }
        if (prabhagRes.status === "fulfilled") {
          setPrabhagOptions(toOptions(prabhagRes.value, "WARDID", "WARDNAME"));
        }
        if (ccDeptRes.status === "fulfilled") {
          setCcDepartmentOptions(
            toOptions(ccDeptRes.value, "DEPTID", "ENGMARNAME"),
          );
        }
        if (purposeRes.status === "fulfilled") {
          setPurposeOptions(
            toOptions(purposeRes.value, "NUM_PURPOSE_ID", "VAR_PURPOSE_NAME"),
          );
        }
        if (desigRes.status === "fulfilled") {
          setDesignationOptions(
            toOptions(desigRes.value, "DESIG_ID", "DESIG_ENAME"),
          );
        }
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDropdowns();
  }, [ulbid]);

  useEffect(() => {
    if (!watchMainCategory || !ulbid) {
      setReceiverSubCategoryOptions([]);
      return;
    }

    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const res = await apiService.post("receiverSubCategoryDropdown", {
          ulbId: Number(ulbid),
          senderId: Number(watchMainCategory),
        });

        setReceiverSubCategoryOptions(
          toOptions(res, "NUM_SENDERSUBTYPE_ID", "VAR_SENDERSUBTYPE_NAME"),
        );
      } catch (err) {
        console.error("Sub category fetch error:", err);
        setReceiverSubCategoryOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [watchMainCategory, ulbid]);

  const fetchEmployeesForRow = async (rowIndex, desigId, deptId) => {
    if (!desigId || !deptId || !ulbid) {
      setEmployeeOptionsMap((prev) => ({ ...prev, [rowIndex]: [] }));
      return;
    }

    try {
      const res = await apiService.post("getEmployeeNameDropdown", {
        ulbid: Number(ulbid),
        desigId: Number(desigId),
        departmentId: Number(deptId),
      });

      const options = toOptions(res, "NUM_USER_USERID", "VAR_USER_USERNAME");
      setEmployeeOptionsMap((prev) => ({ ...prev, [rowIndex]: options }));
    } catch (err) {
      console.error("Employee fetch error:", err);
      setEmployeeOptionsMap((prev) => ({ ...prev, [rowIndex]: [] }));
    }
  };

  const handleAddCcRow = () => {
    appendCc({ ...emptyCcRow });
  };

  const handleRemoveCcRow = (index) => {
    removeCc(index);
    // Clean up employee options for this row
    setEmployeeOptionsMap((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        const k = Number(key);
        if (k < index) next[k] = prev[k];
        else if (k > index) next[k - 1] = prev[k];
        // k === index → dropped
      });
      return next;
    });
  };

  // Helper: convert "YYYY-MM-DD" → "DD-Mon-YYYY"
  const formatOracleDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Build CC string
      const in_stroutwordcc = (data.cc || [])
        .filter((row) => row.prabhag && row.prabhag.trim() !== "")
        .map((row) =>
          [
            row.prabhag,
            row.ccDepartment,
            row.purpose,
            row.employeeName,
            row.designation,
          ].join("$"),
        )
        .join("#");

      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_date: formatOracleDate(data.date),
        in_receivercatid: Number(data.mainReceiverCategory),
        in_receiversubcatid: Number(data.receiverSubCategory),
        in_doctype: Number(data.documentType),
        in_docsubtype: Number(data.documentSubType),
        in_inwrefno: data.relatedInwardNo?.trim() || "",
        in_refdate: formatOracleDate(data.referenceDate),
        in_receivername: data.receiverName?.trim(),
        in_address: data.address?.trim() || null,
        in_subject: data.subject?.trim(),
        in_outmodeid: Number(data.outwardType),
        in_remark: data.remarks?.trim() || null,
        in_ipaddress: ip,
        in_OutwardNo: data.deptOutwardNo?.trim(),
        in_Mode: 1,
        in_Deptid: Number(data.department),
        in_orgId: Number(ulbid),
        IN_stroutwordcc: in_stroutwordcc,
        in_mobile: null,
        in_email: null,
        in_sendingtype: null,
        in_typeflag: "Outward",
      };

      const res = await apiService.post("aoio_outward_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === -100) {
        alert(
          `${res.data.errorMessage}\n\n` +
            `Outward ID: ${res.data.outwardId}\n` +
            `Outward No: ${res.data.outwardNo}`,
        );

        // Reset the entire form back to defaults
        reset({
          deptOutwardNo: "",
          date: getToday(),
          mainReceiverCategory: "",
          receiverSubCategory: "",
          documentType: "",
          documentSubType: "",
          relatedInwardNo: "",
          referenceDate: "",
          receiverName: "",
          address: "",
          subject: "",
          outwardType: "",
          department: "",
          remarks: "",
          cc: [{ ...emptyCcRow }],
        });

        // Clear dependent dropdown states
        setReceiverSubCategoryOptions([]);
        setEmployeeOptionsMap({});
      } else {
        alert(res?.data?.errorMessage || "Failed to save outward entry");
      }
    } catch (error) {
      console.error("Error saving outward:", error);
      alert(error.message || "Failed to save outward entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Outward Entry"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Outward Entry",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. विभाग जावक क्र */}
          <div>
            <Label text="विभाग जावक क्र : " required />
            <input
              type="text"
              placeholder="Enter outward no."
              className={`form-input-box ${
                errors.deptOutwardNo ? "border-red-500" : ""
              }`}
              {...register("deptOutwardNo", {
                required: "विभाग जावक क्र आवश्यक आहे",
              })}
            />
            {errors.deptOutwardNo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.deptOutwardNo.message}
              </p>
            )}
          </div>

          {/* 2. दिनांक */}
          <div>
            <Label text="दिनांक : " required />
            <input
              type="date"
              className={`form-input-box ${
                errors.date ? "border-red-500" : ""
              }`}
              {...register("date", { required: "दिनांक आवश्यक आहे" })}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* 3. मुख्य प्राप्तकर्ताचे श्रेणी */}
          <div>
            <Label text="मुख्य प्राप्तकर्ताचे श्रेणी : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.mainReceiverCategory ? "border-red-500" : ""}`}
              {...register("mainReceiverCategory", {
                required: "मुख्य प्राप्तकर्ताचे श्रेणी आवश्यक आहे",
                onChange: () => setValue("receiverSubCategory", ""),
              })}
            >
              <option value="">-- Select --</option>
              {mainCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.mainReceiverCategory && (
              <p className="text-sm text-red-500 mt-1">
                {errors.mainReceiverCategory.message}
              </p>
            )}
          </div>

          {/* 4. प्राप्तकर्ताचे उपश्रेणी */}
          <div>
            <Label text="प्राप्तकर्ताचे उपश्रेणी : " required />
            <select
              disabled={!watchMainCategory}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchMainCategory ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.receiverSubCategory ? "border-red-500" : ""}`}
              {...register("receiverSubCategory", {
                required: "प्राप्तकर्ताचे उपश्रेणी आवश्यक आहे",
              })}
            >
              <option value="">
                {watchMainCategory
                  ? "-- Select --"
                  : "-- Select Main Category first --"}
              </option>
              {receiverSubCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.receiverSubCategory && (
              <p className="text-sm text-red-500 mt-1">
                {errors.receiverSubCategory.message}
              </p>
            )}
          </div>

          {/* 5. दस्तऐवजचे प्रकार */}
          <div>
            <Label text="दस्तऐवजचे प्रकार : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.documentType ? "border-red-500" : ""}`}
              {...register("documentType", {
                required: "दस्तऐवजचे प्रकार आवश्यक आहे",
              })}
            >
              <option value="">-- Select --</option>
              {documentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.documentType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.documentType.message}
              </p>
            )}
          </div>

          {/* 6. दस्तऐवजचे उपप्रकार */}
          <div>
            <Label text="दस्तऐवजचे उपप्रकार : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.documentSubType ? "border-red-500" : ""}`}
              {...register("documentSubType", {
                required: "दस्तऐवजचे उपप्रकार आवश्यक आहे",
              })}
            >
              <option value="">-- Select --</option>
              {documentSubTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.documentSubType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.documentSubType.message}
              </p>
            )}
          </div>

          {/* 7. संबंधित आवक क्रमांक */}
          <div>
            <Label text="संबंधित आवक क्रमांक : " required />
            <input
              type="text"
              placeholder="Enter related inward no."
              className={`form-input-box ${
                errors.relatedInwardNo ? "border-red-500" : ""
              }`}
              {...register("relatedInwardNo", {
                required: "संबंधित आवक क्रमांक आवश्यक आहे",
                validate: (v) =>
                  v.trim().length > 0 ||
                  "संबंधित आवक क्रमांक रिकामे असू शकत नाही",
              })}
            />
            {errors.relatedInwardNo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.relatedInwardNo.message}
              </p>
            )}
          </div>

          {/* 8. संदर्भ दिनांक */}
          <div>
            <Label text="संदर्भ दिनांक : " />
            <input
              type="date"
              className="form-input-box"
              {...register("referenceDate")}
            />
          </div>

          {/* 9. प्राप्तकर्ताचे नाव */}
          <div>
            <Label text="प्राप्तकर्ताचे नाव : " required />
            <textarea
              rows={2}
              placeholder="Enter receiver name"
              className={`form-input-box resize-none ${
                errors.receiverName ? "border-red-500" : ""
              }`}
              {...register("receiverName", {
                required: "प्राप्तकर्ताचे नाव आवश्यक आहे",
                validate: (v) =>
                  v.trim().length > 0 ||
                  "प्राप्तकर्ताचे नाव रिकामे असू शकत नाही",
              })}
            />
            {errors.receiverName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.receiverName.message}
              </p>
            )}
          </div>

          {/* 10. पत्ता */}
          <div>
            <Label text="पत्ता : " />
            <textarea
              rows={2}
              placeholder="Enter address"
              className="form-input-box resize-none"
              {...register("address")}
            />
          </div>
          <div>
            <Label text="विषय : " required />
            <textarea
              rows={2}
              placeholder="Enter subject"
              className={`form-input-box resize-none ${
                errors.subject ? "border-red-500" : ""
              }`}
              {...register("subject", {
                required: "विषय आवश्यक आहे",
              })}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* 11. जावक प्रकार */}
          <div>
            <Label text="जावक प्रकार : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.outwardType ? "border-red-500" : ""}`}
              {...register("outwardType", {
                required: "जावक प्रकार आवश्यक आहे",
              })}
            >
              <option value="">-- Select --</option>
              {outwardTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.outwardType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.outwardType.message}
              </p>
            )}
          </div>

          {/* 12. विभाग */}
          <div>
            <Label text="विभाग : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.department ? "border-red-500" : ""}`}
              {...register("department", {
                required: "विभाग आवश्यक आहे",
              })}
            >
              <option value="">-- Select --</option>
              {departmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-sm text-red-500 mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

          {/* 13. शेरा — spans 2 columns */}
          <div className="md:col-span-2">
            <Label text="शेरा : " />
            <textarea
              rows={3}
              placeholder="Enter remarks"
              className="form-input-box resize-none"
              {...register("remarks")}
            />
          </div>

          {/* 14. CC — opens popup */}
          <div>
            <Label text="CC : " />
            <button
              type="button"
              onClick={() => setCcModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                border border-slate-300 bg-white text-slate-700 text-sm
                hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <span>Select CC Recipients</span>
              <svg
                className="w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" strokeLinecap="round" />
              </svg>
            </button>
            {ccFields?.filter((f) => Object.values(f).some((v) => v)).length >
              0 && (
              <p className="text-xs text-slate-500 mt-1">
                {
                  ccFields.filter((f) =>
                    [
                      "prabhag",
                      "ccDepartment",
                      "purpose",
                      "designation",
                      "employeeName",
                    ].some((k) => f[k]),
                  ).length
                }{" "}
                CC row(s) filled
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <Button type="button" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </div>
      </form>

      {ccModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setCcModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-800">
                CC Recipients
              </h3>
              <button
                type="button"
                onClick={() => setCcModalOpen(false)}
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

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Add Row button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCcRow}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    text-sm font-medium bg-blue-600 text-white
                    hover:bg-blue-700 active:scale-[0.98] shadow-sm transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" />
                  </svg>
                  Add Row
                </button>
              </div>

              {/* CC Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] table-fixed border-collapse">
                    <thead className="bg-slate-100/95">
                      <tr className="border-b border-slate-200">
                        <th className="w-12 px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          #
                        </th>
                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          प्रभाग
                        </th>
                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          विभाग
                        </th>
                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          उद्देश
                        </th>
                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          पदनाम
                        </th>
                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          कर्मचारी नाव
                        </th>
                        <th className="w-16 px-3 py-3 text-center text-[12px] font-bold uppercase tracking-wider text-slate-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {ccFields.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-8 text-slate-400 text-sm"
                          >
                            No CC rows. Click "Add Row" to add one.
                          </td>
                        </tr>
                      ) : (
                        ccFields.map((field, index) => (
                          <tr
                            key={field.id}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-3 py-2 text-center text-sm text-slate-500">
                              {index + 1}
                            </td>

                            {/* प्रभाग */}
                            <td className="px-3 py-2">
                              <select
                                className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                {...register(`cc.${index}.prabhag`)}
                              >
                                <option value="">-- Select --</option>
                                {prabhagOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* विभाग */}
                            <td className="px-3 py-2">
                              <select
                                className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                {...register(`cc.${index}.ccDepartment`, {
                                  onChange: (e) => {
                                    const deptId = e.target.value;
                                    const desigId = getValues(
                                      `cc.${index}.designation`,
                                    );
                                    fetchEmployeesForRow(
                                      index,
                                      desigId,
                                      deptId,
                                    );
                                  },
                                })}
                              >
                                <option value="">-- Select --</option>
                                {ccDepartmentOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* उद्देश */}
                            <td className="px-3 py-2">
                              <select
                                className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                {...register(`cc.${index}.purpose`)}
                              >
                                <option value="">-- Select --</option>
                                {purposeOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* पदनाम */}
                            <td className="px-3 py-2">
                              <select
                                className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                  focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                {...register(`cc.${index}.designation`, {
                                  onChange: (e) => {
                                    const desigId = e.target.value;
                                    const deptId = getValues(
                                      `cc.${index}.ccDepartment`,
                                    );
                                    // reset employee when designation changes
                                    setValue(`cc.${index}.employeeName`, "");
                                    fetchEmployeesForRow(
                                      index,
                                      desigId,
                                      deptId,
                                    );
                                  },
                                })}
                              >
                                <option value="">-- Select --</option>
                                {designationOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* कर्मचारी नाव */}
                            <td className="px-3 py-2">
                              <select
                                disabled={
                                  !getValues(`cc.${index}.designation`) ||
                                  !getValues(`cc.${index}.ccDepartment`)
                                }
                                className={`form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                  focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                  ${
                                    !getValues(`cc.${index}.designation`) ||
                                    !getValues(`cc.${index}.ccDepartment`)
                                      ? "bg-slate-100 cursor-not-allowed"
                                      : ""
                                  }`}
                                {...register(`cc.${index}.employeeName`)}
                              >
                                <option value="">
                                  {getValues(`cc.${index}.designation`) &&
                                  getValues(`cc.${index}.ccDepartment`)
                                    ? "-- Select --"
                                    : "-- Select Designation & Department first --"}
                                </option>
                                {(employeeOptionsMap[index] || []).map(
                                  (opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ),
                                )}
                              </select>
                            </td>

                            {/* Remove */}
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveCcRow(index)}
                                className="p-1.5 rounded-md text-red-600 border border-red-300
                                  hover:bg-red-50 active:scale-[0.95] transition-all"
                                title="Remove row"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCcModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => setCcModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FrmOutward;
