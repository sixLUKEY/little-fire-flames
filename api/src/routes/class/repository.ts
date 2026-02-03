import { Class } from '../../db/models/class.model';
import { CreateClassDto, DeleteClassDto, GetClassDto, UpdateClassDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

export const getClasses = async (dto: GetClassDto): Promise<Class[]> => {
  const { classId } = dto;
  
  if (classId) {
    const foundClass = await Class.findOne({
      where: {
        classId: classId,
      },
    });

    return foundClass ? [foundClass] : [];
  }

  // If no classId provided, return all classes
  const allClasses = await Class.findAll();
  return allClasses || [];
};

export const createClass = async (dto: CreateClassDto): Promise<Class> => {
  const { name, teacherId } = dto;

  const newClass = await Class.create({
    classId: uuidv4(),
    name,
    teacherId,
  });

  return newClass;
};

export const updateClass = async (classId: string, dto: UpdateClassDto): Promise<Class> => {
  const classToUpdate = await Class.findOne({
    where: {
      classId: classId,
    },
  });

  if (!classToUpdate) {
    throw new Error('Class not found');
  }

  if (dto.name !== undefined) {
    classToUpdate.name = dto.name;
  }
  if (dto.teacherId !== undefined) {
    classToUpdate.teacherId = dto.teacherId;
  }

  await classToUpdate.save();
  return classToUpdate;
};

export const deleteClass = async (dto: DeleteClassDto): Promise<void> => {
  const { classId } = dto;

  await Class.destroy({
    where: {
      classId,
    },
  });
};
