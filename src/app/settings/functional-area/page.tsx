"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
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

import type { Schema } from "../../../../amplify/data/resource";
import "@/app/app.css";
import outputs from "@root/amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function FunctionalAreaPage() {
  const [functionalAreas, setFunctionalAreas] = useState<
    Array<Schema["FunctionalArea"]["type"]>
  >([]);
  const [editingFunctionalAreaId, setEditingFunctionalAreaId] = useState<
    string | null
  >(null);
  const [newFunctionalArea, setNewFunctionalArea] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch and list functional areas
  function listFunctionalAreas() {
    client.models.FunctionalArea.observeQuery().subscribe({
      next: (data) => setFunctionalAreas([...data.items]),
    });
  }

  // Delete a functional area by ID
  function deleteFunctionalArea(id: string, name: string) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the Functional Area: "${name}"?`
    );

    if (confirmDelete) {
      // Proceed with deletion if confirmed
      client.models.FunctionalArea.delete({ id });
    }
  }

  // Handle the create or edit form submission
  const handleSubmit = async (functionalAreaId?: string) => {
    try {
      if (functionalAreaId) {
        // Edit functional area
        const functionalArea = functionalAreas.find(
          (area) => area.id === functionalAreaId
        );
        if (functionalArea) {
          const updatedFunctionalArea = {
            id: functionalArea.id,
            name: functionalArea.name,
            description: functionalArea.description,
          };
          await client.models.FunctionalArea.update(updatedFunctionalArea);
          setEditingFunctionalAreaId(null);
        }
      } else {
        // Add new functional area
        if (newFunctionalArea.name.trim() !== "") {
          const newFunctionalAreaData = {
            name: newFunctionalArea.name,
            description: newFunctionalArea.description,
          };
          await client.models.FunctionalArea.create(newFunctionalAreaData);
          setNewFunctionalArea({ name: "", description: "" });
          setIsAdding(false);
        }
      }
    } catch (error) {
      console.error("Error creating or updating functional area:", error);
    }
  };

  // Handle editing functional area inline
  const handleFunctionalAreaChange = (
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    setFunctionalAreas((prevFunctionalAreas) =>
      prevFunctionalAreas.map((functionalArea) =>
        functionalArea.id === id
          ? { ...functionalArea, [field]: value }
          : functionalArea
      )
    );
  };

  // Handle adding new functional area input changes
  const handleNewFunctionalAreaChange = (
    field: "name" | "description",
    value: string
  ) => {
    setNewFunctionalArea((prevNewFunctionalArea) => ({
      ...prevNewFunctionalArea,
      [field]: value,
    }));
  };

  useEffect(() => {
    listFunctionalAreas();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s Functional Areas</h1>

          {/* Table listing functional areas */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Description</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {functionalAreas.map((functionalArea) => (
                <TableRow key={functionalArea.id}>
                  <TableCell>
                    {editingFunctionalAreaId === functionalArea.id ? (
                      <TextField
                        label="Functional area name"
                        value={functionalArea.name}
                        onChange={(e) =>
                          handleFunctionalAreaChange(
                            functionalArea.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      functionalArea.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingFunctionalAreaId === functionalArea.id ? (
                      <TextField
                        label="Functional area description"
                        value={functionalArea.description || ""}
                        onChange={(e) =>
                          handleFunctionalAreaChange(
                            functionalArea.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      functionalArea.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingFunctionalAreaId === functionalArea.id ? (
                      <View>
                        <Button
                          onClick={() => handleSubmit(functionalArea.id)}
                          variation="primary"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingFunctionalAreaId(null)}
                          variation="link"
                        >
                          Cancel
                        </Button>
                      </View>
                    ) : (
                      <View>
                        <Button
                          onClick={() =>
                            setEditingFunctionalAreaId(functionalArea.id)
                          }
                          variation="link"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() =>
                            deleteFunctionalArea(
                              functionalArea.id,
                              functionalArea.name
                            )
                          }
                          variation="link"
                        >
                          Delete
                        </Button>
                      </View>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new functional area row */}
              {isAdding && (
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Functional area name"
                      value={newFunctionalArea.name}
                      onChange={(e) =>
                        handleNewFunctionalAreaChange("name", e.target.value)
                      }
                      placeholder="Functional Area name"
                      isRequired
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Functional area description"
                      value={newFunctionalArea.description}
                      onChange={(e) =>
                        handleNewFunctionalAreaChange(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Functional Area description"
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

          {/* Button to show the form for adding a new functional area */}
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} variation="primary">
              Add New Functional Area
            </Button>
          )}

          {/* Sign out button */}
          <Button onClick={signOut}>Sign Out</Button>
        </main>
      )}
    </Authenticator>
  );
}
