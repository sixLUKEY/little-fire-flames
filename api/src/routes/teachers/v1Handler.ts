import { Teacher } from '../../db/models/teachers.model';
import { HttpRawResponse, V1RequestOptions } from '../../types';
import { CreateTeacherDto, DeleteTeacherDto, GetTeacherDto, UpdateTeacherDto, TeacherResponseDto, TeacherListResponseDto } from './dto';
import { createTeacher, deleteTeacher, getTeachers, updateTeacher } from './repository';

export const handleV1Teachers = async (
  options: V1RequestOptions
): Promise<HttpRawResponse<TeacherListResponseDto>> => {
  const getDto: GetTeacherDto = {
    teacherId: options.params.id,
  };
  
  const teachers: Teacher[] = await getTeachers(getDto);

  const response: TeacherListResponseDto = {
    data: teachers.map((teacher) => ({
      teacherId: teacher.teacherId,
      name: teacher.name,
      description: teacher.description,
      subjectId: teacher.subjectId,
    })),
  };

  return {
    statusCode: 200,
    body: response,
  };
};

export const handleV1TeacherCreate = async (
  options: V1RequestOptions<CreateTeacherDto>
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

    const createDto: CreateTeacherDto = {
      name: options.body.name,
      description: options.body.description,
      subjectId: options.body.subjectId,
    };

    await createTeacher(createDto);

    return {
      statusCode: 201,
      body: {
        message: 'Teacher created successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to create teacher',
      },
    };
  }
};

export const handleV1TeacherUpdate = async (
  options: V1RequestOptions<UpdateTeacherDto>
): Promise<HttpRawResponse> => {
  try {
    const teacherId = options.params.id

    if (!teacherId) {
      return {
        statusCode: 400,
        body: {
          message: 'Teacher ID is required',
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

    const updateDto: UpdateTeacherDto = {
      name: options.body.name,
      description: options.body.description,
      subjectId: options.body.subjectId,
    };

    await updateTeacher(teacherId, updateDto);

    return {
      statusCode: 200,
      body: {
        message: 'Teacher updated successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to update teacher',
      },
    };
  }
};

export const handleV1TeacherDelete = async (
  options: V1RequestOptions<DeleteTeacherDto>
): Promise<HttpRawResponse> => {
  try {
    const deleteDto: DeleteTeacherDto = {
      teacherId: options.params.id || options.body?.teacherId || '',
    };

    if (!deleteDto.teacherId) {
      return {
        statusCode: 400,
        body: {
          message: 'Teacher ID is required',
        },
      };
    }

    await deleteTeacher(deleteDto);

    return {
      statusCode: 200,
      body: {
        message: 'Teacher deleted successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to delete teacher',
      },
    };
  }
}
