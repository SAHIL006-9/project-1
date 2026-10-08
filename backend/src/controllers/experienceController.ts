import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AppError } from '../utils/AppError';
import Experience from '../models/Experience';

export const getExperiences = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = 'startDate', order = 'desc' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const query = Experience.find().sort({ [sort as string]: order === 'desc' ? -1 : 1 });
  
  const [experiences, total] = await Promise.all([
    query.skip(skip).limit(Number(limit)).lean(),
    Experience.countDocuments(),
  ]);
  
  sendPaginated(res, experiences, Number(page), Number(limit), total);
});

export const getExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) throw new AppError('Experience not found', 404);
  sendSuccess(res, experience);
});

export const createExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await Experience.create(req.body);
  sendSuccess(res, experience, 'Experience created', 201);
});

export const updateExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!experience) throw new AppError('Experience not found', 404);
  sendSuccess(res, experience, 'Experience updated');
});

export const deleteExperience = asyncHandler(async (req: Request, res: Response) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) throw new AppError('Experience not found', 404);
  sendSuccess(res, null, 'Experience deleted');
});

export const reorderExperiences = asyncHandler(async (req: Request, res: Response) => {
  const { experiences } = req.body; // Array of { id, order }
  
  const operations = experiences.map((exp: { id: string; order: number }) =>
    Experience.findByIdAndUpdate(exp.id, { order: exp.order })
  );
  
  await Promise.all(operations);
  sendSuccess(res, null, 'Experiences reordered');
});