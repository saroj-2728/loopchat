import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AllUsersProvider from "@/context/allUsersContext";
import { SocketProvider } from "@/context/socketContext";
import { PopupProvider } from "@/context/PopupContext";
import Popup from "@/components/Popup";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "LoopChat",
  description: "A Private Messaging App for All.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
            <SocketProvider>
              <AllUsersProvider>
                <PopupProvider>
                  <Popup />
                  <div className="md:flex flex-row">
                    <Navbar />
                    {children}
                  </div>
                </PopupProvider>
              </AllUsersProvider>
            </SocketProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
