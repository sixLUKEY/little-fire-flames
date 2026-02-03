import { DataTypes, Model } from 'sequelize';
import { SubjectResults } from '../../routes/learners/dto';
import { sequelize } from '..';

export class Learner extends Model {
  declare name: string;
  declare studentId: string;
  declare classId: string;
  declare results: SubjectResults[];
}

Learner.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    classId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    results: {
      type: DataTypes.JSONB,
    },
  },
  { sequelize, tableName: 'learners' }
);
