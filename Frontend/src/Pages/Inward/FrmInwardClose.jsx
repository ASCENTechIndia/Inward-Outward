import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import * as XLSX from "xlsx";

const FrmInwardClose = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoader();
    const { user } = useAuth();
    const userId = user?.userId;
    const ulbid = user?.ulbId;

    const { invardNo } = location.state || {
        invardNo: ""
    };

    // Modal Fields
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            // inwardNumber: invardNo || ""
            inwardNo: "",
            sender: "",
            subtype: "",
            docType: "",
            docSubType: "",
            refNo: "",
            refDate: "",
            from: "",
            subject: "",
            letterType: ""
        }
    });
    const [searchInput, setSearchInput] = useState("");
    const [tableData, setTableData] = useState([]);
    const [showInwardDetailsModal, setShowInwardDetailsModal] = useState(false);

    const [senderOptions, setSenderOptions] = useState([
        { label: "Test Sender", value: "1" },
    ]);
    const [subTypeOptions, setSubTypeOptions] = useState([
        { label: "Test subType", value: "1" },
    ]);
    const [documentTypeOptions, setDocumentTypeOptions] = useState([
        { label: "Test documentType", value: "1" },
    ]);
    const [documentSubTypeOptions, setDocumentSubTypeOptions] = useState([
        { label: "Test documentSubType", value: "1" },
    ]);

    // For handle invard search input
    const handleSearch = async () => {
        try {
            setLoading(true);

            const payload = {
                invardNo: invardNo || searchInput
            };

            // const response = await apiService.post("", payload);

            // if (response.success) {
            //     const formatted = response.data.data.map((item, index) => ({
            //         id: index + 1,
            //         invardno: item.invno,
            //         date: item.invdate,
            //         refno: item.refno,
            //         refdate: item.refdate,
            //         mobileno: item.mobileno,
            //         subject: item.sub,
            //         mobileno: item.mobileno,
            //         letterType: item.letttype,
            //         nivda: (
            //             <div className="flex justify-center items-center px-3 py-2">
            //                 <button
            //                     type="button"
            //                     className="p-1.5 rounded-md text-blue-600 border border-blue-300
            // hover:bg-blue-50 active:scale-[0.95] transition-all"
            //                     onClick={() => {
            //                         fetchInvardApplDetails(item);
            //                     }}
            //                 >
            //                     Select
            //                 </button>
            //             </div>
            //         )
            //     }));

            //     setTableData(formatted);
            // }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // For fetching inward application details for the modal
    const fetchInvardApplDetails = async (invardRow) => {
        try {
            setLoading(true);

            setValue("inwardNo", invardRow.no || "");
            setValue("sender", invardRow.sender || "");
            setValue("subType", invardRow.subType || "");
            setValue("docType", invardRow.docType || "");
            setValue("docSubType", invardRow.docSubType || "");
            setValue("refNo", invardRow.refNo || "");
            setValue("refDate", invardRow.refDate || "");
            setValue("from", invardRow.from || "");
            setValue("subject", invardRow.subject || "");
            setValue("letterType", invardRow.letterType || "");

            setShowInwardDetailsModal(true);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // For exporting the table content to excel
    const handleExportToExcel = () => {
        if (!tableData || tableData.length === 0) {
            alert("Export करण्यासाठी कोणताही डेटा उपलब्ध नाही.");
            return;
        }

        // Convert tableData into Excel-friendly format
        const excelData = tableData.map((item, index) => ({
            "अनुक्रमांक": index + 1,
            "आवक क्र.": item.number || 0,
            "तारीख": item.date || "-",
            "संदर्भ क्रमांक": item.refno || "-",
            "संदर्भ दिनांक": item.refdate || "-",
            "मोबाईल क्र": item.mobileno || "-",
            "विषय": item.subject || "-",
            "पत्राचे प्रकार": item.letterType || "-",
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet["!cols"] = [
            { wch: 12 }, // अनुक्रमांक
            { wch: 15 }, // आवक क्र.
            { wch: 15 }, // तारीख
            { wch: 20 }, // संदर्भ क्रमांक
            { wch: 18 }, // संदर्भ दिनांक
            { wch: 15 }, // मोबाईल क्र
            { wch: 40 }, // विषय
            { wch: 25 }, // पत्राचे प्रकार
            { wch: 15 }, // निवडा
        ];

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Add worksheet
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "आवक तपशील"
        );

        // Generate Excel file
        XLSX.writeFile(
            workbook,
            `आवक_तपशील_${new Date().toISOString().slice(0, 10)}_${invardNo}.xlsx`
        );
    };

    // For submitting modal form
    const handleModalSubmit = async (data) => {
        try {
            setLoading(true);
            console.log(data);
            const payload = { ...data };

            // const response = await apiService.post("", payload);

            // if (response.data.success) {
            //     alert(response.data.message);
            //     reset();
            // } else {
            //     alert(response.data.message);
            // }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        if (userId && ulbid && invardNo) {
            handleSearch();
        }
    }, [userId, ulbid, invardNo]);

    return (
        <Layout
            title="Inward Close"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                currrent: "Inward Close"
            }}
        >
            <div className="w-full space-y-6" >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label text="आवक क्र. : " />
                        <input
                            type="text"
                            placeholder="Enter Inward Number"
                            className={`form-input-box`}
                            value={invardNo || ""}
                            // onChange={(e) => {
                            //     const value = e.target.value;
                            //     setSearchInput(value);
                            // }}
                            disabled

                        // {...register("inwardNumber")}
                        />
                    </div>
                    <div>
                        <div className="flex items-end gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    // handleSearch();
                                }}
                            >
                                शोधा
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    navigate("/Inward/FrmInwardDtls");
                                }}
                            >
                                मागे
                            </Button>
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="mt-3">
                    <Button
                        type="button"
                        onClick={() => {
                            handleExportToExcel();
                        }}
                    >
                        Export to Excel
                    </Button>
                </div>
                <div className="mt-3">
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] table-fixed border-collapse">
                                <thead className="bg-slate-100/95">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            अनुक्रमांक
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            आवक क्र.
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            तारीख
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            संदर्भ क्रमांक
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            संदर्भ दिनांक
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            मोबाईल क्र
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            विषय
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            पत्राचे प्रकार
                                        </th>
                                        <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                                            निवडा
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.length > 0 && (
                                        tableData.map((item, index) => (
                                            <tr>
                                                <td className="px-3 py-2 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.number || 0}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.date || "-"}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.refno || "-"}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.refdate || "-"}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.mobileno || "-"}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.subject || "-"}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.letterType || "-"}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    {item.nivda || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {showInwardDetailsModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => setShowInwardDetailsModal(false)}
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl w-full max-w-6xl
                       max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between
                            px-5 py-3 border-b border-slate-200
                            flex-shrink-0">

                                <h3 className="text-base font-semibold text-slate-800">
                                    आवक तपशील
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => setShowInwardDetailsModal(false)}
                                    className="p-1 rounded-md hover:bg-slate-100
                               text-slate-500 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M6 18L18 6M6 6l12 12"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit(handleModalSubmit)}
                                className="flex flex-col flex-1 min-h-0"
                            >
                                {/* Scrollable Body */}
                                <div
                                    className="flex-1 min-h-0 overflow-y-auto
                               px-4 sm:px-5 py-5"
                                >

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* आवक क्र. */}
                                        <div className="min-w-0">
                                            <Label text="आवक क्र.: " />

                                            <input
                                                type="text"
                                                placeholder="Enter inward number"
                                                className="form-input-box w-full"
                                                {...register("inwardNo")}
                                            />
                                        </div>

                                        {/* पाठवणारा */}
                                        <div className="min-w-0">
                                            <Label text="पाठवणारा : " required />

                                            <select
                                                className={`form-input-box w-full
                                border border-gray-400 rounded-md px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                ${errors.sender ? "border-red-500" : ""}`}
                                                {...register("sender", {
                                                    required: "पाठवणारा आवश्यक आहे"
                                                })}
                                            >
                                                <option value="">-- Select --</option>

                                                {senderOptions.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
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

                                        {/* उपप्रकार */}
                                        <div className="min-w-0">
                                            <Label text="उपप्रकार : " required />

                                            <select
                                                className={`form-input-box w-full
                                border border-gray-400 rounded-md px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                ${errors.subtype ? "border-red-500" : ""}`}
                                                {...register("subtype", {
                                                    required: "उपप्रकार आवश्यक आहे"
                                                })}
                                            >
                                                <option value="">-- Select --</option>

                                                {subTypeOptions.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
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

                                        {/* दस्तऐवजचे प्रकार */}
                                        <div className="min-w-0">
                                            <Label text="दस्तऐवजचे प्रकार : " required />

                                            <select
                                                className={`form-input-box w-full
                                border border-gray-400 rounded-md px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                ${errors.docType ? "border-red-500" : ""}`}
                                                {...register("docType", {
                                                    required: "दस्तऐवजचे प्रकार आवश्यक आहे"
                                                })}
                                            >
                                                <option value="">-- Select --</option>

                                                {documentTypeOptions.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                    >
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {errors.docType && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.docType.message}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label text="दस्तऐवजचे उपप्रकार : " required />
                                            <select
                                                className={`form-input-box w-full
                                border border-gray-400 rounded-md px-3 py-2 text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                ${errors.docSubType ? "border-red-500" : ""}`}
                                                {...register("docSubType", {
                                                    required: "दस्तऐवजचे उपप्रकार आवश्यक आहे"
                                                })}
                                            >
                                                <option value="">-- Select --</option>
                                                {documentSubTypeOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* संदर्भ क्रमांक */}
                                        <div className="min-w-0">
                                            <Label text="संदर्भ क्रमांक : " />

                                            <input
                                                type="text"
                                                placeholder="Enter reference number"
                                                className="form-input-box w-full"
                                                {...register("refNo")}
                                            />
                                        </div>

                                        {/* संदर्भ दिनांक */}
                                        <div className="min-w-0">
                                            <Label text="संदर्भ दिनांक : " />

                                            <input
                                                type="date"
                                                className="form-input-box w-full"
                                                {...register("refDate")}
                                            />
                                        </div>

                                        {/* पासून */}
                                        <div className="min-w-0">
                                            <Label text="पासून : " required />

                                            <input
                                                type="text"
                                                placeholder="Enter from"
                                                className={`form-input-box w-full
                                ${errors.from ? "border-red-500" : ""}`}
                                                {...register("from", {
                                                    required: "पासून आवश्यक आहे"
                                                })}
                                            />

                                            {errors.from && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.from.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* विषय */}
                                        <div className="min-w-0">
                                            <Label text="विषय" required />

                                            <input
                                                type="text"
                                                placeholder="Enter subject"
                                                className={`form-input-box w-full
                                ${errors.subject ? "border-red-500" : ""}`}
                                                {...register("subject", {
                                                    required: "विषय आवश्यक आहे"
                                                })}
                                            />

                                            {errors.subject && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.subject.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* पत्राचे प्रकार */}
                                        <div className="min-w-0">
                                            <Label text="पत्राचे प्रकार : " required />

                                            <input
                                                type="text"
                                                className={`form-input-box w-full
                                ${errors.letterType ? "border-red-500" : ""}`}
                                                {...register("letterType", {
                                                    required: "पत्राचे प्रकार आवश्यक आहे"
                                                })}
                                                placeholder="Enter letter type"
                                            />

                                            {errors.letterType && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.letterType.message}
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex justify-center gap-2
                            px-5 py-3
                            border-t border-slate-200
                            bg-white flex-shrink-0">

                                    <Button type="submit">
                                        साठवा
                                    </Button>

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
    )
};

export default FrmInwardClose;