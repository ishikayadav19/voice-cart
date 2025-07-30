import { Inter } from "next/font/google"
import "./globals.css"
import { ShopProvider } from "../context/ShopContext"
import { Toaster } from "react-hot-toast"
import Notification from './components/Notification'
import { VoiceProvider } from "../context/voiceContext";
import VoiceAssistant from './components/voice-assistant'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Voice Cart",
  description: "Your voice-controlled shopping assistant",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <VoiceProvider>
          <ShopProvider>
            {children}
            <Notification />
            <div className="fixed bottom-6 right-6 z-50">
              <VoiceAssistant />
            </div>
          </ShopProvider>
        </VoiceProvider>
      </body>
    </html>
  )
} 