import { Request, Response, NextFunction } from "express";
import Product from "../models/Product";
import NodeCache from "node-cache";

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

/**
 * @desc    Get all products (with pagination, filtering, search)
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      metalType,
      minPrice,
      maxPrice,
      sort,
    } = req.query;

    // Cache key based on query params
    const cacheKey = `products_${JSON.stringify(req.query)}`;
    if (cache.has(cacheKey)) {
      res.status(200).json(cache.get(cacheKey));
      return;
    }

    const query: any = {};

    // Filtering
    if (category) {
      if (category === "diamonds") {
        // "Diamonds" isn't a stored category — it's a curated view of every
        // piece set with diamonds, drawn from across the catalogue.
        query.$or = [
          { gemstone: { $regex: "diamond", $options: "i" } },
          { name: { $regex: "diamond", $options: "i" } },
        ];
      } else {
        query.category = category;
      }
    }
    // metalType may arrive as one value or several (filter checkboxes / mega-menu).
    if (metalType) {
      const metals = Array.isArray(metalType) ? metalType : [metalType];
      query.metalType = { $in: metals };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    const responseData = {
      status: "success",
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    };

    cache.set(cacheKey, responseData);

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ status: "error", message: "Product not found" });
      return;
    }
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    cache.flushAll(); // Clear cache when new product is added
    res.status(201).json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404).json({ status: "error", message: "Product not found" });
      return;
    }
    cache.flushAll();
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ status: "error", message: "Product not found" });
      return;
    }
    cache.flushAll();
    res.status(200).json({ status: "success", message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
