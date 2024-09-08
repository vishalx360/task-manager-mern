const { z } = require('zod');

// Signin schema
const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Signup schema
const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export { signinSchema, signupSchema };
