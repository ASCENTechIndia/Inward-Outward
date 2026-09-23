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

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const FrmInvardDtlsDocument = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ searchParams ] = useSearchParams();
    const { setLoading } = useLoader();
    const { user } = useAuth();
    const userId = user?.userId;
    const ulbid = user?.ulbId;
    // const mode = searchParams.get("mode");
    // console.log(mode);
    // console.log(userId);
    // console.log(ulbid);

    const {
        register,
        setValue,
        reset,
        watch,
        getValues,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            fromDate: getToday(),
            toDate: getToday()
        }
    });

    const [tableHeaders, setTableHeaders] = useState([
        "अनुक्रमांक",
        "आवक क्र.",
        "तारीख",
        "संदर्भ क्रमांक",
        "संदर्भ दिनांक",
        "मोबाईल क्र",
        "विषय",
        "पत्राचे प्रकार",
        "निवडा"
    ])
    const [tableData, setTableData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const formatDateToDDMMMYYYY = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");

        const months = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];

        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

    const handleSearch = async (data) => {
        try {
            setLoading(true);
            // console.log(data)


            const payload = {
                fromDate: formatDateToDDMMMYYYY(data.fromDate),
                toDate: formatDateToDDMMMYYYY(data.toDate),
                ulbid,
                userId
            }
            const response = await apiService.post("getInwarListTwo", payload);

            if (response.data.success) {
                if (response.data.data.length === 0) {
                    alert("No Records Found");
                    setShowTable(false);
                    return;
                }
                    // const navigateToURL = mode === 1 ? "/Inward/FrmInwardClose" : mode === 2 ? "" : "";
                    // const navigateState = mode === 1 ? {

                    // }
                    const formatted = response.data.data.map((item, index) => 
                        (
                            [
                        index + 1,
                        item.INWORD_NO,
                        item.INWARDDATE ? formatDateToDDMMYYYY(item.INWARDDATE) : "",
                        item.REF_NO,
                        item.REF_DATE ? formatDateToDDMMYYYY(item.REF_DATE) : "",
                        item.MOBILE_NO,
                        item.SUBJECT,
                        item.LETTERTYPE,
                            <div className="flex justify-center items-center px-3 py-2">
                                <button
                                    type="button"
                                    className="p-1.5 rounded-md text-blue-600 border border-blue-300
                                    hover:bg-blue-50 active:scale-[0.95] transition-all"
                                onClick={() => {
                                    navigate("/Inward/FrmInwardDocUpload", {
                                        state: {
                                            invardNo: item.INWORD_NO,
                                            row: item,
                                        }
                                    });
                                }}
                                >
                                    Select
                                </button>
                            </div>
                        ,
                            ]  
                ))
            setTableData(formatted);
            setShowTable(true);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Layout
            title="Invard List"
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "Invard List"
            }}
        >
            <form onSubmit={handleSubmit(handleSearch)} className="w-full space-y-6" >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label text="दिनांकापासून : " />
                        <input
                            type="date"
                            className={`form-input-box`}
                            {...register("fromDate")}
                        />
                    </div>
                    <div>
                        <Label text="दिनांकापर्यंत : " />
                        <input
                            type="date"
                            className={`form-input-box`}
                            {...register("toDate")}
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-2 px-5 py-3 border-t border-slate-200">
                    <Button
                        type="submit"
                    >
                        Search
                    </Button>
                </div>

                {/* Table */}
                {showTable &&
                    (
                        <div className="mt-3">
                            <Table
                                headers={tableHeaders}
                                data={tableData}
                                rowsPerPage={10}
                            />
                        </div>
                    )
                }

            </form>
        </Layout>
    )

}

export default FrmInvardDtlsDocument;