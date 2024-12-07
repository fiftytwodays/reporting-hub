import { defineAuth } from "@aws-amplify/backend";

import { listGroups } from "../data/groups/list-groups/resource";
import { addUserToGroup } from "../data/groups/add-user-to-group/resource";

import { listUsers } from "../data/users/list-users/resource";
import { listGroupsForUser } from "../data/users/list-groups-for-user/resource";
import { createUser } from "../data/users/create-user/resource";
import { deleteUser } from "../data/users/delete-user/resource";
import { setUserPassword } from "../data/users/set-user-password/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    "custom:projects": {
      dataType: "String",
      mutable: true,
    },
    "custom:clusters": {
      dataType: "String",
      mutable: true,
    },
    "custom:regions": {
      dataType: "String",
      mutable: true,
    },
  },
  groups: ["user", "report-viewer", "admin"],

  access: (allow) => [
    allow.resource(listGroups).to(["listGroups"]),
    allow.resource(addUserToGroup).to(["addUserToGroup"]),
    allow.resource(listUsers).to(["listUsers"]),
    allow.resource(listGroupsForUser).to(["listGroupsForUser"]),
    allow.resource(createUser).to(["createUser"]),
    allow.resource(deleteUser).to(["deleteUser"]),
    allow.resource(setUserPassword).to(["setUserPassword"]),
  ],
});
