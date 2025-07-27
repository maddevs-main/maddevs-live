// page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Head from 'next/head';

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
  meeting_link?: string; // NEW FIELD
  approved?: boolean | null;
  done?: boolean | null;
};

// Get API key from env (for admin UI)
const API_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY;

export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("admin_jwt");
      if (!token) {
        router.replace("/alternatepamchange09");
        return;
      }

      // Validate token with backend
      try {
        const response = await fetch('/api/validate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Token is invalid, clear it and redirect
          localStorage.removeItem("admin_jwt");
          router.replace("/alternatepamchange09");
          return;
        }

        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // Network error or other issue, redirect to login
        localStorage.removeItem("admin_jwt");
        router.replace("/alternatepamchange09");
      }
    };

    validateToken();
  }, [router]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_jwt");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };
  const [onboards, setOnboards] = useState<Onboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [updating, setUpdating] = useState<string>('');
  const [viewOnboard, setViewOnboard] = useState<Onboard | null>(null);
  const [view, setView] = useState<'default' | 'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('default');
  
  // NEW: Dialog state for approval
  const [approvalDialog, setApprovalDialog] = useState<{ show: boolean; onboardId: string | null; meetingLink: string }>({
    show: false,
    onboardId: null,
    meetingLink: ''
  });

  const fetchOnboards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboard/all');
      const data = await res.json();
      setOnboards(data.meetings || []);
    } catch (e) {
      setError('Failed to fetch onboard entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isAuthenticated) {
      fetchOnboards(); 
    }
  }, [isAuthenticated]);

  // Show loading or redirect if not authenticated
  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "#222222",
        color: "white",
        fontFamily: "Inter, Arial, sans-serif"
      }}>
        {isLoading ? "Loading..." : "Redirecting to login..."}
      </div>
    );
  }

  // NEW: Handle approval dialog
  const handleApproveClick = (id: string) => {
    setApprovalDialog({
      show: true,
      onboardId: id,
      meetingLink: ''
    });
  };

  // NEW: Handle approval confirmation
  const handleApproveConfirm = async (approved: boolean) => {
    if (!approvalDialog.onboardId) return;
    
    setUpdating(approvalDialog.onboardId + approved);
    try {
      const res = await fetch(`/api/admin-onboard?id=${approvalDialog.onboardId}&action=approve`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          approved,
          meeting_link: approved ? approvalDialog.meetingLink : undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update approval');
      await fetchOnboards();
      setApprovalDialog({ show: false, onboardId: null, meetingLink: '' });
    } catch (e: any) {
      setError(e.message || 'Failed to update approval');
    } finally {
      setUpdating('');
    }
  };

  // NEW: Handle meeting link input change
  const handleMeetingLinkChange = (value: string) => {
    setApprovalDialog(prev => ({ ...prev, meetingLink: value }));
  };

  const all = onboards;
  const approved = onboards.filter(o => o.approved === true && o.done !== true);
  const rejected = onboards.filter(o => o.approved === false);
  const pending = onboards.filter(o => o.approved === null || typeof o.approved === 'undefined');
  const completed = onboards.filter(o => o.done === true);

  const handleDone = async (id: string) => {
    setUpdating(id + 'done');
    try {
      const res = await fetch(`/api/admin-onboard?id=${id}&action=done`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ done: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update done status');
      await fetchOnboards();
    } catch (e: any) {
      setError(e.message || 'Failed to update done status');
    } finally {
      setUpdating('');
    }
  };

  const Table = ({ title, data, showDone, showApprove }: { title: string, data: Onboard[], showDone?: boolean, showApprove?: boolean }) => (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>{title}</h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ border: '1px solid #eee', padding: 10 }}>Name</th>
            <th style={{ border: '1px solid #eee', padding: 10 }}>Email</th>
            <th style={{ border: '1px solid #eee', padding: 10 }}>Organisation</th>
            <th style={{ border: '1px solid #eee', padding: 10 }}>Title</th>
            <th style={{ border: '1px solid #eee', padding: 10 }}>Date</th>
            <th style={{ border: '1px solid #eee', padding: 10 }}>Time</th>
            <th style={{ border: '1px solid #eee', padding: 10 }}>Approved</th>
            {showDone && <th style={{ border: '1px solid #eee', padding: 10 }}>Done</th>}
            <th style={{ border: '1px solid #eee', padding: 10 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((o) => (
            <tr key={o._id} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setViewOnboard(o)}>
              <td style={{ border: '1px solid #eee', padding: 10 }}>{o.name}</td>
              <td style={{ border: '1px solid #eee', padding: 10 }}>{o.email}</td>
              <td style={{ border: '1px solid #eee', padding: 10 }}>{o.organisation}</td>
              <td style={{ border: '1px solid #eee', padding: 10 }}>{o.title}</td>
              <td style={{ border: '1px solid #eee', padding: 10 }}>{o.date}</td>
              <td style={{ border: '1px solid #eee', padding: 10 }}>{o.time}</td>
              <td style={{ border: '1px solid #eee', padding: 10 }}>{o.approved === true ? 'Yes' : o.approved === false ? 'No' : 'None'}</td>
              {showDone && <td style={{ border: '1px solid #eee', padding: 10 }}>{o.done === true ? 'Yes' : 'No'}</td>}
              <td style={{ border: '1px solid #eee', padding: 10 }} onClick={e => e.stopPropagation()}>
                {showApprove && (
                  <button 
                    onClick={() => handleApproveClick(o._id)} 
                    disabled={updating === o._id + 'true' || updating === o._id + 'false'} 
                    style={{ 
                      padding: '6px 14px', 
                      borderRadius: 4, 
                      background: '#2ecc40', 
                      color: '#fff', 
                      border: 'none', 
                      cursor: 'pointer', 
                      opacity: (updating === o._id + 'true' || updating === o._id + 'false') ? 0.5 : 1 
                    }}
                  >
                    Approve
                  </button>
                )}
                {showDone && o.done !== true && <button onClick={() => handleDone(o._id)} disabled={updating === o._id + 'done'} style={{ marginLeft: 8, padding: '6px 14px', borderRadius: 4, background: '#0074d9', color: '#fff', border: 'none', cursor: 'pointer', opacity: updating === o._id + 'done' ? 0.5 : 1 }}>Done</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 124, fontFamily: 'Inter, Arial, sans-serif' }}>
         <a href="/alternatepamchange09/estimateace" style={{ fontSize: 20, color: "#0074d9", textDecoration: "underline", marginBottom: 8 }}>DASH</a>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, letterSpacing: 1 }}>Onboard Management</h1>
        <div style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setView('default')} style={{ padding: '8px 18px', borderRadius: 4, background: view === 'default' ? '#222' : '#eee', color: view === 'default' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Default</button>
          <button onClick={() => setView('all')} style={{ padding: '8px 18px', borderRadius: 4, background: view === 'all' ? '#222' : '#eee', color: view === 'all' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>All</button>
          <button onClick={() => setView('pending')} style={{ padding: '8px 18px', borderRadius: 4, background: view === 'pending' ? '#222' : '#eee', color: view === 'pending' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Pending</button>
          <button onClick={() => setView('approved')} style={{ padding: '8px 18px', borderRadius: 4, background: view === 'approved' ? '#222' : '#eee', color: view === 'approved' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Approved</button>
          <button onClick={() => setView('rejected')} style={{ padding: '8px 18px', borderRadius: 4, background: view === 'rejected' ? '#222' : '#eee', color: view === 'rejected' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Rejected</button>
          <button onClick={() => setView('completed')} style={{ padding: '8px 18px', borderRadius: 4, background: view === 'completed' ? '#222' : '#eee', color: view === 'completed' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Completed</button>
        </div>
        {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
          <>
            {view === 'default' && <>
              <Table title="Pending Onboards" data={pending} showApprove />
              <Table title="Approved Onboards" data={approved} showDone />
            </>}
            {view === 'all' && <Table title="All Onboards" data={all} />}
            {view === 'pending' && <Table title="Pending Onboards" data={pending} showApprove />}
            {view === 'approved' && <Table title="Approved Onboards" data={approved} showDone />}
            {view === 'rejected' && <Table title="Rejected Onboards" data={rejected} />}
            {view === 'completed' && <Table title="Meeting Complete" data={completed} showDone />}
          </>
        )}
        
        {/* NEW: Approval Dialog */}
        {approvalDialog.show && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 400, maxWidth: 500, boxShadow: '0 2px 12px #0002', position: 'relative' }}>
              <button 
                onClick={() => setApprovalDialog({ show: false, onboardId: null, meetingLink: '' })} 
                style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}
              >
                &times;
              </button>
              <h2 style={{ marginBottom: 18, fontWeight: 600 }}>Approve Meeting</h2>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Meeting Link (Optional):</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={approvalDialog.meetingLink}
                  onChange={(e) => handleMeetingLinkChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    fontSize: 14,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setApprovalDialog({ show: false, onboardId: null, meetingLink: '' })}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 4,
                    background: '#f5f5f5',
                    color: '#333',
                    border: '1px solid #ddd',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApproveConfirm(false)}
                  disabled={updating === approvalDialog.onboardId + 'false'}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 4,
                    background: '#ff4136',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: updating === approvalDialog.onboardId + 'false' ? 0.5 : 1
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveConfirm(true)}
                  disabled={updating === approvalDialog.onboardId + 'true'}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 4,
                    background: '#2ecc40',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    opacity: updating === approvalDialog.onboardId + 'true' ? 0.5 : 1
                  }}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
        
        {viewOnboard && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 350, maxWidth: 500, boxShadow: '0 2px 12px #0002', position: 'relative' }}>
              <button onClick={() => setViewOnboard(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
              <h2 style={{ marginBottom: 18, fontWeight: 600 }}>Onboard Details</h2>
              <div style={{ fontSize: 15, lineHeight: 1.7 }}>
                <div><b>Name:</b> {viewOnboard.name}</div>
                <div><b>Email:</b> {viewOnboard.email}</div>
                <div><b>Organisation:</b> {viewOnboard.organisation}</div>
                <div><b>Title:</b> {viewOnboard.title}</div>
                <div><b>Message:</b> <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 8, borderRadius: 4 }}>{viewOnboard.message}</pre></div>
                <div><b>Date:</b> {viewOnboard.date}</div>
                <div><b>Time:</b> {viewOnboard.time}</div>
                <div><b>Meeting ID:</b> {viewOnboard.meetingId}</div>
                <div><b>Meeting Link:</b> {viewOnboard.meeting_link ? <a href={viewOnboard.meeting_link} target="_blank" rel="noopener noreferrer" style={{ color: '#0074d9' }}>{viewOnboard.meeting_link}</a> : 'Not set'}</div>
                <div><b>Approved:</b> {viewOnboard.approved === true ? 'Yes' : viewOnboard.approved === false ? 'No' : 'None'}</div>
                <div><b>Done:</b> {viewOnboard.done === true ? 'Yes' : viewOnboard.done === false ? 'No' : 'None'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}