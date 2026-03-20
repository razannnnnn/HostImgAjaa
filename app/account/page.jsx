"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ===== SIDEBAR NAV ITEM =====
const NavItem = ({ icon, label, active, onClick, danger, collapsed }) => (
  <button
    onClick={onClick}
    title={label}
    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-all duration-150 ${
      collapsed ? "justify-center" : ""
    } ${
      danger
        ? "rounded-xl text-danger-500 hover:bg-danger-500/10"
        : active
          ? "rounded-l-none rounded-r-xl border-l-2 border-primary-500 bg-gray-950/60 font-medium text-white backdrop-blur-md"
          : "rounded-xl text-gray-400 hover:bg-gray-950/40 hover:text-white"
    }`}
  >
    <svg
      className="size-4 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon}
    </svg>
    {!collapsed && <span>{label}</span>}
  </button>
);

// ===== GALLERY TAB =====
const GalleryTab = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetch("/api/my-images")
      .then((r) => r.json())
      .then((data) => {
        console.log("API response:", data); // ← tambah ini
        if (data.success) setImages(data.images);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (deleteCode, id) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    try {
      const res = await fetch(`api/delete/${deleteCode}`, {
        headers: { accept: "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img._id !== id));
      } else {
        alert("Gagal menghapus gambar");
      }
    } catch {
      alert("Gagal menghapus gambar");
    }
  };

  const thisMonth = images.filter((img) => {
    const d = new Date(img.uploadedAt);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Stats */}
      <div className="grid shrink-0 grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: "Total Upload", value: images.length, sub: "tersimpan" },
          { label: "Bulan Ini", value: thisMonth, sub: "terbaru" },
          { label: "Storage", value: "∞", sub: "unlimited" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-gray-800/50 bg-gray-950/60 p-3 backdrop-blur-md sm:p-4"
          >
            <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-gray-500 sm:text-xs">
              {s.label}
            </p>
            <p className="text-xl font-semibold text-white sm:text-2xl">
              {s.value}
            </p>
            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Label */}
      <p className="shrink-0 text-xs font-medium uppercase tracking-widest text-gray-500">
        Gambar Tersimpan
      </p>

      {/* Gallery Box */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-950/60 backdrop-blur-md">
        {loading ? (
          <div className="custom-scroll h-full overflow-y-auto p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-xl bg-gray-800"
                />
              ))}
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
            <svg
              className="mx-auto mb-3 h-10 w-10 text-gray-600"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="10" width="36" height="28" rx="4" />
              <circle cx="17" cy="22" r="4" />
              <path d="M6 32l10-8 8 7 6-5 12 11" />
            </svg>
            <p className="mb-1 text-sm font-medium text-white">
              Belum ada gambar
            </p>
            <p className="mb-4 text-xs text-gray-500">
              Upload gambar pertamamu sekarang!
            </p>
            <Link href="/upload" className="btn variant-primary sz-sm">
              <span>Upload Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="custom-scroll h-full overflow-y-auto p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {images.map((img) => {
                const previewUrl = img.cloudinaryUrl?.replace(
                  "/upload/",
                  "/upload/w_400,q_60,f_auto/",
                );
                const cdnUrl = `${window.location.origin}/api/i/${img.filename}`;
                return (
                  <div
                    key={img._id}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900"
                  >
                    <img
                      src={previewUrl}
                      alt={img.filename}
                      className="h-full w-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-950/70 p-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                      <a
                        href={cdnUrl}
                        target="_blank"
                        className="btn variant-outlined sz-xs w-full justify-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          className="size-3"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 3h3v3M13 3l-6 6M6 4H3v9h9v-3" />
                        </svg>
                        <span>Buka</span>
                      </a>
                      <button
                        onClick={() => handleCopy(cdnUrl, img._id)}
                        className="btn variant-primary sz-xs w-full justify-center"
                      >
                        <svg
                          className="size-3"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="5" width="9" height="9" rx="1.5" />
                          <path d="M5 5V3.5A1.5 1.5 0 016.5 2h6A1.5 1.5 0 0114 3.5v6A1.5 1.5 0 0112.5 11H11" />
                        </svg>
                        <span>{copied === img._id ? "✓" : "Salin"}</span>
                      </button>
                      {/* ← Tambah tombol hapus */}
                      <button
                        onClick={() => handleDelete(img.deleteCode, img._id)}
                        className="btn sz-xs w-full justify-center border border-red-500/20 bg-red-500/10 text-danger-500 hover:bg-danger-500/25"
                      >
                        <svg
                          className="size-3"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" />
                        </svg>
                        <span>Hapus</span>
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950/90 to-transparent px-2 py-1.5">
                      <p className="truncate font-mono text-[10px] text-white/60">
                        {img.filename}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== SETTINGS TAB =====
const SettingsTab = ({ session, userData, setUserData }) => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pfpPreview, setPfpPreview] = useState(null);
  const [pfpFile, setPfpFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPfp, setLoadingPfp] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const pfpInputRef = useRef(null);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setPfpPreview(userData.profilePicture || null);
    }
  }, [userData]);

  const handlePfpChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto profil maksimal 2MB");
      return;
    }
    setPfpFile(file);
    setPfpPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (pfpFile) formData.append("profilePicture", pfpFile);

      const res = await fetch("/api/user/update", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess("Profil berhasil diupdate!");
        setPfpFile(null);
        setUserData((prev) => ({
          ...prev,
          name,
          profilePicture: data.profilePicture || prev?.profilePicture,
        }));
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("Semua field password wajib diisi");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Password baru dan konfirmasi tidak sama");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    setLoadingPfp(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess("Password berhasil diubah!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoadingPfp(false);
    }
  };

  return (
    <div className="custom-scroll h-full overflow-y-auto pr-1">
      <div className="space-y-4">
        {/* Profile Section */}
        <div className="rounded-xl border border-gray-800/50 bg-gray-950/60 p-5 backdrop-blur-md">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">
            Profil
          </p>

          {/* Profile Picture */}
          <div className="mb-5 flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-gray-700 bg-gray-800">
                {pfpPreview ? (
                  <img
                    src={pfpPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                    {session?.user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => pfpInputRef.current.click()}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-gray-400 transition-colors hover:text-white"
              >
                <svg
                  className="size-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 2l3 3-9 9H2v-3L11 2z" />
                </svg>
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Foto Profil</p>
              <p className="text-xs text-gray-500">Maks 2MB · 128×128px</p>
              <button
                onClick={() => pfpInputRef.current.click()}
                className="mt-1.5 text-xs text-primary-500 transition-colors hover:text-primary-400"
              >
                Ganti foto
              </button>
            </div>
            <input
              ref={pfpInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePfpChange}
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              className="input variant-mixed sz-md w-full"
            />
          </div>

          {/* Email (readonly) */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={session?.user?.email || ""}
              className="input variant-mixed sz-md w-full opacity-50"
              disabled
              readOnly
            />
            <p className="mt-1 text-xs text-gray-600">
              Email tidak dapat diubah
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-danger-500/20 bg-danger-500/10 p-3">
              <p className="text-xs text-danger-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-400">{success}</p>
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="btn variant-primary sz-sm"
          >
            {loading ? (
              <>
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>

        {/* Password Section */}
        <div className="rounded-xl border border-gray-800/50 bg-gray-950/60 p-5 backdrop-blur-md">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gray-500">
            Ganti Password
          </p>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Password Lama
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="input variant-mixed sz-md w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Password Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input variant-mixed sz-md w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-400">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input variant-mixed sz-md w-full"
              />
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loadingPfp}
            className="btn variant-outlined sz-sm mt-4"
          >
            {loadingPfp ? (
              <>
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Ganti Password</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
// ===== END SETTINGS TAB =====

// ===== USER DETAIL MODAL =====
const UserDetailModal = ({ isOpen, onClose, user }) => {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setVisible(false), 400);
    }
  }, [isOpen]);

  if (!visible || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        transition: "all 400ms ease",
        backgroundColor: animate ? "rgba(3,7,18,0.7)" : "transparent",
        backdropFilter: animate ? "blur(12px)" : "blur(0px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card variant-outlined mx-auto w-full max-w-sm"
        style={{
          transition: "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: animate ? 1 : 0,
          transform: animate
            ? "translateY(0) scale(1)"
            : "translateY(40px) scale(0.95)",
        }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-title text-base font-semibold">Detail User</h2>
          <button
            onClick={onClose}
            className="btn variant-ghost icon-only sz-sm"
          >
            <svg
              className="size-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Profile Picture + Name */}
        <div className="mb-5 flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gray-700 bg-gray-800">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="pfp"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-title text-sm font-semibold">
              {user.name || "—"}
            </p>
            <p className="text-body truncate font-mono text-xs">{user.email}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  user.role === "admin"
                    ? "bg-primary-500/20 text-primary-400"
                    : "bg-gray-700/50 text-gray-400"
                }`}
              >
                {user.role || "user"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  user.isVerified
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 rounded-xl border border-gray-800/50 bg-gray-950/60 p-4">
          {[
            { label: "Email", value: user.email },
            { label: "Nama", value: user.name || "—" },
            { label: "Role", value: user.role || "user" },
            {
              label: "Status",
              value: user.isVerified ? "Verified" : "Unverified",
            },
            { label: "Upload Count", value: user.uploadCount ?? 0 },
            {
              label: "Bergabung",
              value: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-mono text-xs text-gray-300">{item.value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="btn variant-outlined sz-sm mt-4 w-full"
        >
          <span>Tutup</span>
        </button>
      </div>
    </div>
  );
};
// ==== END USER DETAIL MODAL =====

// ===== USERS TAB =====
const UsersTab = ({ session }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setUsers(data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name || "",
      role: user.role,
      isVerified: user.isVerified,
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, ...editForm } : u)),
        );
        setEditingUser(null);
        setSuccess("User berhasil diupdate!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!confirm(`Yakin ingin menghapus user ${email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        setSuccess("User berhasil dihapus!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    }
  };

  return (
    <>
      <div className="custom-scroll h-full overflow-y-auto pr-1">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Users</h1>
            <p className="text-sm text-gray-400">
              Kelola semua pengguna terdaftar
            </p>
          </div>
          <span className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-xs text-gray-400">
            {users.length} users
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-danger-500/20 bg-danger-500/10 p-3">
            <p className="text-xs text-danger-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
            <p className="text-xs text-emerald-400">{success}</p>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-800/50 bg-gray-950/60 backdrop-blur-md">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 border-b border-gray-800 px-4 py-3">
            {["Email", "Nama", "Role", "Status", "Aksi"].map((h) => (
              <p
                key={h}
                className="text-[10px] font-medium uppercase tracking-widest text-gray-500"
              >
                {h}
              </p>
            ))}
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="space-y-px">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3"
                >
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 animate-pulse rounded bg-gray-800"
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Tidak ada user
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-800/20 ${editingUser === user._id ? "cursor-default" : "cursor-pointer"}`}
                  onClick={() => {
                    if (editingUser === user._id) return; // ← tidak trigger modal saat mode edit
                    setSelectedUser(user);
                    setDetailOpen(true);
                  }}
                >
                  {/* Email */}
                  <p className="truncate font-mono text-xs text-gray-300">
                    {user.email}
                  </p>

                  {/* Nama */}
                  {editingUser === user._id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => {
                        e.stopPropagation();
                        setEditForm({ ...editForm, name: e.target.value });
                      }}
                      className="input variant-mixed sz-xs w-full font-sans"
                    />
                  ) : (
                    <p className="truncate text-xs text-gray-400">
                      {user.name || "-"}
                    </p>
                  )}

                  {/* Role */}
                  {editingUser === user._id ? (
                    <select
                      value={editForm.role}
                      onChange={(e) => {
                        e.stopPropagation();
                        setEditForm({ ...editForm, role: e.target.value });
                      }}
                      className="input variant-mixed sz-xs w-full font-sans"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        user.role === "admin"
                          ? "bg-primary-500/20 text-primary-400"
                          : "bg-gray-700/50 text-gray-400"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  )}

                  {/* Status */}
                  {editingUser === user._id ? (
                    <select
                      value={editForm.isVerified ? "true" : "false"}
                      onChange={(e) => {
                        e.stopPropagation();
                        setEditForm({
                          ...editForm,
                          isVerified: e.target.value === "true",
                        });
                      }}
                      className="input variant-mixed sz-xs w-full font-sans"
                    >
                      <option value="true">Verified</option>
                      <option value="false">Unverified</option>
                    </select>
                  ) : (
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        user.isVerified
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  )}

                  {/* Aksi */}
                  <div className="flex items-center gap-1.5">
                    {editingUser === user._id ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(user._id);
                          }}
                          disabled={saving}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 transition-colors hover:bg-emerald-500/30"
                        >
                          {saving ? (
                            <svg
                              className="size-3 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="size-3"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 8l4 4 8-8" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingUser(null);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-colors hover:bg-gray-700"
                        >
                          <svg
                            className="size-3"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M3 3l10 10M13 3L3 13" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(user);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-colors hover:bg-primary-500/20 hover:text-primary-400"
                        >
                          <svg
                            className="size-3"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 2l3 3-9 9H2v-3L11 2z" />
                          </svg>
                        </button>
                        {user._id !== session?.user?.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user._id, user.email);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-colors hover:bg-danger-500/20 hover:text-danger-400"
                          >
                            <svg
                              className="size-3"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <UserDetailModal
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </>
  );
};
// ===== END USERS TAB =====

// ===== MAIN PAGE =====
export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("gallery");
  const [collapsed, setCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/me")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setUserData(data.user);
        });
    }
  }, [status, router]);

  // Auto collapse di layar kecil
  useEffect(() => {
    const check = () => setCollapsed(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <svg
          className="size-6 animate-spin text-primary-500"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }

  console.log("session role:", session?.user?.role);

  const tabs = [
    {
      id: "gallery",
      label: "Gallery",
      icon: (
        <>
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="5" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </>
      ),
    },
    ...(session?.user?.role === "admin"
      ? [
          {
            id: "users",
            label: "Users",
            icon: (
              <>
                <circle cx="5" cy="5" r="2.5" />
                <path d="M1 13c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                <circle cx="11" cy="5" r="2.5" />
                <path d="M9 13c0-2.2 1.8-4 4-4" />
              </>
            ),
          },
        ]
      : []),
    {
      id: "settings",
      label: "Settings",
      icon: (
        <>
          <circle cx="8" cy="8" r="2.5" />
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
        </>
      ),
    },
  ];

  const sidebarWidth = collapsed ? "w-14" : "w-52";

  return (
    <>
      <Navbar />
      <main
        className="pt-20 lg:pt-24"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div className="mx-auto flex h-full max-w-6xl flex-col px-3 pb-4 sm:px-6">
          <div className="flex flex-1 items-start gap-3 overflow-hidden sm:gap-6">
            {/* Sidebar */}
            <aside
              className={`${sidebarWidth} shrink-0 transition-all duration-300`}
            >
              <div className="rounded-2xl border border-gray-800/50 bg-gray-950/60 p-2 backdrop-blur-md sm:p-3">
                {/* Avatar / User Info */}
                <div
                  className={`mb-2 border-b border-gray-800 pb-3 pt-2 ${collapsed ? "flex justify-center" : "flex items-center gap-3 px-2"}`}
                >
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black text-sm font-bold text-white transition-colors hover:border-white/40"
                  >
                    {userData?.profilePicture ? (
                      <img
                        src={userData.profilePicture}
                        alt="pfp"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      session?.user?.email?.charAt(0).toUpperCase()
                    )}
                  </button>
                  {!collapsed && (
                    <p className="truncate text-xs text-gray-400">
                      {userData?.name || session?.user?.email}
                    </p>
                  )}
                </div>

                {/* Nav */}
                <div className="mb-2 space-y-0.5">
                  {tabs.map((tab) => (
                    <NavItem
                      key={tab.id}
                      icon={tab.icon}
                      label={tab.label}
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      collapsed={collapsed}
                    />
                  ))}
                </div>

                <div className="border-t border-gray-800 pt-2">
                  <NavItem
                    icon={
                      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M10 11l3-3-3-3M13 8H6" />
                    }
                    label="Sign out"
                    danger
                    collapsed={collapsed}
                    onClick={() => signOut({ callbackUrl: "/" })}
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="h-full min-w-0 flex-1 overflow-hidden">
              {activeTab === "gallery" && <GalleryTab session={session} />}
              {activeTab === "settings" && (
                <SettingsTab
                  session={session}
                  userData={userData}
                  setUserData={setUserData}
                />
              )}
              {activeTab === "users" && session?.user?.role === "admin" && (
                <UsersTab session={session} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
// ===== END MAIN PAGE =====
