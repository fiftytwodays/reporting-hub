import React, { ReactNode } from "react";
import { Flex, View, Text, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

// Define the props type with children
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" height="100vh">
      {/* Header */}
      <View padding="1rem">
        <Text color="white" fontSize="1.5rem">
          Header
        </Text>
      </View>

      {/* Body */}
      <Flex direction="row" flex="1">
        {/* Sidebar */}
        <View width="250px" padding="1rem">
          <Text color="white" marginBottom="1rem">
            Sidebar
          </Text>
          <Button variation="link" color="white">
            Regions
          </Button>
          <Button variation="link" color="white">
            Clusters
          </Button>
        </View>

        {/* Main Content */}
        <View flex="1" padding="2rem">
          {children}
        </View>
      </Flex>
    </Flex>
  );
};

export default Layout;
