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

const FrmSenderMaster = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const { state } = useLocation();
  const { user } = useAuth();

  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const senderId = state?.senderId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      senderId: "",
      senderName: "",
    },
  });

  const fetchSenderDetail = async () => {
    if (!senderId) {
      alert("Sender Id is not present");
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post("getSenderDetail", {
        senderId: Number(senderId),
      });

      if (res?.data?.success && res?.data?.data?.length > 0) {
        const data = res.data.data[0];
        reset({
          senderId: data.NUM_SENDER_ID,
          senderName: data.VAR_SENDER_NAME || "",
        });
      } else {
        reset({ senderId: "", senderName: "" });
        alert(
          res?.data?.errorMessage ||
            res?.data?.errorMessage || res?.data?.message ||
            "Sender Id is missing",
        );
      }
    } catch (error) {
      console.error("Error fetching sender detail:", error);
      reset({ senderId: "", senderName: "" });
      alert("Failed to fetch sender details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (senderId) {
      fetchSenderDetail();
    }
  }, [senderId]);

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
        in_Mode: senderId ? 2 : 1,
        in_SenderId: senderId ? Number(senderId) : null,
        in_SenderName: data.senderName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_sender_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Masters/FrmSenderList");
      } else {
        alert(res?.data?.errorMessage || res?.data?.message || "Failed to save sender");
      }
    } catch (error) {
      console.error("Error saving sender:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Sender Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sender Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Sender Id : " />
            <input
              type="text"
              disabled
              placeholder="Sender ID"
              className="form-input-box bg-slate-100 text-slate-500 cursor-not-allowed"
              {...register("senderId")}
            />
          </div>

          <div>
            <Label text="Sender Name : " required />
            <input
              type="text"
              placeholder="Enter sender name"
              className={`form-input-box ${
                errors.senderName ? "border-red-500" : ""
              }`}
              {...register("senderName", {
                required: "Sender name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Sender name cannot be empty",
              })}
            />
            {errors.senderName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.senderName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmSenderList")}
          >
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {senderId ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmSenderMaster;
