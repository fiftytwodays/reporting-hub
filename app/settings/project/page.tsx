"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "@/app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  Authenticator,
  Button,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  SelectField,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function ProjectPage() {
  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>([]);
  const [projectTypes, setProjectTypes] = useState<Array<Schema["ProjectType"]["type"]>>([]);
  const [clusters, setClusters] = useState<Array<Schema["Cluster"]["type"]>>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<{
    name: string;
    location: string;
    projectTypeId: string;
    clusterId: string;
    description: string;
  }>({
    name: "",
    location: "",
    projectTypeId: "",
    clusterId: "",
    description: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch and list projects
  function listProjects() {
    client.models.Project.observeQuery().subscribe({
      next: (data) => setProjects([...data.items]),
    });
  }

  // Fetch project types for dropdown
  function listProjectTypes() {
    client.models.ProjectType.observeQuery().subscribe({
      next: (data) => setProjectTypes([...data.items]),
    });
  }

  // Fetch clusters for dropdown
  function listClusters() {
    client.models.Cluster.observeQuery().subscribe({
      next: (data) => setClusters([...data.items]),
    });
  }

  // Delete a project by ID
  function deleteProject(id: string) {
    client.models.Project.delete({ id });
  }

  // Handle the create or edit form submission
  const handleSubmit = async (projectId?: string) => {
    try {
      if (projectId) {
        // Edit project
        const project = projects.find((project) => project.id === projectId);
        if (project) {
          const updatedProject = {
            id: project.id,
            name: project.name,
            location: project.location,
            description: project.description,
            ...(project.projectTypeId && { projectTypeId: project.projectTypeId }),
            ...(project.clusterId && { clusterId: project.clusterId }),
          };
          await client.models.Project.update(updatedProject);
          setEditingProjectId(null);
        }
      } else {
        // Add new project
        if (newProject.name.trim() !== "") {
          const newProjectData = {
            name: newProject.name,
            location: newProject.location,
            description: newProject.description,
            ...(newProject.projectTypeId && { projectTypeId: newProject.projectTypeId }),
            ...(newProject.clusterId && { clusterId: newProject.clusterId }),
          };
          await client.models.Project.create(newProjectData);
          setNewProject({
            name: "",
            location: "",
            projectTypeId: "",
            clusterId: "",
            description: "",
          });
          setIsAdding(false);
        }
      }
    } catch (error) {
      console.error("Error creating or updating project:", error);
    }
  };

  // Handle editing project inline
  const handleProjectChange = (
    id: string,
    field: "name" | "location" | "projectTypeId" | "clusterId" | "description",
    value: string
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  // Handle adding new project input changes
  const handleNewProjectChange = (
    field: "name" | "location" | "projectTypeId" | "clusterId" | "description",
    value: string
  ) => {
    setNewProject((prevNewProject) => ({ ...prevNewProject, [field]: value }));
  };

  useEffect(() => {
    listProjects();
    listProjectTypes();
    listClusters();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s Projects</h1>

          {/* Table listing projects */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Location</TableCell>
                <TableCell as="th">Project Type</TableCell>
                <TableCell as="th">Cluster</TableCell>
                <TableCell as="th">Description</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {editingProjectId === project.id ? (
                      <TextField
                        label="Project name"
                        value={project.name}
                        onChange={(e) =>
                          handleProjectChange(project.id, "name", e.target.value)
                        }
                      />
                    ) : (
                      project.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProjectId === project.id ? (
                      <TextField
                        label="Project location"
                        value={project.location || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            project.id,
                            "location",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      project.location
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProjectId === project.id ? (
                      <SelectField
                        label="Project Type"
                        value={project.projectTypeId ?? ""}
                        onChange={(e) =>
                          handleProjectChange(
                            project.id,
                            "projectTypeId",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Project Type</option>
                        {projectTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </SelectField>
                    ) : (
                      projectTypes.find((type) => type.id === project.projectTypeId)
                        ?.name || ""
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProjectId === project.id ? (
                      <SelectField
                        label="Cluster"
                        value={project.clusterId ?? ""}
                        onChange={(e) =>
                          handleProjectChange(project.id, "clusterId", e.target.value)
                        }
                      >
                        <option value="">Select Cluster</option>
                        {clusters.map((cluster) => (
                          <option key={cluster.id} value={cluster.id}>
                            {cluster.name}
                          </option>
                        ))}
                      </SelectField>
                    ) : (
                      clusters.find((cluster) => cluster.id === project.clusterId)
                        ?.name || ""
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProjectId === project.id ? (
                      <TextField
                        label="Project description"
                        value={project.description || ""}
                        onChange={(e) =>
                          handleProjectChange(
                            project.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      project.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProjectId === project.id ? (
                      <View>
                        <Button
                          onClick={() => handleSubmit(project.id)}
                          variation="primary"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingProjectId(null)}
                          variation="link"
                        >
                          Cancel
                        </Button>
                      </View>
                    ) : (
                      <View>
                        <Button
                          onClick={() => setEditingProjectId(project.id)}
                          variation="link"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteProject(project.id)}
                          variation="link"
                        >
                          Delete
                        </Button>
                      </View>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new project row */}
              {isAdding && (
                <TableRow>
                  <TableCell>
                    <TextField
                      label="Project name"
                      value={newProject.name}
                      onChange={(e) =>
                        handleNewProjectChange("name", e.target.value)
                      }
                      placeholder="Project name"
                      isRequired
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Project location"
                      value={newProject.location}
                      onChange={(e) =>
                        handleNewProjectChange("location", e.target.value)
                      }
                      placeholder="Project location"
                    />
                  </TableCell>
                  <TableCell>
                    <SelectField
                      label="Project Type"
                      value={newProject.projectTypeId}
                      onChange={(e) =>
                        handleNewProjectChange("projectTypeId", e.target.value)
                      }
                    >
                      <option value="">Select Project Type</option>
                      {projectTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </SelectField>
                  </TableCell>
                  <TableCell>
                    <SelectField
                      label="Cluster"
                      value={newProject.clusterId}
                      onChange={(e) =>
                        handleNewProjectChange("clusterId", e.target.value)
                      }
                    >
                      <option value="">Select Cluster</option>
                      {clusters.map((cluster) => (
                        <option key={cluster.id} value={cluster.id}>
                          {cluster.name}
                        </option>
                      ))}
                    </SelectField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      label="Project description"
                      value={newProject.description}
                      onChange={(e) =>
                        handleNewProjectChange("description", e.target.value)
                      }
                      placeholder="Project description"
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

          {/* Button to show the form for adding a new project */}
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} variation="primary">
              Add New Project
            </Button>
          )}

          {/* Sign out button */}
          <Button onClick={signOut}>Sign Out</Button>
        </main>
      )}
    </Authenticator>
  );
}
