import "./globals.css";

export const metadata = {
  title: "3D Lightsaber Configurator",
  description: "Build Your Own Lightsaber!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
