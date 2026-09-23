import React from "react";

const ConfigTable = ({
  rows = [],
  checkedMap = {},
  onToggle,
  onToggleAll,
  tableKeyMapping = { id: "id", columns: {} },
}) => {
  const idKey = tableKeyMapping?.id;
  const columnEntries = Object.entries(tableKeyMapping?.columns || {});

  const allChecked =
    rows.length > 0 && rows.every((r) => !!checkedMap[r[idKey]]);
  const someChecked = rows.some((r) => !!checkedMap[r[idKey]]);

  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-12 text-center">
        <svg
          className="w-10 h-10 mx-auto text-slate-300 mb-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
        </svg>
        <p className="text-sm text-slate-400">No records found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse max-h-[200px]">
          <thead className="bg-slate-100/95">
            <tr className="border-b border-slate-200">
              {/* Checkbox column — always fixed narrow width */}
              <th className="w-14 px-4 py-3 text-center text-[13px] font-bold uppercase tracking-wider text-slate-600">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked && !allChecked;
                  }}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </th>

              {/* Dynamic columns */}
              {columnEntries.map(([key, label]) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left text-[13px] font-bold uppercase tracking-wider text-slate-600 break-words"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row[idKey]}
                className="hover:bg-slate-50/80 transition-colors duration-150"
              >
                {/* Checkbox cell */}
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={!!checkedMap[row[idKey]]}
                    onChange={(e) => onToggle(row[idKey], e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                </td>

                {/* Dynamic cells */}
                {columnEntries.map(([key]) => (
                  <td
                    key={key}
                    className="px-4 py-3 text-sm text-slate-700 break-words"
                  >
                    {row[key] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfigTable;
