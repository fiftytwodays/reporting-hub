"use client";

import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "@root/amplify/data/resource";
import "@/app/app.css";
import outputs from "@root/amplify_outputs.json";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { useEffect, useState } from "react";
import { Spin } from "antd";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  return (
    <Authenticator>
      <Homepage />
    </Authenticator>
  );
}

function Homepage() {
  const [userDetails, setUserDetails] = useState({
    givenName: "",
    familyName: "",
  });

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserDetails({
          givenName: attributes.given_name || "",
          familyName: attributes.family_name || "",
        });
        console.log("the attributes are ",attributes);

      } catch (error) {
        console.error("Error fetching user attributes:", error);
      }
    };

    getUserDetails();
  }, []);

  return (
    <>
      {(!userDetails || userDetails.familyName == "") && (
        <Spin tip="Loading, please wait" size="large" spinning fullscreen />
      )}
      {(!userDetails || userDetails.familyName == "") && (
        <h1 color="#001529">
          Welcome back, {userDetails.givenName} {userDetails.familyName}
        </h1>
      )}
    </>
  );
}
