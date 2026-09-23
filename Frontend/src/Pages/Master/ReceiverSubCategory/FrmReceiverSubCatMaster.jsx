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

const FrmReceiverSubCatMaster = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.userId;
  const { setLoading } = useLoader();

  const receiverCategoryIdFromState = state?.receiverCategoryId;
  const receiverSubCatIdFromState = state?.receiverSubCatId;
  const receiverSubCatNameFromState = state?.receiverSubCatName;

  const isUpdate = !!receiverSubCatIdFromState;

  const [categoryOptions, setCategoryOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      categoryId: "",
      subCatName: "",
    },
  });

  const fetchCategoryDropdown = async () => {
    try {
      setLoading(true);
      const res = await apiService.get("getReciverCategoryDropdown");

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const options = res.data.data.map((item) => ({
          value: String(item.NUM_RECEIVERCATEGORY_ID),
          label: item.VAR_RECEIVERCATEGORY_NAME,
        }));
        setCategoryOptions(options);
      } else {
        setCategoryOptions([]);
      }
    } catch (error) {
      console.error("Error fetching category dropdown:", error);
      alert(error.message || "Failed to fetch category dropdown.");
      setCategoryOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDropdown();
  }, []);

  useEffect(() => {
    if (
      receiverCategoryIdFromState &&
      receiverSubCatNameFromState &&
      categoryOptions?.length > 0
    ) {
      setValue("categoryId", String(receiverCategoryIdFromState));
      setValue("subCatName", receiverSubCatNameFromState);
    }
  }, [
    receiverCategoryIdFromState,
    receiverSubCatNameFromState,
    categoryOptions,
  ]);

  const onSubmit = async (data) => {
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
        in_reccatid: Number(data.categoryId),
        in_subreccatid: isUpdate ? Number(receiverSubCatIdFromState) : null,
        in_subreccatname: data.subCatName.trim(),
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post(
        "aoio_receiversubcategory_ins",
        payload,
      );

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        navigate("/Masters/FrmReceiverSubCatList");
      } else {
        alert(
          res?.data?.errorMessage ||
            res?.data?.errorMessage || res?.data?.message ||
            "Failed to save sub category",
        );
      }
    } catch (error) {
      console.error("Error saving sub category:", error);
      alert(error.message || "Failed to save sub category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Receiver Sub Category Master"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Receiver Sub Category Master",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="Receiver Category : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.categoryId ? "border-red-500" : ""}`}
              {...register("categoryId", {
                required: "Receiver category is required",
              })}
            >
              <option value="">-- Select Category --</option>
              {categoryOptions.map((opt, idx) => (
                <option key={`${opt.value}-${idx}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <Label text="Sub Category Name : " required />
            <input
              type="text"
              placeholder="Enter sub category name"
              className={`form-input-box ${
                errors.subCatName ? "border-red-500" : ""
              }`}
              {...register("subCatName", {
                required: "Sub category name is required",
                validate: (v) =>
                  v.trim().length > 0 || "Sub category name cannot be empty",
              })}
            />
            {errors.subCatName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subCatName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/Masters/FrmReceiverSubCatList")}
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

export default FrmReceiverSubCatMaster;
