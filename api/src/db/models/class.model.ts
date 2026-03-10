import { DataTypes, Model } from 'sequelize';
import { sequelize } from '..';

export class Class extends Model {
  declare classId: string;
  declare name: string;
  declare teacherId: string;
  declare subjectIds: string[];
}

Class.init(
  {
    classId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    teacherId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subjectIds: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: () => [],
    },
  },
  { sequelize, tableName: 'classes' }
);
