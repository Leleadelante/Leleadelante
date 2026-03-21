import './globals.css';

export const metadata = {
  title: 'Your Title',
  description: 'Your Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}