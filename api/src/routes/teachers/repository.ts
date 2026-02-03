import { Teacher } from '../../db/models/teachers.model';
import { CreateTeacherDto, DeleteTeacherDto, GetTeacherDto, UpdateTeacherDto } from './dto';
import { randomUUID } from 'crypto';

export const getTeachers = async (dto: GetTeacherDto): Promise<Teacher[]> => {
  const { teacherId } = dto;
  
  if (teacherId) {
    const foundTeacher = await Teacher.findOne({
      where: {
        teacherId: teacherId,
      },
    });

    return foundTeacher ? [foundTeacher] : [];
  }

  // If no teacherId provided, return all teachers
  const allTeachers = await Teacher.findAll();
  return allTeachers || [];
};

export const createTeacher = async (dto: CreateTeacherDto): Promise<Teacher> => {
  const { name, description, subjectId } = dto;

  // Generate 8-digit teacher ID
  const generateTeacherId = (): string => {
    const min = 10000000;
    const max = 99999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  };

  let teacherId = generateTeacherId();
  // Ensure uniqueness (simple retry, in production you might want a better approach)
  let existing = await Teacher.findOne({ where: { teacherId } });
  while (existing) {
    teacherId = generateTeacherId();
    existing = await Teacher.findOne({ where: { teacherId } });
  }

  const newTeacher = await Teacher.create({
    teacherId: teacherId,
    name: name,
    description: description,
    subjectId: subjectId,
  });

  return newTeacher;
};

export const updateTeacher = async (teacherId: string, dto: UpdateTeacherDto): Promise<Teacher> => {
  const teacherToUpdate = await Teacher.findOne({
    where: {
      teacherId: teacherId,
    },
  });

  if (!teacherToUpdate) {
    throw new Error('Teacher not found');
  }

  if (dto.name !== undefined) {
    teacherToUpdate.name = dto.name;
  }
  if (dto.description !== undefined) {
    teacherToUpdate.description = dto.description;
  }
  if (dto.subjectId !== undefined) {
    teacherToUpdate.subjectId = dto.subjectId;
  }

  await teacherToUpdate.save();
  return teacherToUpdate;
};

export const deleteTeacher = async (dto: DeleteTeacherDto): Promise<void> => {
  const { teacherId } = dto;

  await Teacher.destroy({
    where: {
      teacherId: teacherId,
    },
  });
};


