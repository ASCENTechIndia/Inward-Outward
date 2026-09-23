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
import GetIPAddress from "../../utils/ipHelper.jsx";
import config from "../../utils/config.jsx";

const TABLE_KEY_MAPPING = {
  id: "DEPTID",
  columns: {
    DEPTNAME: "Department Name",
  },
};

const FrmOutWardUserConfig = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const ulbid = user?.ulbId;
  const { setLoading } = useLoader();

  const [ulbOptions, setUlbOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const [tableRows, setTableRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [checkedMap, setCheckedMap] = useState({});
  const [prevStatusMap, setPrevStatusMap] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ulbId: "", userId: "" },
  });

  const watchUserId = watch("userId");

  useEffect(() => {
    const fetchUlb = async () => {
      try {
        setLoading(true);
        const res = await apiService.get("getUlbDropdown");

        if (res?.data?.success && Array.isArray(res.data.data)) {
          const options = res.data.data.map((item) => ({
            value: String(item.CORPORATIONID),
            label: item.CORPORATIONNAME,
          }));
          setUlbOptions(options);
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
    if (ulbid && ulbOptions?.length > 0) {
      setValue("ulbId", String(ulbid));
    }
  }, [ulbid, ulbOptions]);

  useEffect(() => {
    if (!ulbid) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await apiService.post("getUserDropdown", {
          ulbId: Number(ulbid),
        });

        if (res?.data?.success && Array.isArray(res.data.data)) {
          setUserOptions(
            res.data.data.map((item) => ({
              value: String(item.NUM_USER_USERID),
              label: item.VAR_USER_USERNAME,
            })),
          );
        } else {
          setUserOptions([]);
          alert(
            res?.data?.errorMessage ||
              res?.data?.message ||
              "Failed to load user dropdown",
          );
        }
      } catch (err) {
        console.error("User dropdown error:", err);
        alert(err.message || "Failed to load user dropdown");
        setUserOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [ulbid]);

  useEffect(() => {
    if (!ulbid) return;

    const fetchTable = async () => {
      try {
        setLoading(true);
        const res = await apiService.post("getUserDeptConfigTableData", {
          ulbId: Number(ulbid),
        });

        if (
          res?.data?.success &&
          Array.isArray(res?.data?.data) &&
          res.data.data.length > 0
        ) {
          setTableRows(res.data.data);
        } else {
          setTableRows([]);
        }
      } catch (err) {
        console.error("Config table error:", err);
        setTableRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTable();
  }, [ulbid]);

  useEffect(() => {
    // Reset when user changes
    setSelectedIds([]);

    if (!watchUserId) return;

    const fetchSelectedIds = async () => {
      try {
        setLoading(true);
        const res = await apiService.post("getUserDeptConfigSelectedIds", {
          userId: String(watchUserId),
        });

        if (
          res?.data?.success &&
          Array.isArray(res?.data?.data) &&
          res.data.data.length > 0
        ) {
          setSelectedIds(res.data.data);
        } else {
          setSelectedIds([]);
        }
      } catch (err) {
        console.error("Selected ids error:", err);
        setSelectedIds([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSelectedIds();
  }, [watchUserId]);

  useEffect(() => {
    if (!tableRows.length) {
      setCheckedMap({});
      setPrevStatusMap({});
      return;
    }

    // Set of USERCONFIGID values that are already configured
    const selectedSet = new Set(
      selectedIds.map((item) => Number(item.USERCONFIGID)),
    );

    const checked = {};
    const prev = {};
    tableRows.forEach((row) => {
      const id = row[TABLE_KEY_MAPPING.id];
      const isSelected = selectedSet.has(Number(id));

      checked[id] = isSelected;
      prev[id] = isSelected ? "Y" : "N";
    });
    setCheckedMap(checked);
    setPrevStatusMap(prev);
  }, [tableRows, selectedIds]);

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
    if (!data.userId) {
      alert("Please select a user");
      return;
    }

    try {
      setLoading(true);

      // String format: DEPTID#prevStatus#currentStatus$...
      const in_UserConfstr = tableRows
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
        In_UserConfigId: String(data.userId),
        in_UserConfstr: in_UserConfstr,
        in_mode: 2,
        in_ipaddress: ip,
        in_source: config.source,
      };

      const res = await apiService.post("aoio_OutwardUserConfig_ins", payload);

      if (res?.data?.success && res?.data?.errorCode === 9999) {
        alert(res.data.errorMessage);
        setValue("userId", "");
        setSelectedIds([]);
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
      console.error("Error saving user config:", error);
      alert(error.message || "Failed to save user configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Outward User Configuration"
      breadcrumb={{
        homeLink: "/dashboard",
        homeText: "Home",
        current: "Outward User Configuration",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ULB */}
          <div>
            <Label text="ULB : " required />
            <select
              disabled
              className="form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                bg-slate-100 text-slate-500 cursor-not-allowed"
              {...register("ulbId")}
            >
              <option value="">-- Select ULB --</option>
              {ulbOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* User */}
          <div>
            <Label text="User : " required />
            <select
              className={`form-input-box w-full border border-gray-400 rounded-md px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
                ${errors.userId ? "border-red-500" : ""}`}
              {...register("userId", { required: "User is required" })}
            >
              <option value="">-- Select User --</option>
              {userOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>
        </div>

        {watchUserId && tableRows.length > 0 && (
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
            disabled={isSubmitting || tableRows.length === 0 || !watchUserId}
          >
            Submit
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default FrmOutWardUserConfig;
