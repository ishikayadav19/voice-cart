import { Inter } from "next/font/google"
import "./globals.css"
import { ShopProvider } from "../context/ShopContext"
import { Toaster } from "react-hot-toast"

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
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  )
} 