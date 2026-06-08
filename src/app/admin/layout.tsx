import styles from './admin.module.css';
import { LayoutDashboard, Users, FileText, Printer, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Image src="/images/logo.png" alt="Logo" width={48} height={48} className={styles.logo} />
          <div>
            <h2 className={styles.sidebarTitle}>Smart Caregiver</h2>
            <p className={styles.sidebarSubtitle}>Admin Panel</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <a href="/admin" className={`${styles.navItem} ${styles.active}`}>
            <LayoutDashboard size={20} />
            <span>ภาพรวมระบบ (Dashboard)</span>
          </a>
          <a href="/admin/patients" className={styles.navItem}>
            <Users size={20} />
            <span>จัดการข้อมูลผู้ป่วย / อสบ.</span>
          </a>
          <a href="/admin/reports" className={styles.navItem}>
            <FileText size={20} />
            <span>รายงานผลปฏิบัติงาน</span>
          </a>
          <a href="/admin/export" className={styles.navItem}>
            <Printer size={20} />
            <span>พิมพ์รายงาน (PDF/Excel)</span>
          </a>
          <div className={styles.navDivider}></div>
          <a href="/admin/settings" className={styles.navItem}>
            <Settings size={20} />
            <span>ตั้งค่าระบบ</span>
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Mobile Header (Only visible on small screens) */}
        <header className={styles.mobileHeader}>
          <Image src="/images/logo.png" alt="Logo" width={32} height={32} className={styles.logo} />
          <h1 className={styles.mobileTitle}>Admin Dashboard</h1>
          <button className={styles.menuBtn}>☰</button>
        </header>

        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}
