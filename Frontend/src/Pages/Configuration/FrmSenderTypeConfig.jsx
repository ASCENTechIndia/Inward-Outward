import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Layout from "../../Components/Layout";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import ConfigTable from "../../Components/ConfigTable.jsx";
import apiService from "../../../apiService.js";
import { useAuth } from "../../Context/AuthContext";
import { useLoader } from "../../Context/LoaderContext";
import GetIPAddress from "../../utils/ipHelper";
import config from "../../utils/config.jsx";

const TABLE_KEY_MAPPING = {
  id: "COMPLAINID",
  columns: {
    VAR_SENDER_NAME: "Complain Type Name",
  },
};

const FrmSenderTypeConfig = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  const [checkedMap, setCheckedMap] = useState({});

  const [prevStatusMap, setPrevStatusMap] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ulbId: "" },
  });

  const watchUlbId = watch("ulbId");

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
    setTableRows([]);
    setCheckedMap({});
    setPrevStatusMap({});

    if (!watchUlbId) return;

    const fetchConfigData = async () => {
      try {
        setLoading(true);

        // Fetch both table data and selected ids
        const [tableRes, selectedRes] = await Promise.all([
          apiService.get("getSenderTypeConfigTableData"),
          apiService.post("getSenderTypeConfigSelectedIds", {
            ulbId: Number(watchUlbId),
          }),
        ]);

        // table data
        let rows = [];
        if (
          tableRes?.data?.success &&
          Array.isArray(tableRes?.data?.data) &&
          tableRes?.data?.data?.length > 0
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
          Array.isArray(selectedRes?.data?.data) &&
          selectedRes?.data?.data?.length > 0
        ) {
          selectedRes.data.data.forEach((item) => {
            if (item.COMPTYPECONFIGID != null) {
              selectedIds.add(Number(item.COMPTYPECONFIGID));
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
  }, [watchUlbId]);

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
    if (!userId) {
      alert("User Id is not set");
      return;
    }

    try {
      setLoading(true);

      // String format: COMPLAINID#prevStatus#currentStatus$...
      const in_sendertypestr = tableRows
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
        ulbId: Number(data.ulbId),
        in_sendertypestr: in_sendertypestr,
        in_mode: 2,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_sendertypeconfig_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        setTableRows([]);
        setCheckedMap({});
        setPrevStatusMap({});
        setValue("ulbId", "");
      } else {
        alert(res?.data?.errorMessage || "Failed to update configuration");
      }
    } catch (error) {
      console.error("Error saving sender type config:", error);
      alert("API Error — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Sender Type Configuration"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Sender Type Configuration",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default FrmSenderTypeConfig;
