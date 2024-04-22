import Logo from '../components/logo';
import './global.css';

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
        <div className="navbar">
          <div className="logoContainer">
            <Logo isBig={false} />
            <span className="logoSubText">The best in URL shortening!</span>
          </div>
          <div className="navbar-menu">
            <a className="navbar-menu-item" href="/create-account">
              Create Account
            </a>
            <a className="navbar-menu-item" href="/login">
              Login
            </a>
            <a className="navbar-menu-item" href="/dashboard">
              Dashboard
            </a>
          </div>
        </div>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
