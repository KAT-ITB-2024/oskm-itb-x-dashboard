import { z } from 'zod';
import { AllowableFileTypeEnum, FolderEnum } from '../enums/storage';

export const UploadFilePayload = z.object({
  folder: z.nativeEnum(FolderEnum),
  filename: z.string(),
  contentType: z.nativeEnum(AllowableFileTypeEnum),
});

export const DownloadFilePayload = z.object({
  filename: z.string(),
  folder: z.nativeEnum(FolderEnum),
});
