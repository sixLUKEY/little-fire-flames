import { DataTypes, Model } from 'sequelize';
import { sequelize } from '..';

export class Subject extends Model {
  declare name: string;
  declare description: string;
  declare subjectId: string;
}

Subject.init(
  {
    subjectId: {
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
  },
  { sequelize, tableName: 'subjects' }
);
