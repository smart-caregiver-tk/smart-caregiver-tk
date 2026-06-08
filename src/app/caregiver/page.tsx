'use client';

import styles from './caregiver.module.css';
import { Search, MapPin, Activity, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CaregiverDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionStr = localStorage.getItem('userSession');
    if (!sessionStr) {
      router.push('/login');
      return;
    }

    const session = JSON.parse(sessionStr);

    const fetchPatients = async () => {
      // In a real scenario we filter by session.id, but since we are testing, let's fetch all or the ones linked to this caregiver.
      const { data, error } = await supabase
        .from('patients')
        .select('*');
        // .eq('caregiver_id', session.id); // Uncomment this when auth is strictly enforced

      if (data) {
        setPatients(data);
      }
      setLoading(false);
    };

    fetchPatients();
  }, [router]);

  const filteredPatients = patients.filter(p => 
    p.full_name?.includes(searchQuery) || p.patient_id?.includes(searchQuery)
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>รายชื่อผู้ป่วยที่รับผิดชอบ</h2>
        <p className={styles.pageSubtitle}>
          {loading ? 'กำลังโหลดข้อมูล...' : `คุณมีผู้ป่วยในความดูแลทั้งหมด ${filteredPatients.length} คน`}
        </p>
      </div>

      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อผู้ป่วย หรือรหัส..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.patientList}>
        {!loading && filteredPatients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            ไม่พบข้อมูลผู้ป่วยในระบบ
          </div>
        )}
        
        {filteredPatients.map((patient) => (
          <a href={`/caregiver/patient/${patient.patient_id}`} key={patient.id} className={styles.patientCard}>
            <div className={styles.patientInfo}>
              <h3 className={styles.patientName}>{patient.full_name}</h3>
              <div className={styles.patientDetails}>
                <span className={styles.detailBadge}>
                  <MapPin size={14} /> {patient.moo}
                </span>
                <span className={`${styles.detailBadge} ${patient.adl_group === 'ติดเตียง' ? styles.badgeRed : styles.badgeGreen}`}>
                  <Activity size={14} /> {patient.adl_group || 'รอประเมิน'}
                </span>
              </div>
            </div>
            <div className={styles.patientAction}>
              <ChevronRight size={24} className={styles.chevronIcon} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
