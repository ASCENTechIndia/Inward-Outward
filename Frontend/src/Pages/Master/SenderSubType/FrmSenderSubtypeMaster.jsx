import React, { useEffect, useState } from "react";
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

const FrmSenderSubtypeMaster = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  // senderId passed from list page → presence = update context
  const senderIdFromState = state?.senderId;
  const senderSubTypeId = state?.senderSubTypeId;
  const subTypeName = state?.subTypeName;
  const senderStatus = state?.status;
  const isUpdate = !!senderIdFromState;

  const [senderOptions, setSenderOptions] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      senderId: "",
      subSenderName: "",
      status: "",
    },
  });

  // ================= FETCH SENDER DROPDOWN (options only) =================
  const fetchSenderDropdown = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getSenderTypeDropdown");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const options = res.data.data.map((item) => ({
          value: String(item.NUM_SENDER_ID),
          label: item.VAR_SENDER_NAME,
        }));
        setSenderOptions(options);
      } else {
        setSenderOptions([]);
      }
    } catch (error) {
      setSenderOptions([]);
      console.error("Error fetching sender dropdown:", error);
      alert("Failed to fetch sender dropdown.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSenderDropdown();
  }, []);

  useEffect(() => {
    if (senderIdFromState && senderOptions?.length > 0) {
      setValue("senderId", String(senderIdFromState));
      setValue("subSenderName", subTypeName);
      setValue("status", senderStatus === "Active" ? "Y" : "N");
    }
  }, [senderIdFromState, senderOptions, setValue]);

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
        in_Mode: senderIdFromState ? 2 : 1,
        in_SendersubtypeId: senderSubTypeId ? senderSubTypeId : null,
        in_Sstsenderid: Number(data.senderId),
        in_SendersubtypeName: data.subSenderName.trim(),
        in_SendersubtypeFlag: data.status,
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_sendersubtype_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Masters/FrmSenderSubtypeList");
      } else {
        alert(
          res?.data?.errorMessage ||
            res?.data?.errorMessage || res?.data?.message ||
            "Failed to save sub sender",
        );
      }
    } catch (error) {
      console.error("Error saving subtype:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Sender Subtype Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sender Subtype Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label text="Sender : " required />
            <select
              disabled={isUpdate}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${isUpdate ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}
                ${errors.senderId ? "border-red-500" : ""}`}
              {...register("senderId", {
                required: "Sender is required",
              })}
            >
              <option value="">-- Select Sender --</option>
              {senderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.senderId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.senderId.message}
              </p>
            )}
          </div>

          <div>
            <Label text="Sub Sender Name : " required />
            <input
              type="text"
              placeholder="Enter sub sender name"
              className={`form-input-box ${
                errors.subSenderName ? "border-red-500" : ""
              }`}
              {...register("subSenderName", {
                required: "Sub sender name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Sub sender name cannot be empty",
              })}
            />
            {errors.subSenderName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subSenderName.message}
              </p>
            )}
          </div>

          <div>
            <Label text="Status : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.status ? "border-red-500" : ""}`}
              {...register("status", {
                required: "Status is required",
              })}
            >
              <option value="">-- Select Status --</option>
              <option value="Y">Active</option>
              <option value="N">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmSenderSubtypeList")}
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

export default FrmSenderSubtypeMaster;
