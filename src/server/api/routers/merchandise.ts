// Router ini digunakan untuk segala yang berkaitan dengan merchandise
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

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const merchandiseRouter = createTRPCRouter({
  // GET All Merchandise + limit, offset, search query
  getAllMerchandise: publicProcedure
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
          )
          .orderBy(merchandises.name);

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
  updateQuantity: publicProcedure
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
  getMerchandiseExchange: publicProcedure
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
  getDetailsExchange: publicProcedure
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
            price: merchandises.price,
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
  editExchangeStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.transaction(async (trx) => {
          const current = await trx
            .selectDistinct({
              status: merchandiseExchanges.status,
            })
            .from(merchandiseExchanges)
            .where(eq(merchandiseExchanges.id, input.id));

          if (!current[0]) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Merchandise exchange not found",
            });
          }

          if (
            current[0].status == merchandiseExchangeStatusEnum.enumValues[0]
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Merchandise exchange status is already updated",
            });
          }

          const res = await trx
            .update(merchandiseExchanges)
            .set({
              status: merchandiseExchangeStatusEnum.enumValues[0],
            })
            .where(eq(merchandiseExchanges.id, input.id))
            .returning({ foundId: merchandiseExchanges.id });

          if (!res.length) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Merchandise can't be found",
            });
          }

          const details = await trx
            .select({
              merchandiseId: merchandiseExchangeDetails.merchandiseId,
              quantity: merchandiseExchangeDetails.quantity,
            })
            .from(merchandiseExchangeDetails)
            .where(
              eq(merchandiseExchangeDetails.merchandiseExchangeId, input.id),
            );

          if (!details.length) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "No merchandise exchange details found",
            });
          }

          for (const detail of details) {
            const itemStock = await trx
              .selectDistinct({ stock: merchandises.stock })
              .from(merchandises)
              .where(eq(merchandises.id, detail.merchandiseId));

            if (itemStock[0] === undefined || itemStock[0] === null) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "No merchandise id:" + detail.merchandiseId + " found",
              });
            }

            if (itemStock[0].stock >= 0) {
              await trx
                .update(merchandises)
                .set({
                  stock: itemStock[0]?.stock - detail.quantity,
                })
                .where(eq(merchandises.id, detail.merchandiseId));
            } else {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Not enough stock for merchandise",
              });
            }
          }
        });

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
