import { DataTypes, Model } from 'sequelize';
import { sequelize } from '..';

export class Teacher extends Model {
  declare teacherId: string;
  declare name: string;
  declare description: string;
  declare classId: string | null;
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
    classId: {
      type: DataTypes.STRING,
      allowNull: true, // true so existing rows survive sync; backfill then set to false if desired
    },
  },
  { sequelize, tableName: 'teachers' }
);
