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

const FrmOutwardRegRpt = () => {
    const { user } = useAuth();
    const ulbid = user?.ulbId;
    const userId = user?.userId;
    const userDeptId = user?.deptId;
    const userDesigId = user?.desigId;

    const { setLoading } = useLoader();
    const navigate = useNavigate();

    const [tableHeader, setTableHeader] = useState([
        "अनुक्रमांक",
        "जावक क्र",
        "दिनांक",
        "मुख्य प्राप्तकर्ता श्रेणी",
        "दस्तऐवजचे प्रकार",
        "आवक संदर्भ क्र.",
        "संदर्भ दिनांक",
        "प्राप्तकर्त्याचे नाव",
        "पत्ता",
        "विषय",
        "जावक प्रकार",
        "शेरा",
    ]);

    const [tableData, setTableData] = useState([]);
    const [formattedData, setFormattedData] = useState([]);

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
            fromDate: getToday(),
            toDate: getToday()
        }
    });

    const fetchTableData = async (data) => {
        try {
            setLoading(true);
            // console.log(data);
            const payload = {
                ulbid: Number(ulbid),
                fromDate: formatOracleDate(data.fromDate),
                toDate: formatOracleDate(data.toDate),
                userId
            };


            const response = await apiService.post("getOutwardRegReport", payload);

            console.log(response);
            return;
            if (response.data.success && response.data.data.length > 0) {
                setTableData(response.data.data[0]);

                const formatted = response.data.data.map((item, index) => ([
                    index + 1,
                    item.INWARD_NO || "-",
                    item.FROMUSER || "-",
                    item.TOUSER || "-",
                    item.FROM_PRABHAGNAME || "-",
                    item.FROM_DEPTNAME || "-",
                    item.TO_DEPTNAME || "-",
                    item.PURPOSE_NAME || "-",
                    item.DESG_NAME || "-",
                    item.ACTION || "-"
                ]));
                setFormattedData(formatted);
            } else if (response.data.success && response.data.data.length === 0) {
                alert("No record found");
            }

        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to fetch details");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout
            title={"जावक नोंदणी अहवाल"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "जावक नोंदणी अहवाल"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(fetchTableData)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label
                            text="दिनांकापासून"
                        />
                        <input
                            type="date"
                            {...register("fromDate")}
                            className="form-input-box"
                        />
                    </div>
                    <div>
                        <Label
                            text="दिनांकापर्यंत"
                        />
                        <input
                            type="date"
                            {...register("toDate")}
                            className="form-input-box"
                        />
                    </div>
                </div>
                <div className="flex justify-center gap-3 mt-3">
                    <Button
                        type="submit"
                    >
                        साठवा
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            reset({
                                toDate: getToday(),
                                fromDate: getToday()
                            });
                            setFormattedData([]);
                            setTableData([]);
                        }}
                    >
                        बदल
                    </Button>
                </div>
                {formattedData.length > 0 && (
                    <>
                        <div className="mt-3 flex gap-3">
                            <Excel
                                tableHeader={tableHeader}
                                tableData={formattedData}
                                fileName={`Outward_Register_${new Date()
                                    .toISOString()
                                    .slice(0, 10)}.xlsx`}
                                sheetName="Outward Register"
                                title="जावक नोंदणी अहवाल"
                            />
                        </div>
                        <div className="mt-3">
                            <Table
                                headers={tableHeader}
                                data={formattedData}
                                rowsPerPage={10}
                            />
                        </div>
                    </>
                )}
            </form>
        </Layout>
    )
}

export default FrmOutwardRegRpt;