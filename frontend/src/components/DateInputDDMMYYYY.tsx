"use client";
import React, { useRef } from "react";
import { Calendar } from "lucide-react";

export default function DateInputDDMMYYYY({ value, onChange, placeholder = "dd/mm/yyyy", testId, min }: { value: any; onChange: any; placeholder?: string; testId?: string; min?: string }) {
  const ref = useRef(null);
  const display = value ? value.split("-").reverse().join("/") : "";
  const today = new Date().toISOString().split("T")[0];

  const open = () => {
    if (!ref.current) return;
    if (ref.current.showPicker) {
      try {
        ref.current.showPicker();
        return;
      } catch {
        ref.current.click();
      }
    } else {
      ref.current.click();
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (min && val < min) return;
    if (!min && val < today) return;
    onChange(val);
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
        min={min || today}
        onChange={handleChange}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        tabIndex={-1}
      />
    </div>
  );
}
