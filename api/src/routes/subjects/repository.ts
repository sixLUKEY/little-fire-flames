import { Subject } from '../../db/models/subjects.model';
import { CreateSubjectDto, DeleteSubjectDto, GetSubjectDto, UpdateSubjectDto } from './dto';

export const getSubjects = async (dto: GetSubjectDto): Promise<Subject[]> => {
  const { subjectId } = dto;
  
  if (subjectId) {
    const foundSubject = await Subject.findOne({
      where: {
        subjectId: subjectId,
      },
    });

    return foundSubject ? [foundSubject] : [];
  }

  // If no subjectId provided, return all subjects
  const allSubjects = await Subject.findAll();
  return allSubjects || [];
};

export const createSubject = async (dto: CreateSubjectDto): Promise<Subject> => {
  const { name, description } = dto;

  // Generate 8-digit subject ID
  const generateSubjectId = (): string => {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  };

  let subjectId = generateSubjectId();
  // Ensure uniqueness (simple retry, in production you might want a better approach)
  let existing = await Subject.findOne({ where: { subjectId } });
  while (existing) {
    subjectId = generateSubjectId();
    existing = await Subject.findOne({ where: { subjectId } });
  }

  const newSubject = await Subject.create({
    name: name,
    description: description,
    subjectId: subjectId,
  });

  return newSubject;
};

export const updateSubject = async (subjectId: string, dto: UpdateSubjectDto): Promise<Subject> => {
  const subjectToUpdate = await Subject.findOne({
    where: {
      subjectId: subjectId,
    },
  });

  if (!subjectToUpdate) {
    throw new Error('Subject not found');
  }

  if (dto.name !== undefined) {
    subjectToUpdate.name = dto.name;
  }
  if (dto.description !== undefined) {
    subjectToUpdate.description = dto.description;
  }

  await subjectToUpdate.save();
  return subjectToUpdate;
};

export const deleteSubject = async (dto: DeleteSubjectDto): Promise<void> => {
  const { subjectId } = dto;

  await Subject.destroy({
    where: {
      subjectId: subjectId,
    },
  });
};

