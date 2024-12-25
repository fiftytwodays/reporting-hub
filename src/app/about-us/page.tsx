"use client";

import { Amplify } from "aws-amplify";

import AboutUsCarousel from "@/entities/about-us/ui/AboutUsCarousel";
import outputs from "@root/amplify_outputs.json";

Amplify.configure(outputs);

export default function ClusterList() {
  return <AboutUsCarousel />;
}
