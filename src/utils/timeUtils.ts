export const dateWIB = (waktuSelesai: Date) => {
  const date = new Date(waktuSelesai);

  const day = date.getDate();
  const month = date.toLocaleString('id-ID', { month: 'long' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
}