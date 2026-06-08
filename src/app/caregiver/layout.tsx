import styles from './caregiver.module.css';
import { Home, Users, ClipboardList, LogOut } from 'lucide-react';

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutContainer}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Smart Caregiver</h1>
          <button className={styles.logoutBtn} title="ออกจากระบบ">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className={styles.bottomNav}>
        <a href="/caregiver" className={`${styles.navItem} ${styles.active}`}>
          <Users size={24} />
          <span>ผู้ป่วยของฉัน</span>
        </a>
        <a href="/caregiver/history" className={styles.navItem}>
          <ClipboardList size={24} />
          <span>ประวัติเยี่ยมบ้าน</span>
        </a>
        <a href="/caregiver/profile" className={styles.navItem}>
          <Home size={24} />
          <span>โปรไฟล์</span>
        </a>
      </nav>
    </div>
  );
}
