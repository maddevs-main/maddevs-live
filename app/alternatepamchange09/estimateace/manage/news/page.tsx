// page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Head from 'next/head';

type News = {
  id?: number;
  title: string;
  slug: string;
  subtitle: string;
  imageUrl: string;
  content: string;
  layout: string;
  tags: string[];
};

type FormNews = Omit<News, 'id' | 'tags'> & { tags: string; slug: string };

const emptyNews: FormNews = {
  title: '',
  subtitle: '',
  imageUrl: '',
  content: '',
  layout: '',
  tags: '',
  slug: '',
};

export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [form, setForm] = useState<FormNews>(emptyNews);
  const [editId, setEditId] = useState<number | null>(null);

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

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(data.news || []);
    } catch (e) {
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isAuthenticated) {
      fetchNews(); 
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

  const openAdd = () => {
    setForm(emptyNews);
    setEditMode(false);
    setShowDialog(true);
    setEditId(null);
  };
  const openEdit = (item: News) => {
    setForm({ ...item, tags: (item.tags ?? []).join(', '), slug: item.slug ?? '' });
    setEditMode(true);
    setShowDialog(true);
    setEditId(item.id ?? null);
  };
  const closeDialog = () => {
    setShowDialog(false);
    setForm(emptyNews);
    setEditId(null);
  };
  const slugify = (str: string) =>
    str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => {
      if (name === 'title') {
        // Auto-generate slug as user types title, unless slug was manually edited
        return { ...f, title: value, slug: f.slug && f.slug !== slugify(f.title) ? f.slug : slugify(value) };
      }
      return { ...f, [name]: value };
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.slug) {
      setError('Slug is required');
      return;
    }
    const payload: News = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editMode && editId !== null) {
        await fetch(`/api/admin-news?id=${editId}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      } else {
        await fetch('/api/admin-news', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      }
      await fetchNews();
      closeDialog();
    } catch (e) {
      setError('Failed to save news');
    }
  };
  const handleDelete = async () => {
    if (editId === null) return;
    try {
      await fetch(`/api/admin-news?id=${editId}`, { method: 'DELETE', headers: getAuthHeaders() });
      await fetchNews();
      closeDialog();
    } catch (e) {
      setError('Failed to delete news');
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 124, fontFamily: 'Inter, Arial, sans-serif' }}>
        <a href="/alternatepamchange09/estimateace" style={{ fontSize: 20, color: "#0074d9", textDecoration: "underline", marginBottom: 8 }}>DASH</a>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, letterSpacing: 1 }}>News Dashboard</h1>

        <button onClick={openAdd} style={{ marginBottom: 16, padding: '10px 20px', fontWeight: 600, borderRadius: 6, background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }}>Add News</button>
        {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Title</th>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Subtitle</th>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Layout</th>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item: News) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>{item.title}</td>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>{item.subtitle}</td>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>{item.layout}</td>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>
                    <button onClick={() => openEdit(item)} style={{ marginRight: 8, padding: '6px 14px', borderRadius: 4, background: '#eee', border: 'none', cursor: 'pointer' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showDialog && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 28, borderRadius: 10, minWidth: 350, maxWidth: 420, boxShadow: '0 2px 12px #0002' }}>
              <h2 style={{ marginBottom: 18, fontWeight: 600 }}>{editMode ? 'Edit News' : 'Add News'}</h2>
              <label style={{ display: 'block', marginBottom: 8 }}>Title<input name="title" value={form.title} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }} /></label>
              <label style={{ display: 'block', marginBottom: 8 }}>Slug<input name="slug" value={form.slug} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }} /></label>
              <label style={{ display: 'block', marginBottom: 8 }}>Subtitle<input name="subtitle" value={form.subtitle} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }} /></label>
              <label style={{ display: 'block', marginBottom: 8 }}>Image URL<input name="imageUrl" value={form.imageUrl} onChange={handleChange} style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }} /></label>
              <label style={{ display: 'block', marginBottom: 8 }}>Content<textarea name="content" value={form.content} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }} /></label>
              <label style={{ display: 'block', marginBottom: 8 }}>Layout<input name="layout" value={form.layout} onChange={handleChange} style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }} /></label>
              <label style={{ display: 'block', marginBottom: 8 }}>Tags (comma separated)<input name="tags" value={form.tags} onChange={handleChange} style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ddd' }} /></label>
              <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: 4, background: '#222', color: '#fff', border: 'none', fontWeight: 600 }}>{editMode ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeDialog} style={{ padding: '8px 18px', borderRadius: 4, background: '#eee', border: 'none' }}>Cancel</button>
                {editMode && <button type="button" onClick={handleDelete} style={{ padding: '8px 18px', borderRadius: 4, background: '#fff', color: 'red', border: '1px solid #eee' }}>Delete</button>}
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}