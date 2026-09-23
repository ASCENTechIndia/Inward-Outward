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

const FrmInwardRegister = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const [tableData, setTableData] = useState([]);

  const fetchTableData = async () => {
    const response = await apiService.post("", {});

    if (response.data.success && response.data.data.length > 0) {
      const formatted = response.data.data.map((item, index) => ({
        id: index + 1,
        inwardApplication: (
          <span
            className="text-blue-400 underline"
            onClick={() => {
              navigate("/Inward/FrmInwardRegisterDet", {
                state: {
                  inwardNo: item.invno,
                },
              });
            }}
          >
            {item.invno}
          </span>
        ),
        date: item.date,
        sender: item.sender,
        subtype: item.subtype,
        doctype: item.documentType,
        docSubType: item.documentSubType,
        refNo: item.referenceNo,
        refDate: item.refDate,
        from: item.from,
        address: item.address,
        mobileno: item.mobile,
        subject: item.sub,
        attachment: item.attach,
        letterType: item.letter,
        inwardType: item.invtype,
      }));

      setTableData(formatted);
    } else {
      setTableData([]);
    }
  };

  useEffect(() => {
    if (ulbid) {
      fetchTableData();
    }
  }, [ulbid]);

  return (
    <Layout
      title="Inward Register / आवक नोंदणी"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        currrent: "Inward Register",
      }}
    >
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
                    दिनांक
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    पाठवणारा
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    उपप्रकार
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    दस्तऐवजचे प्रकार
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    दस्तऐवजचे उपप्रकार
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    संदर्भ क्रमांक
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    संदर्भ दिनांक
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    पासुन
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    पत्ता
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    मोबाईल क्र.
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    विषय
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    संलग्नक
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    पत्राचे प्रकार
                  </th>
                  <th className="px-3 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-slate-600">
                    आवक प्रकार
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {tableData.length > 0 ? (
                  tableData.map((item, index) => (
                    <tr
                      key={index + 1}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td>{item.id || "-"}</td>
                      <td>{item.inwardApplication || "-"}</td>
                      <td>{item.date || "-"}</td>
                      <td>{item.sender || "-"}</td>
                      <td>{item.subtype || "-"}</td>
                      <td>{item.doctype || "-"}</td>
                      <td>{item.docSubType || "-"}</td>
                      <td>{item.refNo || "-"}</td>
                      <td>{item.refDate || "-"}</td>
                      <td>{item.from || "-"}</td>
                      <td>{item.address || "-"}</td>
                      <td>{item.mobileno || "-"}</td>
                      <td>{item.subject || "-"}</td>
                      <td>{item.attachment || "-"}</td>
                      <td>{item.letterType || "-"}</td>
                      <td>{item.inwardType || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={16}>
                      <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100 border border-slate-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6.586a2 2 0 011.414.586l3.414 3.414A2 2 0 0119 8.414V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>

                        <p className="text-base font-semibold text-slate-600">
                          कोणतेही रेकॉर्ड उपलब्ध नाहीत
                        </p>

                        {/* <p className="mt-1 text-sm text-slate-400 text-center">
                                                    दाखवण्यासाठी सध्या कोणताही आवक तपशील उपलब्ध नाही.
                                                </p> */}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FrmInwardRegister;
