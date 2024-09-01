// import axios, { type AxiosProgressEvent } from axios

// export const getContentType = (fileName: string): string => {
//   const extension = fileName.split(".").pop()?.toLowerCase();
//   switch (extension) {
//     case "pdf":
//       return "application/pdf";
//     case "jpg":
//     case "jpeg":
//       return "image/jpeg";
//     case "png":
//       return "image/png";
//     case "docx":
//       return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
//     default:
//       return "application/octet-stream";
//   }
// };

// export const downloadFile = async (
//   url: string,
//   onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void,
// ) => {
//   const axiosInstance = axios.create();

//   const response = await axiosInstance.get<Blob>(url, {
//     responseType: "blob",
//     onDownloadProgress,
//   });

//   return response.data;
// };
