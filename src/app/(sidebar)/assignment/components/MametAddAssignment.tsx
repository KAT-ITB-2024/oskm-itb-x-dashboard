"use client";

import React from "react";
import { MdUpload } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { AssignmentType } from "@katitb2024/database";
import { FolderEnum } from "~/server/bucket";
import toast from "react-hot-toast";

export interface AssignmentInsertion {
  judul: string;
  deskripsi: string;
  waktuMulai: Date;
  waktuSelesai: Date;
  assignmentType: AssignmentType;
  point: number;
  file: string;
}

const ALLOWED_FORMATS = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export default function MametAddAssignment() {
  const router = useRouter();

  const fileUploadMutation = api.storage.uploadFile.useMutation();
  const createAssignmentMutation =
    api.assignment.uploadNewAssignmentMamet.useMutation();

  const [isLoading, setIsLoading] = React.useState(false);

  const [file, setFile] = React.useState<File | null>(null);
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);

  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [startTime, setStartTime] = React.useState<Date>(new Date());
  const [deadline, setDeadline] = React.useState<Date>(new Date());
  const [assignmentType, setAssignmentType] =
    React.useState<AssignmentType>("Main");
  const [point, setPoint] = React.useState<number>(0);

  const [jamMulai, setJamMulai] = React.useState<string>("00:00");
  const [jamSelesai, setJamSelesai] = React.useState<string>("00:00");

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
        toast.error("Format file tidak sesuai");
        setFile(null);
      } else if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("Ukuran file terlalu besar");
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const createAssignment = async (
    filename?: string | undefined,
    presignedUrl?: string | undefined,
  ) => {
    try {
      const newFilename = filename ?? "";
      const downloadUrl = presignedUrl ?? "";
      await createAssignmentMutation.mutateAsync({
        title,
        description,
        assignmentType,
        point: assignmentType === "Main" ? 0 : point,
        startTime: setTime(startTime, jamMulai),
        deadline: setTime(deadline, jamSelesai),
        filename: newFilename,
        downloadUrl,
      });
      router.push("/assignment");
    } catch (err) {
      toast.error("Gagal membuat tugas");
      console.error("Error creating assignment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAssignment = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    const fields = [
      { "Judul Tugas": title },
      { "Deskripsi Tugas": description },
      { "Waktu Mulai": startTime },
      { "Waktu Selesai": deadline },
      { "Tipe Tugas": assignmentType },
      { Poin: point },
    ];

    for (const field of fields) {
      for (const [key, value] of Object.entries(field)) {
        if (!value) {
          if (key === "Poin" && assignmentType === "Main") continue;
          toast.error(`Kolom ${key} harus diisi`);
          return;
        } else {
          if (
            key === "Waktu Selesai" &&
            setTime(startTime, jamMulai) >= setTime(deadline, jamSelesai)
          ) {
            toast.error(
              "Waktu selesai tidak boleh lebih kecil dari waktu mulai",
            );
            return;
          }
        }
      }
    }
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
            await createAssignment(file.name, presignedUrl);
          }
        };
        reader.readAsDataURL(file);
      } else {
        await createAssignment();
      }
    } catch (err) {
      toast.error("Gagal submit tugas");
      console.error("Error submitting assignment:", err);
    }
  };

  return (
    <div className="flex max-h-96 w-full flex-col items-center justify-start">
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[#0010A4]">
            Deskripsi Tugas<span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Masukkan deskripsi tugas nama di sini..."
            className="rounded-lg border-2 border-gray-300 px-6 py-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                value={startTime.toISOString().split("T")[0]}
                onChange={(e) => setStartTime(new Date(e.target.value))}
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
                value={deadline.toISOString().split("T")[0]}
                onChange={(e) => setDeadline(new Date(e.target.value))}
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
            Label<span className="text-red-500">*</span>
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
              file ? "block" : "hidden"
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
              <p>{file?.name}</p>
              <p className="text-nowrap text-[10px] font-light">
                {file?.size
                  ? parseFloat(file.size.toPrecision(3)) / 1000000
                  : 0}{" "}
                MB{" "}
              </p>
            </div>
            <IoMdClose
              className="cursor-pointer text-lg"
              onClick={() => setFile(null)}
            />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-[24px] w-[24px] accent-[#64B1F7]"
              checked={assignmentType === "Side"}
              onChange={(e) =>
                setAssignmentType(e.target.checked ? "Side" : "Main")
              }
            />
            <label className="text-[#0B46E8]">Side Quest</label>
          </div>
          {assignmentType === "Side" && (
            <div className="flex w-full flex-col">
              <label className="text-[#0010A4]">
                Poin<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Jumlah Poin"
                className="w-1/3 rounded-lg border-2 border-gray-300 px-6 py-3"
                value={point}
                min={0}
                onChange={(e) => setPoint(parseInt(e.target.value ?? "0"))}
              />
            </div>
          )}
        </div>
      </form>
      <div className="my-10 flex w-full justify-between px-28">
        <Button variant="destructive" className="w-[110px]">
          Batal
        </Button>
        <Button
          className="w-[110px] bg-[#0010A4]"
          onClick={handleSubmitAssignment}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
