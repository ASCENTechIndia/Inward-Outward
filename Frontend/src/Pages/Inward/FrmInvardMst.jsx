import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import { useLoader } from "../../Context/LoaderContext";
import GetIPAddress from "../../utils/ipHelper.jsx";

const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
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

// "prabhag$dept$purpose$employee$designation#"
const buildEmployeeString = (rows) => {
  return (rows || [])
    .filter((row) => row.prabhag && String(row.prabhag).trim() !== "")
    .map((row) =>
      [
        row.prabhag,
        row.department,
        row.purpose,
        row.employeeName,
        row.designation,
      ].join("$"),
    )
    .join("#");
};

// "$$$docname#$$$docname2"
const buildDocNamesString = (docs) => {
  return (docs || [])
    .filter((d) => d.documentName && d.documentName.trim() !== "")
    .map((d) => "$$$" + d.documentName)
    .join("#");
};

// Helper: convert File → Base64 string
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const emptyCcRow = {
  prabhag: "",
  department: "",
  purpose: "",
  designation: "",
  employeeName: "",
};

const emptyAttachmentRow = {
  document: "",
  documentName: "",
  view: "",
  remove: "",
};

const emptyTableRow = {
  prabhag: "",
  department: "",
  purpose: "",
  designation: "",
  employeeName: "",
};

const toOptions = (res, valueKey, labelKey) => {
  if (res?.data?.success && Array.isArray(res.data.data)) {
    return res.data.data.map((item) => ({
      value: String(item[valueKey]),
      label: item[labelKey],
    }));
  }
  return [];
};

const FrmInvardMst = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [senderOptions, setSenderOptions] = useState([]);
  const [subTypeOptions, setSubTypeOptions] = useState([]);
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [documentSubTypeOptions, setDocumentSubTypeOptions] = useState([]);
  const [letterTypeOptions, setLetterTypeOptions] = useState([]);
  const [outwardTypeOptions, setOutwardTypeOptions] = useState([]);

  // Main table
  const [tableDepartmentOptions, setTableDepartmentOptions] = useState([]);
  const [tablePrabhagOptions, setTablePrabhagOptions] = useState([]);
  const [tableDesignationOptions, setTableDesignationOptions] = useState([]);
  const [tableSuggestionOptions, setTableSuggestionOptions] = useState([]);
  const [tableEmployeeOptions, setTableEmployeeOptions] = useState([]);

  // Main table's auto-selected purpose
  const [mainTablePurpose, setMainTablePurpose] = useState("");

  // CC popup
  const [ccPrabhagOptions, setCCPrabhagOptions] = useState([]);
  const [ccDepartmentOptions, setCCDepartmentOptions] = useState([]);
  const [ccSuggestionOptions, setCCSuggestionOptions] = useState([]);
  const [ccDesignationOptions, setCCDesignationOptions] = useState([]);
  const [ccEmployeeOptionsMap, setCCEmployeeOptionsMap] = useState({});

  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [ccModalOpen, setCcModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      invardNo: "",
      date: getToday(),
      sender: "",
      subtype: "",
      documentType: "",
      documentSubType: "",
      referenceNumber: "",
      referenceDate: "",
      applicantName: "",
      from: "",
      email: "",
      address: "",
      mobileNumber: "",
      subject: "",
      attachment: "",
      attachmentDocuments: [{ ...emptyAttachmentRow }],
      cc: [{ ...emptyCcRow }],
      tableRow: { ...emptyTableRow },
      letterType: "",
      outwardType: "",
    },
  });

  const watchSender = watch("sender");
  const watchTableDesignation = watch("tableRow.designation");
  const watchTableDepartment = watch("tableRow.department");

  const {
    fields: ccFields,
    append: appendCc,
    remove: removeCc,
  } = useFieldArray({ control, name: "cc" });

  const {
    fields: docFields,
    append: appendDoc,
    remove: removeDoc,
  } = useFieldArray({ control, name: "attachmentDocuments" });

  // INITIAL LOAD
  useEffect(() => {
    if (!ulbid) return;

    const fetchAllDropdowns = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          apiService.post("getSendersDropdown", { ulbid: Number(ulbid) }),
          apiService.get("getDocumentTypeDropdown"),
          apiService.get("getDocumentSubTypeDropdown"),
          apiService.get("getLetterTypeDropdown"),
          apiService.get("getOutTypeDropdown"),
          apiService.post("getPrabhagDropdown", { ulbid: Number(ulbid) }),
          apiService.post("getMarathiDepartmentDropdown", {
            ulbid: Number(ulbid),
          }),
          apiService.post("getCcDepartmentDropdown", { ulbid: Number(ulbid) }),
          apiService.get("getCcPurposeDropdown"),
          apiService.post("getCcDesignationDropdown", { ulbid: Number(ulbid) }),
        ]);

        const [
          senderRes,
          docTypeRes,
          docSubTypeRes,
          letterTypeRes,
          outwardTypeRes,
          prabhagRes,
          marathiDeptRes,
          ccDeptRes,
          purposeRes,
          desigRes,
        ] = results;

        if (senderRes.status === "fulfilled") {
          setSenderOptions(
            toOptions(senderRes.value, "NUM_SENDER_ID", "VAR_SENDER_NAME"),
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
        if (letterTypeRes.status === "fulfilled") {
          setLetterTypeOptions(
            toOptions(
              letterTypeRes.value,
              "NUM_LETTERTYPE_ID",
              "VAR_LETTERTYPE_TYPE",
            ),
          );
        }
        if (outwardTypeRes.status === "fulfilled") {
          setOutwardTypeOptions(
            toOptions(
              outwardTypeRes.value,
              "NUM_INWARDMODE_ID",
              "VAR_INWARDMODE_NAME",
            ),
          );
        }
        if (prabhagRes.status === "fulfilled") {
          const options = toOptions(prabhagRes.value, "WARDID", "WARDNAME");
          setTablePrabhagOptions(options);
          setCCPrabhagOptions(options);
        }
        if (marathiDeptRes.status === "fulfilled") {
          setTableDepartmentOptions(
            toOptions(marathiDeptRes.value, "DEPTID", "DEPT_MARNAME"),
          );
        }
        if (ccDeptRes.status === "fulfilled") {
          setCCDepartmentOptions(
            toOptions(ccDeptRes.value, "DEPTID", "ENGMARNAME"),
          );
        }
        if (purposeRes.status === "fulfilled") {
          const options = toOptions(
            purposeRes.value,
            "NUM_PURPOSE_ID",
            "VAR_PURPOSE_NAME",
          );
          setTableSuggestionOptions(options);
          setCCSuggestionOptions(options);
        }
        if (desigRes.status === "fulfilled") {
          const options = toOptions(desigRes.value, "DESIG_ID", "DESIG_ENAME");
          setTableDesignationOptions(options);
          setCCDesignationOptions(options);
        }
      } catch (err) {
        console.error("Dropdown fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDropdowns();
  }, [ulbid, setValue]);

  // Dependent Sub Types
  useEffect(() => {
    if (!watchSender || !ulbid) {
      setSubTypeOptions([]);
      setValue("subtype", "");
      return;
    }

    const fetchSubTypes = async () => {
      try {
        setLoading(true);
        const res = await apiService.post("getSubTypesDropdown", {
          ulbid: Number(ulbid),
          senderId: Number(watchSender),
        });
        setSubTypeOptions(
          toOptions(res, "NUM_SENDERSUBTYPE_ID", "VAR_SENDERSUBTYPE_NAME"),
        );
      } catch (err) {
        console.error("Sub type fetch error:", err);
        setSubTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubTypes();
  }, [watchSender, ulbid, setValue]);

  // MAIN TABLE Employees
  useEffect(() => {
    if (!watchTableDesignation || !watchTableDepartment || !ulbid) {
      setTableEmployeeOptions([]);
      return;
    }

    const fetchEmployees = async () => {
      try {
        const res = await apiService.post("getEmployeeNameDropdown", {
          ulbid: Number(ulbid),
          desigId: Number(watchTableDesignation),
          departmentId: Number(watchTableDepartment),
        });
        setTableEmployeeOptions(
          toOptions(res, "NUM_USER_USERID", "VAR_USER_USERNAME"),
        );
      } catch (err) {
        console.error("Table employee fetch error:", err);
        setTableEmployeeOptions([]);
      }
    };

    fetchEmployees();
  }, [watchTableDesignation, watchTableDepartment, ulbid]);

  // CC POPUP Employees per row
  const fetchCCEmployeesForRow = async (rowIndex, desigId, deptId) => {
    if (!desigId || !deptId || !ulbid) {
      setCCEmployeeOptionsMap((prev) => ({ ...prev, [rowIndex]: [] }));
      return;
    }

    try {
      const res = await apiService.post("getEmployeeNameDropdown", {
        ulbid: Number(ulbid),
        desigId: Number(desigId),
        departmentId: Number(deptId),
      });
      const options = toOptions(res, "NUM_USER_USERID", "VAR_USER_USERNAME");
      setCCEmployeeOptionsMap((prev) => ({ ...prev, [rowIndex]: options }));
    } catch (err) {
      console.error("CC employee fetch error:", err);
      setCCEmployeeOptionsMap((prev) => ({ ...prev, [rowIndex]: [] }));
    }
  };

  // Auto select first purpose for MAIN TABLE
  useEffect(() => {
    if (tableSuggestionOptions.length > 0 && !getValues("tableRow.purpose")) {
      const firstValue = tableSuggestionOptions[0].value;
      setValue("tableRow.purpose", firstValue, {
        shouldDirty: false,
        shouldValidate: false,
      });
      setMainTablePurpose(firstValue);
    }
  }, [tableSuggestionOptions, setValue, getValues]);

  // CC POPUP HANDLERS
  const handleAddCcRow = () => {
    appendCc({ ...emptyCcRow });
  };

  const handleRemoveCcRow = (index) => {
    removeCc(index);
    setCCEmployeeOptionsMap((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        const k = Number(key);
        if (k < index) next[k] = prev[k];
        else if (k > index) next[k - 1] = prev[k];
      });
      return next;
    });
  };

  // DOCUMENT MODAL HANDLERS
  const handleAddDocRow = () => {
    appendDoc({ ...emptyAttachmentRow });
  };

  const handleRemoveDocRow = (index) => {
    removeDoc(index);
  };

  const handleViewDocument = (index) => {
    const file = getValues(`attachmentDocuments.${index}.document`);
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  };

  // FORM VALIDATION
  const validateForm = (data) => {
    // 1. Main table — at least prabhag must be filled
    const mainPrabhag = data.tableRow?.prabhag;
    if (!mainPrabhag || String(mainPrabhag).trim() === "") {
      alert("कृपया मुख्य टेबलमध्ये प्रभाग निवडा");
      return false;
    }
    if (!data.tableRow.department) {
      alert("कृपया मुख्य टेबलमध्ये विभाग निवडा");
      return false;
    }
    if (!data.tableRow.purpose) {
      alert("कृपया मुख्य टेबलमध्ये उद्देश निवडा");
      return false;
    }
    if (!data.tableRow.designation) {
      alert("कृपया मुख्य टेबलमध्ये हुद्दा निवडा");
      return false;
    }
    if (!data.tableRow.employeeName) {
      alert("कृपया मुख्य टेबलमध्ये कर्मचारी नाव निवडा");
      return false;
    }

    // 2. CC rows — if prabhag filled, all other fields required
    const ccRows = data.cc || [];
    for (let i = 0; i < ccRows.length; i++) {
      const row = ccRows[i];
      if (row.prabhag && String(row.prabhag).trim() !== "") {
        if (!row.department) {
          alert(`CC पंक्ती ${i + 1}: कृपया विभाग निवडा`);
          setCcModalOpen(true);
          return false;
        }
        if (!row.purpose) {
          alert(`CC पंक्ती ${i + 1}: कृपया उद्देश निवडा`);
          setCcModalOpen(true);
          return false;
        }
        if (!row.designation) {
          alert(`CC पंक्ती ${i + 1}: कृपया पदनाम निवडा`);
          setCcModalOpen(true);
          return false;
        }
        if (!row.employeeName) {
          alert(`CC पंक्ती ${i + 1}: कृपया कर्मचारी नाव निवडा`);
          setCcModalOpen(true);
          return false;
        }
      }
    }

    // 3. Document rows — if a file is set, documentName must exist
    const docs = data.attachmentDocuments || [];
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      if (doc.document && !doc.documentName) {
        alert(`दस्तऐवज पंक्ती ${i + 1}: कृपया दस्तऐवज पुन्हा निवडा`);
        setDocumentsModalOpen(true);
        return false;
      }
    }

    // 4. Mobile — if entered, must be 10 digits
    if (data.mobileNumber && data.mobileNumber.length !== 10) {
      alert("कृपया योग्य 10 अंकी मोबाईल नंबर टाका");
      return false;
    }

    // 5. Email — basic validation
    if (data.email && data.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        alert("कृपया योग्य ईमेल पत्ता टाका");
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("UserId or UlbId is not set");
      return;
    }

    // custom validations
    if (!validateForm(data)) return;

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      // Build the  strings from table rows
      const mainTableRow = data.tableRow?.prabhag
        ? [
            {
              ...data.tableRow,
              purpose: data.tableRow.purpose || mainTablePurpose,
            },
          ]
        : [];
      const IN_strinwardto = buildEmployeeString(mainTableRow);
      const IN_strinwordcc = buildEmployeeString(data.cc);
      const IN_strinwardimg = buildDocNamesString(data.attachmentDocuments);

      const payload = {
        IN_USERID: userId,
        in_OrgId: Number(ulbid),
        in_ipaddress: ip,
        in_inwarddate: formatOracleDate(data.date),
        IN_senderid: Number(data.sender),
        IN_sendersubtypeid: Number(data.subtype),
        IN_doctype: Number(data.documentType),
        IN_docsubtype: Number(data.documentSubType),
        IN_refno: data.referenceNumber?.trim() || "",
        IN_refdate: formatOracleDate(data.referenceDate),
        IN_from: data.from?.trim() || "",
        IN_address: data.address?.trim() || "",
        IN_mobile: data.mobileNumber ? Number(data.mobileNumber) : null,
        IN_subject: data.subject?.trim(),
        IN_attachment: data.attachment?.trim() || "",
        IN_lettertype: data.letterType || "",
        IN_inwmodeid: Number(data.outwardType),
        in_email: data.email?.trim() || "",
        in_AppliName: data.applicantName?.trim(),
        IN_strinwardto,
        IN_strinwardimg,
        IN_strinwordcc,
        in_sourceid: 0,
        in_Priority: null,
      };

      const res = await apiService.post("aoio_inward_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        const { inwardId, inwardNo } = res.data;

        const validDocs = (data.attachmentDocuments || []).filter(
          (d) => d.document && d.documentName,
        );

        if (validDocs.length > 0) {
          try {
            // Convert files to Base64
            const documents = await Promise.all(
              validDocs.map(async (d) => ({
                documentName: d.documentName,
                fileBytes: await fileToBase64(d.document),
              })),
            );

            const docPayload = {
              inwardId: Number(inwardId),
              inwardNo,
              ulbid: Number(ulbid),
              userId,
              date: formatOracleDate(data.date),
              documents,
            };

            const docRes = await apiService.post(
              "insertInwardDocuments",
              docPayload,
            );

            if (docRes?.data?.success) {
              alert(
                `${res.data.errorMessage}\n\nInward No: ${inwardNo}\nDocuments uploaded: ${validDocs.length}`,
              );
            } else {
              alert(
                `Inward saved (No: ${inwardNo}) but documents failed:\n${
                  docRes?.data?.message || "Unknown error"
                }`,
              );
            }
          } catch (docErr) {
            console.error("Document upload error:", docErr);
            alert(
              `Inward saved (No: ${inwardNo}) but document upload failed:\n${docErr.message}`,
            );
          }
        } else {
          alert(`${res.data.errorMessage}\n\nInward No: ${inwardNo}`);
        }

        // Reset form
        reset({
          invardNo: "",
          date: getToday(),
          sender: "",
          subtype: "",
          documentType: "",
          documentSubType: "",
          referenceNumber: "",
          referenceDate: "",
          applicantName: "",
          from: "",
          email: "",
          address: "",
          mobileNumber: "",
          subject: "",
          attachment: "",
          attachmentDocuments: [{ ...emptyAttachmentRow }],
          cc: [{ ...emptyCcRow }],
          tableRow: { ...emptyTableRow },
          letterType: "",
          outwardType: "",
        });
        setSubTypeOptions([]);
        setTableEmployeeOptions([]);
        setCCEmployeeOptionsMap({});
        setMainTablePurpose("");
        setCcModalOpen(false);
        setDocumentsModalOpen(false);
      } else {
        alert(res?.data?.errorMessage || "Failed to save inward");
      }
    } catch (error) {
      console.error("Error saving inward:", error);
      alert(error.message || "Failed to save inward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Invard Entry"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Invard Entry",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="आवक क्र.: " />
            <input
              type="text"
              placeholder="Enter inward number"
              className="form-input-box"
              {...register("invardNo")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="दिनांक : " />
            <input
              type="date"
              className={`form-input-box ${errors.date ? "border-red-500" : ""}`}
              {...register("date", { required: "दिनांक आवश्यक आहे" })}
              disabled={true}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>
          <div>
            <Label text="पाठवणारा : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      ${errors.sender ? "border-red-500" : ""}`}
              {...register("sender", { required: "पाठवणारा आवश्यक आहे" })}
            >
              <option value="">-- Select --</option>
              {senderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.sender && (
              <p className="text-sm text-red-500 mt-1">
                {errors.sender.message}
              </p>
            )}
          </div>
          <div>
            <Label text="उपप्रकार : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      ${
                        !watchSender
                          ? "bg-slate-100 text-slate-500 cursor-not-allowed pointer-events-none"
                          : ""
                      }
                      ${errors.subtype ? "border-red-500" : ""}`}
              {...register("subtype", { required: "उपप्रकार आवश्यक आहे" })}
              disabled={!watchSender}
            >
              <option value="">
                {watchSender ? "-- Select --" : "-- Select Sender first --"}
              </option>
              {subTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.subtype && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subtype.message}
              </p>
            )}
          </div>
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
          <div>
            <Label text="संदर्भ क्रमांक : " />
            <input
              type="text"
              placeholder="Enter reference number"
              className="form-input-box"
              {...register("referenceNumber")}
            />
          </div>
          <div>
            <Label text="संदर्भ दिनांक : " />
            <input
              type="date"
              className={`form-input-box ${
                errors.referenceDate ? "border-red-500" : ""
              }`}
              {...register("referenceDate")}
            />
            {errors.referenceDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.referenceDate.message}
              </p>
            )}
          </div>
          <div>
            <Label text="अर्जदाराचे नाव : " required />
            <input
              type="text"
              placeholder="Enter applicant name"
              className={`form-input-box ${
                errors.applicantName ? "border-red-500" : ""
              }`}
              {...register("applicantName", {
                required: "अर्जदाराचे नाव आवश्यक आहे",
              })}
            />
            {errors.applicantName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.applicantName.message}
              </p>
            )}
          </div>
          <div>
            <Label text="पासून : " />
            <input
              type="text"
              placeholder="Enter from"
              className="form-input-box"
              {...register("from")}
            />
          </div>
          <div>
            <Label text="इमेल : " />
            <input
              type="email"
              placeholder="Enter email"
              className="form-input-box"
              {...register("email")}
            />
          </div>
          <div>
            <Label text="पत्ता : " />
            <input
              type="text"
              placeholder="Enter address"
              className="form-input-box"
              {...register("address")}
            />
          </div>
          <div>
            <Label text="मोबाईल क्र : " />
            <input
              type="text"
              placeholder="Enter mobile number"
              className="form-input-box"
              {...register("mobileNumber")}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              maxLength={10}
            />
          </div>
          <div>
            <Label text="विषय" required />
            <textarea
              rows={2}
              placeholder="Enter subject"
              className={`form-input-box ${errors.subject ? "border-red-500" : ""}`}
              {...register("subject", { required: "विषय आवश्यक आहे" })}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <Label text="संलग्नक : " />
            <input
              type="text"
              placeholder="Enter attachments"
              className="form-input-box"
              {...register("attachment")}
            />
          </div>
          <div className="flex">
            <div className="flex items-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setDocumentsModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                border border-slate-300 bg-white text-slate-700 text-sm
                hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                <span>संलग्नक दस्तऐव</span>
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

              <button
                type="button"
                onClick={() => setCcModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                border border-slate-300 bg-white text-slate-700 text-sm
                hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                <span>CC </span>
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
            </div>
          </div>
          <div>
            <Label text="पत्राचे प्रकार : " />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      ${errors.letterType ? "border-red-500" : ""}`}
              {...register("letterType")}
            >
              <option value="">-- Select --</option>
              {letterTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="जावकाचे प्रकार : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      ${errors.outwardType ? "border-red-500" : ""}`}
              {...register("outwardType", {
                required: "जावकाचे प्रकार आवश्यक आहे",
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
        </div>

        {/* MAIN TABLE */}
        <div className="mt-3">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] table-fixed border-collapse">
                <thead className="bg-slate-100/95">
                  <tr className="border-b border-slate-200">
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
                      हुद्दा
                    </th>
                    <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                      कर्मचारी नाव
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 py-2">
                      <select
                        className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        {...register(`tableRow.prabhag`)}
                      >
                        <option value="">-- Select --</option>
                        {tablePrabhagOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        {...register(`tableRow.department`)}
                      >
                        <option value="">-- Select --</option>
                        {tableDepartmentOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-2">
                      <select
                        disabled
                        className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                        bg-slate-100 text-slate-500 cursor-not-allowed pointer-events-none"
                        {...register(`tableRow.purpose`)}
                      >
                        <option value="">-- Select --</option>
                        {tableSuggestionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-2">
                      <select
                        className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        {...register(`tableRow.designation`)}
                      >
                        <option value="">-- Select --</option>
                        {tableDesignationOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-2">
                      <select
                        disabled={
                          !watchTableDesignation || !watchTableDepartment
                        }
                        className={`form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                        ${
                                          !watchTableDesignation ||
                                          !watchTableDepartment
                                            ? "bg-slate-100 text-slate-500 cursor-not-allowed pointer-events-none"
                                            : ""
                                        }`}
                        {...register(`tableRow.employeeName`)}
                      >
                        <option value="">
                          {watchTableDesignation && watchTableDepartment
                            ? "-- Select --"
                            : "-- Select Designation & Department first --"}
                        </option>
                        {tableEmployeeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200">
          <Button type="submit" disabled={isSubmitting}>
            साठवा
          </Button>
          <Button type="button" variant="secondary">
            बदल
          </Button>
        </div>

        {/* CC MODAL  */}
        {ccModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setCcModalOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
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

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
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

                              <td className="px-3 py-2">
                                <select
                                  className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                  {...register(`cc.${index}.prabhag`)}
                                >
                                  <option value="">-- Select --</option>
                                  {ccPrabhagOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="px-3 py-2">
                                <select
                                  className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                  {...register(`cc.${index}.department`, {
                                    onChange: (e) => {
                                      const deptId = e.target.value;
                                      const desigId = getValues(
                                        `cc.${index}.designation`,
                                      );
                                      fetchCCEmployeesForRow(
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

                              <td className="px-3 py-2">
                                <select
                                  className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                  {...register(`cc.${index}.purpose`)}
                                >
                                  <option value="">-- Select --</option>
                                  {ccSuggestionOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="px-3 py-2">
                                <select
                                  className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                  {...register(`cc.${index}.designation`, {
                                    onChange: (e) => {
                                      const desigId = e.target.value;
                                      const deptId = getValues(
                                        `cc.${index}.department`,
                                      );
                                      setValue(`cc.${index}.employeeName`, "");
                                      fetchCCEmployeesForRow(
                                        index,
                                        desigId,
                                        deptId,
                                      );
                                    },
                                  })}
                                >
                                  <option value="">-- Select --</option>
                                  {ccDesignationOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              <td className="px-3 py-2">
                                <select
                                  disabled={
                                    !getValues(`cc.${index}.designation`) ||
                                    !getValues(`cc.${index}.department`)
                                  }
                                  className={`form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                                    ${
                                                      !getValues(
                                                        `cc.${index}.designation`,
                                                      ) ||
                                                      !getValues(
                                                        `cc.${index}.department`,
                                                      )
                                                        ? "bg-slate-100 text-slate-500 cursor-not-allowed pointer-events-none"
                                                        : ""
                                                    }`}
                                  {...register(`cc.${index}.employeeName`)}
                                >
                                  <option value="">
                                    {getValues(`cc.${index}.designation`) &&
                                    getValues(`cc.${index}.department`)
                                      ? "-- Select --"
                                      : "-- Select Designation & Department first --"}
                                  </option>
                                  {(ccEmployeeOptionsMap[index] || []).map(
                                    (opt) => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </td>

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

        {/* DOCUMENTS MODAL */}
        {documentsModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDocumentsModalOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-800">
                  Attachment Documents
                </h3>
                <button
                  type="button"
                  onClick={() => setDocumentsModalOpen(false)}
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

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddDocRow}
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

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-slate-100/95">
                        <tr className="border-b border-slate-200">
                          <th className="w-[35%] px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                            दस्तऐवज
                          </th>
                          <th className="w-[35%] px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                            दस्तऐवजाचे नाव
                          </th>
                          <th className="w-[15%] px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                            पहा
                          </th>
                          <th className="w-[15%] px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                            काढा
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {docFields.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-8 text-slate-400 text-sm"
                            >
                              No Attachment Document Rows. Click "Add Row" to
                              add one.
                            </td>
                          </tr>
                        ) : (
                          docFields.map((field, index) => (
                            <tr
                              key={field.id}
                              className="hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-3 py-2 align-top">
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setValue(
                                        `attachmentDocuments.${index}.document`,
                                        file,
                                        {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                        },
                                      );
                                      setValue(
                                        `attachmentDocuments.${index}.documentName`,
                                        file.name,
                                        {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                        },
                                      );
                                    }
                                  }}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300
                                        bg-white text-slate-700 text-sm
                                        file:mr-4 file:py-1.5 file:px-3 file:rounded-md
                                        file:border-0 file:bg-slate-100 file:text-slate-700
                                        file:font-medium file:text-sm
                                        hover:file:bg-slate-200
                                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {watch(
                                  `attachmentDocuments.${index}.documentName`,
                                ) && (
                                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                    <span className="font-medium">
                                      Selected:
                                    </span>
                                    <span className="truncate">
                                      {watch(
                                        `attachmentDocuments.${index}.documentName`,
                                      )}
                                    </span>
                                  </div>
                                )}
                              </td>

                              <td className="px-3 py-2 align-top">
                                <input
                                  type="text"
                                  placeholder="Enter document name"
                                  className="form-input-box"
                                  {...register(
                                    `attachmentDocuments.${index}.documentName`,
                                  )}
                                  disabled={true}
                                />
                              </td>

                              <td className="px-3 py-2 align-top">
                                <div className="flex justify-center items-center">
                                  <button
                                    type="button"
                                    onClick={() => handleViewDocument(index)}
                                    className="p-1.5 rounded-md text-blue-600 border border-blue-300
                                     hover:bg-blue-50 active:scale-[0.95] transition-all"
                                  >
                                    View
                                  </button>
                                </div>
                              </td>

                              <td className="px-3 py-2 text-center align-top">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocRow(index)}
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

              <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setDocumentsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setDocumentsModalOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </Layout>
  );
};

export default FrmInvardMst;
