"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "@root/amplify/data/resource";
import "@/app/app.css";
import outputs from "@root/amplify_outputs.json";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  return (
    <>
      <h1>Dashboard</h1>
      <p>Coming soon..</p>
    </>
  );
}
