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

import type { Schema } from "@root/amplify/data/resource";
import "@/app/app.css";
import outputs from "@root/amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function ProjectTypePage() {
  const [projectTypes, setProjectTypes] = useState<
    Array<Schema["ProjectType"]["type"]>
  >([]);
  const [editingProjectTypeId, setEditingProjectTypeId] = useState<
    string | null
  >(null);
  const [newProjectType, setNewProjectType] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch and list project types
  function listProjectTypes() {
    client.models.ProjectType.observeQuery().subscribe({
      next: (data) => setProjectTypes([...data.items]),
    });
  }

  // Delete a project type by ID
  function deleteProjectType(id: string) {
    client.models.ProjectType.delete({ id });
  }

  // Handle the create or edit form submission
  const handleSubmit = async (projectTypeId?: string) => {
    try {
      if (projectTypeId) {
        // Edit project type
        const projectType = projectTypes.find(
          (type) => type.id === projectTypeId
        );
        if (projectType) {
          const updatedProjectType = {
            id: projectType.id,
            name: projectType.name,
            description: projectType.description,
          };
          await client.models.ProjectType.update(updatedProjectType);
          setEditingProjectTypeId(null);
        }
      } else {
        // Add new project type
        if (newProjectType.name.trim() !== "") {
          const newProjectTypeData = {
            name: newProjectType.name,
            description: newProjectType.description,
          };
          await client.models.ProjectType.create(newProjectTypeData);
          setNewProjectType({ name: "", description: "" });
          setIsAdding(false);
        }
      }
    } catch (error) {
      console.error("Error creating or updating project type:", error);
    }
  };

  // Handle editing project type inline
  const handleProjectTypeChange = (
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    setProjectTypes((prevProjectTypes) =>
      prevProjectTypes.map((projectType) =>
        projectType.id === id ? { ...projectType, [field]: value } : projectType
      )
    );
  };

  // Handle adding new project type input changes
  const handleNewProjectTypeChange = (
    field: "name" | "description",
    value: string
  ) => {
    setNewProjectType((prevNewProjectType) => ({
      ...prevNewProjectType,
      [field]: value,
    }));
  };

  useEffect(() => {
    listProjectTypes();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s Project Types</h1>

          {/* Table listing project types */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Description</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {projectTypes.map((projectType) => (
                <TableRow key={projectType.id}>
                  <TableCell>
                    {editingProjectTypeId === projectType.id ? (
                      <TextField
                        label="Project type name"
                        value={projectType.name}
                        onChange={(e) =>
                          handleProjectTypeChange(
                            projectType.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      projectType.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProjectTypeId === projectType.id ? (
                      <TextField
                        label="Project type description"
                        value={projectType.description || ""}
                        onChange={(e) =>
                          handleProjectTypeChange(
                            projectType.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      projectType.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProjectTypeId === projectType.id ? (
                      <View>
                        <Button
                          onClick={() => handleSubmit(projectType.id)}
                          variation="primary"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingProjectTypeId(null)}
                          variation="link"
                        >
                          Cancel
                        </Button>
                      </View>
                    ) : (
                      <View>
                        <Button
                          onClick={() =>
                            setEditingProjectTypeId(projectType.id)
                          }
                          variation="link"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteProjectType(projectType.id)}
                          variation="link"
                        >
                          Delete
                        </Button>
                      </View>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new project type row */}
              {isAdding && (
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Project type name"
                      value={newProjectType.name}
                      onChange={(e) =>
                        handleNewProjectTypeChange("name", e.target.value)
                      }
                      placeholder="Project Type name"
                      isRequired
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Project type description"
                      value={newProjectType.description}
                      onChange={(e) =>
                        handleNewProjectTypeChange(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Project Type description"
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

          {/* Button to show the form for adding a new project type */}
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} variation="primary">
              Add New Project Type
            </Button>
          )}

          {/* Sign out button */}
          <Button onClick={signOut}>Sign Out</Button>
        </main>
      )}
    </Authenticator>
  );
}
