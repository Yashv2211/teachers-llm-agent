// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react-native";

const rules = {
  agents: {
    allow: {
      // Anyone can view agents (share token obscurity provides access control)
      view: "true",
      // Only authenticated teachers can create agents
      create: "auth.id != null",
      // Only the linked teacher can update/delete their agents
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id in data.ref('teacher.id')"],
  },
} satisfies InstantRules;

export default rules;
