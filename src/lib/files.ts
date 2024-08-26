import { TRPCError } from "@trpc/server";

async function uploadFileToPresignedUrl(
  presignedUrl: string,
  file: File,
): Promise<boolean> {
  try {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `HTTP error! status: ${response.status}`,
      });
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `HTTP error! status: ${error.message}`,
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unknown error occurred",
    });
  }
}
