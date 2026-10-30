import { destinations } from "../../data/portfolio.js";

export const flightBounds = { minX: -48, maxX: 48, minZ: -60, maxZ: 40 };

// Mutate a Vector3-compatible position to avoid allocating objects in the frame loop.
export function constrainFlightPosition(position) {
  position.x = Math.max(
    flightBounds.minX,
    Math.min(flightBounds.maxX, position.x),
  );
  position.z = Math.max(
    flightBounds.minZ,
    Math.min(flightBounds.maxZ, position.z),
  );
  for (const destination of destinations) {
    if (!["home", "projects", "memes"].includes(destination.id)) continue;
    const dx = position.x - destination.position[0];
    const dz = position.z - destination.position[2];
    const limit = destination.radius + 1.4;
    if (Math.hypot(dx, dz) < limit) {
      const angle = Math.atan2(dz, dx);
      position.x = destination.position[0] + Math.cos(angle) * limit;
      position.z = destination.position[2] + Math.sin(angle) * limit;
    }
  }
  return position;
}

export function getApproachPosition(id) {
  const destination = destinations.find((item) => item.id === id);
  return destination
    ? [
        destination.position[0],
        0,
        destination.position[2] + destination.radius + 7,
      ]
    : null;
}

export function getNearbyDestination(position) {
  let nearest = null;
  let distance = Infinity;
  for (const destination of destinations) {
    const separation =
      Math.hypot(
        position.x - destination.position[0],
        position.z - destination.position[2],
      ) - destination.radius;
    if (separation < distance) {
      distance = separation;
      nearest = destination.id;
    }
  }
  return distance < 13 ? nearest : null;
}
