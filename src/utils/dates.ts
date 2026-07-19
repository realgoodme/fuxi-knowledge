export function entryDate(entry: any): Date | undefined {
  const value = entry?.data?.date ?? entry?.data?.created ?? entry?.data?.fetched ?? entry?.data?.updated ?? entry?.data?.ingested;
  if (value) {
    const date = value instanceof Date ? value : new Date(String(value).replace(" ", "T"));
    if (!Number.isNaN(date.getTime())) return date;
  }
  const nameDate = String(entry?.id ?? entry?.data?.title ?? "").match(/(20\d{2})(\d{2})(\d{2})/);
  if (nameDate) return new Date(`${nameDate[1]}-${nameDate[2]}-${nameDate[3]}T00:00:00`);
  return undefined;
}
