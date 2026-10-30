import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "KRISHI MITRA AI | ಕೃಷಿ ಮಿತ್ರ — An Initiative for Indian Agriculture",
  description: "A world-class, voice-first agricultural government scheme assistant and deterministic decision-support system for Indian farmers. PM-KISAN, PMFBY, and Karnataka Agritech Subsidies.",
  keywords: ["PM-KISAN", "PMFBY", "Karnataka Farmers", "Krishi Mitra AI", "Agricultural Schemes", "Kannada Voice AI", "Vantara Agriculture"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kn" className="h-full antialiased scroll-smooth dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#041209] text-[#f0f4f0] font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
