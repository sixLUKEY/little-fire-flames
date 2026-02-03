import { Subject } from '../../db/models/subjects.model';
import { HttpRawResponse, V1RequestOptions } from '../../types';
import { CreateSubjectDto, DeleteSubjectDto, GetSubjectDto, UpdateSubjectDto, SubjectResponseDto, SubjectListResponseDto } from './dto';
import { createSubject, deleteSubject, getSubjects, updateSubject } from './repository';

export const handleV1Subjects = async (
  options: V1RequestOptions
): Promise<HttpRawResponse<SubjectListResponseDto>> => {
  const getDto: GetSubjectDto = {
    subjectId: options.params.id,
  };
  
  const subjects: Subject[] = await getSubjects(getDto);

  const response: SubjectListResponseDto = {
    data: subjects.map((subject) => ({
      name: subject.name,
      description: subject.description,
      subjectId: subject.subjectId,
    })),
  };

  return {
    statusCode: 200,
    body: response,
  };
};

export const handleV1SubjectCreate = async (
  options: V1RequestOptions<CreateSubjectDto>
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

    const createDto: CreateSubjectDto = {
      name: options.body.name,
      description: options.body.description,
      subjectId: options.body.subjectId,
    };

    await createSubject(createDto);

    return {
      statusCode: 201,
      body: {
        message: 'Subject created successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to create subject',
      },
    };
  }
};

export const handleV1SubjectUpdate = async (
  options: V1RequestOptions<UpdateSubjectDto>
): Promise<HttpRawResponse> => {
  try {
    const subjectId = options.params.id

    if (!subjectId) {
      return {
        statusCode: 400,
        body: {
          message: 'Subject ID is required',
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

    const updateDto: UpdateSubjectDto = {
      name: options.body.name,
      description: options.body.description,
    };

    await updateSubject(subjectId, updateDto);

    return {
      statusCode: 200,
      body: {
        message: 'Subject updated successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to update subject',
      },
    };
  }
};

export const handleV1SubjectDelete = async (
  options: V1RequestOptions<DeleteSubjectDto>
): Promise<HttpRawResponse> => {
  try {
    const deleteDto: DeleteSubjectDto = {
      subjectId: options.params.id || options.body?.subjectId || '',
    };

    if (!deleteDto.subjectId) {
      return {
        statusCode: 400,
        body: {
          message: 'Subject ID is required',
        },
      };
    }

    await deleteSubject(deleteDto);

    return {
      statusCode: 200,
      body: {
        message: 'Subject deleted successfully',
      },
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      body: {
        message: e?.message || 'Failed to delete subject',
      },
    };
  }
}

