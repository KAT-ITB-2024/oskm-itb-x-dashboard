import {
  createTRPCRouter,
  mametProcedure,
  mentorMametProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/server/bucket";
import sanitize from "sanitize-filename";
import { FolderEnum } from "~/server/bucket";
import { TRPCError } from "@trpc/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getContentType } from "~/utils/fileUtils";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DownloadFilePayload, UploadFilePayload } from "~/types/payloads/storage";

export const storageRouter = createTRPCRouter({
  deleteFile: mentorMametProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { key } = input;
        const deleteObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_DO_BUCKET_NAME,
          Key: key,
        });

        await s3Client.send(deleteObjectCommand);

        return {
          success: true,
          message: "File deleted successfully",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error when deleting file",
        });
      }
    }),
  uploadFile: mentorMametProcedure
    .input(
      z.object({
        folder: z.nativeEnum(FolderEnum),
        fileName: z.string().min(1),
        fileContent: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const fileUUID = uuidv4();
        const sanitizedFileName = sanitize(input.fileName);
        const sanitizedFilename = `${fileUUID}-${sanitizedFileName}`;
        const key = `${input.folder}/${sanitizedFilename}`;

        const fileBuffer = Buffer.from(input.fileContent, "base64");

        const putObjectCommand = new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_DO_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: getContentType(input.fileName),
        });

        await s3Client.send(putObjectCommand);

        const getObjectCommand = new GetObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_DO_BUCKET_NAME,
          Key: key,
        });

        const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
          expiresIn: 3600 * 24 * 7,
        }); // 1 week expiration

        return {
          key,
          presignedUrl,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error uploading file",
        });
      }
    }),
  downloadFile: mentorMametProcedure
    .input(
      z.object({
        key: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const getObjectCommand = new GetObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_DO_BUCKET_NAME,
          Key: input.key,
        });

        const { Body, ContentType } = await s3Client.send(getObjectCommand);

        if (!Body) {
          throw new Error("File not found");
        }

        const fileContent = await Body.transformToByteArray();
        const base64Content = Buffer.from(fileContent).toString("base64");

        return {
          content: base64Content,
          contentType: ContentType ?? "application/octet-stream",
          fileName: input.key.split("/").pop() ?? "download",
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error downloading file",
        });
      }
    }),
  generateUploadUrl: mametProcedure
    .input(UploadFilePayload)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not logged in yet!",
        });
      }
      const id = uuidv4();
      const filename = `${id}-${input.filename}`;
      const file = `${input.folder}/${filename}`;
      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_DO_BUCKET_NAME,
        Key: file,
        ContentType: input.contentType,
      });

      try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
        return { url, filename };
      } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate new file",
        });
      }
    }),
  generateDownloadUrl: mentorMametProcedure
    .input(DownloadFilePayload)
    .mutation(async ({ ctx, input }): Promise<string> => {
      if (!ctx.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not logged in yet!",
        });
      }
      const file = `${input.folder}/${input.filename}`;
      const command = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_DO_BUCKET_NAME,
        Key: file,
      });
      try {
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: 604800,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return url;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed generating download URL!",
        });
      }
    }),
});
