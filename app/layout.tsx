import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Resumiq",
    description: "AI-powered resume tailor",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
