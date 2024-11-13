import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between mx-auto p-4">
          <Link href={"/main"}>
            <img
              src="https://www.nibol.com.bo/wp-content/uploads/2022/06/logo-nibol-negro-ok1.png"
              alt="Nibol"
              className="mr-4"
            />
          </Link>
          <div className="flex text-center">
            <p className="text-lg font-bold">NIBOL</p>
          </div>
        </div>
        <hr />
        <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between mx-auto p-4">
          <Link href={"/main"}>
            <img src="/image.png" style={{width:30}} alt="Regresar" />
          </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
