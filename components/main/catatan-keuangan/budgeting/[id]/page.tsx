'use client';

import { useState, useEffect } from "react";
import 'material-icons/iconfont/material-icons.css';
import { useRouter } from "next/navigation";
import Sidebar from '../../../sidebar';

import Header from "../../../header";

interface EditBudgetingProps {
  budgetingId: string | number | null;
  onSwitchToBudgeting: () => void;
}

export default function EditBudgeting({ budgetingId, onSwitchToBudgeting }: EditBudgetingProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [kategoriBudget, setKategoriBudget] = useState("");
  const [batasBulan, setBatasBulan] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const router = useRouter();

  const jenisOptions = [
    { id: "Makanan", name: "Makanan & Minuman" },
    { id: "Transportasi", name: "Transportasi / Bensin" },
    { id: "Uang Saku", name: "Uang Saku" },
    { id: "Pendidikan", name: "Pendidikan / Kuliah" },
    { id: "Belanja", name: "Belanja / kebutuhan" },
    { id: "Hiburan", name: "Hiburan / Game" },
    { id: "Tagihan", name: "Tagihan / Listrik / Air" },
    { id: "Lainnya", name: "Lainnya" },
  ];

  const listBudgeting = [
    {
      id: 1,
      kategori: "Uang Saku",
      batas: "3.000.000",
      mulai: "2026-08-01",
      selesai: "2026-08-31",
    },
    {
      id: 2,
      kategori: "Pendidikan",
      batas: "1.500.000",
      mulai: "2026-08-01",
      selesai: "2026-08-31",
    },
  ];

  const formatNumberInput = (value: string) => {
    let cleanValue = value.replace(/[^0-9,]/g, "");
    
    const parts = cleanValue.split(",");
    if (parts.length > 2) {
      cleanValue = parts[0] + "," + parts.slice(1).join("");
    }

    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? "," + parts[1] : "";

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return integerPart + decimalPart;
  };

  useEffect(() => {
    if (budgetingId) {
      const foundItem = listBudgeting.find(
        (item) => String(item.id) === String(budgetingId)
      );

      if (foundItem) {
        setKategoriBudget(foundItem.kategori);
        setBatasBulan(foundItem.batas);
        setTanggalMulai(foundItem.mulai);
        setTanggalSelesai(foundItem.selesai);
      }
    }
  }, [budgetingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nominalBersih = batasBulan.replace(/\./g, "").replace(/,/g, ".");
    
    console.log("Update Budgeting:", {
      budgetingId,
      kategoriBudget,
      batasBulan: Number(nominalBersih),
      tanggalMulai,
      tanggalSelesai,
    });
    
    onSwitchToBudgeting();
  };

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus budget ini?")) {
      console.log("Menghapus Budget ID:", budgetingId);

      if (onSwitchToBudgeting) {
        onSwitchToBudgeting();
      }
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-6 py-8 flex flex-col bg-[#F8F9FC] text-gray-800 overflow-y-auto overflow-x-hidden relative font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="lg:max-w-5xl lg:mx-auto lg:w-full flex flex-col gap-5">
        <Header
          title="Catatan Keuangan"
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onProfileClick={() => router.push("/?mode=profile-edit")}
        />

        <div className="flex flex-row gap-4 items-center">
          <button 
            type="button"
            onClick={onSwitchToBudgeting}
            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            <span className="material-icons text-xl leading-none">arrow_back</span>
          </button>
          <div className="text-xl font-bold text-gray-900">Edit Budget</div>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="bg-white border border-gray-100 p-5 md:p-6 rounded-3xl shadow-sm mb-6 flex flex-col gap-4">
            
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Kategori Budget</label>
              <div className="relative">
                <select 
                  value={kategoriBudget}
                  onChange={(e) => setKategoriBudget(e.target.value)}
                  className={`appearance-none bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors cursor-pointer pr-10 ${
                    kategoriBudget === "" ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  <option value="" disabled hidden>Pilih Kategori Budget</option>
                  {jenisOptions.map((item) => (
                    <option key={item.id} value={item.id} className="bg-white text-gray-800">
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Batas per Bulan</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-semibold text-gray-500">Rp</span>
                <input 
                  type="text"
                  inputMode="decimal"
                  value={batasBulan}
                  onChange={(e) => {
                    const formatted = formatNumberInput(e.target.value);
                    setBatasBulan(formatted);
                  }}
                  className="bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm pl-12 pr-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors placeholder:text-gray-400"
                  placeholder="Contoh: 3.000.000"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Tanggal Mulai</label>
              <input 
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Tanggal Selesai</label>
              <input 
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-[#6C63F2] text-sm text-white font-bold py-3.5 rounded-2xl hover:bg-[#574CE8] transition-colors cursor-pointer shadow-md shadow-[#6C63F2]/20"
            >
              Simpan Perubahan
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-50 text-red-500 text-sm font-bold py-3.5 rounded-2xl hover:bg-red-100 transition-colors cursor-pointer"
            >
              Hapus Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}