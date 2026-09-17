import "./globals.css";

export const metadata = {
  title: "Marcus — Bennet",
  description: "Visuals Composer & Digital Crafter portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME"
          type="text/css"
        />
      </head>
      <body className="bg-black text-[#ff5a1f] font-hn antialiased overflow-x-clip selection:bg-[#ff5a1f] selection:text-black">
        {children}
      </body>

    </html>
  );
}
