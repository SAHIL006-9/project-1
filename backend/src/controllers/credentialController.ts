import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AppError } from '../utils/AppError';
import Credential from '../models/Credential';

export const getCredentials = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = 'issueDate', order = 'desc', type } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const filter: any = {};
  if (type) filter.type = type;
  
  const query = Credential.find(filter).sort({ [sort as string]: order === 'desc' ? -1 : 1 });
  
  const [credentials, total] = await Promise.all([
    query.skip(skip).limit(Number(limit)).lean(),
    Credential.countDocuments(filter),
  ]);
  
  sendPaginated(res, credentials, Number(page), Number(limit), total);
});

export const getCredential = asyncHandler(async (req: Request, res: Response) => {
  const credential = await Credential.findById(req.params.id);
  if (!credential) throw new AppError('Credential not found', 404);
  sendSuccess(res, credential);
});

export const createCredential = asyncHandler(async (req: Request, res: Response) => {
  const credential = await Credential.create(req.body);
  sendSuccess(res, credential, 'Credential created', 201);
});

export const updateCredential = asyncHandler(async (req: Request, res: Response) => {
  const credential = await Credential.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!credential) throw new AppError('Credential not found', 404);
  sendSuccess(res, credential, 'Credential updated');
});

export const deleteCredential = asyncHandler(async (req: Request, res: Response) => {
  const credential = await Credential.findByIdAndDelete(req.params.id);
  if (!credential) throw new AppError('Credential not found', 404);
  sendSuccess(res, null, 'Credential deleted');
});

export const reorderCredentials = asyncHandler(async (req: Request, res: Response) => {
  const { credentials } = req.body;
  
  const operations = credentials.map((cred: { id: string; order: number }) =>
    Credential.findByIdAndUpdate(cred.id, { order: cred.order })
  );
  
  await Promise.all(operations);
  sendSuccess(res, null, 'Credentials reordered');
});