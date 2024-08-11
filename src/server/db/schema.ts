import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  text,
  time,
  timestamp,
  unique,
  varchar,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `${name}`);

export const facultyEnum = pgEnum('faculty', [
  'FITB',
  'FMIPA',
  'FSRD',
  'FTMD',
  'FTTM',
  'FTSL',
  'FTI',
  'SAPPK',
  'SBM',
  'SF',
  'SITH',
  'STEI',
]);

export const lembagaEnum = pgEnum('lembaga', ['HMJ', 'Unit']);

export const roleEnum = pgEnum('role', ['Peserta', 'Mentor', 'Mamet', 'ITB-X']);

export const genderEnum = pgEnum('gender', ['Male', 'Female']);

export const assignmentTypeEnum = pgEnum('assignmentType', ['Main', 'Side']);

export const presenceTypeEnum = pgEnum('presenceType', [
  'Hadir',
  'Izin/Sakit',
  'Alpha',
]);

export const eventDayEnum = pgEnum('day', ['Day 1', 'Day 2', 'Day 3', 'Day 4']);

export const presenceEventEnum = pgEnum('presenceEvent', [
  'Opening',
  'Closing',
]);

export const classDayEnum = pgEnum('classDay', ['Day 1', 'Day 2']);

// Users
export const users = createTable(
  'users',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    nim: varchar('nim', { length: 100 }).unique().notNull(),
    role: roleEnum('role').notNull(),
    email: varchar('email', { length: 255 }).unique(),
    password: varchar('password', { length: 255 }).notNull(),
    activityPoints: integer('activityPoints').default(0),
    createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (user) => ({
    idIdx: index().on(user.id),
    nimIdx: index().on(user.nim),
  }),
);

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  userMatchesAsFirstUser: many(userMatches, { relationName: 'firstUser' }),
  userMatchesAsSecondUser: many(userMatches, { relationName: 'secondUser' }),
  messages: many(messages, { relationName: 'sender' }),
  messagesAsReceiver: many(messages, { relationName: 'receiver' }),
  resetToken: one(resetTokens),
  chosenClass: one(classes),
  wrappedProfile: one(wrappedProfiles),
}));

// Profiles
export const profiles = createTable(
  'profiles',
  {
    name: varchar('name', { length: 255 }).notNull(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    faculty: facultyEnum('faculty').notNull(),
    gender: genderEnum('gender').notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
    profileImage: text('profileImage'),
    groupNumber: integer('groupNumber').notNull(),
    point: integer('point'),
    instagram: varchar('instagram', { length: 255 }),
    chosenClass: varchar('chosenClass', { length: 255 }).references(
      () => classes.id,
    ),
  },
  (profile) => ({
    userIdIdx: index().on(profile.userId),
    pointIdx: index().on(profile.point),
  }),
);

export const profilesRelations = relations(profiles, ({ one }) => ({
  users: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const resetTokens = createTable('resetTokens', {
  userId: text('id')
    .primaryKey()
    .references(() => users.id),
  value: text('value'),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  expiredTime: integer('expiredTime').default(3600),
});

export const resetTokenRelations = relations(resetTokens, ({ one }) => ({
  userId: one(users, {
    fields: [resetTokens.userId],
    references: [users.id],
  }),
}));

// User Matches
export const userMatches = createTable('userMatches', {
  id: text('id').primaryKey().$defaultFn(createId),
  firstUserId: text('firstUserId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  secondUserId: text('secondUserId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  // Change to enum later
  topic: varchar('topic', { length: 50 }).notNull(),
  isRevealed: boolean('isRevealed')
    .notNull()
    .default(sql`false`),
  // is anonyomous -> dia mau profile dia keliatan ato ga
  isAnonymous: boolean('isAnonymous')
    .notNull()
    .default(sql`false`),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  endedAt: timestamp('endedAt', { mode: 'date', withTimezone: true })
    .default(sql`null`)
    .$type<Date | null>(),
});

export const userMatchesRelations = relations(userMatches, ({ many, one }) => ({
  firstUser: one(users, {
    fields: [userMatches.firstUserId],
    references: [users.id],
    relationName: 'firstUser',
  }),
  secondUser: one(users, {
    fields: [userMatches.secondUserId],
    references: [users.id],
    relationName: 'secondUser',
  }),
  messages: many(messages),
}));

// Messages
export const messages = createTable('messages', {
  id: text('id').primaryKey().$defaultFn(createId),
  senderId: text('senderId')
    .notNull()
    .references(() => users.id),
  receiverId: text('receiverId')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  isRead: boolean('isRead')
    .notNull()
    .default(sql`false`),
  createdAt: timestamp('createdAt', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  userMatchId: text('userMatchId')
    .notNull()
    .references(() => userMatches.id, { onDelete: 'cascade' }),
});

export const messagesRelations = relations(messages, ({ many, one }) => ({
  senderId: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiverId: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
  userMatch: one(userMatches, {
    fields: [messages.userMatchId],
    references: [userMatches.id],
  }),
}));

// Assignments
export const assignments = createTable('assignments', {
  id: text('id').primaryKey().$defaultFn(createId),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  startTime: timestamp('startTime', { mode: 'date', withTimezone: true }),
  deadline: timestamp('deadline', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  files: varchar('files', { length: 255 })
    .array()
    .default(sql`ARRAY[]::varchar[]`),
  assignmentType: assignmentTypeEnum('assignmentType').notNull(),
  point: integer('point'),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
});

// Assignment Submissions
export const assignmentSubmissions = createTable(
  'assignmentSubmissions',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    point: integer('point'),
    assignmentId: text('assignmentId')
      .notNull()
      .references(() => assignments.id, { onDelete: 'cascade' }),
    userNim: varchar('userNim', { length: 100 })
      .notNull()
      .references(() => users.nim, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    files: varchar('files', { length: 255 })
      .array()
      .default(sql`ARRAY[]::varchar[]`),
    createdAt: timestamp('createdAt', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (submission) => ({
    userIdIdx: index('submission_userId_idx').on(submission.userNim),
  }),
);

export const assignmentSubmissionsRelations = relations(
  assignmentSubmissions,
  ({ one }) => ({
    assignment: one(assignments, {
      fields: [assignmentSubmissions.assignmentId],
      references: [assignments.id],
    }),
    user: one(users, {
      fields: [assignmentSubmissions.userNim],
      references: [users.nim],
    }),
  }),
);

// Character
export const characters = createTable('characters', {
  name: varchar('name', { length: 255 }).notNull().primaryKey(),
  characterImage: varchar('characterImage', { length: 255 }).notNull(),
});

// Events
export const events = createTable(
  'events',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    day: eventDayEnum('day').notNull(),
    eventDate: date('eventDate', { mode: 'date' }).notNull(),
    openingOpenPresenceTime: time('openingOpenPresenceTime').notNull(),
    openingClosePresenceTime: time('openingClosePresenceTime').notNull(),
    closingOpenPresenceTime: time('closingOpenPresenceTime').notNull(),
    closingClosePresenceTime: time('closingClosePresenceTime').notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
    lore: text('lore').notNull(),
    characterName: varchar('characterName', { length: 255 })
      .notNull()
      .references(() => characters.name),
    guideBook: varchar('guideBook', { length: 255 }).notNull(),
    youtubeVideo: varchar('youtubeVideo', { length: 255 }).notNull(),
  },
  (e) => ({
    uniqueDayConstraint: unique().on(e.day),
  }),
);

export const eventsCharactersRelations = relations(events, ({ one }) => ({
  characters: one(characters, {
    fields: [events.characterName],
    references: [characters.name],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  eventPresences: many(eventPresences),
}));

// Event Presences
export const eventPresences = createTable(
  'eventPresence',
  {
    id: text('id').primaryKey().$defaultFn(createId),
    eventId: text('eventId')
      .notNull()
      .references(() => events.id),
    userNim: varchar('userNim', { length: 255 })
      .notNull()
      .references(() => users.nim),
    presenceType: presenceTypeEnum('presenceType').notNull(),
    presenceEvent: presenceEventEnum('presenceEvent').notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (presence) => ({
    eventIdIdx: index('presence_eventId_idx').on(presence.eventId),
    userIdIdx: index('presence_userId_idx').on(presence.userNim),
    uniquePresenceConstraint: unique().on(
      presence.eventId,
      presence.presenceEvent,
      presence.userNim,
    ),
  }),
);

export const eventPresencesRelations = relations(eventPresences, ({ one }) => ({
  event: one(events, {
    fields: [eventPresences.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventPresences.userNim],
    references: [users.nim],
  }),
}));

export const classes = createTable('classes', {
  id: text('id').primaryKey().$defaultFn(createId),
  title: varchar('title', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 100 }),
  description: text('description').notNull(),
  speaker: varchar('speaker', { length: 100 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
  date: timestamp('date', { mode: 'date', withTimezone: true }).notNull(),
  totalSeats: integer('totalSeats').notNull(),
  reservedSeats: integer('reservedSeats').default(0),
});

export const classUserRelations = relations(classes, ({ many }) => ({
  users: many(users),
}));

export const postTests = createTable('postTests', {
  id: text('id').primaryKey().$defaultFn(createId),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  startTime: timestamp('startTime', { mode: 'date', withTimezone: true }),
  deadline: timestamp('deadline', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  googleFormLink: varchar('googleFormLink', { length: 255 }).notNull(),
  eventId: text('eventId')
    .notNull()
    .references(() => events.id),
});

export const postTestSubmissions = createTable(
  'postTestSubmissions',
  {
    postTestId: text('postTestId')
      .notNull()
      .references(() => postTests.id),
    userNim: varchar('userNim', { length: 100 })
      .notNull()
      .references(() => users.nim),
    createdAt: timestamp('createdAt', {
      mode: 'date',
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (submission) => {
    return {
      pk: primaryKey({ columns: [submission.postTestId, submission.userNim] }),
      userNimIdx: index('submission_usernim_idx').on(submission.userNim),
    };
  },
);

export const postTestRelations = relations(postTests, ({ one }) => ({
  event: one(events, {
    fields: [postTests.eventId],
    references: [events.id],
  }),
}));

export const postTestSubmissionRelations = relations(
  postTestSubmissions,
  ({ one }) => ({
    postTest: one(postTests, {
      fields: [postTestSubmissions.postTestId],
      references: [postTests.id],
    }),
    user: one(users, {
      fields: [postTestSubmissions.userNim],
      references: [users.nim],
    }),
  }),
);

export const notifications = createTable('notifications', {
  id: text('id').primaryKey().$defaultFn(createId),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const wrappedProfiles = createTable(
  'wrappedProfiles',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    totalMatch: integer('totalMatch').notNull().default(0),
    submittedQuest: integer('submittedQuest').notNull().default(0),
    mbti: text('mbti'),
    favTopic: text('favTopic'),
    rank: integer('rank'),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (wrappedProfile) => ({
    userIdIdx: index().on(wrappedProfile.userId),
  }),
);

export const wrappedProfilesRelation = relations(wrappedProfiles, ({ one }) => ({
  users: one(users, {
    fields: [wrappedProfiles.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type UserMatch = typeof userMatches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventPresence = typeof eventPresences.$inferSelect;
export type ResetToken = typeof resetTokens.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type PostTest = typeof postTests.$inferSelect;
export type PostTestSubmission = typeof postTestSubmissions.$inferSelect;
export type Notifications = typeof notifications.$inferSelect;

export type UserRole = (typeof roleEnum.enumValues)[number];
export type UserFaculty = (typeof facultyEnum.enumValues)[number];
export type UserGender = (typeof genderEnum.enumValues)[number];