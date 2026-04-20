"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPasswordOption?: boolean; // Para mostrar o olhinho
}

export const InputCustomizado = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  showPasswordOption 
}: InputProps) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="ml-4 font-medium text-[#0A4F6E] text-[18px]">{label}</label>
      <div className="relative w-full">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-full bg-white px-6 focus:outline-none text-[16px]"
          style={{ boxShadow: '0px 4px 6px rgba(10, 79, 110, 0.8)' }}
        />
        {isPassword && showPasswordOption && (
          <button 
            type="button" 
            onClick={() => setShow(!show)} 
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF904B]"
          >
            {show ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        )}
      </div>
    </div>
  );
};