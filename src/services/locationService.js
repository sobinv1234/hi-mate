export const searchLocations = async (input) => {
  if (!input) return [];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        q: `${input}, Southampton`,
        format: "json",
        addressdetails: 1,
        limit: 8,
      })
  );

  const data = await res.json();

  return data.map((item) => ({
    label: item.display_name,
    value: item.display_name,
    lat: item.lat,
    lng: item.lon,
  }));
};