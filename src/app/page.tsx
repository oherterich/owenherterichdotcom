import RotatingLogo from "@/components/RotatingLogo/RotatingLogo";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <RotatingLogo />
    </main>
  );
}
