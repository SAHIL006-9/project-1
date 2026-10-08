import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../utils/AppError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import User from '../models/User';

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    maxAge: 15 * 60 * 1000, // 15 minutes
  };
  const refreshCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
};

const clearTokenCookies = (res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({ email, password, name });

  const payload = { id: user._id.toString(), email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  setTokenCookies(res, accessToken, refreshToken);

  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const payload = { id: user._id.toString(), email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  setTokenCookies(res, accessToken, refreshToken);

  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  }, 'Login successful');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  clearTokenCookies(res);
  sendSuccess(res, null, 'Logged out successfully');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError('Refresh token required', 401);
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new AppError('User not found', 401);
    }

    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    setTokenCookies(res, newAccessToken, newRefreshToken);

    sendSuccess(res, null, 'Token refreshed');
  } catch {
    clearTokenCookies(res);
    throw new AppError('Invalid refresh token', 401);
  }
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, avatar } = req.body;

  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  }, 'Profile updated');
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { currentPassword, newPassword } = req.body;

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  sendSuccess(res, null, 'Password changed successfully');
});