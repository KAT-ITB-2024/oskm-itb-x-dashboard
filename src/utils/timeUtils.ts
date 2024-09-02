export const dateWIB = (waktuSelesai: Date) => {
  const date = new Date(waktuSelesai);

  const day = date.getDate();
  const month = date.toLocaleString("id-ID", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
};

export const formatKeterlambatan = (seconds: number | null) => {
  if (seconds === null) return "-";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
