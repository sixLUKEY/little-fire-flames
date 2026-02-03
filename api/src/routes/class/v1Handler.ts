import { Class } from '../../db/models/class.model';
import { HttpRawResponse, V1RequestOptions } from '../../types';
import { CreateClassDto, DeleteClassDto, GetClassDto, UpdateClassDto, ClassResponseDto, ClassListResponseDto } from './dto';
import { createClass, deleteClass, getClasses, updateClass } from './repository';

export const handleV1Classes = async (
  options: V1RequestOptions
): Promise<HttpRawResponse<ClassListResponseDto>> => {
  const getDto: GetClassDto = {
    classId: options.params.id,
  };
  
  const classes: Class[] = await getClasses(getDto);

  const response: ClassListResponseDto = {
    data: classes.map((cls) => ({
      classId: cls.classId,
      name: cls.name,
      teacherId: cls.teacherId,
    })),
  };

  return {
    statusCode: 200,
    body: response,
  };
};

export const handleV1ClassCreate = async (
  options: V1RequestOptions<CreateClassDto>
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

    const createDto: CreateClassDto = {
      name: options.body.name,
      teacherId: options.body.teacherId,
    };

    await createClass(createDto);

    return {
      statusCode: 201,
      body: {
        message: 'Class created successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to create class',
      },
    };
  }
};

export const handleV1ClassUpdate = async (
  options: V1RequestOptions<UpdateClassDto>
): Promise<HttpRawResponse> => {
  try {
    const classId = options.params.id

    if (!classId) {
      return {
        statusCode: 400,
        body: {
          message: 'Class ID is required',
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

    const updateDto: UpdateClassDto = {
      name: options.body.name,
      teacherId: options.body.teacherId,
      learnerIds: options.body.learnerIds,
    };

    await updateClass(classId, updateDto);

    return {
      statusCode: 200,
      body: {
        message: 'Class updated successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to update class',
      },
    };
  }
};

export const handleV1ClassDelete = async (
  options: V1RequestOptions<DeleteClassDto>
): Promise<HttpRawResponse> => {
  try {
    const deleteDto: DeleteClassDto = {
      classId: options.params.id || options.body?.classId || '',
    };

    if (!deleteDto.classId) {
      return {
        statusCode: 400,
        body: {
          message: 'Class ID is required',
        },
      };
    }

    await deleteClass(deleteDto);

    return {
      statusCode: 200,
      body: {
        message: 'Class deleted successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to delete class',
      },
    };
  }
}
