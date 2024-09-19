import { defineAuth } from "@aws-amplify/backend";

import { listGroups } from "../data/groups/list-groups/resource";
import { listUsers } from "../data/groups/list-users/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["admin", "report-viewer", "user"],

  access: (allow) => [
    allow.resource(listGroups).to(["listGroups"]),
    allow.resource(listUsers).to(["listUsers"]),
  ],
});
