"use client";
import React, { useRef } from "react";
import { Calendar } from "lucide-react";

// India-friendly dd/mm/yyyy date picker.
// Uses native HTML5 date input under the hood but always displays dd/mm/yyyy.
export default function DateInputDDMMYYYY({ value, onChange, placeholder = "dd/mm/yyyy", testId }) {
  const ref = useRef(null);
  const display = value ? value.split("-").reverse().join("/") : "";

  const open = () => {
    if (!ref.current) return;
    if (ref.current.showPicker) ref.current.showPicker();
    else ref.current.click();
  };

  return (
    <div className="relative">
      <input
        type="text"
        readOnly
        value={display}
        placeholder={placeholder}
        onClick={open}
        className="input-gajab pr-10 cursor-pointer"
        data-testid={testId}
      />
      <Calendar onClick={open} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F26B1F] cursor-pointer" />
      <input
        ref={ref}
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        tabIndex={-1}
      />
    </div>
  );
}
