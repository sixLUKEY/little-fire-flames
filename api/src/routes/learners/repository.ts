import { Learner } from '../../db/models/learner.model';
import { CreateLearnerDto, DeleteLearnerDto, GetLearnerDto, UpdateLearnerDto } from './dto';

export const getLearners = async (dto: GetLearnerDto): Promise<Learner[]> => {
  const { studentId } = dto;

  // If studentId is provided, find one learner by studentId
  if (studentId) {
    const foundLearner = await Learner.findOne({
      where: {
        studentId: studentId,
      },
    });

    return foundLearner ? [foundLearner] : [];
  }

  // If no studentId, return all learners
  const allLearners = await Learner.findAll();
  return allLearners || [];
};

export const createLearner = async (dto: CreateLearnerDto): Promise<Learner> => {
  const { name, classId, studentId } = dto;

  const newLearner = await Learner.create({
    studentId: studentId,
    name: name,
    classId: classId,
    results: [],
  });

  return newLearner;
};

export const updateLearner = async (studentId: string, dto: UpdateLearnerDto): Promise<Learner> => {
  const learnerToUpdate = await Learner.findOne({
    where: {
      studentId: studentId,
    },
  });

  if (!learnerToUpdate) {
    throw new Error('Learner not found');
  }

  if (dto.name !== undefined) {
    learnerToUpdate.name = dto.name;
  }
  if (dto.classId !== undefined) {
    learnerToUpdate.classId = dto.classId;
  }
  if (dto.results !== undefined) {
    learnerToUpdate.results = dto.results;
  }

  await learnerToUpdate.save();
  return learnerToUpdate;
};

export const deleteLearner = async (dto: DeleteLearnerDto): Promise<void> => {
  const { studentId } = dto;

  await Learner.destroy({
    where: {
      studentId: studentId,
    },
  });
};
