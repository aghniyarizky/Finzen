"use client";

import { useEffect } from "react";
import "material-icons/iconfont/material-icons.css";

interface ToastSuccessProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  autoCloseDuration?: number;
}

export default function ToastSuccess({
  isVisible,
  onClose,
  title = "Data berhasil dihapus.",
  message = "Data yang dipilih telah dihapus dari daftar. Perubahan ini sudah tersimpan.",
  autoCloseDuration = 3000,
}: ToastSuccessProps) {
  useEffect(() => {
    if (isVisible && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-white border border-gray-100 rounded-2xl p-4 shadow-xl flex flex-row items-start gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="w-10 h-10 rounded-xl bg-[#1B8A44] shrink-0" />
      
      <div className="flex-1 pt-0.5">
        <h4 className="text-sm font-bold text-[#1B8A44] mb-1">{title}</h4>
        <p className="text-xs text-gray-500 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}