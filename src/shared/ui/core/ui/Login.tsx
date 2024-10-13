"use client";

import { useEffect } from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { AuthUser } from "aws-amplify/auth";
import { redirect } from "next/navigation";
import outputs from "@root/amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

function Login({ user }: { user?: AuthUser }) {
  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);
  return null;
}

export default withAuthenticator(Login);
