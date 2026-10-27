"use client";

import { useState } from "react";
import 'material-icons/iconfont/material-icons.css';
import Image from "next/image";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=sakusehat"; 

interface ProfileAuthProps {
  email: string;
  onNext: (fotoProfilUrl: string) => void;
  onSkip: () => void;
  onSwitchToLogin: () => void;
}

export default function ProfileAuthComponent({ 
  email, 
  onNext, 
  onSkip, 
  onSwitchToLogin 
}: ProfileAuthProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setImagePreview(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const finalFoto = imagePreview || DEFAULT_AVATAR;

      const token = localStorage.getItem("token"); 

      const payload = {
        fotoProfilUrl: finalFoto,
        onboardingCompleted: true,
        saldoSekarang: 0, 
        sumberPemasukan: "Lainnya"
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan foto profil.");
      }

      onNext(finalFoto); 
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setImagePreview(DEFAULT_AVATAR);
    onNext(DEFAULT_AVATAR);
  };

  return (
    <div className="w-full min-h-screen flex bg-[#F8F9FC]">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center px-14 bg-transparent">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#6C63F2]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#6C63F2]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-10">
            <div className="flex items-center justify-center p-2 bg-[#6c63f2]/10 rounded-full shrink-0">
              <Image
                src="/Logo-saku-gen-z.png"
                alt="Logo Saku GenZ"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="text-gray-800 font-extrabold text-lg tracking-tight">Saku Gen-Z</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-gray-800 mb-4">
            Tambah{" "}
            <span className="bg-gradient-to-r from-[#6C63F2] to-[#BEEDE8] bg-clip-text text-transparent">
              Foto Profil
            </span>
          </h1>

          <p className="text-gray-600 text-sm font-medium leading-relaxed mb-10">
            Tambahin foto profil biar akunmu lebih personal. Bisa dilewati dan diubah kapan aja.
          </p>

          <div className="space-y-4">
            {[
              { icon: "photo_camera", text: "Foto profil opsional" },
              { icon: "edit", text: "Bisa diubah kapan saja" },
              { icon: "check_circle", text: "Langkah terakhir sebelum masuk" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <span className="material-icons text-[#6C63F2] text-base">{item.icon}</span>
                </div>
                <span className="text-gray-600 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Form */}
      <div className="w-full lg:w-1/2 min-h-screen px-8 py-8 flex flex-col justify-between bg-transparent relative overflow-y-auto">
        <div className="w-full lg:max-w-md lg:mx-auto">
          
          <div className="w-10 h-10 mb-6">
            <div 
              onClick={onSwitchToLogin}
              className="flex items-center justify-center w-full h-full bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="material-icons text-lg text-gray-700">arrow_back</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full flex justify-between items-center gap-1 mb-2">
              <div className="w-1/2">
                <div className="p-1 bg-[#6C63F2] rounded-full"></div>
              </div>
              <div className="w-1/2">
                <div className="p-1 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs font-medium">Foto Profil</span>
              <span className="text-gray-600 text-xs font-medium text-end">Langkah 1 dari 2</span>
            </div>
          </div>

          <div className="w-full text-start mt-8 lg:hidden">
            <h2 className="text-gray-800 text-3xl font-extrabold tracking-tight leading-snug">
              Tambah{" "}
              <span className="bg-gradient-to-r from-[#6C63F2] to-[#BEEDE8] bg-clip-text text-transparent">
                Foto Profil
              </span>
            </h2>
            <p className="text-sm mt-2 text-gray-600 font-medium leading-relaxed">
              Tambahin foto profil biar akunmu lebih personal.<br />
              Bisa dilewati dan diubah kapan aja.
            </p>
          </div>

          <form id="profile-form" onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center py-10">
            {error && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl">
                {error}
              </div>
            )}

            <div className="relative group">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#6C63F2] flex items-center justify-center overflow-hidden bg-white shadow-sm">
                <img
                  src={imagePreview || DEFAULT_AVATAR}
                  alt="Preview Foto Profil"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
              </div>

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 w-11 h-11 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer shadow-md border border-gray-200 transition-all active:scale-95"
              >
                <span className="material-icons text-xl text-[#6C63F2] select-none">
                  photo_camera
                </span>
              </label>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </form>
        </div>

        <div className="w-full flex flex-col gap-3 pb-4 lg:pb-0 lg:max-w-md lg:mx-auto mt-auto">
          <button
            type="submit"
            form="profile-form" 
            disabled={loading}
            className="w-full py-3 bg-[#6C63F2] hover:bg-[#5a52d0] text-white font-bold rounded-xl shadow-md shadow-[#6C63F2]/20 transition-all active:scale-[0.98] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Lanjut"}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-3 text-sm text-[#6C63F2] bg-transparent border border-[#6C63F2]/30 hover:bg-[#6C63F2]/5 font-bold rounded-xl transition-all cursor-pointer"
          >
            Lewati
          </button>
        </div>

      </div>
    </div>
  );
}