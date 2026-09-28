import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";

const FrmDocumentSubTypeMaster = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;

  const docTypeIdFromState = state?.docTypeId;
  const docSubTypeIdFromState = state?.docSubTypeId;
  const docSubTypeNameFromState = state?.docSubTypeName;

  const isUpdate = !!docSubTypeIdFromState;

  const [docTypeOptions, setDocTypeOptions] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      docTypeId: "",
      subDocName: docSubTypeNameFromState || "",
    },
  });

  useEffect(() => {
    const fetchDocTypes = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("getDocumentTypeDropdown");

        if (res?.data?.success && Array.isArray(res.data.data)) {
          setDocTypeOptions(
            res.data.data.map((item) => ({
              value: String(item.NUM_DOCTYPE_ID),
              label: item.VAR_DOCTYPE_NAME,
            })),
          );
        } else {
          setDocTypeOptions([]);
        }
      } catch (err) {
        console.error("Doc Type dropdown error:", err);
        setDocTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocTypes();
  }, []);

  useEffect(() => {
    if (isUpdate && docTypeIdFromState && docTypeOptions.length > 0) {
      setValue("docTypeId", String(docTypeIdFromState));
    }
  }, [isUpdate, docTypeIdFromState, docTypeOptions, setValue]);

  const onFormSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("UserId or UlbId is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_Mode: isUpdate ? 2 : 1,
        in_DocsubtypeId: isUpdate ? Number(docSubTypeIdFromState) : null,
        in_DocId: Number(data.docTypeId),
        in_DocsubtypeName: data.subDocName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_docsubtype_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        reset({ docTypeId: "", subDocName: "" });
        navigate("/Masters/FrmDocumentSubTypeList", { replace: true });
      } else {
        alert(res?.data?.errorMessage || "Failed to save document sub type");
      }
    } catch (error) {
      console.error("Error saving doc sub type:", error);
      alert(error.message || "Failed to submit the form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Document Sub Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Document Sub Type Master",
      }}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="Doc Type : " required />
            <select
              disabled={isUpdate}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${isUpdate ? "bg-slate-100 text-slate-500 cursor-not-allowed pointer-events-none" : ""}
                ${errors.docTypeId ? "border-red-500" : ""}`}
              {...register("docTypeId", {
                required: "Doc Type is required",
              })}
            >
              <option value="">-- Select Doc Type --</option>
              {docTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.docTypeId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.docTypeId.message}
              </p>
            )}
          </div>

          <div>
            <Label text="Sub Doc Name : " required />
            <input
              type="text"
              placeholder="Enter sub document name"
              className={`form-input-box ${
                errors.subDocName ? "border-red-500" : ""
              }`}
              {...register("subDocName", {
                required: "Sub Doc Name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Sub Doc Name cannot be empty",
              })}
            />
            {errors.subDocName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subDocName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-3">
          <Button type="submit" disabled={isSubmitting}>
            {isUpdate ? "Update" : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate("/Masters/FrmDocumentSubTypeList", { replace: true })
            }
          >
            Cancel
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmDocumentSubTypeMaster;
