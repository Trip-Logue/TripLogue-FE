import { useState, useEffect } from "react";
import type { RecordModalProps } from "@/types";
import CommonInput from "../commons/commomInput";
import {ImagePlus} from "lucide-react";

export default function RecordModal({
  open,
  onClose,
  onSubmit,
  selectedPlace,
}: RecordModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");
  const [isActive, setIsActive] = useState(false);


  // 드래그 앤 드랍 관리하는 코드 18 ~ 34 라인
  const dragStart = () => setIsActive(true);
  const dragEnd = () => setIsActive(false);
  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };
  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      console.log("파일이 드롭되었습니다:", files[0].name);
      
    }
  };
  const unUploadStyle =
    "text-sm font-medium mb-1 h-40 border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center";
  const uplodadStyle =
    "text-sm font-medium mb-1 h-40 border-dashed border-2 border-black rounded-lg flex items-center justify-center";

  useEffect(() => {
    if (open) {
      setTitle(selectedPlace?.name || "");
      setDate("");
      setMemo("");
    }
  }, [open, selectedPlace]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">마커 정보 입력</h2>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            제목
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            날짜
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            메모
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </label>
        </div>
        <div className="mb-3 ">
          <label
            className={isActive ? uplodadStyle : unUploadStyle}
            onDragEnter={dragStart}
            onDragLeave={dragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <ImagePlus className="w-30" />
              <span>이미지를 업로드 해주세요!</span>
            </div>
            <CommonInput placeholder="" className="hidden" type="file" />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ title, date, memo })}
            disabled={!title || !date}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
