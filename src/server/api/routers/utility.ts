// Router ini digunakan untuk segala yang berkaitan dengan utility seperti menambahkan activity point dan lain-lain
import {
  merchandises,
  merchandiseExchanges,
  users,
  profiles,
  merchandiseExchangeDetails,
  merchandiseExchangeStatusEnum,
} from "@katitb2024/database";
import { TRPCError } from "@trpc/server";
import { count, eq, ilike } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, itbxProcedure } from "~/server/api/trpc";

export const utilityRouter = createTRPCRouter({
  // GET All Merchandise + limit, offset, search query
  getAllMerchandise: itbxProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const query = ctx.db
          .select({
            id: merchandises.id,
            name: merchandises.name,
            price: merchandises.price,
            image: merchandises.image,
            stock: merchandises.stock,
          })
          .from(merchandises)
          .where(
            input.search && input.search !== ""
              ? ilike(merchandises.name, `%${input.search}%`)
              : undefined,
          );

        const limit =
          input.limit !== undefined ? query.limit(input.limit) : query;

        const offset =
          input.offset !== undefined ? limit.offset(input.offset) : limit;

        const res = await offset;

        const total = await ctx.db
          .select({ count: count() })
          .from(merchandises)
          .where(
            input.search && input.search !== ""
              ? ilike(merchandises.name, `%${input.search}%`)
              : undefined,
          );

        return {
          res,
          count: total[0]?.count,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Merchandise list",
        });
      }
    }),

  // PUT Edit Quantity Merchandise
  updateQuantity: itbxProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const res = await ctx.db
          .update(merchandises)
          .set({ stock: input.quantity })
          .where(eq(merchandises.id, input.id))
          .returning({ foundId: merchandises.id });

        if (!res.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Merchandise can't be found",
          });
        }

        return {
          success: true,
          message: "Merchandise quantity updated successfully.",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
          });
        }
      }
    }),

  // GET All Exchange Merchandise + limit, offset, search query
  getMerchandiseExchange: itbxProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const query = ctx.db
          .select({
            id: merchandiseExchanges.id,
            nim: users.nim,
            name: profiles.name,
            status: merchandiseExchanges.status,
          })
          .from(merchandiseExchanges)
          .leftJoin(users, eq(merchandiseExchanges.userId, users.id))
          .leftJoin(profiles, eq(users.id, profiles.userId))
          .where(
            input.search && input.search !== ""
              ? ilike(merchandiseExchanges.id, `%${input.search}%`)
              : undefined,
          );

        const limit =
          input.limit !== undefined ? query.limit(input.limit) : query;

        const offset =
          input.offset !== undefined ? limit.offset(input.offset) : limit;

        const res = await offset;

        const total = await ctx.db
          .select({ count: count() })
          .from(merchandiseExchanges)
          .where(
            input.search && input.search !== ""
              ? ilike(merchandiseExchanges.id, `%${input.search}%`)
              : undefined,
          );

        return {
          res,
          count: total[0]?.count,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch exchange merchandise",
        });
      }
    }),

  // Get Details Exchange Merchandise
  getDetailsExchange: itbxProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const res = await ctx.db
          .selectDistinct({
            orderId: merchandiseExchanges.id,
            nim: users.nim,
            name: profiles.name,
            status: merchandiseExchanges.status,
          })
          .from(merchandiseExchanges)
          .leftJoin(users, eq(users.id, merchandiseExchanges.userId))
          .leftJoin(profiles, eq(profiles.userId, users.id))
          .where(eq(merchandiseExchanges.id, input.id));

        const details = await ctx.db
          .select({
            merchandiseId: merchandiseExchangeDetails.merchandiseId,
            merchandiseName: merchandises.name,
            quantity: merchandiseExchangeDetails.quantity,
          })
          .from(merchandiseExchangeDetails)
          .leftJoin(
            merchandises,
            eq(merchandiseExchangeDetails.merchandiseId, merchandises.id),
          )
          .where(
            eq(merchandiseExchangeDetails.merchandiseExchangeId, input.id),
          );

        return {
          res,
          details: details,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
          });
        }
      }
    }),

  // PUT Change Exchange Status
  editExchangeStatus: itbxProcedure
    .input(
      z.object({
        id: z.string(),
        setDone: z.boolean(), // True bila set ke Done, False bila set ke Undone
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const res = await ctx.db
          .update(merchandiseExchanges)
          .set({
            status: input.setDone
              ? merchandiseExchangeStatusEnum.enumValues[0]
              : merchandiseExchangeStatusEnum.enumValues[1],
          })
          .where(eq(merchandiseExchanges.id, input.id))
          .returning({ foundId: merchandiseExchanges.id });

        if (!res.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Merchandise can't be found",
          });
        }

        return {
          success: true,
          message: "Merchandise quantity updated successfully.",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
          });
        }
      }
    }),
});
