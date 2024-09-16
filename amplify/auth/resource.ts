import { defineAuth } from "@aws-amplify/backend";

import { listGroups } from "../data/groups/list-groups/resource";
import { addUserToGroup } from "../data/groups/add-user-to-group/resource";

import { listUsers } from "../data/users/list-users/resource";
import { createUser } from "../data/users/create-user/resource";
import { setUserPassword } from "../data/users/set-user-password/resource";

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
    allow.resource(addUserToGroup).to(["addUserToGroup"]),
    allow.resource(listUsers).to(["listUsers"]),
    allow.resource(createUser).to(["createUser"]),
    allow.resource(setUserPassword).to(["setUserPassword"]),
  ],
});
