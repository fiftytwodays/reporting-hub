import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import AppLayout from "@/shared/ui/core/ui/Layout";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@aws-amplify/ui-react/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reporting Hub",
  description: "Reporting Hub",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <AppLayout>{children}</AppLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
