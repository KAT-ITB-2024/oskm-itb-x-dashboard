// import bcrypt from "bcrypt";
// import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "@katitb2024/database";
// import { eq } from "drizzle-orm";
// import dotenv from "dotenv";

// export async function seedUser(db: PostgresJsDatabase<typeof schema>) {
//   const password = await bcrypt.hash("password", 10);
//   for (let i = 0; i < 10; i++) {
//     try {
//       await db.insert(schema.users).values({
//         nim: `1352100${i}`,
//         password,
//         role: "Peserta",
//         updatedAt: new Date(),
//       });
//     } catch (error) {
//       console.error(`Error seeding Peserta`);
//       break;
//     }
//   }

//   for (let i = 0; i < 5; i++) {
//     const role = i % 2 === 0 ? "Mamet" : "Mentor";
//     try {
//       await db.insert(schema.users).values({
//         nim: `1352200${i}`,
//         password,
//         role,
//         updatedAt: new Date(),
//       });
//     } catch (error) {
//       console.error(`Error seeding mamet / mentor`);
//       break;
//     }
//   }
// }

// export async function seedGroup(db: PostgresJsDatabase<typeof schema>) {
//   for (let i = 0; i < 6; i++) {
//     try {
//       await db.insert(schema.groups).values({
//         name: `Keluarga-${i}`,
//         point: 0,
//       });
//     } catch (error) {}
//   }
// }

// export async function seedProfile(db: PostgresJsDatabase<typeof schema>) {
//   const userIds = await db
//     .select()
//     .from(schema.users)
//     .where(eq(schema.users.role, "Peserta"));
//   const groups = await db.select().from(schema.groups);
//   if (!userIds) {
//     return;
//   }

//   for (let i = 0; i < userIds.length - 1; i++) {
//     const user = userIds[i];
//     const group = groups[i % 6];
//     if (!user || !group) {
//       return;
//     }
//     try {
//       await db.insert(schema.profiles).values({
//         name: `User ${user.id}`,
//         userId: user.id,
//         faculty: "STEI",
//         gender: i % 2 === 0 ? "Male" : "Female",
//         profileImage: "",
//         point: 0,
//         group: group.name,
//         updatedAt: new Date(),
//       });
//     } catch (error) {
//       console.error(`Error seeding profile`);
//       return;
//     }
//   }
// }

// export async function seedAssignment(db: PostgresJsDatabase<typeof schema>) {
//   let dayCounter = 25;
//   for (let i = 0; i < 4; i++) {
//     await db.insert(schema.assignments).values({
//       title: `Assignment ${i}`,
//       description: `Description buat assignment ke ${i}`,
//       startTime: new Date(`2024-08-${dayCounter}T00:00:00Z`), // Tanggal 25
//       deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       assignmentType: "Main",
//       point: 10,
//       filename: `Assignment ${i}`,
//       downloadUrl: "https://google.com/DownloadUrl",
//       updatedAt: new Date(),
//     });
//     dayCounter += 1;
//   }

//   dayCounter = 25;
//   for (let i = 0; i < 4; i++) {
//     await db.insert(schema.assignments).values({
//       title: `Side Quest ${i}`,
//       description: `Description buat Side Quest ke ${i}`,
//       startTime: new Date(`2024-08-${dayCounter}T00:00:00Z`),
//       deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       assignmentType: "Side",
//       point: 50,
//       filename: `Side Quest ${i}`,
//       downloadUrl: "https://google.com/DownloadUrl",
//       updatedAt: new Date(),
//     });
//     dayCounter += 1;
//   }
// }

// export async function seedCharacter(db: PostgresJsDatabase<typeof schema>) {
//   for (let i = 0; i < 4; i++) {
//     try {
//       await db.insert(schema.characters).values({
//         name: `Character ${i}`,
//         characterImage: "",
//       });
//     } catch (error) {
//       console.error(`Error seeding character`);
//     }
//   }
// }

// export async function seedEvent(db: PostgresJsDatabase<typeof schema>) {
//   const characters = await db.query.characters.findMany();

//   if (!characters[0]) {
//     return;
//   }

//   await db.insert(schema.events).values({
//     day: "Day 1",
//     eventDate: new Date("2023-07-25T00:00:00Z"),
//     openingOpenPresenceTime: "09:00:00",
//     openingClosePresenceTime: "10:00:00",
//     closingOpenPresenceTime: "17:00:00",
//     closingClosePresenceTime: "18:00:00",
//     updatedAt: new Date(),
//     lore: "https://google.com",
//     characterName: characters[0]?.name,
//     guideBook: "",
//     youtubeVideo: "",
//   });

//   await db.insert(schema.events).values({
//     day: "Day 2",
//     eventDate: new Date("2023-07-28T00:00:00Z"),
//     openingOpenPresenceTime: "09:00:00",
//     openingClosePresenceTime: "10:00:00",
//     closingOpenPresenceTime: "17:00:00",
//     closingClosePresenceTime: "18:00:00",
//     updatedAt: new Date(),
//     lore: "https://google.com",
//     characterName: characters[0]?.name,
//     guideBook: "",
//     youtubeVideo: "",
//   });
// }

// export async function seedAssignmentSubmission(
//   db: PostgresJsDatabase<typeof schema>,
// ) {
//   const assignments = await db.query.assignments.findMany();
//   const users = await db.query.users.findMany();

//   if (assignments.length < 4) {
//     throw new Error(
//       "Not enough assignments available to seed assignment submissions.",
//     );
//   }

//   for (let i = 0; i < 10; i++) {
//     await db.insert(schema.assignmentSubmissions).values({
//       assignmentId: assignments[i % 4]?.id ?? "",
//       userNim: users[i]?.nim ?? "",
//       filename: `Assignment ${i}`,
//       downloadUrl: "https://google.com/DownloadUrl",
//       point: i % 3 == 0 ? null : (assignments[i % 4]?.point ?? 0),
//       updatedAt: new Date(),
//     });
//   }
// }

// export async function seedPostTest(db: PostgresJsDatabase<typeof schema>) {
//   const events = await db.query.events.findMany();

//   if (events.length < 2) {
//     throw new Error("Not enough events available to seed post tests.");
//   }

//   for (let i = 0; i < 2; i++) {
//     const deadline = new Date();
//     deadline.setDate(deadline.getDate() + 7); // Adds 7 days to the current date

//     await db.insert(schema.postTests).values({
//       deadline: deadline,
//       description: `Post test day ${i + 1}`,
//       eventId: events[i]?.id ?? "",
//       title: `Post Test Day ${i + 1}`,
//       googleFormLink: "https://google.com",
//       startTime: new Date(),
//     });
//   }
// }

// export async function seedPostTestSubmission(
//   db: PostgresJsDatabase<typeof schema>,
// ) {
//   const tests = await db.query.postTests.findMany();
//   const users = await db.query.users.findMany();

//   if (tests.length < 2) {
//     throw new Error(
//       "Not enough post tests available to seed post test submissions.",
//     );
//   }

//   for (let i = 0; i < 10; i++) {
//     await db.insert(schema.postTestSubmissions).values({
//       postTestId: tests[i % 2]?.id ?? "",
//       userNim: users[i]?.nim ?? "",
//     });
//   }
// }

// export async function seedNotifications(db: PostgresJsDatabase<typeof schema>) {
//   for (let i = 0; i < 4; i++) {
//     await db.insert(schema.notifications).values({
//       content: `Tugas untuk day ke-${i} baru saja muncul!`,
//     });
//   }
// }
// export async function seed(dbUrl: string) {
//   const migrationClient = postgres(dbUrl, { max: 1 });

//   const db = drizzle(migrationClient, { schema });
//   await seedUser(db);
//   console.log("Done seeding user");
//   await seedGroup(db);
//   console.log("Done seeding group!");
//   await seedProfile(db);
//   console.log("Done seeding profile");
//   await seedCharacter(db);
//   console.log("Done seeding character");
//   await seedEvent(db);
//   console.log("Done seeding event");
//   await seedAssignment(db);
//   console.log("Done seeding assignment");
//   await seedAssignmentSubmission(db);
//   console.log("Done seeding assignment submission");
//   await seedPostTest(db);
//   console.log("Done seeding post test");
//   await seedPostTestSubmission(db);
//   console.log("Done seeding post test submission");
//   await seedNotifications(db);
//   console.log("Done seeding notifications!");
//   await migrationClient.end();
// }
// dotenv.config();

// const dbUrl = process.env.DATABASE_URL;
// if (!dbUrl) {
//   console.error("No databse url provided!");
// } else {
//   await seed(dbUrl)
//     .catch((err) => {
//       console.log(err);
//     })
//     .then(() => console.log("Done seeding data!"));
// }
