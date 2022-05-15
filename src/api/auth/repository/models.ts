import mongoose from 'mongoose'

interface UserDoc {
  keyIdentifier: string
  nonce: string
}

const userSchema = new mongoose.Schema<UserDoc>({
  keyIdentifier: {
    type: String,
    required: true,
    unique: true,
  },
  nonce: {
    type: String,
    required: true,
    unique: true,
  },
})

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.__v
    delete ret._id
  },
})

export const userModel = mongoose.model<UserDoc>('user', userSchema)
