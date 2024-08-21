// Router ini digunakan untuk segala yang berkaitan dengan assignment (tugas-tugas dan submisi)
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/server/db";
import { assignments, assignmentSubmissions, eventPresences, groups, profiles, roleEnum, users } from "@katitb2024/database";
import { count, eq } from "drizzle-orm";
import { hash } from "bcrypt";
import { sendEmail } from "~/services/mail";
import {
  clearToken,
  createToken,
  forgotPasswordURL,
  validateToken,
} from "~/services/forgotToken";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  createForgotToken: publicProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ input: { email } }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found",
        });

      const token = createToken(email);
      const data = { email, token };
      const URL = `${forgotPasswordURL}?${new URLSearchParams(data).toString()}`;

      try {
        await sendEmail({
          subject: "Forgot Password OSKM Dashboard",
          text: `This link valid for 1 hour: ${URL}`,
          to: email,
        });
      } catch (error) {
        console.error("Failed to send email: ", error);
        console.log(`Forgot password URL: ${URL}`);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send email, try again later",
        });
      }
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
        token: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const isValid = validateToken(input);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      await db
        .update(users)
        .set({
          password: await hash(input.password, 10),
        })
        .where(eq(users.email, input.email));
      clearToken(input.email);
      }),
  
    detailKelompok: publicProcedure
      .input(z.object({ userNim: z.string(), role: z.string(), groupName: z.string() }))
      .query(async ({ ctx, input }) => {
        if (input.role === roleEnum.enumValues[2]){

          const resultName = await ctx.db
          .select({name: profiles.name})
          .from(profiles)
          .where(eq(groups.name, input.groupName))
    
          const resultNim = await ctx.db
          .select({nim: users.nim})
          .from(users)
          .where(eq(groups.name, input.groupName))
          
          const resultFaculty = await ctx.db
          .select({faculty: profiles.faculty})
          .from(profiles)
          .where(eq(groups.name, input.groupName))      
  
          const countAssignments = await ctx.db
          .select({count: count(assignments)})
          .from(assignments)
  
          const countAssignmentsSubmitted = await ctx.db
          .select({count: count(assignmentSubmissions)})
          .from(assignmentSubmissions)
          .where(eq(groups.name, input.groupName))
          .groupBy(users.nim) 

          const countPresences = await ctx.db
          .select({count: count(eventPresences)})
          .from(eventPresences)
          .where(eq(groups.name, input.groupName))
          .groupBy(users.nim)

          }
          if (input.role === roleEnum.enumValues[1]) {
            const keluargaMentor = await ctx.db
            .select({namaKeluarga: groups.name})
            .from(profiles)
            .where(eq(users.nim, input.userNim))
            
            let namaKeluargaMentor = String(keluargaMentor)
  
            if (input.groupName === namaKeluargaMentor){
  
              const resultName = await ctx.db
              .select({name: profiles.name})
              .from(profiles)
              .where(eq(groups.name, input.groupName))
        
              const resultNim = await ctx.db
              .select({nim: users.nim})
              .from(users)
              .where(eq(groups.name, input.groupName))
              
              const resultFaculty = await ctx.db
              .select({faculty: profiles.faculty})
              .from(profiles)
              .where(eq(groups.name, input.groupName))      
      
              const countAssignments = await ctx.db
              .select({count: count()})
              .from(assignments)
      
              const countAssignmentsSubmitted = await ctx.db
              .select({count: count(assignmentSubmissions)})
              .from(assignmentSubmissions)
              .where(eq(groups.name, input.groupName))
              .groupBy(users.nim)
      
              const countPresences = await ctx.db
              .select({count: count(eventPresences)})
              .from(eventPresences)
              .where(eq(groups.name, input.groupName))
              .groupBy(users.nim)
            }
            else {
              throw new TRPCError({message: "Nomor Keluarga tidak sesuai!", code: "FORBIDDEN"})
            }
          }
      })
})
    
      
