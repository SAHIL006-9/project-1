import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';
import { AppError } from '../utils/AppError';
import Profile from '../models/Profile';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  let profile = await Profile.findOne().sort({ createdAt: -1 });
  if (!profile) {
    profile = await Profile.create({
      name: '',
      title: '',
      bio: '',
      email: '',
      socialLinks: [],
    });
  }
  sendSuccess(res, profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  let profile = await Profile.findOne().sort({ createdAt: -1 });
  
  if (!profile) {
    profile = await Profile.create(req.body);
  } else {
    Object.assign(profile, req.body);
    await profile.save();
  }
  
  sendSuccess(res, profile, 'Profile updated successfully');
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  // Handled by upload middleware, file URL in req.file
  sendSuccess(res, { url: (req as any).fileUrl }, 'Avatar uploaded');
});

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  sendSuccess(res, { url: (req as any).fileUrl }, 'Resume uploaded');
});