// page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Head from 'next/head';

type Blog = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  content: string;
  imageUrl: string;
  detailImageUrl2: string;
  isPinned: boolean;
  tags: string[];
};

type FormBlog = Omit<Blog, 'id' | 'tags'> & { tags: string; slug: string };

const emptyBlog: FormBlog = {
  title: '',
  excerpt: '',
  author: '',
  date: '',
  content: '',
  imageUrl: '',
  detailImageUrl2: '',
  isPinned: false,
  tags: '',
  slug: '',
};

export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [form, setForm] = useState<FormBlog>(emptyBlog);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);

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

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (e) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isAuthenticated) {
      fetchBlogs(); 
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
    setForm(emptyBlog);
    setEditMode(false);
    setShowDialog(true);
    setEditId(null);
  };
  const openEdit = (blog: Blog) => {
    setForm({ ...blog, tags: (blog.tags ?? []).join(', '), slug: blog.slug ?? '' });
    setEditMode(true);
    setShowDialog(true);
    setEditId(blog.id ?? null);
  };
  const closeDialog = () => {
    setShowDialog(false);
    setForm(emptyBlog);
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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => {
        if (name === 'title') {
          // Auto-generate slug as user types title, unless slug was manually edited
          return { ...f, title: value, slug: f.slug && f.slug !== slugify(f.title) ? f.slug : slugify(value) };
        }
        return { ...f, [name]: value };
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.slug) {
      setError('Slug is required');
      return;
    }
    const payload: Blog = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editMode && editId !== null) {
        await fetch(`/api/admin-blogs?id=${editId}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      } else {
        await fetch('/api/admin-blogs', { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      }
      await fetchBlogs();
      closeDialog();
    } catch (e) {
      setError('Failed to save blog');
    }
  };
  const handleDelete = async () => {
    if (editId === null) return;
    try {
      await fetch(`/api/admin-blogs?id=${editId}`, { method: 'DELETE', headers: getAuthHeaders() });
      await fetchBlogs();
      closeDialog();
    } catch (e) {
      setError('Failed to delete blog');
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 132, fontFamily: 'Inter, Arial, sans-serif' }}>
        <a href="/alternatepamchange09/estimateace" style={{ fontSize: 20, color: "#0074d9", textDecoration: "underline", marginBottom: 8 }}>DASH</a>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, letterSpacing: 1 }}>Blog Dashboard</h1>
        <button onClick={openAdd} style={{ marginBottom: 16, padding: '10px 20px', fontWeight: 600, borderRadius: 6, background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Blog</button>
        {loading ? <div>Loading...</div> : error ? <div style={{ color: 'red' }}>{error}</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Title</th>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Author</th>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Date</th>
                <th style={{ border: '1px solid #eee', padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog: Blog) => (
                <tr key={blog.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>{blog.title}</td>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>{blog.author}</td>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>{blog.date}</td>
                  <td style={{ border: '1px solid #eee', padding: 10 }}>
                    <button onClick={() => setViewBlog(blog)} style={{ marginRight: 8, padding: '6px 14px', borderRadius: 4, background: '#eee', border: 'none', cursor: 'pointer' }}>View</button>
                    <button onClick={() => openEdit(blog)} style={{ marginRight: 8, padding: '6px 14px', borderRadius: 4, background: '#f5f5f5', border: 'none', cursor: 'pointer' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {viewBlog && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 350, maxWidth: 500, boxShadow: '0 2px 12px #0002', position: 'relative' }}>
              <button onClick={() => setViewBlog(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
              <h2 style={{ marginBottom: 18, fontWeight: 600 }}>Blog Details</h2>
              <div style={{ fontSize: 15, lineHeight: 1.7 }}>
                <div><b>Title:</b> {viewBlog.title}</div>
                <div><b>Excerpt:</b> {viewBlog.excerpt}</div>
                <div><b>Author:</b> {viewBlog.author}</div>
                <div><b>Date:</b> {viewBlog.date}</div>
                <div><b>Content:</b> <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f8f8', padding: 8, borderRadius: 4 }}>{viewBlog.content}</pre></div>
                <div><b>Image URL:</b> <a href={viewBlog.imageUrl} target="_blank" rel="noopener noreferrer">{viewBlog.imageUrl}</a></div>
                <div><b>Detail Image URL:</b> <a href={viewBlog.detailImageUrl2} target="_blank" rel="noopener noreferrer">{viewBlog.detailImageUrl2}</a></div>
                <div><b>Is Pinned:</b> {viewBlog.isPinned ? 'Yes' : 'No'}</div>
                <div><b>Tags:</b> {viewBlog.tags && viewBlog.tags.length > 0 ? viewBlog.tags.join(', ') : 'None'}</div>
              </div>
            </div>
          </div>
        )}
        {showDialog && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 350, maxWidth: 400 }}>
              <h2 style={{ marginBottom: 16 }}>{editMode ? 'Edit Blog' : 'Add Blog'}</h2>

              <label>Title<input name="title" value={form.title} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Slug<input name="slug" value={form.slug} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Excerpt<input name="excerpt" value={form.excerpt} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Author<input name="author" value={form.author} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Date<input name="date" value={form.date} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Content<textarea name="content" value={form.content} onChange={handleChange} required style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Image URL<input name="imageUrl" value={form.imageUrl} onChange={handleChange} style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Detail Image URL<input name="detailImageUrl2" value={form.detailImageUrl2} onChange={handleChange} style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <label>Is Pinned<input name="isPinned" type="checkbox" checked={form.isPinned} onChange={handleChange} style={{ marginLeft: 8 }} /></label>
              <label>Tags (comma separated)<input name="tags" value={form.tags} onChange={handleChange} style={{ width: '100%', marginBottom: 8, border: '1px solid #ccc', borderRadius: 4, background: '#fafbfc', padding: 8 }} /></label>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{ padding: '8px 16px' }}>{editMode ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeDialog} style={{ padding: '8px 16px' }}>Cancel</button>
                {editMode && <button type="button" onClick={handleDelete} style={{ padding: '8px 16px', color: 'red' }}>Delete</button>}
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}