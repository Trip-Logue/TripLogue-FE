import type { CommonBtnProps } from "../../types";

function CommonBtn({ text, onClick, className ="bg-[#D9D9D9] text-[#1A1A1A] border border-transparent rounded-lg px-4 py-2 font-medium text-base hover:bg-[#C0C0C0] transition-colors duration-200 w-50 h-10" }: CommonBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`${className}`}
    >
      {text}
    </button>
  );
}

export default CommonBtn;
