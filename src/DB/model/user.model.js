import { Schema, model } from "mongoose";
import {
  userGenderEnum,
  userProviderEnum,
  userRoleEnum,
} from "../../commen/enum/user.enum.js";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: [2, "minimun length for firstname is 2"],
      maxlength: [20, "maximun length for firstname is 20"],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [2, "minimun length for lastname is 2"],
      maxlength: [20, "maximun length for lastname is 20"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === userProviderEnum.SYSTEM;
      },
    },
    gender: {
      type: Number,
      enum: Object.values(userGenderEnum),
      default: userGenderEnum.MALE,
    },
    role: {
      type: Number,
      enum: Object.values(userRoleEnum),
      default: userRoleEnum.USER,
    },
    phoneNumber: String,
    DOB: Date,
    profilePicPath: String,
    coverPicPath: [String],
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: Number,
      enum: Object.values(userProviderEnum),
      default: userProviderEnum.SYSTEM,
    },
    deletedAt: Date,
    changeCredentialTime: Date,
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema
  .virtual("username")
  .get(function () {
    return `${this.firstname} ${this.lastname}`;
  })
  .set(function (v) {
    const [firstname, lastname] = v.split(" ");
    this.set({ firstname, lastname });
  });

export const userModel = model("Users", userSchema);
