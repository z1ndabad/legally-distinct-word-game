import "@/app/globals.css";
import type { Metadata } from "next";
import { type PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Interview Assessment",
};

type Props = Readonly<PropsWithChildren>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
