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
import { useNavigate, useLocation } from "react-router-dom";

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const getCurrentMonthDateRange = () => {
    const d = new Date();

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const fromDate = `${year}-${month}-01`;
    const toDate = `${year}-${month}-${day}`;

    return {
        fromDate,
        toDate,
    };
};

const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};


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

const RptFileMoveTrack = () => {
    const { user } = useAuth();
    const ulbid = user?.ulbId;
    const userId = user?.userId;
    const userDeptId = user?.deptId;
    const userDesigId = user?.desigId;

    const { setLoading } = useLoader();
    const navigate = useNavigate();

    const [tableHeader, setTableHeader] = useState([
        "आवक क्र.",
        "आवक दिनांक",
        "संदर्भ क्र.",
        "पासुन",
        "अर्जदाराचे नाव",
        "पत्ता",
    ]);

    const [modalTableHeader, setModalTableHeader] = useState([
        "Select",
        "Sr. No.",
        "आवक आयडी",
        "आवक क्र",
        "पाठवणारा नाव",
        "प्रेषकाचे उपप्रकार नाव",
        "मोबाईल क्र",
        "विषय",
        "संदर्भ क्रमांक"
    ]);
    const [detailsTableHeader, setDetailsTableHeader] = useState([
        "अनुक्रमांक.",
        "आवक क्र.",
        "आवक दिनांक",
        "प्रकार",
        "वापरकर्त्याकडून",
        "वापरकर्त्याला",
        "उद्देश",
        "जावक दिनांक",
        "शेरा"
    ]);
    const [ccTableHeader, setCCTableHeader] = useState([
        "Inward No.",
        "Prabhag",
        "Department",
        "Designation",
        "User"
    ])

    const [tableData, setTableData] = useState([]);
    const [formattedData, setFormattedData] = useState([]);
    const [showOuterTable, setShowOuterTable] = useState(true);
    const [showInnerTable, setShowInnerTable] = useState(false);

    const [detailsTableData, setDetailsTableData] = useState([]);
    const [formattedDetailsTableData, setFormattedDetailsTableData] = useState([]);

    const [ccTableData, setCCTableData] = useState([]);
    const [formattedCCTableData, setFormattedCCTableData] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [modalTableData, setModalTableData] = useState([]);
    const [formattedModalTableData, setFormattedModalTableData] = useState([]);

    const { fromDate: initialFromDate, toDate: initialToDate } = getCurrentMonthDateRange();

    const [fromDate, setFromDate] = useState(initialFromDate);
    const [toDate, setToDate] = useState(initialToDate);

    const {
        register,
        watch,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            inwardNo: "",
        }
    });

    const handleSearch = async () => {
        try {
            setLoading(true);
            const invno = getValues("inwardNo");
            const payload = {
                "ulbid": Number(ulbid),
                inwardNo: invno || ""
            };

            const response = await apiService.post("getFileMovementTrackingList", payload);

            if (response.data.success && response.data.data.length > 0) {
                setTableData(response.data.data);
                const formatted = response.data.data.map((item, index) => ([
                    <span
                        className="text-blue-400 underline cursor-pointer"
                        onClick={() => {
                            const fileInvNo = item.INWARDNO || item.INWORD_NO;
                            handleFileDetailsSearch(fileInvNo);
                        }}
                    >
                        {item.INWARDNO || item.INWORD_NO || ""}
                    </span>,
                    formatDate(item.INWDATE) || formatDate(item.INWARDDATE) || "",
                    item.REF_NO || "",
                    item.FROMUSERNAME || item.INWARD_FROM || "",
                    item.TOUSERNAME || item.APPLINAME || "",
                    item.ADDRESS || ""
                ]));

                setFormattedData(formatted);
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to search");
        } finally {
            setLoading(false);
        }
    }

    const handleModalSearch = async () => {
        try {
            setLoading(true);

            const payload = {
                "ulbid": Number(ulbid),
                "fromdate": formatOracleDate(fromDate),
                "toDate": formatOracleDate(toDate)
            }

            const response = await apiService.post("getFileMovementTrackingPopupList", payload);

            if (response.data.success) {
                setModalTableData(response.data.data);

                const formatted = response.data.data.map((item, index) => ([
                    <span
                        className="text-blue-400 underline cursor-pointer"
                        onClick={() => {
                            setValue("inwardNo", item.INWORD_NO);

                            setShowModal(false);

                            setFromDate(initialFromDate);
                            setToDate(initialToDate);
                            setModalTableData([]);
                            setFormattedModalTableData([]);

                            handleSearch();
                        }}
                    >
                        Select
                    </span>,
                    index + 1,
                    item.INWARDID || "",
                    item.INWORD_NO || "",
                    item.SENDER_NAME || "",
                    item.SENDER_SUBTYPE_NAME || "",
                    item.MOBILE_NO || "",
                    item.SUBJECT || "",
                    item.REF_NO || ""
                ]));

                setFormattedModalTableData(formatted);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileDetailsSearch = async (invNumber) => {
        try {
            setLoading(true);

            const payload = {
                "ulbid": Number(ulbid),
                inwardNo: invNumber
            };

            const response = await apiService.post("getInwardNoClickList", payload);

            if (response.data.success && Array.isArray(response.data.data) && Array.isArray(response.data.ccData)) {
                setDetailsTableData(response.data.data);
                setCCTableData(response.data.ccData);

                const detailsFormatted = response.data.data.length > 0 ? response.data.data.map((item, index) => ([
                    index + 1,
                    item.INWARDNO || "",
                    formatDate(item.INWDATE) || "",
                    item.TRACKER_TYPE || "",
                    item.FROMUSERNAME || "",
                    item.TOUSERNAME || "",
                    item.PURPOSENAME || "",
                    formatDate(item.OUTWDATE) || "",
                    item.ACTIOREMARK || ""
                ])) : [];

                const ccDetailsFormatted = response.data.ccData.length > 0 ? response.data.ccData.map((item, index) => ([
                    item.INWARDNO || "",
                    item.WARDNAME || "",
                    item.dept || "",
                    item.DESIG_ENAME || "",
                    item.USERNAME || ""
                ])) : [];

                setFormattedDetailsTableData(detailsFormatted);
                setFormattedCCTableData(ccDetailsFormatted);

                setShowOuterTable(false);
                setShowInnerTable(true);
            }

        } catch (error) {
            console.error(error);
            alert(error.message || "Feiled to fetch details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (ulbid) {
            handleSearch();
        }
    }, [ulbid]);

    return (
        <Layout
            title={"File Movement Tracking"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "File Movement Tracking"
            }}
        >
            <form onSubmit={handleSubmit(handleSearch)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label text="आवक क्र.: " required />
                        <input
                            type="text"
                            {...register("inwardNo")}
                            className="form-input-box"
                        />
                    </div>
                    <div className="flex">
                        <div className="flex items-end gap-3">
                            <Button
                                type="submit"
                            >
                                शोधा
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowModal(true);
                                }}
                            >
                                पहा
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    reset({
                                        inwardNo: ""
                                    });

                                    setShowInnerTable(false)
                                    setShowOuterTable(true);
                                    handleSearch();
                                }}
                            >
                                बदल
                            </Button>
                        </div>
                    </div>
                </div>
                {formattedData.length > 0 && showOuterTable && (
                    <>
                        {/* <div className="mt-3 flex gap-3">
                            <Excel
                                tableHeader={tableHeader}
                                tableData={formattedData}
                                fileName={`File_Movement_Track_Report_${new Date()
                                    .toISOString()
                                    .slice(0, 10)}.xlsx`}
                                sheetName="File Movement Track Report"
                                title="File Movement Tracking Report"
                            />
                        </div> */}

                        <div className="mt-3">
                            <Table
                                headers={tableHeader}
                                data={formattedData}
                                rowsPerPage={10}
                            />
                        </div>
                    </>
                )}

                {showInnerTable && (
                    <>
                        <div className="flex justify-end mt-3">
                            <Excel
                                tableHeader={detailsTableHeader}
                                tableData={formattedDetailsTableData}
                                fileName={`File_Details_Register_${new Date()
                                    .toISOString()
                                    .slice(0, 10)}.xlsx`}
                                sheetName="File Details Register"
                                title="File Details Register"
                            />
                        </div>
                        <div className="mt-3">
                            <Table
                                headers={detailsTableHeader}
                                data={formattedDetailsTableData}
                                rowsPerPage={10}
                            />
                        </div>
                        <h3 className="mt-3 font-semibold">
                            CC Details
                        </h3>
                        <div className="mt-3">
                            <Table
                                headers={ccTableHeader}
                                data={formattedCCTableData}
                                rowsPerPage={10}
                            />
                        </div>
                        <div className="mt-3 flex justify-center">
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowInnerTable(false);
                                    setShowOuterTable(true);
                                    setCCTableData([])
                                    setFormattedCCTableData([]);
                                    setDetailsTableData([]);
                                    setFormattedDetailsTableData([]);
                                }}
                            >
                                Back
                            </Button>
                        </div>
                    </>
                )}

                {showModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                        onClick={() => {
                            setShowModal(false);
                            setFromDate(initialFromDate);
                            setToDate(initialToDate);
                            setModalTableData([]);
                            setFormattedModalTableData([]);
                        }}
                    >
                        <div
                            className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 shrink-0">
                                <h3 className="text-base font-semibold text-slate-800">
                                    Search Details
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setFromDate(initialFromDate);
                                        setToDate(initialToDate);
                                        setModalTableData([]);
                                        setFormattedModalTableData([]);
                                    }}
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

                            <div className="p-5 overflow-y-auto">

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                        <div>
                                            <Label text="दिनांकापासून" />

                                            <input
                                                type="date"
                                                className="form-input-box w-full"
                                                value={fromDate}
                                                onChange={(e) => {
                                                    setFromDate(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <Label text="दिनांकापर्यंत" />

                                            <input
                                                type="date"
                                                className="form-input-box w-full"
                                                value={toDate}
                                                onChange={(e) => {
                                                    setToDate(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    handleModalSearch();
                                                }}
                                            >
                                                शोधा
                                            </Button>
                                        </div>

                                    </div>
                                </div>

                                {formattedModalTableData.length > 0 &&
                                    <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <Table
                                                headers={modalTableHeader}
                                                data={formattedModalTableData}
                                                rowsPerPage={10}
                                            />
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                )}
            </form>
        </Layout>
    )
}

export default RptFileMoveTrack;