import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Label from "../../../Components/Label";
import Layout from "../../../Components/Layout";
import Button from "../../../Components/Button";
import { useForm } from "react-hook-form";
import apiService from "../../../../apiService";
import { useLoader } from "../../../Context/LoaderContext";
import { useAuth } from "../../../Context/AuthContext";

const FrmDocumentSubTypeMaster = () => {
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

  const {
    register,
    watch,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      docType: "",
      subDocName: ""
    }
  });

  const { mode, docTypeId, docSubTypeId, docSubTypeName } = location.state || {
    mode: 1,
    docTypeId: "",
    docSubTypeId: "",
    docSubTypeName: ""
  };

  const onFormSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {};

      // const response = await apiService.post("", payload);

      // if (response.data.success && response.data.data.errorCode === -100) {
      //   alert(response.data.message);
      //   reset({
      //     categoryId: "",
      //     categoryName: ""
      //   });

      //   navigate("/Masters/FrmDocumentSubTypeList", {
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
      setValue("docType", docTypeId);
      setValue("subDocName", docSubTypeName);
    }
  }, [mode]);



  return (
    <Layout
      title={"Sender Sub Type Master"}
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sender Sub Type Master"
      }}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text={"Doc Type: "} />
            <input
              type="text"
              {...register("docType")}
              className="form-input-box"
            />
          </div>
          <div>
            <Label text={"Sub Doc Name: "} />
            <input
              type="text"
              {...register("subDocName")}
              className="form-input-box"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-3">
          <Button
            type="submit"
          >Save</Button>
          <Button
            type="button"
            onClick={() => {
              navigate("/Masters/FrmDocumentSubTypeList", {
                replace: true
              })
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmDocumentSubTypeMaster;
