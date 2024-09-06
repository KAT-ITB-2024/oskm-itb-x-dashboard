import axios, { type AxiosProgressEvent } from "axios";
import { type AllowableFileTypeEnum } from "~/types/enums/storage";

export const getContentType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
};

export const downloadFile = async (
  url: string,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const axiosInstance = axios.create();

  const response = await axiosInstance.get<Blob>(url, {
    responseType: "blob",
    onDownloadProgress,
  });

  return response.data;
};

export const uploadFile = async (
  url: string,
  file: File,
  contentType: AllowableFileTypeEnum,
  onProgress?: (progress: number) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', contentType);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress); // Update progress
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error('Failed to upload file.'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error.'));

    xhr.send(file);
  });
};
