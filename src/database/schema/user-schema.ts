import { Schema } from "mongoose";
import { IAddress, IImage, IName, IUser } from "../../@types/user";
import { nameSchema } from "./name-schema";
import { addressSchema } from "./address-schema";
import { imageSchema } from "./img-schema";

const userSchema = new Schema<IUser>({
  name: nameSchema,
  image: {
    type: imageSchema,
    required: false,
    default: {
      url: "https://fifpro.org/media/fhmfhvkx/messi-world-cup.jpg?rxy=0.48356841796117644,0.31512414378031967&width=1000&height=640&rnd=133210253587130000", //change to another img
      alt: "difault profile",
    },
  },
  address: addressSchema,
  phone: {
    required: true,
    type: String,
    minlength: 9,
    maxlength: 15,
  },
  email: {
    unique: true,
    required: true,
    type: String,
    minlength: 7,
    maxlength: 20,
  },
  password: {
    required: true,
    type: String,
    minlength: 7,
    maxlength: 100,
  },
  isAdmin: {
    required: false,
    type: Boolean,
  },
  isBusiness: {
    required: true,
    type: Boolean,
  },
  createdAt: {
    required: false,
    type: Date,
    default: new Date(),
  },
});

export { userSchema };
