import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/server/bucket";
import sanitize from "sanitize-filename";
import { FolderEnum } from "~/server/bucket";
import { TRPCError } from "@trpc/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getContentType } from "~/utils/fileUtils";

export const storageRouter = createTRPCRouter({
  deleteFile: publicProcedure
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
  uploadFile: publicProcedure
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

        const fileUrl = `https://${process.env.NEXT_PUBLIC_DO_BUCKET_NAME}.nyc3.digitaloceanspaces.com/${key}`;
        return fileUrl;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error uploading file",
        });
      }
    }),
  downloadFile: publicProcedure
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
});
