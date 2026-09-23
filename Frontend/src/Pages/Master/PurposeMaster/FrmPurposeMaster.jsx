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

const FrmPurposeMaster = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const purposeIdFromState = state?.purposeId;
  const isUpdate = !!purposeIdFromState;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      purposeId: "",
      purposeName: "",
    },
  });

  const fetchPurposeDetail = async () => {
    if (!purposeIdFromState) {
      alert("Purpose Id is not set");
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post("gerPurposeMasterDetails", {
        purposeId: Number(purposeIdFromState),
      });

      if (res?.data?.success && res?.data?.data?.length > 0) {
        const data = res.data.data[0];
        reset({
          purposeId: data.NUM_PURPOSE_ID,
          purposeName: data.VAR_PURPOSE_NAME || "",
        });
      } else {
        reset({ purposeId: "", purposeName: "" });
        alert(
          res?.data?.errorMessage ||
            res?.data?.message ||
            "Purpose Id is missing",
        );
      }
    } catch (error) {
      console.error("Error fetching purpose detail:", error);
      reset({ purposeId: "", purposeName: "" });
      alert("Failed to fetch purpose details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (purposeIdFromState) {
      fetchPurposeDetail();
    }
  }, [purposeIdFromState]);

  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("UlbId or userId is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_user_id: userId,
        in_mode: isUpdate ? 2 : 1,
        in_purpose_id: isUpdate ? Number(purposeIdFromState) : null,
        in_purpose_name: data.purposeName.trim(),
        in_ulbid: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_purpose_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Masters/FrmPurposeMasterList");
      } else {
        alert(
          res?.data?.errorMessage ||
            res?.data?.message ||
            "Failed to save purpose",
        );
      }
    } catch (error) {
      console.error("Error saving purpose:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Purpose Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Purpose Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Purpose Id : " />
            <input
              type="text"
              disabled
              placeholder="Purpose ID"
              className="form-input-box bg-slate-100 text-slate-500 cursor-not-allowed"
              {...register("purposeId")}
            />
          </div>

          <div>
            <Label text="Purpose Name : " required />
            <input
              type="text"
              placeholder="Enter purpose name"
              className={`form-input-box ${
                errors.purposeName ? "border-red-500" : ""
              }`}
              {...register("purposeName", {
                required: "Purpose name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Purpose name cannot be empty",
              })}
            />
            {errors.purposeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.purposeName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmPurposeMasterList")}
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

export default FrmPurposeMaster;
