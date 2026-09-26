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

const FrmTransferDtlsRpt = () => {
    const { user } = useAuth();
    const ulbid = user?.ulbId;
    const userDeptId = user?.deptId;
    const userDesigId = user?.desigId;

    const { setLoading } = useLoader();
    const navigate = useNavigate();

    const [tableHeader, setTableHeader] = useState([
        "Sr. No.",
        "Inward Number",
        "From User",
        "To User",
        "From Prabhag",
        "From Department",
        "To Department",
        "Purpose",
        "Designation",
        "Action"
    ]);

    const [tableData, setTableData] = useState([]);
    const [formattedData, setFormattedData] = useState([]);

    const [inwardNumber, setInwardNumber] = useState("");

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
            invardNumber: "",
        }
    })

    const fetchInwardNumberDetails = async (data) => {
        try {
            setLoading(true);
            if (!data.invardNumber.trim()) {
                alert("Invalid Inward Number");
                return;
            }

            const payload = {
                "ulbid": Number(ulbid),
                "inwardNo": data.invardNumber
            };

            const response = await apiService.post("getTransferDetailsReport", payload);


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
            title={"हस्तांतरण अहवाल"}
            breadcrumb={{
                homeLink: "/dashboard",
                homeText: "Home",
                current: "हस्तांतरण अहवाल"
            }}
        >
            <form className="w-full space-y-6" onSubmit={handleSubmit(fetchInwardNumberDetails)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <Label
                            text={"आवक क्र:"}
                        />
                        <input
                            type="text"
                            className="form-input-box"
                            {...register("invardNumber")}
                        />
                    </div>
                    <div className="flex">
                        <div className="flex items-end gap-3">
                            <Button
                                type="submit"
                            >साठवा</Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    reset();
                                }}
                            >बदल</Button>
                        </div>
                    </div>
                </div>
                {formattedData.length > 0 &&
                    (
                        <>

                            <div className="flex justify-start gap-2 pt-4 border-t border-slate-200 mt-3">
                                <Excel
                                    tableHeader={tableHeader}
                                    tableData={formattedData}
                                    fileName={`Transfer_Details_${new Date()
                                        .toISOString()
                                        .slice(0, 10)}.xlsx`}
                                    sheetName="Transfer Details"
                                    title="हस्तांतरण अहवाल"
                                />

                                <Pdf
                                    tableHeader={tableHeader}
                                    tableData={formattedData}
                                    fileName={`Transfer_Details_${new Date()
                                        .toISOString()
                                        .slice(0, 10)}.pdf`}
                                    ulbName={municipalText || "Municipal Corporation"}
                                    logoUrl={ulbLogo || ""}
                                    reportTitle="हस्तांतरण अहवाल"
                                    dateRange={dateRangeText}
                                    userName={user?.username || ""}
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
                    )
                }
            </form>
        </Layout>
    )

};

export default FrmTransferDtlsRpt;