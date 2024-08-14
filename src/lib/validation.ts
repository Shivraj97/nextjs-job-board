import { z } from "zod";
import { jobTypes, locationTypes } from "./job-types";

const requiredString = z.string().min(1);
const numericRequiredString = requiredString?.regex(
  /^\d+$/,
  "Must be a number",
);

const companyLogoSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Must be an image file",
  )
  .refine(
    (file) => !file || (file instanceof File && file.size <= 2 * 1024 * 1024),
    "Must be less than 2MB",
  );

const applicationSchema = z
  .object({
    applicationEmail: z.string().max(100).email().optional().or(z.literal("")),
    applicationUrl: z.string().max(100).url().optional().or(z.literal("")),
  })
  .refine((data) => data.applicationEmail || data.applicationUrl, {
    message: "Email or url is required",
    path: ["applicationEmail"],
  });

const locationSchema = z
  .object({
    locationType: requiredString.refine(
      (value) => locationTypes.includes(value),
      "Invalid location type",
    ),
    location: z.string().max(100).optional(),
  })
  .refine(
    (data) =>
      !data.locationType || data.locationType === "Remote" || data.location,
    {
      message: "Location is required for on-site jobs",
      path: ["location"],
    },
  );

// using add to append a different schema, triggers validation at the same time
export const createJobSchema = z
  .object({
    title: requiredString.max(100),
    type: requiredString.refine(
      (val) => jobTypes.includes(val),
      "Must be one of: " + jobTypes.join(", "),
    ),
    companyName: requiredString.max(100),
    companyLogo: companyLogoSchema,
    description: requiredString.max(5000).optional(),
    salary: numericRequiredString.max(9, "Number must be less than 9 digits"),
  })
  .and(applicationSchema)
  .and(locationSchema);

export type CreateJobValues = z.infer<typeof createJobSchema>;

export const jobFilterSchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  remote: z.coerce.boolean().optional(),
});

export type JobFilterValues = z.infer<typeof jobFilterSchema>;
