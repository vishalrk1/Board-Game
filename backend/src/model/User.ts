import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  gamesPlayed: number;
  totalWin: number;
  coins: number;
  comparePassword(IPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gamesPlayed: { type: Number, default: 0 },
  totalWin: { type: Number, default: 0 },
  coins: { type: Number, default: 6 },
});

userSchema.pre<IUser>("save", async function (next) {
  // if password is not updated move to next process
  if (!this.isModified("password")) return next();

  // if password is updated convert it to increpted version
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(userPassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
