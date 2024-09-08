const { z } = require('zod');

// Signin schema
const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Signup schema
const signupSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });

module.exports = {
  signinSchema,
  signupSchema,
};
