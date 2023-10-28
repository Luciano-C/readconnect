import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from './components/navbar'
import AuthProvider from './context/authcontext'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="mb-5">
          <Navbar />
            {children}
        </body>
      </html>
      </AuthProvider>
    
  )
}
