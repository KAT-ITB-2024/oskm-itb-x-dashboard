"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { MdUpload } from "react-icons/md";

import { api } from "~/trpc/react";
import { AssignmentType } from "@katitb2024/database";
import { FolderEnum } from "~/server/bucket";

interface MametEditAssignmentProps {
  assignment: {
    assignmentId: string;
    judulTugas: string;
    deskripsi: string;
    waktuMulai: Date;
    waktuSelesai: Date;
    assignmentType: AssignmentType;
    point: number;
    downloadUrl: string;
    filename: string;
  };
}

const ALLOWED_FORMATS = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export default function MametEditAssignment({
  assignment,
}: MametEditAssignmentProps) {
  const router = useRouter();

  const fileUploadMutation = api.storage.uploadFile.useMutation();
  const editAssignmentMutation =
    api.assignment.editAssignmentMamet.useMutation();

  const [isLoading, setIsLoading] = React.useState(false);

  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File | null>(null);

  const [judul, setJudul] = React.useState<string>(assignment.judulTugas);
  const [deskripsi, setDeskripsi] = React.useState<string>(
    assignment.deskripsi,
  );
  const [waktuMulai, setWaktuMulai] = React.useState<Date>(
    assignment.waktuMulai,
  );
  const [waktuSelesai, setWaktuSelesai] = React.useState<Date>(
    assignment.waktuSelesai,
  );
  const [point, setPoint] = React.useState<number>(assignment.point);
  const [jamMulai, setJamMulai] = React.useState<string>(
    assignment.waktuMulai.toTimeString().slice(0, 5),
  );
  const [jamSelesai, setJamSelesai] = React.useState<string>(
    assignment.waktuSelesai.toTimeString().slice(0, 5),
  );

  const [existFile, setExistFile] = React.useState<string | null>(
    assignment.filename,
  );

  const setTime = (date: Date, time: string) => {
    const newDate = new Date(date);
    const [hours, minutes] = time.split(":");
    newDate.setHours(parseInt(hours ?? "0"));
    newDate.setMinutes(parseInt(minutes ?? "0"));
    return newDate;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.[0];
    if (selectedFile) {
      if (!ALLOWED_FORMATS.includes(selectedFile.type)) {
        alert(
          "Invalid file format. Please select a JPEG, PNG, PDF, or DOCX file.",
        );
        setFile(null);
      } else if (selectedFile.size > MAX_FILE_SIZE) {
        alert("File is too large. Maximum size is 20 MB.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setExistFile(null);
      }
    }
  };

  const updateAssignment = async (
    filename?: string | undefined,
    presignedUrl?: string | undefined,
  ) => {
    try {
      const newFilename = filename ?? "existFile;";
      await editAssignmentMutation.mutateAsync({
        id: assignment.assignmentId,
        filename: newFilename ?? existFile,
        title: judul,
        description: deskripsi,
        startTime: setTime(waktuMulai, jamMulai),
        deadline: setTime(waktuSelesai, jamSelesai),
        point,
        downloadUrl: presignedUrl ?? assignment.downloadUrl,
      });
      router.push("/assignment");
    } catch (err) {
      alert("Error updating assignment. Please try again.");
      console.error("Error updating assignment", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAssignment = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target?.result) {
            const base64Content = (e.target.result as string)
              .toString()
              .split(",")[1];
            const { presignedUrl } = await fileUploadMutation.mutateAsync({
              folder: FolderEnum.ASSIGNMENT_MAMET,
              fileName: file.name,
              fileContent: base64Content!,
            });
            await updateAssignment(file.name, presignedUrl);
          }
        };
        reader.readAsDataURL(file);
      } else {
        await updateAssignment();
      }
    } catch (err) {
      alert("Error updating assignment. Please try again.");
      console.error("Error updating assignment:", err);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <form
        action=""
        className="flex max-h-screen w-full flex-col gap-4 overflow-y-auto px-28"
      >
        <div className="flex flex-col">
          <label className="text-[#0010A4]">
            Judul Tugas<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan judul tugas nama di sini..."
            className="rounded-lg border-2 border-gray-300 px-6 py-3"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[#0010A4]">
            Deskripsi Tugas<span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Masukkan deskripsi tugas nama di sini..."
            className="rounded-lg border-2 border-gray-300 px-6 py-3"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          />
        </div>
        <div className="flex gap-6">
          <div className="w-1/2">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Tanggal Mulai<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
                value={waktuMulai.toISOString().slice(0, 10)}
                onChange={(e) => setWaktuMulai(new Date(e.target.value))}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Waktu Mulai<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-1/2">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Tanggal Selesai<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
                value={waktuSelesai.toISOString().slice(0, 10)}
                onChange={(e) => setWaktuSelesai(new Date(e.target.value))}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col">
              <label className="text-[#0010A4]">
                Waktu Selesai<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="rounded-lg border-2 border-gray-300 px-6 py-3"
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-[#0010A4]">
            Deskripsi Tugas<span className="text-red-500">*</span>
          </label>
          <div className="flex h-[150px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#0010A4] bg-[#F5F5FF] text-[#0010A4]">
            <MdUpload className="text-4xl" />
            <p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer font-bold underline"
              >
                Click to upload{" "}
              </label>
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Supported formates: JPEG, PNG, PDF, DOCSX
            </p>
            <p className="text-xs text-gray-500">Maximum file size 20 MB</p>
          </div>
          <div
            className={`my-3 flex w-1/3 items-center justify-between gap-2 rounded-sm border-2 border-[#0010A4] px-4 py-2 text-xs font-bold text-[#0010A4]  ${
              (file ?? existFile) ? "block" : "hidden"
            }`}
          >
            <input
              id="file-upload"
              type="file"
              ref={hiddenFileInput}
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex gap-1">
              <p>{file?.name ?? existFile}</p>
              <p className="text-nowrap text-[10px] font-light">
                {file?.size
                  ? parseFloat(file.size.toPrecision(3)) / 1000000 + " MB"
                  : ""}
              </p>
            </div>
            <IoMdClose
              className="cursor-pointer text-lg"
              onClick={() => {
                setFile(null);
                setExistFile(null);
              }}
            />
          </div>
        </div>
        {assignment.assignmentType === "Side" ? (
          <div className="flex flex-col">
            <label className="text-[#0010A4]">
              Poin<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Jumlah Poin"
              className="w-1/3 rounded-lg border-2 border-gray-300 px-6 py-3"
              value={point}
              onChange={(e) => setPoint(parseInt(e.target.value))}
            />
          </div>
        ) : null}
      </form>
      <div className="my-10 flex w-full justify-between px-28">
        <Button
          variant="destructive"
          className="w-[110px]"
          onClick={() => router.push("/assignment")}
        >
          Batal
        </Button>
        <Button
          className="w-[110px] bg-[#0010A4]"
          onClick={handleSaveAssignment}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
