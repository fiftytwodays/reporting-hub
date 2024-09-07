"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
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

export default function ClusterPage() {
  const [clusters, setClusters] = useState<Array<Schema["Cluster"]["type"]>>(
    []
  );
  const [regions, setRegions] = useState<Array<Schema["Region"]["type"]>>([]); // Store available regions for dropdown
  const [editingClusterId, setEditingClusterId] = useState<string | null>(null);
  const [newCluster, setNewCluster] = useState<{
    name: string;
    description: string;
    regionId: string;
  }>({
    name: "",
    description: "",
    regionId: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch and list clusters
  function listClusters() {
    client.models.Cluster.observeQuery().subscribe({
      next: (data) => setClusters([...data.items]),
    });
  }

  // Fetch regions for dropdown
  function listRegions() {
    client.models.Region.observeQuery().subscribe({
      next: (data) => setRegions([...data.items]),
    });
  }

  // Delete a cluster by ID
  function deleteCluster(id: string) {
    client.models.Cluster.delete({ id });
  }

  // Handle the create or edit form submission
  const handleSubmit = async (clusterId?: string) => {
    try {
      if (clusterId) {
        // Edit cluster
        const cluster = clusters.find((cluster) => cluster.id === clusterId);
        if (cluster) {
          const updatedCluster = {
            id: cluster.id,
            name: cluster.name,
            description: cluster.description,
            // Only include regionId if it has a value
            ...(cluster.regionId && { regionId: cluster.regionId }),
          };
          await client.models.Cluster.update(updatedCluster);
          setEditingClusterId(null);
        }
      } else {
        // Add new cluster
        if (newCluster.name.trim() !== "") {
          const newClusterData = {
            name: newCluster.name,
            description: newCluster.description,
            // Only include regionId if it has a value
            ...(newCluster.regionId && { regionId: newCluster.regionId }),
          };
          await client.models.Cluster.create(newClusterData);
          setNewCluster({ name: "", description: "", regionId: "" });
          setIsAdding(false);
        }
      }
    } catch (error) {
      console.error("Error creating or updating cluster:", error);
    }
  };

  // Handle editing cluster inline
  const handleClusterChange = (
    id: string,
    field: "name" | "description" | "regionId",
    value: string
  ) => {
    setClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, [field]: value } : cluster
      )
    );
  };

  // Handle adding new cluster input changes
  const handleNewClusterChange = (
    field: "name" | "description" | "regionId",
    value: string
  ) => {
    setNewCluster((prevNewCluster) => ({ ...prevNewCluster, [field]: value }));
  };

  useEffect(() => {
    listClusters();
    listRegions();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>{user?.signInDetails?.loginId}'s Clusters</h1>

          {/* Table listing clusters */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">Name</TableCell>
                <TableCell as="th">Description</TableCell>
                <TableCell as="th">Region</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {clusters.map((cluster) => (
                <TableRow key={cluster.id}>
                  <TableCell>
                    {editingClusterId === cluster.id ? (
                      <TextField
                        value={cluster.name}
                        onChange={(e) =>
                          handleClusterChange(
                            cluster.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      cluster.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingClusterId === cluster.id ? (
                      <TextField
                        value={cluster.description || ""}
                        onChange={(e) =>
                          handleClusterChange(
                            cluster.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      cluster.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingClusterId === cluster.id ? (
                      <SelectField
                        value={cluster.regionId}
                        onChange={(e) =>
                          handleClusterChange(
                            cluster.id,
                            "regionId",
                            e.target.value
                          )
                        }
                      >
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </SelectField>
                    ) : (
                      regions.find((region) => region.id === cluster.regionId)
                        ?.name || ""
                    )}
                  </TableCell>
                  <TableCell>
                    {editingClusterId === cluster.id ? (
                      <View>
                        <Button
                          onClick={() => handleSubmit(cluster.id)}
                          variation="primary"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingClusterId(null)}
                          variation="link"
                        >
                          Cancel
                        </Button>
                      </View>
                    ) : (
                      <View>
                        <Button
                          onClick={() => setEditingClusterId(cluster.id)}
                          variation="link"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteCluster(cluster.id)}
                          variation="link"
                        >
                          Delete
                        </Button>
                      </View>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {/* Add new cluster row */}
              {isAdding && (
                <TableRow>
                  <TableCell>
                    <TextField
                      value={newCluster.name}
                      onChange={(e) =>
                        handleNewClusterChange("name", e.target.value)
                      }
                      placeholder="Cluster name"
                      isRequired
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={newCluster.description}
                      onChange={(e) =>
                        handleNewClusterChange("description", e.target.value)
                      }
                      placeholder="Cluster description"
                    />
                  </TableCell>
                  <TableCell>
                    <SelectField
                      value={newCluster.regionId}
                      onChange={(e) =>
                        handleNewClusterChange("regionId", e.target.value)
                      }
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </SelectField>
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

          {/* Button to show the form for adding a new cluster */}
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} variation="primary">
              Add New Cluster
            </Button>
          )}

          {/* Sign out button */}
          <Button onClick={signOut}>Sign Out</Button>
        </main>
      )}
    </Authenticator>
  );
}
