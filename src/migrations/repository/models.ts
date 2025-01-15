import mongoose from 'mongoose';

interface MigrationDoc {
  number: number;
}

const migrationSchema = new mongoose.Schema<MigrationDoc>({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
});

const migrationModel =
  (mongoose.models.MigrationDoc as mongoose.Model<MigrationDoc>) ||
  mongoose.model<MigrationDoc>('migration', migrationSchema);
export default migrationModel;
