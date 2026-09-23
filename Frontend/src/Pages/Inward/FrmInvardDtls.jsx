import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";

const getToday = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
};

const FrmInvardDtls = () => {
    const navigate = useNavigate();
    const { setLoading } = useLoader();
    const { user } = useAuth();
    const userId = user?.userId;
    const ulbid = user?.ulbId;

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

    const [tableData, setTableData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const handleSearch = async () => {
        try {
            setLoading(true);

            // const response = await apiService.post("", payload);

            // if (response.success) {
            // if (Response.data.data.length === 0) {
            //     alert("No Records Found");
            //     setShowTable(false);
            //     return;
            // }

            //         const formatted = Response.data.data.map(item => ({
            //             id: item.id,
            //             number: item.number,
            //             date: item.date,
            //             refno: item.refno,
            //             refdate: item.refdt,
            //             mobileno: item.mobileno,
            //             subject: item.subject,
            //             letterType: item.letterType,
            //             nivda: (
            //                 <div className="flex justify-center items-center px-3 py-2">
            //                     <button
            //                         type="button"
            //                         className="p-1.5 rounded-md text-blue-600 border border-blue-300
            // hover:bg-blue-50 active:scale-[0.95] transition-all"
            // onClick={() => {
            //     navigate("/Inward/FrmInwardClose", {
            //         state: {
            //             invardNo: item.number,
            //         }
            //     })
            // }}
            //                     >
            //                         Select
            //                     </button>
            //                 </div>
            //             )
            //         }))
            // setTableData(formatted);
            // setShowTable(true);
            // }

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
                    )
                }

            </form>
        </Layout>
    )

}

export default FrmInvardDtls;