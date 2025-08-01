const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const sanitizeHtml = require('sanitize-html');
const jwt = require('jsonwebtoken');
const { checkJwtAuth, setSessions } = require('./middleware/checkJwtAuth');
const JWT_SECRET = 'supersecretjwtkey';

const app = express();
const config = require('./config');
const PORT = config.port;

const {
  sendOnboardCongratsMail,
  sendMeetingRequestMail,
  sendOnboardConfirmedMail,
  sendOnboardRejectedMail,
  sendOnboardDoneMail,
  sendMeetingStatusMail,
} = require('./mailService');
const checkApiKey = require('./middleware/checkApiKey');

// Session management with proper cleanup and validation
const sessions = new Map();

// Share sessions with middleware
setSessions(sessions);

// Enhanced session cleanup with better error handling
const cleanupExpiredSessions = () => {
  try {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [token, session] of sessions.entries()) {
      if (session && session.expiresAt && session.expiresAt < now) {
        sessions.delete(token);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
};

// Clean up expired sessions every 30 minutes (more frequent for better management)
setInterval(cleanupExpiredSessions, 30 * 60 * 1000);

// Initial cleanup
cleanupExpiredSessions();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
        return callback(null, true);
      }

      // Allow your production domain (replace with actual domain)
      const allowedOrigins = [
        'https://maddevs.in', // TODO: Replace with actual frontend domain
        'https://maddevs.in',
        'https://www.maddevs.in',
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // For development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  })
);

// Global error handler for CORS
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
  next(err);
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Mongoose schema
// #manage-onboard-done
const onboardSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    organisation: String,
    title: String,
    message: String,
    date: String,
    time: String,
    meetingId: String,
    meeting_link: { type: String, default: '' }, // NEW FIELD
    approved: { type: Boolean, default: null },
    done: { type: Boolean, default: null }, // #manage-onboard-done
  },
  { timestamps: true }
);
// #manage-onboard-done

const Onboard = mongoose.model('Onboard', onboardSchema);

// Blog schema
const blogSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    slug: { type: String, unique: true }, // #slug-migration
    excerpt: String,
    author: String,
    date: String,
    content: String,
    imageUrl: String,
    detailImageUrl2: String,
    isPinned: Boolean,
    tags: [String], // Added tags field
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

// News schema
const newsSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    slug: { type: String, unique: true }, // #slug-migration
    subtitle: String,
    imageUrl: String,
    content: String,
    layout: String,
    tags: [String],
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

// POST endpoint to save onboard data (public - users can submit meeting requests)
app.post('/api/onboard', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be a valid JSON object',
      });
    }

    const name = sanitizeHtml(req.body.name);
    const email = sanitizeHtml(req.body.email);
    const organisation = sanitizeHtml(req.body.organisation);
    const title = sanitizeHtml(req.body.title);
    const message = sanitizeHtml(req.body.message);
    const date = sanitizeHtml(req.body.date);
    const time = sanitizeHtml(req.body.time);
    const meetingId = sanitizeHtml(req.body.meetingId);
    const approved = req.body.approved ?? null;
    const meeting_link = sanitizeHtml(req.body.meeting_link || '');

    // Enhanced validation with specific error messages
    const missingFields = [];
    if (!name || name.trim() === '') missingFields.push('name');
    if (!email || email.trim() === '') missingFields.push('email');
    if (!organisation || organisation.trim() === '') missingFields.push('organisation');
    if (!title || title.trim() === '') missingFields.push('title');
    if (!message || message.trim() === '') missingFields.push('message');
    if (!date || date.trim() === '') missingFields.push('date');
    if (!time || time.trim() === '') missingFields.push('time');
    if (!meetingId || meetingId.trim() === '') missingFields.push('meetingId');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: `The following fields are required: ${missingFields.join(', ')}`,
        missingFields,
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address',
      });
    }

    // Date validation
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return res.status(400).json({
        error: 'Invalid date',
        message: 'Meeting date cannot be in the past',
      });
    }

    const onboardEntry = new Onboard({
      name,
      email,
      organisation,
      title,
      message,
      date,
      time,
      meetingId,
      approved,
      meeting_link,
    });

    await onboardEntry.save();

    // Send emails (don't fail the request if emails fail)
    try {
      await sendOnboardCongratsMail(email, name, {
        name,
        email,
        organisation,
        title,
        message,
        date,
        time,
        meetingId,
        meeting_link,
      });
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr);
    }

    try {
      await sendMeetingRequestMail({
        name,
        email,
        organisation,
        title,
        message,
        date,
        time,
        meetingId,
        meeting_link,
      });
    } catch (emailErr) {
      console.error('Failed to send notification email:', emailErr);
    }

    res.status(201).json({
      success: true,
      id: onboardEntry._id,
      message: 'Meeting request submitted successfully',
    });
  } catch (err) {
    console.error('Onboard submission error:', err);

    // Handle specific database errors
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Duplicate meeting request',
        message: 'A meeting request with this information already exists',
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid data provided',
        details: Object.values(err.errors).map(e => e.message),
      });
    }

    res.status(500).json({
      error: 'Failed to submit meeting request',
      message: 'An error occurred while processing your request. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// GET endpoint to fetch all onboard meetings
app.get('/api/onboard/all', checkJwtAuth, async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Add filtering support
    const filter = {};
    if (req.query.approved !== undefined) {
      filter.approved = req.query.approved === 'true';
    }
    if (req.query.done !== undefined) {
      filter.done = req.query.done === 'true';
    }

    const meetings = await Onboard.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await Onboard.countDocuments(filter);

    res.json({
      meetings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Fetch onboard meetings error:', err);
    res.status(500).json({
      error: 'Failed to fetch meetings',
      message: 'An error occurred while retrieving meeting data',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// #manage-onboard
// PATCH endpoint to approve/reject onboard
app.patch('/api/onboard/:id/approve', checkJwtAuth, async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be a valid JSON object',
      });
    }

    const { approved, meeting_link } = req.body;

    // Validate approved field
    if (typeof approved !== 'boolean') {
      return res.status(400).json({
        error: 'Invalid approved value',
        message: 'approved field must be a boolean (true or false)',
      });
    }

    // Validate meeting_link if provided
    const sanitizedMeetingLink =
      typeof meeting_link === 'string' ? sanitizeHtml(meeting_link) : undefined;

    // Validate ID format
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'Meeting ID must be a valid 24-character string',
      });
    }

    const updateFields = { approved };
    if (sanitizedMeetingLink !== undefined) {
      updateFields.meeting_link = sanitizedMeetingLink;
    }

    const updated = await Onboard.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: 'Meeting not found',
        message: 'No meeting found with the provided ID',
      });
    }

    // Send emails (don't fail the request if emails fail)
    try {
      if (approved) {
        await sendOnboardConfirmedMail(updated.email, updated.name, updated);
        await sendMeetingStatusMail(updated, 'Confirmed');
      } else {
        await sendOnboardRejectedMail(updated.email, updated.name, updated);
        await sendMeetingStatusMail(updated, 'Rejected');
      }
    } catch (emailErr) {
      console.error('Failed to send status email:', emailErr);
      // Don't fail the request, just log the error
    }

    res.json({
      success: true,
      onboard: updated,
      message: `Meeting ${approved ? 'approved' : 'rejected'} successfully`,
    });
  } catch (err) {
    console.error('Approve/reject onboard error:', err);

    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'The provided meeting ID is not valid',
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid data provided',
        details: Object.values(err.errors).map(e => e.message),
      });
    }

    res.status(500).json({
      error: 'Failed to update meeting status',
      message: 'An error occurred while updating the meeting status',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});
// #manage-onboard

// #manage-onboard-done
// PATCH endpoint to set done true/false
app.patch('/api/onboard/:id/done', checkJwtAuth, async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be a valid JSON object',
      });
    }

    const { done } = req.body;

    // Validate done field
    if (typeof done !== 'boolean') {
      return res.status(400).json({
        error: 'Invalid done value',
        message: 'done field must be a boolean (true or false)',
      });
    }

    // Validate ID format
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'Meeting ID must be a valid 24-character string',
      });
    }

    const updated = await Onboard.findByIdAndUpdate(
      req.params.id,
      { $set: { done } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: 'Meeting not found',
        message: 'No meeting found with the provided ID',
      });
    }

    // Send emails (don't fail the request if emails fail)
    try {
      await sendOnboardDoneMail(updated.email, updated.name, updated);
      await sendMeetingStatusMail(updated, 'Done');
    } catch (emailErr) {
      console.error('Failed to send completion email:', emailErr);
      // Don't fail the request, just log the error
    }

    res.json({
      success: true,
      onboard: updated,
      message: `Meeting marked as ${done ? 'completed' : 'incomplete'} successfully`,
    });
  } catch (err) {
    console.error('Mark done onboard error:', err);

    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'The provided meeting ID is not valid',
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid data provided',
        details: Object.values(err.errors).map(e => e.message),
      });
    }

    res.status(500).json({
      error: 'Failed to update meeting status',
      message: 'An error occurred while updating the meeting completion status',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});
// #manage-onboard-done

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Add filtering support
    const filter = {};
    if (req.query.isPinned !== undefined) {
      filter.isPinned = req.query.isPinned === 'true';
    }
    if (req.query.tags) {
      const tags = Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags];
      filter.tags = { $in: tags };
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Fetch blogs error:', err);
    res.status(500).json({
      error: 'Failed to fetch blogs',
      message: 'An error occurred while retrieving blog data',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// POST seed blogs
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/blogs/seed', checkJwtAuth, async (req, res) => {
    try {
      const blogs = Array.isArray(req.body.blogs)
        ? req.body.blogs.map(blog => ({
          ...blog,
          title: sanitizeHtml(blog.title),
          excerpt: sanitizeHtml(blog.excerpt),
          author: sanitizeHtml(blog.author),
          content: sanitizeHtml(blog.content),
          imageUrl: sanitizeHtml(blog.imageUrl),
          detailImageUrl2: sanitizeHtml(blog.detailImageUrl2),
          tags: Array.isArray(blog.tags) ? blog.tags.map(tag => sanitizeHtml(tag)) : [],
        }))
        : [];
      if (!Array.isArray(blogs)) return res.status(400).json({ error: 'Invalid blogs array' });
      await Blog.deleteMany({});
      await Blog.insertMany(blogs);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });
}

// GET all news
app.get('/api/news', async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Add filtering support
    const filter = {};
    if (req.query.layout) {
      filter.layout = req.query.layout;
    }
    if (req.query.tags) {
      const tags = Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags];
      filter.tags = { $in: tags };
    }

    const news = await News.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await News.countDocuments(filter);

    res.json({
      news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Fetch news error:', err);
    res.status(500).json({
      error: 'Failed to fetch news',
      message: 'An error occurred while retrieving news data',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// POST seed news
if (process.env.NODE_ENV !== 'production') {
  app.post('/api/news/seed', checkJwtAuth, async (req, res) => {
    try {
      const news = Array.isArray(req.body.news)
        ? req.body.news.map(item => ({
          ...item,
          title: sanitizeHtml(item.title),
          subtitle: sanitizeHtml(item.subtitle),
          content: sanitizeHtml(item.content),
          imageUrl: sanitizeHtml(item.imageUrl),
          layout: sanitizeHtml(item.layout),
          tags: Array.isArray(item.tags) ? item.tags.map(tag => sanitizeHtml(tag)) : [],
        }))
        : [];
      if (!Array.isArray(news)) return res.status(400).json({ error: 'Invalid news array' });
      await News.deleteMany({});
      await News.insertMany(news);
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });
}

// #manage-blogs
// GET a single blog by id
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);

    if (isNaN(blogId)) {
      return res.status(400).json({
        error: 'Invalid blog ID',
        message: 'Blog ID must be a valid number',
      });
    }

    const blog = await Blog.findOne({ id: blogId });
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found',
        message: 'No blog found with the provided ID',
      });
    }

    res.json(blog);
  } catch (err) {
    console.error('Fetch single blog error:', err);
    res.status(500).json({
      error: 'Failed to fetch blog',
      message: 'An error occurred while retrieving the blog',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// #slug-migration
// GET blog by slug
app.get('/api/blogs/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || slug.trim() === '') {
      return res.status(400).json({
        error: 'Invalid slug',
        message: 'Blog slug is required',
      });
    }

    const blog = await Blog.findOne({ slug: slug.trim() });
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found',
        message: 'No blog found with the provided slug',
      });
    }

    res.json(blog);
  } catch (err) {
    console.error('Fetch blog by slug error:', err);
    res.status(500).json({
      error: 'Failed to fetch blog',
      message: 'An error occurred while retrieving the blog',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});
// #slug-migration

// #slug-migration
// CREATE a new blog (with slug)
app.post('/api/blogs', checkJwtAuth, async (req, res) => {
  try {
    let {
      id,
      title,
      slug,
      excerpt,
      author,
      date,
      content,
      imageUrl,
      detailImageUrl2,
      isPinned,
      tags,
    } = req.body;
    title = sanitizeHtml(title);
    slug = slug ? sanitizeHtml(slug) : undefined;
    excerpt = sanitizeHtml(excerpt);
    author = sanitizeHtml(author);
    date = sanitizeHtml(date);
    content = sanitizeHtml(content);
    imageUrl = sanitizeHtml(imageUrl);
    detailImageUrl2 = sanitizeHtml(detailImageUrl2);
    tags = Array.isArray(tags) ? tags.map(tag => sanitizeHtml(tag)) : [];
    if (!title || !excerpt || !author || !date || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let newId = id;
    if (!newId) {
      const lastBlog = await Blog.findOne().sort({ id: -1 });
      newId = lastBlog ? lastBlog.id + 1 : 1;
    }
    if (!slug) slug = slugify(title);
    const blog = new Blog({
      id: newId,
      title,
      slug,
      excerpt,
      author,
      date,
      content,
      imageUrl,
      detailImageUrl2,
      isPinned,
      tags,
    });
    await blog.save();
    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
// #slug-migration

// #slug-migration
// UPDATE a blog by id (with slug)
app.put('/api/blogs/:id', checkJwtAuth, async (req, res) => {
  try {
    let { title, slug, excerpt, author, date, content, imageUrl, detailImageUrl2, isPinned, tags } =
      req.body;
    title = sanitizeHtml(title);
    slug = slug ? sanitizeHtml(slug) : undefined;
    excerpt = sanitizeHtml(excerpt);
    author = sanitizeHtml(author);
    date = sanitizeHtml(date);
    content = sanitizeHtml(content);
    imageUrl = sanitizeHtml(imageUrl);
    detailImageUrl2 = sanitizeHtml(detailImageUrl2);
    tags = Array.isArray(tags) ? tags.map(tag => sanitizeHtml(tag)) : [];
    if (!slug && title) slug = slugify(title);
    const updated = await Blog.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          title,
          slug,
          excerpt,
          author,
          date,
          content,
          imageUrl,
          detailImageUrl2,
          isPinned,
          tags,
        },
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Blog not found' });
    res.json({ success: true, blog: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
// #slug-migration

// DELETE a blog by id
app.delete('/api/blogs/:id', checkJwtAuth, async (req, res) => {
  try {
    const deleted = await Blog.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
// #manage-blogs

// #manage-news
// GET a single news by id
app.get('/api/news/:id', async (req, res) => {
  try {
    const newsId = parseInt(req.params.id);

    if (isNaN(newsId)) {
      return res.status(400).json({
        error: 'Invalid news ID',
        message: 'News ID must be a valid number',
      });
    }

    const news = await News.findOne({ id: newsId });
    if (!news) {
      return res.status(404).json({
        error: 'News not found',
        message: 'No news found with the provided ID',
      });
    }

    res.json(news);
  } catch (err) {
    console.error('Fetch single news error:', err);
    res.status(500).json({
      error: 'Failed to fetch news',
      message: 'An error occurred while retrieving the news',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// #slug-migration
// GET news by slug
app.get('/api/news/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || slug.trim() === '') {
      return res.status(400).json({
        error: 'Invalid slug',
        message: 'News slug is required',
      });
    }

    const news = await News.findOne({ slug: slug.trim() });
    if (!news) {
      return res.status(404).json({
        error: 'News not found',
        message: 'No news found with the provided slug',
      });
    }

    res.json(news);
  } catch (err) {
    console.error('Fetch news by slug error:', err);
    res.status(500).json({
      error: 'Failed to fetch news',
      message: 'An error occurred while retrieving the news',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});
// #slug-migration

// #slug-migration
// CREATE a new news (with slug)
app.post('/api/news', checkJwtAuth, async (req, res) => {
  try {
    let { id, title, slug, subtitle, imageUrl, content, layout, tags } = req.body;
    title = sanitizeHtml(title);
    slug = slug ? sanitizeHtml(slug) : undefined;
    subtitle = sanitizeHtml(subtitle);
    content = sanitizeHtml(content);
    imageUrl = sanitizeHtml(imageUrl);
    layout = sanitizeHtml(layout);
    tags = Array.isArray(tags) ? tags.map(tag => sanitizeHtml(tag)) : [];
    if (!title || !subtitle || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let newId = id;
    if (!newId) {
      const lastNews = await News.findOne().sort({ id: -1 });
      newId = lastNews ? lastNews.id + 1 : 1;
    }
    if (!slug) slug = slugify(title);
    const news = new News({ id: newId, title, slug, subtitle, imageUrl, content, layout, tags });
    await news.save();
    res.status(201).json({ success: true, news });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
// #slug-migration

// #slug-migration
// UPDATE a news by id (with slug)
app.put('/api/news/:id', checkJwtAuth, async (req, res) => {
  try {
    let { title, slug, subtitle, imageUrl, content, layout, tags } = req.body;
    title = sanitizeHtml(title);
    slug = slug ? sanitizeHtml(slug) : undefined;
    subtitle = sanitizeHtml(subtitle);
    content = sanitizeHtml(content);
    imageUrl = sanitizeHtml(imageUrl);
    layout = sanitizeHtml(layout);
    tags = Array.isArray(tags) ? tags.map(tag => sanitizeHtml(tag)) : [];
    if (!slug && title) slug = slugify(title);
    const updated = await News.findOneAndUpdate(
      { id: req.params.id },
      { $set: { title, slug, subtitle, imageUrl, content, layout, tags } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'News not found' });
    res.json({ success: true, news: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
// #slug-migration

// DELETE a news by id
app.delete('/api/news/:id', checkJwtAuth, async (req, res) => {
  try {
    const deleted = await News.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'News not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});
// #manage-news

// #slug-migration
function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
// #slug-migration

// Token validation endpoint with enhanced session info
app.post('/api/validate-token', checkJwtAuth, (req, res) => {
  try {
    // If we reach here, the token is valid (checkJwtAuth middleware passed)
    const session = req.session;
    const timeLeft = session.expiresAt - Date.now();

    res.json({
      valid: true,
      message: 'Token is valid',
      timestamp: new Date().toISOString(),
      session: {
        userId: session.userId,
        username: session.username,
        expiresAt: new Date(session.expiresAt).toISOString(),
        lastActivity: new Date(session.lastActivity).toISOString(),
        timeLeft: Math.max(0, timeLeft),
        timeLeftDays: Math.ceil(timeLeft / (24 * 60 * 60 * 1000)),
      }
    });
  } catch (err) {
    console.error('Token validation error:', err);
    res.status(500).json({
      error: 'Token validation failed',
      message: 'An error occurred while validating the token',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Session refresh endpoint
app.post('/api/refresh-session', checkJwtAuth, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const session = sessions.get(token);

    if (!session) {
      return res.status(401).json({
        error: 'Session not found',
        message: 'Session has expired or is invalid',
      });
    }

    // Extend session by 7 days
    const newExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    session.expiresAt = newExpiresAt;
    session.lastActivity = Date.now();

    sessions.set(token, session);

    res.json({
      message: 'Session refreshed successfully',
      session: {
        expiresAt: new Date(newExpiresAt).toISOString(),
        lastActivity: new Date(session.lastActivity).toISOString(),
      }
    });
  } catch (err) {
    console.error('Session refresh error:', err);
    res.status(500).json({
      error: 'Session refresh failed',
      message: 'An error occurred while refreshing the session',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Login route with enhanced session management
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username === 'christiangrey' && password === 'weACEinhouse@09') {
      // Clean up any existing sessions for this user first
      for (const [existingToken, session] of sessions.entries()) {
        if (session && session.username === username) {
          sessions.delete(existingToken);
        }
      }

      // Create session with 7 days expiration
      const expiresIn = '7d';
      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn });
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

      // Store session with enhanced data
      const sessionData = {
        userId: 'admin',
        username: username,
        expiresAt: expiresAt,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown'
      };

      sessions.set(token, sessionData);

      console.log(`New session created for user: ${username}, Token: ${token.substring(0, 20)}...`);

      return res.json({
        token,
        expiresIn: '7d',
        message: 'Login successful',
        sessionInfo: {
          expiresAt: new Date(expiresAt).toISOString(),
          createdAt: new Date(sessionData.createdAt).toISOString()
        }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication error', details: err.message });
  }
});

// Logout route
app.post('/api/logout', checkJwtAuth, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    // Remove session
    sessions.delete(token);

    res.json({
      message: 'Logout successful',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// Session status route
app.get('/api/session/status', checkJwtAuth, (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const session = sessions.get(token);

    if (!session) {
      return res.status(401).json({
        error: 'Session not found',
        message: 'Session has expired or is invalid',
      });
    }

    const timeLeft = session.expiresAt - Date.now();

    res.json({
      valid: true,
      session: {
        userId: session.userId,
        username: session.username,
        expiresAt: new Date(session.expiresAt).toISOString(),
        timeLeft: Math.max(0, timeLeft),
        timeLeftDays: Math.ceil(timeLeft / (24 * 60 * 60 * 1000)),
      },
    });
  } catch (err) {
    console.error('Session status error:', err);
    res.status(500).json({
      error: 'Session status check failed',
      message: 'An error occurred while checking session status',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid data provided',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'The provided ID is not valid',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate Error',
      message: 'A record with this information already exists',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided token is invalid',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'The provided token has expired',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('CORS enabled for development and production domains');
  console.log('Backend API secret key:', config.api.secretKey);
});

