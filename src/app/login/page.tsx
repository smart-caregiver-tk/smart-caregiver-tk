'use client';

import styles from './login.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Special check for admin
      if (citizenId === 'admin' && password === 'admin') {
        localStorage.setItem('userSession', JSON.stringify({ role: 'admin', name: 'Admin' }));
        router.push('/admin');
        return;
      }

      // Query Supabase for Caregiver
      const { data, error } = await supabase
        .from('caregivers')
        .select('*')
        .eq('caregiver_id', citizenId)
        .eq('phone_number', password)
        .single();

      if (error || !data) {
        setError('รหัสบัตรประชาชน หรือ เบอร์โทรศัพท์ไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      // Save session
      localStorage.setItem('userSession', JSON.stringify({
        id: data.id,
        role: 'caregiver',
        name: data.full_name,
        moo: data.moo
      }));
      
      router.push('/caregiver');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/images/logo.png" 
              alt="โลโก้เทศบาลเมืองทับกวาง" 
              width={100} 
              height={100} 
              className={styles.logoImage}
              priority
            />
          </div>
          <h1 className={styles.title}>Smart Caregiver</h1>
          <p className={styles.subtitle}>เทศบาลเมืองทับกวาง</p>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label htmlFor="citizen_id">รหัสบัตรประจำตัวประชาชน</label>
            <input 
              type="text" 
              id="citizen_id" 
              name="citizen_id" 
              placeholder="กรอกเลขบัตร 13 หลัก" 
              maxLength={13}
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">รหัสผ่าน (เบอร์โทรศัพท์)</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="กรอกเบอร์โทรศัพท์" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
