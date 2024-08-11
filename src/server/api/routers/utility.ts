// Router ini digunakan untuk segala yang berkaitan dengan utility seperti menambahkan activity point dan lain-lain
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  //   mametProcedure,
  //   mentorProcedure,
  //   mametMentorProcedure,
} from "~/server/api/trpc";

export const utilityRouter = createTRPCRouter({});
