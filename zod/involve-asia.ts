import { z } from "zod";

export const productDataSchema = z.object({
  shop_id: z.number(),
  shop_name: z.string(),
  shop_type: z.string(),
  shop_link: z.string(),
  shop_image: z.string(),
  shop_banner: z.array(z.string()),
  offer_name: z.string(),
  country: z.string(),
  period_start_time: z.string(),
  period_end_time: z.string().nullable(),
  commission_rate: z.string(),
  tracking_link: z.string(),
});

export const productDataResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    page: z.number(),
    limit: z.number(),
    count: z.number(),
    nextPage: z.number(),
    data: z.array(productDataSchema),
  }),
});

export type TProductData = z.infer<typeof productDataSchema>;
export type TProductDataResponse = z.infer<typeof productDataResponseSchema>;
