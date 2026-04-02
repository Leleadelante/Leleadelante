import './globals.css';

export const metadata = {
  title: 'Abogado Online IA + Base Judicial CABA',
  description: 'Sistema legal avanzado: consultas con IA, base de datos judicial CABA, juzgados, fiscalías, CIF y OVD',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}