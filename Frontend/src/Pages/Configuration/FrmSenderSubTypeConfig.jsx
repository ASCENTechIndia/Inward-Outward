import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import { useAuth } from "../../Context/AuthContext";
import { useLoader } from "../../Context/LoaderContext";
import ConfigTable from "../../Components/ConfigTable.jsx";
import apiService from "../../../apiService.js";
import GetIPAddress from "../../utils/ipHelper.jsx";
import config from "../../utils/config.jsx";

const FrmSenderSubTypeConfig = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [senderTypeOptions, setSenderTypeOptions] = useState([]);

  const [tableRows, setTableRows] = useState([]);
  const [checkedMap, setCheckedMap] = useState({});
  const [prevStatusMap, setPrevStatusMap] = useState({});

  const TABLE_KEY_MAPPING = {
    id: "SENDSUBID",
    columns: {
      VAR_SENDERSUBTYPE_NAME: "Complain Type Name",
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ulbId: "", senderTypeId: "" },
  });

  const watchUlbId = watch("ulbId");
  const watchSenderTypeId = watch("senderTypeId");

  useEffect(() => {
    const fetchUlb = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("getUlbDropdown");

        if (res?.data?.success && Array.isArray(res.data.data)) {
          setUlbOptions(
            res.data.data.map((item) => ({
              value: String(item.CORPORATIONID),
              label: item.CORPORATIONNAME,
            })),
          );
        } else {
          setUlbOptions([]);
          alert(
            res?.data?.errorMessage ||
              res?.data?.message ||
              "Failed to load ULB dropdown",
          );
        }
      } catch (err) {
        console.error("ULB dropdown error:", err);
        alert(err.message || "Failed to load ULB dropdown");
        setUlbOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUlb();
  }, []);

  useEffect(() => {
    // Reset everything when ULB changes
    setSenderTypeOptions([]);
    setValue("senderTypeId", "");
    setTableRows([]);
    setCheckedMap({});
    setPrevStatusMap({});

    if (!watchUlbId) return;

    const fetchSenderTypes = async () => {
      try {
        setLoading(true);
        const res = await apiService.post("getSenderTypeDropdown", {
          ulbId: Number(watchUlbId),
        });

        if (res?.data?.success && Array.isArray(res.data.data)) {
          setSenderTypeOptions(
            res.data.data.map((item) => ({
              value: String(item.SENDERID),
              label: item.NAMES,
            })),
          );
        } else {
          alert(
            res?.data?.errorMessage ||
              res?.data?.message ||
              "Failed to load Sender type dropdown",
          );
          setSenderTypeOptions([]);
        }
      } catch (err) {
        console.error("Sender type dropdown error:", err);
        alert(err.message || "Failed to load Sender type dropdown");
        setSenderTypeOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSenderTypes();
  }, [watchUlbId]);

  useEffect(() => {
    if (!watchUlbId || !watchSenderTypeId) {
      setTableRows([]);
      setCheckedMap({});
      setPrevStatusMap({});
      return;
    }

    const fetchConfigData = async () => {
      try {
        setLoading(true);

        // Fetch BOTH 
        const [tableRes, selectedRes] = await Promise.all([
          apiService.post("getSenderSubTypeConfigTableData", {
            ulbId: Number(watchUlbId),
            senderId: Number(watchSenderTypeId),
          }),
          apiService.post("getSenderSubTypeConfigSelectedIds", {
            ulbId: Number(watchUlbId),
          }),
        ]);

        // TABLE DATA 
        let rows = [];
        if (
          tableRes?.data?.success &&
          Array.isArray(tableRes?.data?.data) &&
          tableRes.data.data.length > 0
        ) {
          rows = tableRes.data.data;
          setTableRows(rows);
        } else {
          setTableRows([]);
          setCheckedMap({});
          setPrevStatusMap({});
          return;
        }

        // SELECTED IDS 
        const selectedIds = new Set();
        if (
          selectedRes?.data?.success &&
          Array.isArray(selectedRes?.data?.data)
        ) {
          selectedRes.data.data.forEach((item) => {
            if (item.SENDSUBTYPCONFID != null) {
              selectedIds.add(Number(item.SENDSUBTYPCONFID));
            }
          });
        }

        const checked = {};
        const prev = {};
        rows.forEach((row) => {
          const id = row[TABLE_KEY_MAPPING.id]; 
          const isSelected = selectedIds.has(Number(id));

          checked[id] = isSelected;
          prev[id] = isSelected ? "Y" : "N";
        });
        setCheckedMap(checked);
        setPrevStatusMap(prev);
      } catch (err) {
        console.error("Config data fetch error:", err);
        alert(err.message || "Failed to load configuration data");
        setTableRows([]);
        setCheckedMap({});
        setPrevStatusMap({});
      } finally {
        setLoading(false);
      }
    };

    fetchConfigData();
  }, [watchUlbId, watchSenderTypeId]);

  const handleToggle = (id, checked) => {
    setCheckedMap((prev) => ({ ...prev, [id]: checked }));
  };

  const handleToggleAll = (checked) => {
    const newMap = {};
    const idKey = TABLE_KEY_MAPPING.id;
    tableRows.forEach((row) => {
      newMap[row[idKey]] = checked;
    });
    setCheckedMap(newMap);
  };

  const onSubmit = async (data) => {
    if (!userId || !ulbid) {
      alert("User Id or Ulb Id is not set");
      return;
    }

    try {
      setLoading(true);

      // String format: SENDSUBID#prevStatus#currentStatus$
      const in_sendersubtypestr = tableRows
        .map((row) => {
          const id = row[TABLE_KEY_MAPPING.id];
          const prevStatus = prevStatusMap[id] || "N";
          const currentStatus = checkedMap[id] ? "Y" : "N";
          return `${id}#${prevStatus}#${currentStatus}`;
        })
        .join("$");

      const ip = await GetIPAddress();

      const payload = {
        In_UserId: userId,
        ulbId: Number(ulbid),
        in_sendersubtypestr: in_sendersubtypestr,
        in_mode: 2,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post(
        "aoio_sendersubtypeconfig_ins",
        payload,
      );

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        setSenderTypeOptions([]);
        setValue("senderTypeId", "");
        setValue("ulbId", "");
        setTableRows([]);
        setCheckedMap({});
        setPrevStatusMap({});
      } else {
        alert(
          res?.data?.errorMessage ||
            res?.data?.message ||
            "Failed to update configuration",
        );
      }
    } catch (error) {
      console.error("Error saving config:", error);
      alert(error.message || "Failed to saving sender sub type configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Sender Sub Type Configuration"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sender Sub Type Configuration",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB */}
          <div>
            <Label text="ULB : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.ulbId ? "border-red-500" : ""}`}
              {...register("ulbId", { required: "ULB is required" })}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.ulbId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.ulbId.message}
              </p>
            )}
          </div>

          {/* Sender Type */}
          <div>
            <Label text="Sender Type : " required />
            <select
              disabled={!watchUlbId}
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${!watchUlbId ? "bg-slate-100 cursor-not-allowed" : ""}
                ${errors.senderTypeId ? "border-red-500" : ""}`}
              {...register("senderTypeId", {
                required: "Sender Type is required",
              })}
            >
              <option value="">
                {watchUlbId
                  ? "-- Select Sender Type --"
                  : "-- Select ULB first --"}
              </option>
              {senderTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.senderTypeId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.senderTypeId.message}
              </p>
            )}
          </div>
        </div>

        {tableRows?.length > 0 && (
          <ConfigTable
            rows={tableRows}
            checkedMap={checkedMap}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            tableKeyMapping={TABLE_KEY_MAPPING}
          />
        )}

        <div className="flex justify-center gap-3">
          <Button type="button" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || tableRows.length === 0}
          >
            Submit
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmSenderSubTypeConfig;
