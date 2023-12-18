// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Helper function to convert radians to degrees
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function calculateCoordinatesRange(
  centerLat: number,
  centerLng: number,
  distanceKm: number,
): {
  ne: { lat: number; lng: number };
  sw: { lat: number; lng: number };
} {
  // Earth radius in kilometers
  const earthRadius = 6371.0;

  // Convert latitude and longitude from degrees to radians
  const centerLatRad = toRadians(centerLat);
  const centerLngRad = toRadians(centerLng);

  // Calculate the angular distance in radians
  const angularDistance = distanceKm / earthRadius;

  // Calculate the latitude of the new point
  const newLatRad = centerLatRad + angularDistance;

  // Calculate the difference in longitude
  const deltaLng = Math.atan2(
    Math.sin(angularDistance) * Math.cos(centerLatRad),
    Math.cos(angularDistance) - Math.sin(centerLatRad) * Math.sin(newLatRad),
  );

  // Calculate the longitude of the new point
  const newLngRad = centerLngRad + deltaLng;

  // Convert back to degrees
  const newLat = toDegrees(newLatRad);
  const newLng = toDegrees(newLngRad);

  // Calculate the southwest coordinates
  const southwestLat = centerLat - (newLat - centerLat);
  const southwestLon = centerLng - (newLng - centerLng);

  return {
    ne: { lat: newLat, lng: newLng },
    sw: { lat: southwestLat, lng: southwestLon },
  };
}

export function handleConsonant(name: string) {
  const charCode = name.charCodeAt(name.length - 1);
  const consonantCode = (charCode - 44032) % 28;
  if (consonantCode === 0) return `${name}가`;
  return `${name}이`;
}
