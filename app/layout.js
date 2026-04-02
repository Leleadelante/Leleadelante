import './globals.css';

export const metadata = {
  title: 'Abogado Online IA - Argentina',
  description: 'Sistema avanzado de consultas legales con inteligencia artificial basado en legislación argentina',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
