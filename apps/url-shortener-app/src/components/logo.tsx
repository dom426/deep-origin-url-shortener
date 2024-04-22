import styles from './logo.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';

type LogoProps = {
  isBig: boolean;
};

export default function Logo(props: LogoProps) {
  return (
    <a className={`${styles.logo} ${props.isBig && styles.big}`} href="/">
      <Image
        className={`${styles.logoImage} ${props.isBig && styles.big}`}
        src={logo}
        alt="Logo"
      />
      <span className={`${styles.logoText} ${props.isBig && styles.big}`}>
        URLittle
      </span>
    </a>
  );
}
