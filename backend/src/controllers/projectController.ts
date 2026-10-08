import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { AppError } from '../utils/AppError';
import Project from '../models/Project';

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = 'order', order = 'asc', search, techStack, featured, status } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const filter: any = {};
  if (search) filter.$text = { $search: search as string };
  if (techStack) filter.techStack = { $in: (techStack as string).split(',') };
  if (featured !== undefined) filter.featured = featured === 'true';
  if (status) filter.status = status;
  
  const query = Project.find(filter).sort({ [sort as string]: order === 'desc' ? -1 : 1 });
  
  const [projects, total] = await Promise.all([
    query.skip(skip).limit(Number(limit)).lean(),
    Project.countDocuments(filter),
  ]);
  
  sendPaginated(res, projects, Number(page), Number(limit), total);
});

export const getFeaturedProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.find({ featured: true, status: 'completed' })
    .sort({ order: 1 })
    .limit(6)
    .lean();
  sendSuccess(res, projects);
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) throw new AppError('Project not found', 404);
  sendSuccess(res, project);
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);
  sendSuccess(res, project);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.create(req.body);
  sendSuccess(res, project, 'Project created', 201);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) throw new AppError('Project not found', 404);
  sendSuccess(res, project, 'Project updated');
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new AppError('Project not found', 404);
  sendSuccess(res, null, 'Project deleted');
});

export const reorderProjects = asyncHandler(async (req: Request, res: Response) => {
  const { projects } = req.body;
  
  const operations = projects.map((proj: { id: string; order: number }) =>
    Project.findByIdAndUpdate(proj.id, { order: proj.order })
  );
  
  await Promise.all(operations);
  sendSuccess(res, null, 'Projects reordered');
});

export const getTechStack = asyncHandler(async (req: Request, res: Response) => {
  const techStack = await Project.distinct('techStack');
  sendSuccess(res, techStack.sort());
});