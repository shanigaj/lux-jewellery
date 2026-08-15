import { Request, Response } from "express";
import Blog from "../models/Blog";
import { logAudit } from "./audit.controller";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// @desc    List blogs (admin sees all; storefront can pass ?status=published)
// @route   GET /api/blogs
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Get one blog by slug (increments views)
// @route   GET /api/blogs/:slug
export const getBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Admin
export const createBlog = async (req: Request, res: Response) => {
  try {
    const slug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.title || "");
    const blog = await Blog.create({ ...req.body, slug });
    logAudit(req, "Created Blog", blog.title);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Admin
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const update = { ...req.body };
    if (update.title && !update.slug) update.slug = slugify(update.title);
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: (error as Error).message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Admin
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: "Blog not found" });
      return;
    }
    logAudit(req, "Deleted Blog", blog.title);
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
