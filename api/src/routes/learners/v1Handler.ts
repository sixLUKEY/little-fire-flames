import { Learner } from '../../db/models/learner.model';
import { HttpRawResponse, V1RequestOptions } from '../../types';
import { CreateLearnerDto, DeleteLearnerDto, GetLearnerDto, UpdateLearnerDto, LearnerResponseDto, LearnerListResponseDto } from './dto';
import { createLearner, deleteLearner, getLearners, updateLearner } from './repository';

export const handleV1Learners = async (
  options: V1RequestOptions
): Promise<HttpRawResponse<LearnerListResponseDto>> => {
  const getDto: GetLearnerDto = {
    studentId: options.params.id,
  };
  
  const learners: Learner[] = await getLearners(getDto);

  const response: LearnerListResponseDto = {
    data: learners.map((learner) => ({
      name: learner.name,
      studentId: learner.studentId,
      classId: learner.classId,
      results: learner.results || [],
    })),
  };

  return {
    statusCode: 200,
    body: response,
  };
};

export const handleV1LearnerCreate = async (
  options: V1RequestOptions<CreateLearnerDto>
): Promise<HttpRawResponse> => {
  try {
    if (!options.body) {
      return {
        statusCode: 400,
        body: {
          message: 'Request body is required',
        },
      };
    }

    const createDto: CreateLearnerDto = {
      name: options.body.name,
      classId: options.body.classId,
      studentId: options.body.studentId,
    };

    await createLearner(createDto);

    return {
      statusCode: 201,
      body: {
        message: 'Learner created successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to create learner',
      },
    };
  }
};

export const handleV1LearnerUpdate = async (
  options: V1RequestOptions<UpdateLearnerDto>
): Promise<HttpRawResponse> => {
  try {
    const studentId = options.params.id

    if (!studentId) {
      return {
        statusCode: 400,
        body: {
          message: 'Student ID is required',
        },
      };
    }

    if (!options.body) {
      return {
        statusCode: 400,
        body: {
          message: 'Request body is required',
        },
      };
    }

    const updateDto: UpdateLearnerDto = {
      name: options.body.name,
      classId: options.body.classId,
      results: options.body.results,
    };

    await updateLearner(studentId, updateDto);

    return {
      statusCode: 200,
      body: {
        message: 'Learner updated successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to update learner',
      },
    };
  }
};

export const handleV1LearnerDelete = async (
  options: V1RequestOptions<DeleteLearnerDto>
): Promise<HttpRawResponse> => {
  try {
    const deleteDto: DeleteLearnerDto = {
      studentId: options.params.id || options.body?.studentId || '',
    };

    if (!deleteDto.studentId) {
      return {
        statusCode: 400,
        body: {
          message: 'Student ID is required',
        },
      };
    }

    await deleteLearner(deleteDto);

    return {
      statusCode: 200,
      body: {
        message: 'Learner deleted successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to delete learner',
      },
    };
  }
}
