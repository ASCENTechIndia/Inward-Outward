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

const FrmInwardModeMaster = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const inwardModeIdFromState = state?.inwardModeId;
  const isUpdate = !!inwardModeIdFromState;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      inwardModeId: "",
      inwardModeName: "",
    },
  });

  const fetchInwardModeDetail = async () => {
    if (!inwardModeIdFromState) {
      alert("Inward mode Id is missing");
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post("getInwardDetails", {
        inwardModeId: Number(inwardModeIdFromState),
      });

      if (res?.data?.success && res?.data?.data?.length > 0) {
        const data = res.data.data[0];
        reset({
          inwardModeId: data.NUM_INWARDMODE_ID,
          inwardModeName: data.VAR_INWARDMODE_NAME || "",
        });
      } else {
        reset({ inwardModeId: "", inwardModeName: "" });
        alert(res?.data?.errorMessage || res?.data?.message || "Inward mode Id is missing");
      }
    } catch (error) {
      console.error("Error fetching inward mode detail:", error);
      reset({ inwardModeId: "", inwardModeName: "" });
      alert("Failed to fetch inward mode details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inwardModeIdFromState) {
      fetchInwardModeDetail();
    }
  }, [inwardModeIdFromState]);

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
        in_inwardmodeId: isUpdate ? Number(inwardModeIdFromState) : null,
        in_inwardmodeName: data.inwardModeName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_inwardmodemas_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Masters/FrmInwardModeList");
      } else {
        alert(res?.data?.errorMessage || res?.data?.message || "Failed to save inward mode");
      }
    } catch (error) {
      console.error("Error saving inward mode:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Inward Mode Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Inward Mode Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Inward Mode Id : " />
            <input
              type="text"
              disabled
              placeholder="Inward Mode Id"
              className="form-input-box bg-slate-100 text-slate-500 cursor-not-allowed"
              {...register("inwardModeId")}
            />
          </div>

          <div>
            <Label text="Inward Mode Name : " required />
            <input
              type="text"
              placeholder="Enter inward mode name"
              className={`form-input-box ${
                errors.inwardModeName ? "border-red-500" : ""
              }`}
              {...register("inwardModeName", {
                required: "Inward mode name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Inward mode name cannot be empty",
              })}
            />
            {errors.inwardModeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.inwardModeName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmInwardModeList")}
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

export default FrmInwardModeMaster;
