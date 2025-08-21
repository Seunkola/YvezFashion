import '../styles/globals.css'
import '../styles/animations.css';
import { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'
import QueryProvider from '@/lib/react-query/queryProvider';
import { AuthInitializer } from '@/components/providers/AuthInitializer';
import { ProgressBarProvider } from '@/components/providers/Loader';

export const metadata = {
  title: 'Yvez Collections',
  description: 'Top Ready to wear brand for plus size women fashion',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <AuthProvider>
          <Navbar />
          <Container>
            <QueryProvider>
              <AuthInitializer>
                <ProgressBarProvider>
                {children}
                </ProgressBarProvider>
              </AuthInitializer>
            </QueryProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </Container>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
