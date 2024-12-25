import useOrganization from "@/entities/organization/api/oganization-list";
import { Carousel, Skeleton } from "antd"; // Added Spin for loading state
import React from "react";
import { carouselStyle } from "../config/carouselStyle";
import CoreValues from "./CoreValues";
import History from "./History";
import Mission from "./Mission";
import Vision from "./Vision";

const AboutUsCarousel: React.FC = () => {
  const { organizationsList, isOrganizationsListLoading } = useOrganization({
    condition: true,
  });

  return (
    <Skeleton loading={isOrganizationsListLoading}>
      <Carousel
        arrows
        infinite={true}
        dotPosition="top"
        dots={false}
        style={carouselStyle}
      >
        <History
          orgName={organizationsList?.name ?? ""}
          data={organizationsList?.history ?? ""}
        />
        <Vision data={organizationsList?.vision ?? ""} />
        <Mission data={organizationsList?.mission ?? ""} />
        <CoreValues data={organizationsList?.coreValues ?? ""} />
      </Carousel>
    </Skeleton>
  );
};

export default AboutUsCarousel;
