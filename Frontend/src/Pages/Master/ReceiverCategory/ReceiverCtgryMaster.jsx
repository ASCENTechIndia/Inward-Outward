import React, { useEffect } from "react";
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

const ReceiverCtgryMaster = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;

  const receiverCategoryIdFromState = state?.receiverCategoryId;
  const isUpdate = !!receiverCategoryIdFromState;

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      categoryId: "",
      categoryName: "",
    },
  });

  useEffect(() => {
    if (!isUpdate) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);

        const res = await apiService.post("getReceiverDetails", {
          receiverId: Number(receiverCategoryIdFromState),
        });

        if (
          res?.data?.success &&
          Array.isArray(res.data.data) &&
          res.data.data.length > 0
        ) {
          const data = res.data.data[0];
          reset({
            categoryId: data.NUM_RECEIVERCATEGORY_ID,
            categoryName: data.VAR_RECEIVERCATEGORY_NAME || "",
          });
        } else {
          reset({ categoryId: "", categoryName: "" });
        }
      } catch (error) {
        console.error("Error fetching receiver details:", error);
        reset({ categoryId: "", categoryName: "" });
        alert("Failed to fetch receiver details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isUpdate, receiverCategoryIdFromState]);

  const onFormSubmit = async (data) => {
    if (!userId) {
      alert("UserId is not set");
      return;
    }

    try {
      setLoading(true);
      const ip = await GetIPAddress();

      const payload = {
        in_user_id: userId,
        in_mode: isUpdate ? 2 : 1,
        in_receivercategory_id: isUpdate
          ? Number(receiverCategoryIdFromState)
          : null,
        in_receivercategory_name: data.categoryName.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_receivercategory_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        reset({ categoryId: "", categoryName: "" });
        navigate("/Masters/FrmReceiverCtgryList", { replace: true });
      } else {
        alert(res?.data?.errorMessage || "Failed to save receiver category");
      }
    } catch (error) {
      console.error("Error saving receiver category:", error);
      alert(error.message || "Failed to submit the form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Receiver Category Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Receiver Category Master",
      }}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="Receiver Category ID : " />
            <input
              type="text"
              {...register("categoryId")}
              className="form-input-box bg-slate-100 text-slate-500 cursor-not-allowed"
              disabled={true}
              placeholder="Receiver Category Id"
            />
          </div>

          <div>
            <Label text="Receiver Category Name : " required />
            <input
              type="text"
              className={`form-input-box ${
                errors.categoryName ? "border-red-500" : ""
              }`}
              placeholder="Enter category name"
              {...register("categoryName", {
                required: "Receiver category name is required",
                validate: (v) =>
                  v.trim().length > 0 ||
                  "Receiver category name cannot be empty",
              })}
            />
            {errors.categoryName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-3">
          <Button type="submit" disabled={isSubmitting}>
            {isUpdate ? "Update" : "Save"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              navigate("/Masters/FrmReceiverCtgryList", { replace: true })
            }
          >
            Cancel
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default ReceiverCtgryMaster;
