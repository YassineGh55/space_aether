import "../env";
import { db } from "./client";
import { rockets, destinations, flights, gallery } from "./schema";

async function main() {
  const [r1, , r3, r4] = await db.insert(rockets).values([
    { name: "Helios I", model: "H1-HEAVY", capacity: 12, description: "First-generation heavy lift vehicle for cislunar operations.", imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800" },
    { name: "Selene", model: "SLN-CREW", capacity: 6, description: "Crew transport optimized for lunar surface missions.", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800" },
    { name: "Ares Transit", model: "ATV-MARS", capacity: 24, description: "Long-duration Mars transit vehicle with centrifuge hab ring.", imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800" },
    { name: "Hermes", model: "HRM-FAST", capacity: 4, description: "High-delta-v courier for urgent interplanetary cargo and VIP crew.", imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800" },
  ]).returning();

  const [earth, moon, mars, europa] = await db.insert(destinations).values([
    { name: "Earth Orbital Station", body: "Earth", description: "Gateway hub in low Earth orbit.", imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800", distanceAu: 0, travelDays: 0 },
    { name: "Luna Base Artemis", body: "Moon", description: "Permanent crewed outpost at the lunar south pole.", imageUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800", distanceAu: 0.0026, travelDays: 3 },
    { name: "Ares Station", body: "Mars", description: "The first permanent human settlement on the Martian surface.", imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800", distanceAu: 1.52, travelDays: 210 },
    { name: "Europa Research Base", body: "Jupiter", description: "Subsurface ocean access station on Europa.", imageUrl: "https://images.unsplash.com/photo-1630694093867-4b947d812bf0?w=800", distanceAu: 5.2, travelDays: 600 },
  ]).returning();

  const d = (days: number) => new Date(Date.now() + days * 86400000);

  await db.insert(flights).values([
    { flightNumber: "AE-101", rocketId: r1.id, originId: earth.id, destinationId: moon.id, departureAt: d(1), arrivalAt: d(4), status: "scheduled", economyPrice: 12000, businessPrice: 35000, orbitalPrice: 80000, seatsTotal: 12, seatsBooked: 4 },
    { flightNumber: "AE-102", rocketId: r1.id, originId: moon.id, destinationId: earth.id, departureAt: d(2), arrivalAt: d(5), status: "scheduled", economyPrice: 12000, businessPrice: 35000, orbitalPrice: 80000, seatsTotal: 12, seatsBooked: 2 },
    { flightNumber: "AE-201", rocketId: r3.id, originId: earth.id, destinationId: mars.id, departureAt: d(5), arrivalAt: d(215), status: "scheduled", economyPrice: 250000, businessPrice: 750000, orbitalPrice: 2000000, seatsTotal: 24, seatsBooked: 18 },
    { flightNumber: "AE-202", rocketId: r3.id, originId: mars.id, destinationId: earth.id, departureAt: d(10), arrivalAt: d(220), status: "scheduled", economyPrice: 250000, businessPrice: 750000, orbitalPrice: 2000000, seatsTotal: 24, seatsBooked: 6 },
    { flightNumber: "AE-301", rocketId: r4.id, originId: earth.id, destinationId: europa.id, departureAt: d(30), arrivalAt: d(630), status: "scheduled", economyPrice: 1200000, businessPrice: 3500000, orbitalPrice: 9000000, seatsTotal: 4, seatsBooked: 1 },
    { flightNumber: "AE-103", rocketId: r1.id, originId: earth.id, destinationId: moon.id, departureAt: d(0), arrivalAt: d(3), status: "boarding", economyPrice: 12000, businessPrice: 35000, orbitalPrice: 80000, seatsTotal: 12, seatsBooked: 12 },
  ]);

  await db.insert(gallery).values([
    { title: "Earth from the Gateway", imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200", credit: "ÆTHER Media", category: "earth" },
    { title: "Lunar Dawn", imageUrl: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1200", credit: "ÆTHER Media", category: "moon" },
    { title: "Mars Horizon", imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200", credit: "ÆTHER Media", category: "mars" },
    { title: "Jupiter's Eye", imageUrl: "https://images.unsplash.com/photo-1630694093867-4b947d812bf0?w=1200", credit: "ÆTHER Media", category: "jupiter" },
    { title: "Deep Space", imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200", credit: "ÆTHER Media", category: "deep" },
  ]);

  console.log("✅ Seeded");
  process.exit(0);
}

main().catch(console.error);
