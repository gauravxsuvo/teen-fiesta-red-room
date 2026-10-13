/**
 * Verified event facts from the supplied RED ROOM campaign poster.
 * Pass terms stay empty until the event team provides confirmed details.
 */
export const redRoomEvent = {
  title: "RED ROOM",
  date: "31 October 2026",
  dateShort: "31.10.2026",
  isoDate: "2026-10-31",
  time: "5–9 PM",
  venue: "Mansion",
  city: "Agra",
  artist: "Fentatine",
} as const;

export const dashPass = {
  name: "DASH",
  price: null as number | null,
  benefits: [] as string[],
  purchaseUrl: null as string | null,
};
