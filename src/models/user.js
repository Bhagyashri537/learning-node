const { jwt } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate: {
        validator(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid Email: " + value);
          }
        },
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error("Invalid password: " + value);
          }
        },
      },
    },
    gender: {
      type: String,
      validate: {
        validator(value) {
          if (!["male", "female", "other"].includes(value)) {
            throw new Error("Gender is not valid: " + value);
          }
        },
      },
    },
  },
  { timestamps: true } // Add timestamps here

 
);

userSchema.method.getJWT = async function () {
const user = this;
const token = await jwt.sign({_id : user._id}, "DEV@Tinder$790", {
  expireIn : "7d"
})
return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
