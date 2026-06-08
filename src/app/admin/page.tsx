import styles from './admin.module.css';
import { Users, Activity, Heart, FileCheck, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>สรุปสถิติภาพรวมระบบ (Dashboard)</h1>
        <p className={styles.pageSubtitle}>ข้อมูลล่าสุด ณ วันที่ {new Date().toLocaleDateString('th-TH')}</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.bgPrimaryLight}`}>
          <div className={styles.statIconWrapper}>
            <Users size={28} className={styles.textPrimary} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statLabel}>ผู้สูงอายุในระบบทั้งหมด</h3>
            <p className={styles.statValue}>128 <span className={styles.statUnit}>คน</span></p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.bgBlueLight}`}>
          <div className={styles.statIconWrapper}>
            <Heart size={28} className={styles.textBlue} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statLabel}>อสบ. ผู้ดูแลทั้งหมด</h3>
            <p className={styles.statValue}>15 <span className={styles.statUnit}>คน</span></p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.bgOrangeLight}`}>
          <div className={styles.statIconWrapper}>
            <Activity size={28} className={styles.textOrange} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statLabel}>การเยี่ยมบ้าน (เดือนนี้)</h3>
            <p className={styles.statValue}>34 <span className={styles.statUnit}>ครั้ง</span></p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.bgPurpleLight}`}>
          <div className={styles.statIconWrapper}>
            <FileCheck size={28} className={styles.textPurple} />
          </div>
          <div className={styles.statInfo}>
            <h3 className={styles.statLabel}>ประเมิน ADL ล่าสุด</h3>
            <p className={styles.statValue}>45 <span className={styles.statUnit}>รายการ</span></p>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* ADL Group Chart/Summary */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>สัดส่วนกลุ่มผู้สูงอายุ (ADL)</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.progressRow}>
              <div className={styles.progressLabel}>
                <span>กลุ่มติดสังคม (&gt;= 12 คะแนน)</span>
                <span className={styles.textGreen}>85 คน</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBar} style={{ width: '66%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
            
            <div className={styles.progressRow}>
              <div className={styles.progressLabel}>
                <span>กลุ่มติดบ้าน (5-11 คะแนน)</span>
                <span className={styles.textYellow}>30 คน</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBar} style={{ width: '23%', backgroundColor: '#f59e0b' }}></div>
              </div>
            </div>

            <div className={styles.progressRow}>
              <div className={styles.progressLabel}>
                <span>กลุ่มติดเตียง (0-4 คะแนน)</span>
                <span className={styles.textRed}>13 คน</span>
              </div>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBar} style={{ width: '10%', backgroundColor: '#ef4444' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>การปฏิบัติงานล่าสุด</h3>
            <button className={styles.btnText}>ดูทั้งหมด</button>
          </div>
          <div className={styles.cardBody}>
            <ul className={styles.activityList}>
              <li className={styles.activityItem}>
                <div className={styles.activityDot} style={{ backgroundColor: 'var(--primary)' }}></div>
                <div className={styles.activityContent}>
                  <p className={styles.activityDesc}><strong>นางสมศรี (อสบ.)</strong> ส่งรายงานเยี่ยมบ้าน คุณตาสมชาย ใจดี</p>
                  <span className={styles.activityTime}>10 นาทีที่แล้ว</span>
                </div>
              </li>
              <li className={styles.activityItem}>
                <div className={styles.activityDot} style={{ backgroundColor: '#f59e0b' }}></div>
                <div className={styles.activityContent}>
                  <p className={styles.activityDesc}><strong>นางประภา (อสบ.)</strong> ประเมิน ADL คุณยายทองม้วน</p>
                  <span className={styles.activityTime}>2 ชั่วโมงที่แล้ว</span>
                </div>
              </li>
              <li className={styles.activityItem}>
                <div className={styles.activityDot} style={{ backgroundColor: '#3b82f6' }}></div>
                <div className={styles.activityContent}>
                  <p className={styles.activityDesc}><strong>นายบุญส่ง (อสบ.)</strong> ลงเวลาปฏิบัติงาน (หมู่ 4)</p>
                  <span className={styles.activityTime}>เมื่อวานนี้ 08:30 น.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
