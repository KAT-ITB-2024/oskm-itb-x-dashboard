// Router ini digunakan untuk segala yang berkaitan dengan presence (absensi)
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";

export const presenceRouter = createTRPCRouter({});
