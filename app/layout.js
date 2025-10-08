"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import { AppSettingsProvider } from "@/components/Context/appSettingContext";
import { ThemeProvider as CustomThemeProvider } from "@/components/Context/themeContext";
import ThemeAwareLoader from "@/components/Layout/Toploader";
import { usePathname } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
   const pathname = usePathname();

    // Routes where Navbar and Footer should be hidden
  const excludedRoutes = [
    "/admin",
    "/login",
    "/signUp",
    "/get-started",
    "/forgot",
    "/verify-email",
    "/restro",
  ];
 
  const shouldHideLayout = excludedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AppSettingsProvider>
            <CustomThemeProvider>
              <ThemeAwareLoader/>
              <div className="flex flex-col min-h-screen">
                {!shouldHideLayout && <Navbar />}
                <main className="flex-grow w-full pb-16 pt-[50px] md:pt-[120px]">
                  {children}
                </main>
                {!shouldHideLayout && <Footer />}
              </div>
            </CustomThemeProvider>
          </AppSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}