"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Onboard = {
  _id: string;
  name: string;
  email: string;
  organisation: string;
  title: string;
  message: string;
  date: string;
  time: string;
  meetingId: string;
  meeting_link?: string;
  approved?: boolean | null;
  done?: boolean | null;
};

export default function Page() {
  const router = useRouter();
  const [onboards, setOnboards] = useState<Onboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState<string>("");
  const [viewOnboard, setViewOnboard] = useState<Onboard | null>(null);
  const [view, setView] = useState<'default' | 'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('default');
  const [approvalDialog, setApprovalDialog] = useState<{ show: boolean; onboardId: string | null; meetingLink: string }>({ show: false, onboardId: null, meetingLink: "" });

  // Check JWT on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_jwt");
    if (!token) {
      router.replace("/admin-login");
    }
  }, [router]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_jwt");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } as HeadersInit
      : { "Content-Type": "application/json" } as HeadersInit;
  };

  const fetchOnboards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboard/all");
      const data = await res.json();
      setOnboards(data.meetings || []);
    } catch (e) {
      setError("Failed to fetch onboard entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOnboards(); }, []);

  const handleApproveClick = (id: string) => {
    setApprovalDialog({ show: true, onboardId: id, meetingLink: "" });
  };

  const handleApproveConfirm = async (approved: boolean) => {
    if (!approvalDialog.onboardId) return;
    setUpdating(approvalDialog.onboardId + approved);
    try {
      const res = await fetch(`/api/admin-onboard?id=${approvalDialog.onboardId}&action=approve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ approved, meeting_link: approved ? approvalDialog.meetingLink : undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update approval");
      await fetchOnboards();
      setApprovalDialog({ show: false, onboardId: null, meetingLink: "" });
    } catch (e: any) {
      setError(e.message || "Failed to update approval");
    } finally {
      setUpdating("");
    }
  };

  const handleMeetingLinkChange = (value: string) => {
    setApprovalDialog(prev => ({ ...prev, meetingLink: value }));
  };

  const all = onboards;
  const approved = onboards.filter(o => o.approved === true && o.done !== true);
  const rejected = onboards.filter(o => o.approved === false);
  const pending = onboards.filter(o => o.approved === null || typeof o.approved === "undefined");
  const completed = onboards.filter(o => o.done === true);

  const handleDone = async (id: string) => {
    setUpdating(id + "done");
    try {
      const res = await fetch(`/api/admin-onboard?id=${id}&action=done`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ done: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update done status");
      await fetchOnboards();
    } catch (e: any) {
      setError(e.message || "Failed to update done status");
    } finally {
      setUpdating("");
    }
  };

  // ... (rest of the UI rendering code remains unchanged)
  // You can paste the previous table and dialog rendering code here.

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, letterSpacing: 1 }}>Onboard Management</h1>
      {/* ... rest of the UI ... */}
      {/* (Paste the previous rendering code for tables, dialogs, etc.) */}
    </div>
  );
} 