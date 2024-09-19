"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "@root/amplify/data/resource";
import {
  Authenticator,
  Button,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "@/app/app.css";
import outputs from "@root/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [regions, setRegions] = useState<Array<Schema["Region"]["type"]>>([]);
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null); // Track the region being edited
  const [newRegion, setNewRegion] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  }); // For adding new region
  const [isAdding, setIsAdding] = useState(false); // Track if a new region is being added

  // Fetch and list regions
  function listRegions() {
    client.models.Region.observeQuery().subscribe({
      next: (data) => setRegions([...data.items]),
    });
  }

  // Delete a region by ID
  function deleteRegion(id: string) {
    client.models.Region.delete({ id });
  }

  // Handle the create or edit form submission
  const handleSubmit = async (regionId?: string) => {
    if (regionId) {
      // Edit region
      const region = regions.find((region) => region.id === regionId);
      if (region) {
        await client.models.Region.update({
          id: region.id,
          name: region.name,
          description: region.description,
        });
        setEditingRegionId(null);
      }
    } else {
      // Add new region
      if (newRegion.name.trim() !== "") {
        await client.models.Region.create({
          name: newRegion.name,
          description: newRegion.description,
        });
        setNewRegion({ name: "", description: "" });
        setIsAdding(false);
      }
    }
  };

  // Handle editing region inline
  const handleRegionChange = (
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    setRegions((prevRegions) =>
      prevRegions.map((region) =>
        region.id === id ? { ...region, [field]: value } : region
      )
    );
  };

  // Handle adding new region input changes
  const handleNewRegionChange = (
    field: "name" | "description",
    value: string
  ) => {
    setNewRegion((prevNewRegion) => ({ ...prevNewRegion, [field]: value }));
  };

  useEffect(() => {
    listRegions();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s Regions</h1>

          {/* Table listing regions */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Description</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {regions.map((region) => (
                <TableRow key={region.id}>
                  <TableCell>
                    {editingRegionId === region.id ? (
                      <TextField
                        label="Region name"
                        value={region.name}
                        onChange={(e) =>
                          handleRegionChange(region.id, "name", e.target.value)
                        }
                      />
                    ) : (
                      region.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRegionId === region.id ? (
                      <TextField
                        label="Region description"
                        value={region.description || ""}
                        onChange={(e) =>
                          handleRegionChange(
                            region.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      region.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRegionId === region.id ? (
                      <View>
                        <Button
                          onClick={() => handleSubmit(region.id)}
                          variation="primary"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingRegionId(null)}
                          variation="link"
                        >
                          Cancel
                        </Button>
                      </View>
                    ) : (
                      <View>
                        <Button
                          onClick={() => setEditingRegionId(region.id)}
                          variation="link"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteRegion(region.id)}
                          variation="link"
                        >
                          Delete
                        </Button>
                      </View>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new region row */}
              {isAdding && (
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Region name"
                      value={newRegion.name}
                      onChange={(e) =>
                        handleNewRegionChange("name", e.target.value)
                      }
                      placeholder="Region name"
                      isRequired
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Region description"
                      value={newRegion.description}
                      onChange={(e) =>
                        handleNewRegionChange("description", e.target.value)
                      }
                      placeholder="Region description"
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleSubmit()} variation="primary">
                      Add
                    </Button>
                    <Button onClick={() => setIsAdding(false)} variation="link">
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>

          {/* Button to show the form for adding a new region */}
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} variation="primary">
              Add New Region
            </Button>
          )}

          {/* Sign out button */}
          <Button onClick={signOut}>Sign Out</Button>
        </main>
      )}
    </Authenticator>
  );
}
