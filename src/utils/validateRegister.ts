import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";
import validator from "validator";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!validator.isEmail(options.email)) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  if (!validator.matches(options.username, "^[a-zA-Z0-9_.-]*$")) {
    return [
      {
        field: "name",
        message: "Invalid name",
      },
    ];
  }

  if (options.password.length <= 8) {
    return [
      {
        field: "password",
        message: "Password length must be greater than 8",
      },
    ];
  }

  return null;
};
