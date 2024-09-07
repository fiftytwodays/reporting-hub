"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

import "../../../app/app.css";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function App() {
  const [regions, setRegions] = useState<Array<Schema["Region"]["type"]>>([]);

  function listRegions() {
    client.models.Region.observeQuery().subscribe({
      next: (data) => setRegions([...data.items]),
    });
  }

  function deleteRegion(id: string) {
    client.models.Region.delete({ id });
  }

  useEffect(() => {
    listRegions();
  }, []);

  function createRegion() {
    client.models.Region.create({
      name: window.prompt("Region name"),
      description: window.prompt("Region description"),
    });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s regions</h1>
          <button onClick={createRegion}>+ new</button>
          <ul>
            {regions.map((region) => (
              <li onClick={() => deleteRegion(region.id)} key={region.id}>
                {region.name} - {region.description}
              </li>
            ))}
          </ul>
        </main>
      )}
    </Authenticator>
  );
}
