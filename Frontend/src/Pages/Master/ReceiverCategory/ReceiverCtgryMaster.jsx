import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { useForm } from "react-hook-form";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";


const ReceiverCtgryMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [searchParams] = useSearchParams();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const collectionCenterId = user?.collcenterid;
  const deptId = user?.deptId;
  const designationId = user?.desigId;

  const { mode, receiverCategoryId, receiverCategory } = location.state || { 
    mode: 1,
    receiverCategoryId: ""
  }

  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      categoryId: "",
      categoryName: "",
    }
  });

  const onFormSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        "ulbid": Number(ulbid),
        "catId": Number(data.categoryId),
        "catName": data.categoryName,
        "in_mode": mode
      };

      // const response = await apiService.post("", payload);

      // if (response.data.success && response.data.data.errorCode === -100) {
      //   alert(response.data.message);
      //   reset({
      //     categoryId: "",
      //     categoryName: ""
      //   });

      //   navigate("/Masters/FrmReceiverCtgryList", {
      //     replace: true
      //   });
      // } else {
      //   alert("Error submitting the form");
      // }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to submit the form"); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (mode === 2) {
      setValue("categoryId", receiverCategoryId);
      setValue("categoryName", receiverCategory);
    }
  }, [mode]);
  return (
    <Layout
      title={"Receiver Category Master"}
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Receiver Category Master"
      }}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-6" >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label 
              text={"Receiver Category ID: "}
            />
            <input 
              type="text" 
              {...register("categoryId")}
              className="form-input-box"
              disabled={true}
            />
          </div>
          <div>
            <Label 
              text={"Receiver Category Name: "}
            />
            <input 
              type="text"
              className="form-input-box"
              {...register("categoryName")}
            />            
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-3">
          <Button
            type="submit"
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={() => {
              navigate("/Masters/FrmReceiverCtgryList", {
                replace: true
              })
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Layout>
  )
};

export default ReceiverCtgryMaster;
