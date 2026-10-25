'use client';

import { useState, useEffect } from 'react';
import 'material-icons/iconfont/material-icons.css';
import Sidebar from '../../../sidebar';

import Header from "../../../header";
import { useRouter } from "next/navigation";

import ConfirmDeleteModal from '../../../../confirm-delete'; 
import ToastSuccess from '../../../../msg-success';

interface EditTransaksiProps {
  transactionId: string | number | null;
  onSwitchToTransaction?: () => void;
}

export default function EditTransaksi({ transactionId, onSwitchToTransaction }: EditTransaksiProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [source, setSource] = useState("Gopay");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("pengeluaran"); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchDetailTransaksi = async () => {
      if (!transactionId) return;
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/${transactionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const textRes = await res.text();
        let resData;
        try {
          resData = JSON.parse(textRes);
        } catch {
          throw new Error("Respon server bukan format JSON yang valid.");
        }

        if (!res.ok) {
          throw new Error(resData.message || "Gagal memuat detail transaksi.");
        }

        const item = resData.data;
        if (item) {
          setTitle(item.Catatan_Transaksi || "");
          setCategory(item.kategori || "Makanan");
          setSource(item.Sumber_Dana || "Gopay");
          setAmount(String(item.nominal || ""));
          if (item.tanggal) {
            setDate(item.tanggal.split("T")[0]);
          }
          setType(item.tipe || "pengeluaran");
        }
      } catch (err: unknown) {
        const errorObj = err as Error;
        setError(errorObj.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailTransaksi();
  }, [transactionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/${transactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            Catatan_Transaksi: title,
            tipe: type,
            kategori: category,
            Sumber_Dana: source,
            nominal: Number(amount),
            tanggal: date ? new Date(date) : new Date(),
          }),
        }
      );

      const textRes = await res.text();
      let resData;
      try {
        resData = JSON.parse(textRes);
      } catch {
        throw new Error("Respon server bukan format JSON yang valid.");
      }

      if (!res.ok) {
        throw new Error(resData.message || "Gagal memperbarui transaksi.");
      }

      if (onSwitchToTransaction) {
        onSwitchToTransaction();
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || "Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transactionId) return;
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/catatan-keuangan/${transactionId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        const textRes = await res.text();
        console.log("RAW RESPONSE DARI SERVER:", textRes); 

        let resData;
        try {
          resData = JSON.parse(textRes);
        } catch {
          throw new Error(`Server merespons bukan JSON. Isi respons: "${textRes}"`);
        }

        if (!res.ok) {
          throw new Error(resData.message || "Gagal memuat detail transaksi.");
        }

        if (onSwitchToTransaction) {
          onSwitchToTransaction();
        }
      } catch (err: unknown) {
        const errorObj = err as Error;
        setError(errorObj.message || "Terjadi kesalahan saat menghapus.");
      } finally {
        setLoading(false);
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

        <div className="flex flex-row items-center gap-4">
          <button 
            type="button"
            onClick={onSwitchToTransaction}
            className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            <span className="material-icons text-xl select-none">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Edit Transaksi</h1>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full bg-white border border-gray-100 p-5 md:p-6 rounded-3xl shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Catatan Transaksi</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors placeholder:text-gray-400"
                placeholder="Masukkan catatan..."
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Tipe Transaksi</label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors cursor-pointer pr-10"
                >
                  <option value="pengeluaran">Pengeluaran</option>
                  <option value="pemasukan">Pemasukan</option>
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Kategori</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors cursor-pointer pr-10"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Uang Saku">Uang Saku</option>
                  <option value="Hiburan">Hiburan</option>
                  <option value="Tabungan">Tabungan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Sumber Dana</label>
              <div className="relative">
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors cursor-pointer pr-10"
                >
                  <option value="Gopay">Gopay</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank BCA">Bank BCA</option>
                  <option value="OVO">OVO</option>
                  <option value="ShopeePay">ShopeePay</option>
                </select>
                <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Nominal</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-semibold text-gray-500">Rp</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm pl-12 pr-4 py-2.5 text-gray-800 font-medium focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors placeholder:text-gray-400"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-semibold mb-1.5 block">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-2xl w-full text-sm px-4 py-2.5 text-gray-800 focus:outline-none focus:border-[#6C63F2] focus:bg-white transition-colors cursor-pointer"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#6C63F2] text-white text-sm font-bold hover:bg-[#574CE8] transition-colors cursor-pointer shadow-md shadow-[#6C63F2]/20 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="w-full py-3 rounded-2xl bg-red-50 text-red-500 text-sm font-bold hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Hapus Transaksi"}
            </button>
          </div>
        </form>
      </div>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={loading}
        title="Hapus Transaksi?"
        description="Apakah kamu yakin ingin menghapus catatan transaksi ini? Tindakan ini tidak dapat dibatalkan."
      />

      {/* hapus */}
      <ToastSuccess
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        title="Data berhasil dihapus."
        message="Data yang dipilih telah dihapus dari daftar transaksi. Perubahan ini sudah tersimpan."
      />

      {/* simpan */}
      <ToastSuccess
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        title="Data berhasil disimpan"
        message="Data berhasil disimpan. Kamu bisa melanjutkan ke langkah berikutnya."
      />
    </div>
  );
}