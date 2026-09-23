export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateYYYYMMDD = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${year}-${month}-${day}`;
}

export const formatDatebyMonth = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");

  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const month = monthNames[d.getMonth()];

  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};
export const formatDatebyMonthSmall = (dateInput) => {
  if (!dateInput) return "";

  let day, month, year;

  if (typeof dateInput === "string") {
    // If string format DD/MM/YYYY
    [day, month, year] = dateInput.split("/");
  } else if (dateInput instanceof Date) {
    // If Date object
    day = String(dateInput.getDate()).padStart(2, "0");
    month = String(dateInput.getMonth() + 1).padStart(2, "0");
    year = dateInput.getFullYear();
  } else {
    console.error("Unsupported date format:", dateInput);
    return "";
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthIndex = parseInt(month, 10) - 1;
  return `${day}-${monthNames[monthIndex]}-${year}`;
};

export const toLocalDate = (dateString) => {
  const date = new Date(dateString);
  return date;
};

export const formatDateSlash = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatLocalDateTime = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
};

export const formatDateMonth = (dateInput) => {
  if (!dateInput) return "";

  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, "0");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateForAPI = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[d.getMonth()];

  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
