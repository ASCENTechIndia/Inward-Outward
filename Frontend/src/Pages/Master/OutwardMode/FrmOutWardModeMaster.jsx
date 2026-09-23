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

const FrmOutWardModeMaster = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const outwardModeIdFromState = state?.outwardModeId;
  const isUpdate = !!outwardModeIdFromState;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      outwardModeId: "",
      outwardModeName: "",
    },
  });

  const fetchOutwardModeDetail = async () => {
    if (!outwardModeIdFromState) {
      alert("Ourward mode id is missing");
      return;
    }

    try {
      setLoading(true);

      const res = await apiService.post("getOutwardDetails", {
        outwardModeId: Number(outwardModeIdFromState),
      });

      if (res?.data?.success && res?.data?.data?.length > 0) {
        const data = res.data.data[0];
        reset({
          outwardModeId: data.NUM_OUTWARDMODE_ID,
          outwardModeName: data.VAR_OUTWARDMODE_NAME || "",
        });
      } else {
        reset({ outwardModeId: "", outwardModeName: "" });
        alert(res?.data?.errorMessage || res?.data?.message || "Ourward Id is missing");
      }
    } catch (error) {
      console.error("Error fetching outward mode detail:", error);
      reset({ outwardModeId: "", outwardModeName: "" });
      alert(error.message || "Failed to fetch outward mode details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (outwardModeIdFromState) {
      fetchOutwardModeDetail();
    }
  }, [outwardModeIdFromState]);

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
        in_outwardmodeId: isUpdate ? Number(outwardModeIdFromState) : null,
        in_outwardmodeName: data.outwardModeName.trim(),
        in_UlbId: Number(ulbid),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_outwardmode_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Masters/FrmOutWardModeList");
      } else {
        alert(res?.data?.errorMessage || "Failed to save outward mode");
      }
    } catch (error) {
      console.error("Error saving outward mode:", error);
      alert(error.message || "API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Outward Mode Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Outward Mode Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Outward Mode Id : " />
            <input
              type="text"
              disabled
              placeholder="Outward mode ID"
              className="form-input-box bg-slate-100 text-slate-500 cursor-not-allowed"
              {...register("outwardModeId")}
            />
          </div>

          <div>
            <Label text="Outward Mode Name : " required />
            <input
              type="text"
              placeholder="Enter outward mode name"
              className={`form-input-box ${
                errors.outwardModeName ? "border-red-500" : ""
              }`}
              {...register("outwardModeName", {
                required: "Outward mode name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Outward mode name cannot be empty",
              })}
            />
            {errors.outwardModeName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.outwardModeName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmOutWardModeList")}
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

export default FrmOutWardModeMaster;
