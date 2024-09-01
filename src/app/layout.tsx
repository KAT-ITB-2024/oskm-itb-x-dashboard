import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { mogula, rem } from "./fonts";
import ToasterContext from "~/context/ToasterContext";

export const metadata = {
  title: "Dashboard OSKM 2024",
  description: "Your beloved dashboard made by IT KAT 2024",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rem.variable} ${mogula.variable}`}>
      <body>
        <TRPCReactProvider>
          <ToasterContext />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
