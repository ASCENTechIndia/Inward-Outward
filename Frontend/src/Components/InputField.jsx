import PropTypes from "prop-types";
import { useEffect, useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";

const inputStyle =
  "w-full h-10 px-4 py-2 border border-gray-500  rounded-md transition duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-lg text-sm sm:text-base placeholder-gray-400 placeholder:!text-gray-400"
  + "shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]";
const DateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="relative w-full cursor-pointer" onClick={onClick}>
    <input
      ref={ref}
      value={value}
      readOnly
      placeholder={placeholder}
      className="bg-white w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <CalendarIcon
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
  </div>
));
DateInput.displayName = "DateInput";

const InputField = ({
  field,
  form,
  restrictInput,
  type = "text",
  label,
  options = [],
  placeholder = "",
  className,
  onChange,
  allowPastDates,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [selectDate, setSelectedDate] = useState(new Date());
  const [calendarValue, setCalendarValue] = useState(null);
  useEffect(() => {
    // Find the label for current field.value
    const selectedOption = options.find((opt) => opt.value === field.value);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm("");
    }
  }, [field.value, options]);
  const { setFieldValue } = form;
  const handleChange = (e) => {
    const newValue = e.target.value;

    if (restrictInput) {
      restrictInput(e, setFieldValue, field.name);
    } else {
      setFieldValue(field.name, newValue);
    }

    // 🔹 Update searchTerm immediately for instant UI feedback
    const selectedOption = options.find((opt) => opt.value === newValue);
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    }

    onChange?.(e);
  };

  const filteredOptions = (options || []).filter((opt) =>
    opt?.label?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  return (
    <div className="mb-4 w-full">
      {label && <label className="block mb-1 font-medium">{label}</label>}

      {/* Text */}
      {type === "text" && (
        <input
          type="text"
          {...field}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${inputStyle} ${className || ""}`}
          {...props}
        />
      )}

      {/* Dropdown */}
      {type === "dropdown" && (
        <select
          {...field}
          onChange={handleChange}
          className={`bg-white ${inputStyle} pr-[2.5rem] ${
            props.disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          disabled={props.disabled}
        >
          <option value="">Select</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Search Dropdown */}
      {type === "search-dropdown" && (
        <div className="relative">
          <div
            className={`bg-white ${inputStyle} cursor-pointer relative break-words whitespace-normal`}
            onClick={() => setShowOptions(!showOptions)}
          >
            {searchTerm || "All"}

            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              ▼
            </span>
          </div>

          {showOptions && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow">
              {/* Search box */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowOptions(true);
                  }}
                  placeholder="Search..."
                  className="w-full border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <ul className="max-h-40 overflow-y-auto text-sm sm:text-base">
                {/* Special All option */}
                <li
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(""); // reset search text
                    form.setFieldValue(field.name, ""); // clear Formik field value
                    setShowOptions(false);
                  }}
                >
                  All
                </li>

                {filteredOptions.length === 0 && (
                  <li className="p-2 text-gray-500">No results</li>
                )}
                {filteredOptions.map((opt, idx) => (
                  <li
                    key={idx}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(opt.label);
                      form.setFieldValue(field.name, opt.value);
                      setShowOptions(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Calendar */}
      {type === "calendar" && (
        <div className="relative w-full">
          <DatePicker
            // selected={field.value ? new Date(field.value) : new Date()} // show today if empty
            // selected={
            //   field.value ? new Date(field.value) : calendarValue || new Date() // show correct initial value
            // }
              selected={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              setSelectedDate(date);
              form.setFieldValue(field.name, date);

              if (props.setDeliveryDate) {
                props.setDeliveryDate(date);
              }
              // update Formik value
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            customInput={<DateInput />}
            showMonthDropdown
            portalId="root"   
            showYearDropdown
            dropdownMode="select"
            minDate={allowPastDates === false ? new Date() : null} // block past if false
            maxDate={allowPastDates === true ? new Date() : null} // block past dates if allowPastDates is false
            className={`bg-white ${inputStyle} ${className || ""}`}
          />
        </div>
      )}
      {type === "calendarwithtime" && (
        <div className="relative w-full">
          <DatePicker
            selected={field.value ? new Date(field.value) : null}
            onChange={(date) => {
              if (!date) return;
              setCalendarValue(date);
              form.setFieldValue(field.name, date); // keep Formik in sync
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="dd/mm/yyyy HH:mm"
            customInput={<DateInput />}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            // ✅ Block all past dates
            minDate={new Date()}
            // ✅ Dynamically block past times for today
            minTime={(() => {
              const today = new Date();
              const selectedDate = field.value ? new Date(field.value) : today;

              // If selected date is today → block times before "now"
              if (selectedDate.toDateString() === today.toDateString()) {
                return today;
              }

              // If future date → allow whole day
              return new Date(new Date().setHours(0, 0, 0));
            })()}
            maxTime={new Date(new Date().setHours(23, 59, 59))}
          />
        </div>
      )}
<style>
{`
  .qty-input::-webkit-inner-spin-button,
  .qty-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .qty-input {
    -moz-appearance: textfield;
  }
`}
</style>
      {/* Quanitity */}
   {type === "quantity" && (
  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full  qty-input">
    {/* - button */}
    <button
      type="button"
      className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
      onClick={() => {
        const current = Number(field.value) || 0;
        const min = props.min ?? 0;

        if (current > min) {
          form.setFieldValue(field.name, current - 1);
        }
      }}
    >
      -
    </button>

    {/* input */}
    <input
      type="number"
      {...field}
      min={props.min ?? 0}
      max={props.max}         
      className="w-full text-center outline-none qty-input"
      onChange={(e) => {
        let val = e.target.value;

        if (val === "") {
          form.setFieldValue(field.name, "");
          return;
        }

        val = Number(val);

        if (props.max !== undefined && val > props.max) {
          val = props.max;
        }

        if (props.min !== undefined && val < props.min) {
          val = props.min;
        }

        form.setFieldValue(field.name, val);
      }}
    />

    {/* + button */}
    <button
      type="button"
      className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
      onClick={() => {
        const current = Number(field.value) || 0;
        const max = props.max;

        if (max === undefined || current < max) {
          form.setFieldValue(field.name, current + 1);
        }
      }}
    >
      +
    </button>
  </div>
)}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.oneOf(["text", "dropdown", "search-dropdown", "calendar"])
    .isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  restrictInput: PropTypes.func, // NEW
};

export default InputField;
