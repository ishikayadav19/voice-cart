import { Inter } from "next/font/google"
import "./globals.css"
import { ShopProvider } from "../context/ShopContext"
import { Toaster } from "react-hot-toast"
import Notification from './components/Notification'
import { VoiceProvider } from "../context/voiceContext";
import VoiceAssistant from './components/voice-assistant'
import { AuthProvider } from "../context/AuthContext";

import SplashWrapper from "./components/SplashWrapper";

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata = {
  title: "VoiceCart — AI Shopping",
  description: "AI-powered voice shopping assistant with intelligent intent recognition, multilingual (Hinglish) support, and personalised product recommendations.",
  icons: { icon: "/icon.png" },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Force-upgrade any stray http:// resource references (e.g. legacy
            product image URLs stored that way in the DB). Without this the
            browser still upgrades them but emits a Mixed Content warning. */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className={inter.className}>
        <Toaster />
        <AuthProvider>
          <VoiceProvider>
            <ShopProvider>
              <SplashWrapper>
                {children}
                <Notification />
              </SplashWrapper>
              <div className="fixed bottom-6 right-6 z-50">
                <VoiceAssistant />
              </div>
            </ShopProvider>
          </VoiceProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 