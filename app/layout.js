import "./globals.css";
import Aurora from "@/components/Aurora";
import Providers from "@/components/Providers";

export const metadata = {
  title: "HostImgAjaa | Made By Razan",
  description:
    "HostImgAjaa is a free image hosting service that allows you to upload and share your images with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-shade="950" data-rounded="3xlarge">
      <body className="relative flex min-h-screen flex-col dark:bg-gray-950">
        {/* Aurora full background */}
        <div className="fixed inset-0 -z-10">
          <Aurora
            colorStops={["#3b0764", "#5c5fd6", "#0c0e14"]}
            amplitude={3}
            blend={0.8}
            speed={1}
          />
        </div>
        <Providers>
          <div className="flex flex-1 flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
