import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import About from '../models/About';

export const getAbout = asyncHandler(async (req: Request, res: Response) => {
  let about = await About.findOne().sort({ createdAt: -1 });
  if (!about) {
    about = await About.create({
      description: '',
      skills: [],
      interests: [],
      stats: [],
    });
  }
  sendSuccess(res, about);
});

export const updateAbout = asyncHandler(async (req: Request, res: Response) => {
  let about = await About.findOne().sort({ createdAt: -1 });
  
  if (!about) {
    about = await About.create(req.body);
  } else {
    Object.assign(about, req.body);
    await about.save();
  }
  
  sendSuccess(res, about, 'About updated successfully');
});

export const addSkill = asyncHandler(async (req: Request, res: Response) => {
  let about = await About.findOne().sort({ createdAt: -1 });
  if (!about) {
    about = await About.create({ description: '', skills: [], interests: [], stats: [] });
  }
  about.skills.push(req.body);
  await about.save();
  sendSuccess(res, about, 'Skill added');
});

export const updateSkill = asyncHandler(async (req: Request, res: Response) => {
  const { skillId } = req.params;
  const about = await About.findOne().sort({ createdAt: -1 });
  if (!about) throw new Error('About not found');
  
  const skillIndex = about.skills.findIndex(s => s._id?.toString() === skillId);
  if (skillIndex === -1) throw new Error('Skill not found');
  
  about.skills[skillIndex] = { ...about.skills[skillIndex], ...req.body };
  await about.save();
  sendSuccess(res, about, 'Skill updated');
});

export const deleteSkill = asyncHandler(async (req: Request, res: Response) => {
  const { skillId } = req.params;
  const about = await About.findOne().sort({ createdAt: -1 });
  if (!about) throw new Error('About not found');
  
  about.skills = about.skills.filter(s => s._id?.toString() !== skillId);
  await about.save();
  sendSuccess(res, about, 'Skill deleted');
});