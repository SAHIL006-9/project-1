import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AppError } from '../utils/AppError';
import Certification from '../models/Certification';

export const getCertifications = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = 'issueDate', order = 'desc', category, isActive } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const filter: any = {};
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  
  const query = Certification.find(filter).sort({ [sort as string]: order === 'desc' ? -1 : 1 });
  
  const [certifications, total] = await Promise.all([
    query.skip(skip).limit(Number(limit)).lean(),
    Certification.countDocuments(filter),
  ]);
  
  sendPaginated(res, certifications, Number(page), Number(limit), total);
});

export const getActiveCertifications = asyncHandler(async (req: Request, res: Response) => {
  const certifications = await Certification.find({ isActive: true })
    .sort({ order: 1, issueDate: -1 })
    .lean();
  sendSuccess(res, certifications);
});

export const getCertification = asyncHandler(async (req: Request, res: Response) => {
  const certification = await Certification.findById(req.params.id);
  if (!certification) throw new AppError('Certification not found', 404);
  sendSuccess(res, certification);
});

export const createCertification = asyncHandler(async (req: Request, res: Response) => {
  const certification = await Certification.create(req.body);
  sendSuccess(res, certification, 'Certification created', 201);
});

export const updateCertification = asyncHandler(async (req: Request, res: Response) => {
  const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!certification) throw new AppError('Certification not found', 404);
  sendSuccess(res, certification, 'Certification updated');
});

export const deleteCertification = asyncHandler(async (req: Request, res: Response) => {
  const certification = await Certification.findByIdAndDelete(req.params.id);
  if (!certification) throw new AppError('Certification not found', 404);
  sendSuccess(res, null, 'Certification deleted');
});

export const reorderCertifications = asyncHandler(async (req: Request, res: Response) => {
  const { certifications } = req.body;
  
  const operations = certifications.map((cert: { id: string; order: number }) =>
    Certification.findByIdAndUpdate(cert.id, { order: cert.order })
  );
  
  await Promise.all(operations);
  sendSuccess(res, null, 'Certifications reordered');
});