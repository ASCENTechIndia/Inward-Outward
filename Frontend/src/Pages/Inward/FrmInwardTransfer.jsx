import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import { useSearchParams } from "react-router-dom";
import Table from "../../Components/Table";
import { FastField } from "formik";
import GetIPAddress from "../../utils/ipHelper";

const emptyTableRow = {
    prabhag: "",
    department: "",
    purpose: "",
    designation: "",
    employeeName: "",
    remark: "",
};

const FrmInwardTransfer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { setLoading } = useLoader();
    const { user } = useAuth();
    const userId = user?.userId;
    const ulbid = user?.ulbId;
    const collectionCenterId = user?.collcenterid;
    const deptId = user?.deptId;
    const designationId = user?.desigId;

    // console.log(user);

    const [actionOptions, setActionOptions] = useState([
        { label: "Forward", value: "F" },
        { label: "Reply", value: "R" }
    ]);

    const [applicantInwardId, setApplicantInwardId] = useState("");
    const [applicationSubTypeId, setApplicationSubTypeId] = useState("");
    const [applicationDocSubId, setApplicationDocSubId] = useState("");
    const [applicationTransId, setApplicationTransId] = useState("");
    // const [selectedAction, setSelectedAction] = useState("");
    const [selectedTableDept, setSelectedTableDept] = useState("");
    const [selectedTableDesg, setSelectedTableDesg] = useState("");
    const [forwardApplicationData, setForwardApplicationData] = useState({});

    const [senderOptions, setSenderOptions] = useState([]);
    const [subTypeOptions, setSubTypeOptions] = useState([]);
    const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
    const [documentSubTypeOptions, setDocumentSubTypeOptions] = useState([]);

    const [tablePrabhagOptions, setTablePrabhagOptions] = useState([]);
    const [tableDepartmentOptions, setTableDepartmentOptions] = useState([]);
    const [tableSuggestionOptions, setTableSuggestionOptions] = useState([]);
    const [tableDesignationOptions, setTableDesignationOptions] = useState([]);
    const [tableEmployeeOptions, setTableEmployeeOptions] = useState([]);

    const { invardNo, row } = location.state;

    const {
        register,
        watch,
        setValue,
        getValues,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            invardNo: "",
            action: "",
            sender: "",
            subType: "",
            docType: "",
            docSubType: "",
            refNo: "",
            refDate: "",
            from: "",
            subject: "",
            letterType: "",
            remark: "",
            tableRow: { ...emptyTableRow }
        }
    });

    const watchSender = watch("sender");
    const watchAction = watch("action");
    const watchTablePrabhag = watch("tableRow.prabhag");
    const watchTableDepartment = watch("tableRow.department");
    const watchTablePurpose = watch("tableRow.purpose");
    const watchTableDesignation = watch("tableRow.designation");



    const fetchSenderDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.post("getMainReceiverCategoryDropdown", {
                ulbId: ulbid
            });

            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.VAR_SENDER_NAME,
                    value: item.NUM_SENDER_ID
                }));

                setSenderOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchSubTypeDropdown = async (senderId = watchSender) => {
        try {
            const response = await apiService.post(
                "receiverSubCategoryDropdown",
                {
                    ulbId: Number(ulbid),
                    senderId: Number(senderId)
                }
            );

            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.VAR_SENDERSUBTYPE_NAME,
                    value: Number(item.NUM_SENDERSUBTYPE_ID)
                }));

                setSubTypeOptions(formatted);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDocumentTypeDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.get("getDocumentTypeDropdown");

            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.VAR_DOCTYPE_NAME,
                    value: item.NUM_DOCTYPE_ID
                }));

                setDocumentTypeOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchDocumentSubTypeDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.get("getDocumentSubTypeDropdown");
            // console.log(response);
            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.VAR_DOCSUBTYPE_NAME,
                    value: item.NUM_DOCSUBTYPE_ID
                }));

                setDocumentSubTypeOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchPrabhagDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.post("getPrabhagDropdown", { ulbid: Number(ulbid) });
            // console.log(response);
            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.WARDNAME,
                    value: item.WARDID
                }));

                setTablePrabhagOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchMarathiDepartmentDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.post("getMarathiDepartmentDropdown", { ulbid: Number(ulbid) });

            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.DEPT_MARNAME,
                    value: item.DEPTID
                }));

                setTableDepartmentOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchPurposeDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.get("getCcPurposeDropdown");

            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.VAR_PURPOSE_NAME,
                    value: item.NUM_PURPOSE_ID
                }));

                setTableSuggestionOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchDesignationDropdown = async () => {
        try {
            setLoading(true);

            const response = await apiService.post("getCcDesignationDropdown", { ulbid: Number(ulbid) });

            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.DESIG_ENAME,
                    value: item.DESIG_ID
                }));

                setTableDesignationOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchEmployeeNameDropdown = async () => {
        try {

            if (!watchTableDepartment || !watchTableDesignation) {
                return;
            }
            setLoading(true);

            const response = await apiService.post("getEmployeeNameDropdown", { ulbid: Number(ulbid), desigId: Number(watchTableDesignation), departmentId: Number(watchTableDepartment) });
            // console.log(watchTableDepartment, watchTableDesignation, selectedTableDesg)
            // console.log(response);
            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    label: item.VAR_USER_USERNAME,
                    value: item.NUM_USER_USERID
                }));

                setTableEmployeeOptions(formatted);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchApplicationDetails = async () => {
        try {
            setLoading(true);

            const response = await apiService.post("getTransferFormData", {
                ulbid: Number(ulbid),
                inwardNo: invardNo,
                userDeptId: Number(deptId)
            });

            if (response.data.success) {
                const data = response.data.data;

                // console.log("Application Details:", data);

                setApplicantInwardId(data.INWARDID);
                setApplicationTransId(data.TRANSID);
                const senderId = Number(data.SENDERID);
                const subTypeId = Number(data.SENDERSUBTYPEID);

                // Store application subtype
                setApplicationSubTypeId(subTypeId);
                setApplicationDocSubId(Number(data.DOCSUBTYPE))
                // Fill normal fields
                // setValue("sender", senderId);

                setValue("refNo", data.REFNO || "");
                setValue("refDate", data.REFDATE || "");
                setValue("from", data.INWARDFROM || "");
                setValue("subject", data.SUBJECT || "");
                setValue("letterType", data.LETTERTYPE_NAME || "");

                // -----------------------------------------
                // Fetch sender dropdown using application data
                // -----------------------------------------
                await fetchSenderDropdown();

                // -----------------------------------------
                // Fetch subtype dropdown using application sender
                // -----------------------------------------
                await fetchSubTypeDropdown(senderId);

                await fetchDocumentTypeDropdown();
                await fetchDocumentSubTypeDropdown();

                ;
                setValue("docType", Number(data.DOCTYPE));
                setValue("docSubType", Number(data.DOCSUBTYPE));

                // Set selected values after dropdowns are loaded
                setValue("sender", senderId);
                setValue("subType", subTypeId);
            }

        } catch (error) {
            console.error(error);
            alert(error.message || "Error fetching application details");
        } finally {
            setLoading(false);
        }
    };

    const fetchForwardApplicationData = async () => {
        try {
            setLoading(true);

            const payload = {
                userId,
                ulbid: Number(ulbid),
                inwardNo: invardNo,
                inwardId: Number(applicantInwardId)
            }

            const response = await apiService.post("getForwardTransferData", payload);

            console.log(response);

            if (response.data.success) {
                if (!response.data.data.length) {
                    // setValue("action", "F");
                    setForwardApplicationData({});
                    return;
                }

                const data = response.data.data[0];

                // setValue("tableRow.prabhag", data.NUM_TRANSFER_FRMPRABHAGID);
                // setValue("tableRow.department", data.NUM_TRANSFER_FRMDEPTID);
                // setValue("tableRow.purpose", data.NUM_TRANSFER_PURPOSEID);
                // setValue("tableRow.designation", data.NUM_USER_DESGID);
                // setValue("tableRow.employeeName", data.VAR_TRANSFER_INSBY);
                setForwardApplicationData(data);

            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const makeTransferString = ({
        collid = "",
        deptid = "",
        formData,
        transid = ""
    }) => {
        // console.log(formData);
        const {
            prabhag,
            department,
            purpose,
            employeeName,
            designation,
            remark
        } = formData?.tableRow || {};

        const action = formData?.action || "";
        const remarkField = formData?.remark || "";

        return `${collid}$${deptid}$${prabhag || forwardApplicationData.NUM_TRANSFER_FRMPRABHAGID || ""}$${department || forwardApplicationData.NUM_TRANSFER_FRMDEPTID || ""}$${purpose || forwardApplicationData.NUM_TRANSFER_PURPOSEID || ""}$${employeeName || forwardApplicationData.VAR_TRANSFER_INSBY || ""}$${designation || forwardApplicationData.NUM_USER_DESGID || ""}$${remark || remarkField || ""}$${action}$${transid || ""}`;
    };


    const handleTransferSubmit = async (data) => {
        try {
            setLoading(true);

            console.log("Entries: ", Object.entries(forwardApplicationData));
            if (watchAction === "R" && Object.entries(forwardApplicationData).length === 0) {
                alert("Please fill the details");
                setValue("remark", "");
                setValue("action", "F");
                return;
            }

            // console.log(data);
            const ipAddress = await GetIPAddress();

            const trnsferStr = makeTransferString({
                collid: collectionCenterId,
                deptid: deptId,
                formData: data,
                transid: applicationTransId
            });

            const payload = {
                "IN_USERID": userId,
                "IN_inwardid": Number(applicantInwardId),
                "IN_INWARDNO": invardNo,
                "in_ipaddress": ipAddress,
                "in_trfstr": trnsferStr,
                "ulbid": Number(ulbid)
            };


            const response = await apiService.post("aoio_transfer_ins", payload);

            if (response.data.success && response.data.errorCode === -100) {
                alert(response.data.errorMessage);
                reset();
                navigate("/Inward/FrmInwardDtlsCommunication", {
                    replace: true
                });
            } else {
                alert("Error in submitting form.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (ulbid) {
            // fetchSenderDropdown();
            // fetchDocumentTypeDropdown();
            // fetchDocumentSubTypeDropdown();
            fetchPrabhagDropdown();
            fetchMarathiDepartmentDropdown();
            fetchPurposeDropdown();
            fetchDesignationDropdown();
        }
    }, [ulbid]);



    useEffect(() => {
        if (ulbid && invardNo && deptId) {
            fetchApplicationDetails();
        }
    }, [ulbid, invardNo, deptId]);

    useEffect(() => {
        if (documentSubTypeOptions.length > 0 && applicationDocSubId) {
            setValue("docSubType", applicationDocSubId);
        }
    }, [documentSubTypeOptions, applicationDocSubId]);

    useEffect(() => {
        if (ulbid && userId && invardNo && applicantInwardId && watchAction === "R") {
            fetchForwardApplicationData();
        }
    }, [watchAction, ulbid, userId, invardNo, applicantInwardId]);

    useEffect(() => {

        fetchEmployeeNameDropdown();
    }, [watchTableDepartment, watchTableDesignation]);

    return (
        <Layout
            title={"हस्तांतरण किंवा अंतर्गत संप्रेषण"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Transfer / Internal Communication"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(handleTransferSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label text="आवक क्र.: " />
                        <div className="flex">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter inward number"
                                    className={`form-input-box`}
                                    {...register("invardNo")}
                                    disabled={true}
                                    value={invardNo}
                                />
                                <Button
                                    type="button"
                                    disabled={true}
                                >
                                    शोधा
                                </Button>
                                {/* <Button
                                type="button"
                                onClick={() => {
                                    navigate("/Inward/FrmInwardDtlsDocument", {
                                        replace: true
                                    });
                                }}
                            >
                                बदल
                            </Button> */}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label text={"क्रिया"} />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                            {...register("action")}
                        // onChange={(e) => {
                        //     const value = e.target.value;
                        //     // setSelectedAction(value);
                        // }}
                        >
                            <option value="">--SELECT--</option>
                            {actionOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label text={"पाठवणारा"} />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                            {...register("sender")}
                            disabled={true}
                        >
                            <option value="">--SELECT--</option>
                            {senderOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label text={"उपप्रकार"} />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                            {...register("subType")}
                            disabled={true}
                        >
                            <option value="">--SELECT--</option>
                            {subTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label text={"दस्तऐवजचे प्रकार"} />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                            {...register("docType")}
                            disabled={true}
                        >
                            <option value="">--SELECT--</option>
                            {documentTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label text={"दस्तऐवजचे उपप्रकार"} />
                        <select
                            className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
                            {...register("docSubType")}
                            disabled={true}
                        >
                            <option value="">--SELECT--</option>
                            {documentSubTypeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label text={"संदर्भ क्रमांक"} />
                        <input
                            type="text"
                            placeholder="Enter Reference number"
                            className={`form-input-box`}
                            disabled={true}
                            {...register("refNo")}
                        />
                    </div>
                    <div>
                        <Label text={"संदर्भ दिनांक"} />
                        <input
                            type="date"
                            className={`form-input-box`}
                            {...register("refDate")}
                            disabled={true}
                        />
                    </div>
                    <div>
                        <Label text={"पासून"} />
                        <input
                            type="text"
                            // placeholder="Enter from"
                            className={`form-input-box`}
                            disabled={true}
                            {...register("from")}
                        />
                    </div>
                    <div>
                        <Label text={"विषय"} />
                        <input
                            type="text"
                            // placeholder="Enter from"
                            className={`form-input-box`}
                            disabled={true}
                            {...register("subject")}
                        />
                    </div>
                    <div>
                        <Label text={"पत्राचे प्रकार"} />
                        <input
                            type="text"
                            // placeholder="Enter from"
                            className={`form-input-box`}
                            disabled={true}
                            {...register("letterType")}
                        />
                    </div>

                    {watchAction === "R" && (
                        <div>
                            <Label text={"शेरा"} />
                            <input
                                type="text"
                                // placeholder="Enter from"
                                className={`form-input-box`}
                                // disabled={true}
                                {...register("remark")}
                            />
                        </div>
                    )}
                </div>
                {watchAction === "F" &&
                    (
                        <div className="mt-3">
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[1000px] table-fixed border-collapse">
                                        <thead className="bg-slate-100/95">
                                            <tr className="border-b border-slate-200">
                                                <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    Prabhag
                                                </th>
                                                <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    Department
                                                </th>
                                                <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    Purpose
                                                </th>
                                                <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    Designation
                                                </th>
                                                <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    Employee Name
                                                </th>
                                                <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                                    Remark
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
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            setValue("tableRow.prabhag", value, {
                                                                shouldDirty: true,
                                                                shouldValidate: true
                                                            });
                                                            setValue("tableRow.department", "");
                                                            setValue("tableRow.purpose", "");
                                                            setValue("tableRow.designation", "");
                                                            setValue("tableRow.employeeName", "");
                                                        }}
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
                                                        className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
                                                        {...register("tableRow.department")}
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            setValue("tableRow.department", value, {
                                                                shouldDirty: true,
                                                                shouldValidate: true,
                                                            });

                                                            setValue("tableRow.purpose", "");
                                                            setValue("tableRow.designation", "");
                                                            setValue("tableRow.employeeName", "");
                                                        }}
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
                                                        className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
                                        bg-slate-100 text-slate-500"
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
                                                        {...register("tableRow.designation")}
                                                        // onChange={(e) => {
                                                        //     const value = e.target.value;
                                                        //     // setSelectedTableDesg(value);
                                                        //     setValue("tableRow.employeeName", "");
                                                        // }}
                                                        disabled={
                                                            !watchTablePrabhag ||
                                                            !watchTableDepartment ||
                                                            !watchTablePurpose
                                                        }
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
                                                        className="form-input-box w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                        {...register("tableRow.employeeName")}
                                                        disabled={
                                                            !watchTableDepartment ||
                                                            !watchTableDesignation
                                                        }
                                                    >
                                                        <option value="">
                                                            {!watchTableDepartment || !watchTableDesignation
                                                                ? "-- Select Department and Designation"
                                                                : "-- SELECT --"}
                                                        </option>

                                                        {tableEmployeeOptions.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        className="form-input-box"
                                                        {...register("tableRow.remark")}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="mt-3 flex justify-center gap-3">
                    <Button
                        type="submit"
                    >
                        साठवा
                    </Button>
                    <Button
                        type="button"
                    >
                        बदल
                    </Button>
                    <Button
                        type="button"
                        onClick={() => navigate("/Inward/FrmInwardDtlsCommunication", {
                            replace: true
                        })}
                    >
                        मागे
                    </Button>
                </div>
            </form>
        </Layout>
    )

};



export default FrmInwardTransfer;