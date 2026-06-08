import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Smart Caregiver Tubkwang 🩺
        </h1>
        <p className={styles.description}>
          ระบบจัดการการดูแลผู้สูงอายุที่มีภาวะพึ่งพิง (Modern System)
        </p>
        
        <div className={styles.grid}>
          <a href="/login" className={styles.card}>
            <h2>เข้าสู่ระบบ &rarr;</h2>
            <p>สำหรับ อสบ. และผู้ดูแลระบบ</p>
          </a>
        </div>
      </main>
    </div>
  );
}
