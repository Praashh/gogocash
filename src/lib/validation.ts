import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const idSchema = z.coerce.number().int().positive();

export const stringSchema = z.string().trim().min(1);

export const urlSchema = z.string().url();

export const emailSchema = z.string().email();

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

export const sanitizeNumber = (input: string | number): number => {
  const num = typeof input === "string" ? parseInt(input, 10) : input;
  return isNaN(num) ? 1 : Math.max(1, num);
};

export const sanitizePage = (input: string | number): number => {
  return sanitizeNumber(input);
};

export const validateInput = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          error.issues
            ?.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ") || "Validation error",
      };
    }
    return { success: false, error: "Invalid input format" };
  }
};

export const validateQueryParams = <T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams,
): { success: true; data: T } | { success: false; error: string } => {
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return validateInput(schema, params);
};

export const validateRateLimit = () //   _identifier: string
: boolean => {
  return true;
};

export const validateSecurityHeaders = (headers: Headers): boolean => {
  const requiredHeaders = ["user-agent", "accept"];

  return requiredHeaders.every((header) => headers.has(header));
};

export const validateContentType = (contentType: string): boolean => {
  const allowedTypes = [
    "application/json",
    "application/x-www-form-urlencoded",
    "multipart/form-data",
  ];

  return allowedTypes.some((type) => contentType.includes(type));
};

export type PaginationInput = z.infer<typeof paginationSchema>;
