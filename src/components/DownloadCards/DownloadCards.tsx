import React, { useState } from "react";
import Image from "next/image";
import DownloadCard1 from "./DownloadCard1";
import DownloadCard2 from "./DownloadCard2";

// Utility: Download handler with spinner + success/error states
export const useDownload = (fileUrl: string, fileName: string) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setStatus("success");
      setTimeout(() => setStatus("idle"), 1000);
    } catch (error) {
      console.error("Download failed:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return { status, handleDownload };
};

// Download Icon State Renderer
export const DownloadIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === "loading") {
    return (
      <Image
        src="/assets/images/card-imgs/download-loading-icon.png"
        alt="Downloading..."
        width={24}
        height={24}
        className="animate-spin"
        style={{ animationDuration: "2s" }}
      />
    );
  }
  if (status === "success") {
    return (
      <svg
        className="text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (status === "error") {
    return (
      <svg
        className="text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    );
  }
  return (
    <svg
      className="size-6 text-slate-800"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M21 15.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V15.5M7 10.5L12 15.5M12 15.5L17 10.5M12 15.5V3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const DownloadCards: React.FC = () => {
  return (
    <div className="bg-gray-400 pb-20">
      <h1 className="text-3xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
        Downloading Cards (type-7 & type-8)
      </h1>

      <div className="mx-auto max-w-7xl px-6 pt-3 pb-6">
        {/* Card Type 7 */}
        <h3 className="text-white text-xl text-center border-b mb-6 pb-3 border-white">
          Component Cards Card-type - 7
        </h3>
        <div className="grid grid-cols-2 gap-4 pt-20 pb-6">
          <DownloadCard1 />
        </div>

        {/* Card Type 8 */}
        <h3 className="text-white text-xl text-center border-b mb-6 pb-3 border-white">
          Component Cards Card-type - 8
        </h3>
        <div className="grid grid-cols-1 gap-4 pt-20 pb-6">
          <DownloadCard2 />
        </div>
      </div>
    </div>
  );
};

export default DownloadCards;
