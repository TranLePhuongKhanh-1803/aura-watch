import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata = {
  title: "Aura Watch | Thiết Bị Đeo Thông Minh Tương Lai",
  description: "Khám phá thế hệ đồng hồ thông minh Aura Watch. Thiết kế tối giản, theo dõi sức khỏe chuyên sâu, thời lượng pin 14 ngày. Trải nghiệm ngay hôm nay.",
  openGraph: {
    title: "Aura Watch | Thiết Bị Đeo Thông Minh Tương Lai",
    description: "Khám phá thế hệ đồng hồ thông minh Aura Watch. Thiết kế tối giản, theo dõi sức khỏe chuyên sâu, thời lượng pin 14 ngày. Trải nghiệm ngay hôm nay.",
    url: "https://aurawatch.example.com",
    siteName: "Aura Watch",
    images: [
      {
        url: "https://aurawatch.example.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
