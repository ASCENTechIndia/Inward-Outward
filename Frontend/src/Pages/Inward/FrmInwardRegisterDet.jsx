import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { useLoader } from "../../Context/LoaderContext";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import * as XLSX from "xlsx";

const emptyAttachDocRow = {
  srNo: "",
  date: "",
  documentName: "",
  view: "",
};

const FrmInwardRegisterDet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoader();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { inwardNo } = location.state || {
    inwardNo: "",
  };

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      applicationId: "",
      date: "",
      sender: "",
      subType: "",
      documentType: "",
      documentSubType: "",
      refNumber: "",
      refDate: "",
      applicantName: "",
      prabhagId: "",
      from: "",
      email: "",
      address: "",
      mobileNumber: "",
      subject: "",
      letterType: "",
      inwardType: "",
      attachmentDocs: [{ ...emptyAttachDocRow }],
      method: "",
      remark: "",
      documentUpload: "",
    },
  });

  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const [senderOptions, setSenderOptions] = useState([
    { label: "Test Sender", value: "1" },
  ]);

  const [subTypeOptions, setSubTypeOptions] = useState([
    { label: "Test subType", value: "1" },
  ]);

  const [documentTypeOptions, setDocumentTypeOptions] = useState([
    { label: "Test documentType", value: "1" },
  ]);

  const [documentSubTypeOptions, setDocumentSubTypeOptions] = useState([
    { label: "Test documentSubType", value: "1" },
  ]);

  const [prabhagOptions, setPrabhagOptions] = useState([
    { label: "Test Prabhag", value: "1" },
  ]);

  const [letterTypeOptions, setLetterTypeOptions] = useState([
    { label: "Test letterType", value: "1" },
  ]);

  const [inwardTypeOptions, setInwardTypeOptions] = useState([
    { label: "Test InwardType", value: "1" },
  ]);

  const [actionOptions, setActionOptions] = useState([
    { label: "Forward", value: "1" },
    { label: "Transfer", value: "2" },
    { label: "ReturnToInward", value: "3" },
    { label: "Close", value: "4" },
  ]);

  const fetchApplicationDetails = async (appNo) => {
    try {
      setLoading(true);

      const response = await apiService.post("", {
        appNo,
      });

      if (response.data.success && response.data.data.length > 0) {
        const data = response.data.data[0];
        setValue("applicationId", data.id);
        setValue("date", data.date);
        setValue("sender", data.sender);
        setValue("subType", data.subType);
        setValue("documentType", data.docType);
        setValue("documentSubType", data.docSubType);
        setValue("refNumber", data.refno);
        setValue("refDate", data.refdate);
        setValue("applicantName", data.applName);
        setValue("prabhagId", data.prabhag);
        setValue("from", data.from);
        setValue("email", data.email);
        setValue("address", data.address);
        setValue("mobileNumber", data.mobile);
        setValue("subject", data.sub);
        setValue("letterType", data.letter);
        setValue("inwardType", data.invType);
        setValue("method", data.action);
        setValue("remark", data.remark);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      console.log(data);

      const payload = {};

      const response = await apiService.post("", payload);

      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ulbid && inwardNo) {
      fetchApplicationDetails(inwardNo);
    }
  }, [ulbid, inwardNo]);

  return (
    <Layout
      title="आवक नोंदणी स्क्रीन"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Invard Entry",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label text="अनुक्रमांक: " />
            <input
              type="text"
              placeholder="Enter inward number"
              className={`form-input-box`}
              {...register("applicationId")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="दिनांक : " />
            <input
              type="date"
              className={`form-input-box`}
              {...register("date")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="पाठवणारा : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      ${errors.sender ? "border-red-500" : ""}`}
              {...register("sender", {
                required: "पाठवणारा आवश्यक आहे",
              })}
              disabled={true}
            >
              <option value="">-- Select --</option>
              {senderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.sender && (
              <p className="text-sm text-red-500 mt-1">
                {errors.sender.message}
              </p>
            )}
          </div>
          <div>
            <Label text="उपप्रकार : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                                          focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                          ${errors.subType ? "border-red-500" : ""}`}
              {...register("subType", {
                required: "उपप्रकार आवश्यक आहे",
              })}
              disabled={true}
            >
              <option value="">-- Select --</option>
              {subTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.subType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subType.message}
              </p>
            )}
          </div>
          <div>
            <Label text="दस्तऐवजचे प्रकार : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                                          focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                          ${errors.documentType ? "border-red-500" : ""}`}
              {...register("documentType", {
                required: "दस्तऐवजचे प्रकार आवश्यक आहे",
              })}
              disabled={true}
            >
              <option value="">-- Select --</option>
              {documentTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.documentType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.documentType.message}
              </p>
            )}
          </div>
          <div>
            <Label text="दस्तऐवजचे उपप्रकार : " />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
              {...register("documentSubType")}
              disabled={true}
            >
              <option value="">-- Select --</option>
              {documentSubTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="संदर्भ क्रमांक : " />
            <input
              type="text"
              placeholder="Enter reference number"
              className={`form-input-box`}
              {...register("refNumber")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="संदर्भ दिनांक : " />
            <input
              type="date"
              className={`form-input-box`}
              {...register("refDate")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="अर्जदाराचे नाव : " required />
            <input
              type="text"
              placeholder="Enter applicant name"
              className={`form-input-box ${errors.applicantName ? "border-red-500" : ""}`}
              {...register("applicantName", {
                required: "अर्जदाराचे नाव आवश्यक आहे",
              })}
              disabled={true}
            />
            {errors.applicantName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.applicantName.message}
              </p>
            )}
          </div>
          <div>
            <Label text="प्रभाग क्रमांक" />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
              {...register("prabhagId")}
              disabled={true}
            >
              <option value="">-- SELECT OPTION --</option>
              {prabhagOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="पासून : " />
            <input
              type="text"
              placeholder="Enter from"
              className={`form-input-box`}
              {...register("from")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="इमेल : " />
            <input
              type="email"
              placeholder="Enter email"
              className={`form-input-box`}
              {...register("email")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="पत्ता : " />
            <input
              type="text"
              placeholder="Enter address"
              className={`form-input-box`}
              {...register("address")}
              disabled={true}
            />
          </div>
          <div>
            <Label text="मोबाईल क्र : " />
            <input
              type="text"
              placeholder="Enter mobile number"
              className={`form-input-box`}
              {...register("mobileNumber")}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              maxLength={10}
              disabled={true}
            />
          </div>
          <div>
            <Label text="विषय" required />
            <input
              type="text"
              className={`form-input-box ${errors.subject ? "border-red-500" : ""}`}
              disabled={true}
            />
            {errors.subject && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <Label text="पत्र प्रकार : " />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                                          focus:outline-none focus:ring-2 focus:ring-blue-500/40
                                         `}
              {...register("letterType")}
              disabled={true}
            >
              <option value="">-- Select --</option>
              {letterTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text={"आवकचे प्रकार"} required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40
                      ${errors.inwardType ? "border-red-500" : ""}`}
              {...register("inwardType", {
                required: "आवकचे प्रकार आवश्यक आहे",
              })}
              disabled={true}
            >
              <option value="">-- Select --</option>
              {inwardTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.inwardType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.inwardType.message}
              </p>
            )}
          </div>
          <div>
            <Label text="संलग्नक" />
            <div>
              <Button
                type="button"
                onClick={() => {
                  setShowDocumentsModal(true);
                }}
              >
                View
              </Button>
            </div>
          </div>
          <div>
            <Label text="कृती : " />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/40`}
              {...register("method")}
            >
              <option value="">-- SELECT OPTION --</option>
              {actionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label text="शेरा : " required />
            <input
              type="text"
              placeholder="Enter remark"
              className={`form-input-box ${errors.remark ? "border-red-500" : ""}`}
              {...register("remark", {
                required: "शेरा आवश्यक आहे",
              })}
            />
            {errors.remark && (
              <p className="text-sm text-red-500 mt-1">
                {errors.remark.message}
              </p>
            )}
          </div>
          <div>
            <Label text="Document Upload : " />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("documentUpload")}
              className="w-full px-3 py-2 rounded-lg border border-slate-300
    bg-white text-slate-700 text-sm
    file:mr-4 file:py-1.5 file:px-3 file:rounded-md
    file:border-0 file:bg-slate-100 file:text-slate-700
    file:font-medium file:text-sm
    hover:file:bg-slate-200
    focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button type="submit">साठवा</Button>
          <Button type="button" variant="secondary" onClick={reset}>
            बदल
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmInwardRegisterDet;
