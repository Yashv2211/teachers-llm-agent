// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    colors: i.entity({
      value: i.string(),
    }),
    agents: i.entity({
      name: i.string(),
      subject: i.string(),
      systemPrompt: i.string(),
      contextText: i.string().optional(),
      contextSources: i.string().optional(), // JSON array of { type, label } objects
      gradeLevel: i.string(), // "elementary" | "middle" | "high"
      language: i.string(), // e.g. "English", "Spanish"
      shareToken: i.string().unique().indexed(),
      createdAt: i.number().indexed(),
    }),
  },
  rooms: {},
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    teacherAgents: {
      forward: {
        on: "$users",
        has: "many",
        label: "agents",
      },
      reverse: {
        on: "agents",
        has: "one",
        label: "teacher",
      },
    },
  },
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
