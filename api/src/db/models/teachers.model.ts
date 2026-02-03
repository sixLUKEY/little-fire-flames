import { DataTypes, Model } from 'sequelize';
import { sequelize } from '..';

export class Teacher extends Model {
  declare teacherId: string;
  declare name: string;
  declare description: string;
  declare subjectId: string;
}

Teacher.init(
  {
    teacherId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, tableName: 'teachers' }
);
