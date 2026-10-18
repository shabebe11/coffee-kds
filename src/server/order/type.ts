import z from "zod";

export const OrderInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  coffees: z
    .array(
      z.object({
        name: z.string().trim().toLowerCase().min(1).max(40),
        isCustom: z.boolean().optional(),
        milk: z.string().trim().min(1).max(40),
        notes: z.string().trim().max(200).optional(),
        extras: z.array(z.string().trim().min(1).max(40)).max(10),
      }),
    )
    .min(1)
    .max(20),
});

export type OrderInput = z.infer<typeof OrderInputSchema>;
