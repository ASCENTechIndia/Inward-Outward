import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../../Components/Layout";
import Label from "../../../Components/Label";
import Button from "../../../Components/Button";
import apiService from "../../../../apiService";
import { useAuth } from "../../../Context/AuthContext";
import { useLoader } from "../../../Context/LoaderContext";
import GetIPAddress from "../../../utils/ipHelper";
import config from "../../../utils/config";

const FrmDocTypeMaster = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const docTypeIdFromState = state?.docTypeId;
  const isUpdate = !!docTypeIdFromState;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      docTypeId: "",
      docTypeName: "",
    },
  });

  const fetchDocTypeDetail = async () => {
    if (!docTypeIdFromState) {
      alert("Doc type Id is not set");
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post("getDodTypeDetails", {
        docTypeId: Number(docTypeIdFromState),
      });

      if (res?.data?.success && res?.data?.data?.length > 0) {
        const data = res.data.data[0];
        reset({
          docTypeId: data.NUM_DOCTYPE_ID,
          docTypeName: data.VAR_DOCTYPE_NAME || "",
        });
      } else {
        reset({ docTypeId: "", docTypeName: "" });
        alert(res?.data?.errorMessage || res?.data?.message || "Document type Id is missing");
      }
    } catch (error) {
      reset({ docTypeId: "", docTypeName: "" });
      console.error("Error fetching doc type detail:", error);
      alert("Failed to fetch doc type details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docTypeIdFromState) {
      fetchDocTypeDetail();
    }
  }, [docTypeIdFromState]);

  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("UlbId or userId is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_UserId: userId,
        in_Mode: isUpdate ? 2 : 1,
        in_DoctypeId: isUpdate ? Number(docTypeIdFromState) : null,
        in_DoctypeName: data.docTypeName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      console.log("Doc Type payload:", payload);

      const res = await apiService.post("aoio_doctype_ins", payload);
      console.log("Doc Type save response:", res);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Masters/FrmDocTypeList");
      } else {
        alert(res?.data?.errorMessage || res?.data?.message || "Failed to save doc type");
      }
    } catch (error) {
      console.error("Error saving doc type:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Document Type Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Document Type Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Doc Type Id : " />
            <input
              type="text"
              disabled
              placeholder="Doc type ID"
              className="form-input-box bg-slate-100 text-slate-500 cursor-not-allowed"
              {...register("docTypeId")}
            />
          </div>

          <div>
            <Label text="Doc Type Name : " required />
            <input
              type="text"
              placeholder="Enter doc type name"
              className={`form-input-box ${
                errors.docTypeName ? "border-red-500" : ""
              }`}
              {...register("docTypeName", {
                required: "Doc type name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Doc type name cannot be empty",
              })}
            />
            {errors.docTypeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.docTypeName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmDocTypeList")}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isUpdate ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmDocTypeMaster;
