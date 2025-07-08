import type { CommonInputProps } from "../../types";

function CommonInput({
  placeholder,
  value,
  onChange,
  className = "bg-[#F5F5F5] text-[#1A1A1A] border border-transparent rounded-lg px-4 py-2 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 w-60 h-10",
}: CommonInputProps) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${className}`}
      type="text"
      maxLength={100}
    ></input>
  );
}

export default CommonInput;
