import * as v from "valibot";

export const SignInSchema = v.object({
  // Domain Name
  domainName: v.pipe(
    v.string("Your domain name must be a string"),
    v.nonEmpty("Please enter your domain name"),
  ),
  // Email
  email: v.pipe(
    v.string("Your email must be a string"),
    v.nonEmpty("Please enter your email"),
    v.email("Your email must be a valid email address"),
  ),
  // Password
  password: v.pipe(
    v.string("Your password must be a string"),
    v.nonEmpty("Please enter your password"),
  ),
});

export type SignInInputs = v.InferInput<typeof SignInSchema>;
