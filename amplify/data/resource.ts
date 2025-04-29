import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

import { listGroups } from "./groups/list-groups/resource";
import { addUserToGroup } from "./groups/add-user-to-group/resource";
import { removeUserFromGroup } from "./groups/remove-user-from-group/resource";
import { listUsersInGroup } from "./groups/list-users-in-group/resource";
import { listUsers } from "./users/list-users/resource";
import { listGroupsForUser } from "./users/list-groups-for-user/resource";
import { createUser } from "./users/create-user/resource";
import { disableUser } from "./users/disable-user/resource";
import { updateUserAttributes } from "./users/update-user-attributes/resource";
import { enableUser } from "./users/enable-user/resource";
import { deleteUser } from "./users/delete-user/resource";
import { setUserPassword } from "./users/set-user-password/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  listGroups: a
    .mutation()
    .arguments({})
    // Changed authorization to allow.authenticated()
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(listGroups))
    .returns(a.json()),
  addUserToGroup: a
    .mutation()
    .arguments({
      userName: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json()),
  removeUserFromGroup: a
    .mutation()
    .arguments({
      userName: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(removeUserFromGroup))
    .returns(a.json()),
  listUsersInGroup: a
    .mutation()
    .arguments({
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(listUsersInGroup))
    .returns(a.json()),
  listUsers: a
    .mutation()
    .arguments({})
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(listUsers))
    .returns(a.json()),
  listGroupsForUser: a
    .mutation()
    .arguments({
      userName: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(listGroupsForUser))
    .returns(a.json()),
  createUser: a
    .mutation()
    .arguments({
      userName: a.string().required(),
      email: a.string().required(),
      givenName: a.string().required(),
      familyName: a.string(),
      password: a.string().required(),
      projects: a.string(),
      clusters: a.string(),
      regions: a.string(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(createUser))
    .returns(a.json()),
  updateUserAttributes: a
    .mutation()
    .arguments({
      userName: a.string().required(),
      givenName: a.string().required(),
      familyName: a.string(),
      projects: a.string(),
      clusters: a.string(),
      regions: a.string(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(updateUserAttributes))
    .returns(a.json()),
  enableUser: a
    .mutation()
    .arguments({
      userName: a.string().required(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(enableUser))
    .returns(a.json()),
  disableUser: a
    .mutation()
    .arguments({
      userName: a.string().required(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(disableUser))
    .returns(a.json()),
  deleteUser: a
    .mutation()
    .arguments({
      userName: a.string().required(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(deleteUser))
    .returns(a.json()),
  setUserPassword: a
    .mutation()
    .arguments({
      userName: a.string().required(),
      password: a.string().required(),
      permanent: a.boolean().required(),
    })
    .authorization((allow) => [allow.group("admin")])
    .handler(a.handler.function(setUserPassword))
    .returns(a.json()),

  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
  // .authorization((allow) => [allow.owner()]),

  ProjectType: a
    .model({
      name: a.string().required(),
      description: a.string(),
      projects: a.hasMany("Project", "projectTypeId"), // Reference the related Projects
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]),
    ]),
  Cluster: a
    .model({
      name: a.string().required(),
      description: a.string(),
      regionId: a.id(),
      region: a.belongsTo("Region", "regionId"),
      projects: a.hasMany("Project", "clusterId"), // Reference the related Projects
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]),
    ]),
  Region: a
    .model({
      name: a.string().required(),
      description: a.string(),
      clusters: a.hasMany("Cluster", "regionId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]),
    ]),
  // Add FunctionalArea model here
  FunctionalArea: a
    .model({
      name: a.string().required(),
      description: a.string(),
      plan: a.hasMany("Plan", "functionalAreaId"),
      additionalActivities: a.hasMany("AdditionalActivity", "functionalAreaId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]),
    ]),
  Project: a
    .model({
      name: a.string().required(),
      location: a.string().required(),
      projectTypeId: a.id(),
      projectType: a.belongsTo("ProjectType", "projectTypeId"), // Belongs to ProjectType
      clusterId: a.id(), //
      cluster: a.belongsTo("Cluster", "clusterId"), // Belongs to Cluster
      description: a.string(),
      yearlyPlan: a.hasMany("YearlyPlan", "projectId"),
      monthlyForms: a.hasMany("MonthlyForm", "projectId"),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]),
    ]),
  YearlyPlan: a
    .model({
      user: a.string(),
      userId: a.string().required(),
      projectId: a.string(),
      project: a.belongsTo("Project", "projectId"),
      comments: a.string(),
      status: a.string(),
      year: a.string(),
      reviewedBy: a.string(),
      approvedBy: a.string(),
      quarterlyPlan: a.hasMany("QuarterlyPlan", "yearlyPlanId"),
    })
    .secondaryIndexes((index) => [
      index("year"),
      index("userId"),
      index("projectId"),
    ])
    .authorization((allow) => [
      allow.authenticated().to(["read", "update"]),
      allow.owner(),
      allow.groups(["admin"]),
    ]),
  QuarterlyPlan: a
    .model({
      yearlyPlanId: a.id(),
      yearlyPlan: a.belongsTo("YearlyPlan", "yearlyPlanId"),
      quarter: a.integer(),
      status: a.string(),
      reviewedBy: a.string(),
      approvedBy: a.string(),
      plan: a.hasMany("Plan", "quarterlyPlanId"),
    })
    .secondaryIndexes((index) => [index("yearlyPlanId"), index("quarter")])
    .authorization((allow) => [
      allow.authenticated().to(["read", "update"]),
      allow.owner(),
      allow.groups(["admin"]),
    ]),
  Plan: a
    .model({
      quarterlyPlanId: a.id(),
      quarterlyPlan: a.belongsTo("QuarterlyPlan", "quarterlyPlanId"),
      activity: a.string().required(),
      month: a.string().array(),
      functionalAreaId: a.id(),
      functionalArea: a.belongsTo("FunctionalArea", "functionalAreaId"),
      comments: a.string(),
      isMajorGoal: a.boolean(),
      outcomes: a.hasMany("Outcome", "activityId"),
      additionalActivitiesNextMonth: a.hasMany(
        "AdditionalActivityNextMonth",
        "activityId"
      ),
    })
    .secondaryIndexes((index) => [index("quarterlyPlanId")])
    .authorization((allow) => [
      allow.authenticated().to(["read", "update"]),
      allow.owner(),
      allow.groups(["admin"]),
    ]),
  Organization: a
    .model({
      name: a.string().required(),
      website: a.string(),
      address: a.string(),
      logo: a.string(),
      phoneNumber: a.string(),
      email: a.string(),
      description: a.string(),
      history: a.string(),
      mission: a.string(),
      vision: a.string(),
      coreValues: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]),
    ]),
  MonthlyForm: a
    .model({
      projectId: a.string().required(),
      project: a.belongsTo("Project", "projectId"),
      month: a.string().required(),
      year: a.string().required(),
      status: a.string(),
      facilitator: a.string(),
      praisePoints: a.string().array(),
      prayerRequests: a.string().array(),
      story: a.string(),
      concerns: a.string(),
      comments: a.string(),
      outcomes: a.hasMany("Outcome", "monthlyFormId"),
      additionalActivities: a.hasMany("AdditionalActivity", "monthlyFormId"),
      additionalActivitiesNextMonth: a.hasMany(
        "AdditionalActivityNextMonth",
        "monthlyFormId"
      ),
    })
    .secondaryIndexes((index) => [
      index("projectId"),
      index("facilitator"),
      index("year"),
      index("month"),
    ])
    .authorization((allow) => [
      allow.authenticated().to(["read", "update"]),
      allow.owner(),
      allow.groups(["admin"]),
    ]),
  AdditionalActivity: a
    .model({
      monthlyFormId: a.string().required(),
      monthlyForm: a.belongsTo("MonthlyForm", "monthlyFormId"),
      activity: a.string().required(),
      functionalAreaId: a.id().required(),
      functionalArea: a.belongsTo("FunctionalArea", "functionalAreaId"),
      comments: a.string(),
      isMajorGoal: a.boolean(),
    })
    .secondaryIndexes((index) => [index("monthlyFormId")])
    .authorization((allow) => [
      allow.authenticated().to(["read", "update"]),
      allow.owner(),
      allow.groups(["admin"]),
    ]),
  Outcome: a
    .model({
      monthlyFormId: a.string(),
      monthlyForm: a.belongsTo("MonthlyForm", "monthlyFormId"),
      activityId: a.string(),
      activity: a.belongsTo("Plan", "activityId"),
      reason: a.string(),
      achieved: a.string(),
      comments: a.string(),
    })
    .secondaryIndexes((index) => [index("monthlyFormId")])
    .authorization((allow) => [
      allow.authenticated().to(["read", "update"]),
      allow.owner(),
      allow.groups(["admin"]),
    ]),
  AdditionalActivityNextMonth: a
    .model({
      monthlyFormId: a.string(),
      monthlyForm: a.belongsTo("MonthlyForm", "monthlyFormId"),
      activityId: a.string(),
      activity: a.belongsTo("Plan", "activityId"),
    })
    .secondaryIndexes((index) => [index("monthlyFormId"), index("activityId")])
    .authorization((allow) => [
      allow.authenticated().to(["read", "update"]),
      allow.owner(),
      allow.groups(["admin"]),
    ]),
  // AdditionalActivity: a
  //   .model({
  //     monthlyFormId: a.string().required(),
  //     monthlyForm: a.belongsTo("MonthlyForm", "monthlyFormId"),
  //     activityId: a.string().required(),
  //     activity: a.belongsTo("Plan", "activityId"),
  //   })
  //   .authorization((allow) => [
  //     allow.authenticated().to(["read"]),
  //     allow.groups(["admin"]),
  //   ]),
  Parameters: a
    .model({
      monthlyFormStartDate: a.string(),
      quarterlyPlanResetDate: a.string(),
      startYear: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // defaultAuthorizationMode: "apiKey",
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
