"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to change password.");
      } else {
        setSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirm("");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <div className="text-center py-12">Please log in.</div>;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="card">
        <h1 className="text-xl font-bold text-wc-darkblue mb-4">👤 My Profile</h1>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Display name:</span>
            <span className="font-semibold">{session.user.alias}</span>
          </div>
          {session.user.isAdmin && (
            <div className="flex justify-between">
              <span className="text-gray-500">Role:</span>
              <span className="text-wc-red font-semibold">Administrator</span>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-wc-darkblue mb-4">🔑 Change Password</h2>
        {session.user.mustChangePassword && (
          <div className="alert-warning mb-4 text-sm">
            ⚠️ Please change your temporary password before entering predictions.
          </div>
        )}
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="form-label">Current password</label>
            <input
              type="password"
              className="form-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="form-label">New password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <div>
            <label className="form-label">Confirm new password</label>
            <input
              type="password"
              className="form-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="alert-error text-sm">{error}</div>}
          {success && <div className="alert-success text-sm">{success}</div>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Changing…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
