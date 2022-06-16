import mongoose from "mongoose";

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

export const migrationModel = mongoose.model<MigrationDoc>("migration", migrationSchema);
