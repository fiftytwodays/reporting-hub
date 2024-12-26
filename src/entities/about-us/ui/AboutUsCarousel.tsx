import useOrganization from "@/entities/organization/api/oganization-list";
import { Carousel, Skeleton } from "antd";
import React from "react";
import { carouselStyle } from "../config/carouselStyle";
import History from "./History";
import OtherDetails from "./OtherDetails";
import "@/app/page.module.css";
import styled from "@emotion/styled";

const AboutUsCarousel: React.FC = () => {
  const { organizationsList, isOrganizationsListLoading } = useOrganization({
    condition: true,
  });

  return (
    <Skeleton loading={isOrganizationsListLoading}>
      <_Carousel arrows infinite={true} dots={false} style={carouselStyle}>
        <History
          orgName={organizationsList?.name ?? ""}
          data={organizationsList?.history ?? ""}
        />
        <OtherDetails data={organizationsList} />
      </_Carousel>
    </Skeleton>
  );
};

export default AboutUsCarousel;

const _Carousel = styled(Carousel)`
  > .slick-next, .slick-prev {
    color: rgb(7, 1, 1);
    position: absoulte;
    border-radius: 100%;
  }
`;
