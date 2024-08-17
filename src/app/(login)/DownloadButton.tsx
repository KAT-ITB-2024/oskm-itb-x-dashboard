"use client";

import React from "react";
import { api } from "~/trpc/react";

function DownloadButton({ assignmentId }: { assignmentId: string }) {
  const downloadMutation = api.assignment.getMainQuestAssignmentCsv.useMutation(
    {
      onSuccess: (data) => {
        const blob = new Blob([data.content], { type: data.mimeType });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      onError: (error) => {
        console.error("Download failed:", error);
      },
    },
  );

  const handleDownload = () => {
    downloadMutation.mutate({ assignmentId });
  };

  const isLoading = downloadMutation.status === "pending";

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
    >
      {isLoading ? "Downloading..." : "Download CSV"}
    </button>
  );
}

export default DownloadButton;
