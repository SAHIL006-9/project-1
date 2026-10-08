import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { uploadToCloudinary } from '../config/cloudinary';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return sendSuccess(res, null, 'No file uploaded', 400);
  }
  
  const folder = req.body.folder || 'portfolio';
  const result = await uploadToCloudinary(req.file, folder);
  
  sendSuccess(res, { url: result.url, publicId: result.publicId }, 'Image uploaded');
});

export const uploadMultipleImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return sendSuccess(res, null, 'No files uploaded', 400);
  }
  
  const folder = req.body.folder || 'portfolio';
  const results = await Promise.all(
    files.map(file => uploadToCloudinary(file, folder))
  );
  
  sendSuccess(res, results.map(r => ({ url: r.url, publicId: r.publicId })), 'Images uploaded');
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.body;
  if (!publicId) {
    return sendSuccess(res, null, 'Public ID required', 400);
  }
  
  const { deleteFromCloudinary } = await import('../config/cloudinary');
  await deleteFromCloudinary(publicId);
  
  sendSuccess(res, null, 'Image deleted');
});