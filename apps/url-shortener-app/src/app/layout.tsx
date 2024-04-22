import './global.css';
import NavigationBar from '../components/navigation-bar/navigation-bar';

export const metadata = {
  title: 'URLittle',
  description: 'Developed by Dominick Alfonso',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
