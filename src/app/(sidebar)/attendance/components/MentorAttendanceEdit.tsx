"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "~/components/ui/select";
import Pagination from "./paginationTable";
import SearchBar from "./searchBarTable";
import { FiEdit, FiCheck } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import { api } from "~/trpc/react";

// Data peserta interface
interface Participant {
  id: number;
  nim: string;
  name: string;
  time: string;
  status: "Hadir" | "Telat" | "Izin/Sakit";
  remarks: string;
}

// Map data dari query ke tipe Participant
const mapToParticipant = (
  data: {
    nim: string | null;
    nama: string | null;
    status: "Hadir" | "Izin/Sakit" | "Alpha";
    updatedAt: Date;
  }[],
): Participant[] => {
  return data.map((item, index) => ({
    id: index + 1, // Misalnya ID di-generate dari index
    nim: item.nim ?? "",
    name: item.nama ?? "",
    time: item.updatedAt.toISOString(), // Sesuaikan jika format waktu berbeda
    status:
      item.status === "Izin/Sakit"
        ? "Izin/Sakit"
        : item.status === "Alpha"
          ? "Telat"
          : "Hadir",
    remarks: "", // Tambahkan jika ada data keterangan
  }));
};

const itemsPerPage = 10;

export default function MentorAttendanceEdit() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentData, setCurrentData] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dari backend berdasarkan eventId
  const {
    data,
    isLoading: queryLoading,
    error: queryError,
  } = api.presence.getPresensiPeserta.useQuery({
    eventId: "EventId", // Ganti dengan ID event yang sesuai
    group: "Keluarga-1", // Sesuaikan jika diperlukan
  });

  useEffect(() => {
    if (!queryLoading && data) {
      const mappedParticipants = mapToParticipant(data);
      setParticipants(mappedParticipants);
      setIsLoading(false);
    } else if (queryError) {
      setError("Failed to fetch participants");
      setIsLoading(false);
    }
  }, [queryLoading, data, queryError]);

  const filteredData = useMemo(
    () =>
      participants.filter((participant) =>
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [participants, searchQuery],
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentData(filteredData.slice(startIndex, endIndex));
  }, [filteredData, currentPage]);

  const handleInputChange = (
    index: number,
    field: keyof Participant,
    value: string,
  ) => {
    if (index >= 0 && index < participants.length) {
      const newParticipants = [...participants];
      newParticipants[index] = {
        ...newParticipants[index],
        [field]: value,
      } as Participant;
      setParticipants(newParticipants);
    }
  };

  const handleSelectChange = (index: number, value: Participant["status"]) => {
    handleInputChange(index, "status", value);
  };

  const { mutate: updatePresence } =
    api.presence.updatePresensiPeserta.useMutation();

  const handleSave = useCallback(() => {
    if (
      editIndex !== null &&
      editIndex >= 0 &&
      editIndex < participants.length
    ) {
      const participant = participants[editIndex];
      if (participant) {
        const apiStatus: "Hadir" | "Izin/Sakit" | "Alpha" =
          participant.status === "Telat" ? "Alpha" : participant.status;

        updatePresence(
          {
            userNim: participant.nim,
            eventId: "some-event-id", // Ganti dengan ID event yang sesuai
            newPresenceType: apiStatus, // Pastikan status adalah salah satu dari enum yang didefinisikan
          },
          {
            onSuccess: () => {
              console.log("Presence updated successfully");
              // Optionally, refresh data or redirect
            },
            onError: (err) => {
              console.error("Failed to update presence:", err);
              setError("Failed to update presence");
            },
          },
        );
        setEditIndex(null);
      } else {
        console.error("Participant is undefined");
      }
    }
  }, [editIndex, participants, updatePresence]);

  const handleEditToggle = (index: number) => {
    if (editIndex === index) {
      void handleSave();
    } else {
      setEditIndex(index);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full items-center justify-between">
        <Button
          className="bg-transparent p-2"
          onClick={() => router.push("/attendance")}
        >
          <FiArrowLeft className="text-blue-500" size={24} />
        </Button>
        <h1 className="bg-gradient-to-r from-[#0010A4] to-[#EE1192] bg-clip-text text-3xl font-bold text-transparent">
          Event Name
        </h1>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <Table className="w-full border-spacing-0 rounded-lg bg-gradient-to-r from-[#0010A4] to-[#EE1192]">
              <TableHeader>
                <TableRow>
                  <TableHead className="rounded-tl-lg border border-[#D1D4DB] font-bold text-white">
                    No.
                  </TableHead>
                  <TableHead className="border border-[#D1D4DB] font-bold text-white">
                    NIM
                  </TableHead>
                  <TableHead className="border border-[#D1D4DB] font-bold text-white">
                    Nama
                  </TableHead>
                  <TableHead className="border border-[#D1D4DB] font-bold text-white">
                    Waktu
                  </TableHead>
                  <TableHead className="border border-[#D1D4DB] font-bold text-white">
                    Status
                  </TableHead>
                  <TableHead className="border border-[#D1D4DB] font-bold text-white">
                    Keterangan
                  </TableHead>
                  <TableHead className="rounded-tr-lg border border-[#D1D4DB] font-bold text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border border-[#D1D4DB] bg-white text-center">
                {currentData.map((participant, index) => (
                  <TableRow key={participant.id}>
                    <TableCell className="border border-[#D1D4DB]">
                      {index + 1}
                    </TableCell>
                    <TableCell className="border border-[#D1D4DB]">
                      {participant.nim}
                    </TableCell>
                    <TableCell className="border border-[#D1D4DB]">
                      {participant.name}
                    </TableCell>
                    <TableCell className="border border-[#D1D4DB]">
                      <Input
                        type="time"
                        value={participant.time}
                        onChange={(e) =>
                          handleInputChange(index, "time", e.target.value)
                        }
                        className={`w-full bg-transparent text-center outline-none ${
                          editIndex === index ? "" : "pointer-events-none"
                        }`}
                      />
                    </TableCell>
                    <TableCell className="border border-[#D1D4DB]">
                      <Select
                        value={participant.status}
                        onValueChange={(value: Participant["status"]) =>
                          handleSelectChange(index, value)
                        }
                      >
                        <SelectTrigger>
                          <div className="text-center">
                            {participant.status}
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hadir">Hadir</SelectItem>
                          <SelectItem value="Telat">Telat</SelectItem>
                          <SelectItem value="Izin">Izin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="border border-[#D1D4DB]">
                      <Input
                        value={participant.remarks}
                        onChange={(e) =>
                          handleInputChange(index, "remarks", e.target.value)
                        }
                        className={`w-full bg-transparent text-center outline-none ${
                          editIndex === index ? "" : "pointer-events-none"
                        }`}
                      />
                    </TableCell>
                    <TableCell className="border border-[#D1D4DB]">
                      <Button
                        onClick={() => handleEditToggle(index)}
                        className="flex items-center justify-center p-2"
                      >
                        {editIndex === index ? (
                          <FiCheck className="text-green-500" />
                        ) : (
                          <FiEdit className="text-blue-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <p className="text-[#EE1192]">
                Total {participants.length} items
              </p>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <div className="flex h-6 items-center justify-center rounded-md border px-3.5">
              <p className="text-gray-500">
                <span className="font-semibold">{itemsPerPage}</span> / page
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
