import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KRISHI MITRA AI | ಕೃಷಿ ಮಿತ್ರ - Agricultural Scheme Assistant",
  description: "Natural Voice & Deterministic Decision-Support System for Indian Farmers. Verified Government Scheme Retrieval for PM-KISAN, PMFBY, and Karnataka Agritech Subsidies.",
  keywords: ["PM-KISAN", "PMFBY", "Karnataka Farmers", "Krishi Mitra", "Agricultural Schemes", "Kannada Voice AI", "Crop Insurance"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kn" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8faf8] text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
