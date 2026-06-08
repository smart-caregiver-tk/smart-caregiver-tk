'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Download, Printer, Search, FileText, Calendar } from 'lucide-react';

export default function ExportPage() {
  const [reportType, setReportType] = useState('daily');
  
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>ระบบรายงานและส่งออกข้อมูล</h1>
        <p className={styles.pageSubtitle}>เลือกประเภทรายงานเพื่อพิมพ์ (PDF) หรือส่งออกเป็น Excel</p>
      </div>

      <div className={styles.dashboardCard} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>ตัวกรองรายงาน</h3>
        </div>
        <div className={styles.cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            
            {/* Report Type */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-color)' }}>ประเภทรายงาน</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ flex: 1, padding: '1rem', border: '1px solid', borderColor: reportType === 'daily' ? 'var(--primary)' : 'var(--border-color)', backgroundColor: reportType === 'daily' ? 'var(--bg-green-light)' : 'white', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="reportType" value="daily" checked={reportType === 'daily'} onChange={() => setReportType('daily')} style={{ display: 'none' }} />
                  <FileText size={20} color={reportType === 'daily' ? 'var(--primary)' : '#64748b'} />
                  <span style={{ fontWeight: reportType === 'daily' ? 600 : 400, color: reportType === 'daily' ? 'var(--primary-hover)' : 'inherit' }}>รายงานผลปฏิบัติงาน (แบบ จปต.)</span>
                </label>
                <label style={{ flex: 1, padding: '1rem', border: '1px solid', borderColor: reportType === 'time' ? 'var(--primary)' : 'var(--border-color)', backgroundColor: reportType === 'time' ? 'var(--bg-green-light)' : 'white', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="reportType" value="time" checked={reportType === 'time'} onChange={() => setReportType('time')} style={{ display: 'none' }} />
                  <Calendar size={20} color={reportType === 'time' ? 'var(--primary)' : '#64748b'} />
                  <span style={{ fontWeight: reportType === 'time' ? 600 : 400, color: reportType === 'time' ? 'var(--primary-hover)' : 'inherit' }}>บัญชีลงเวลาปฏิบัติงาน (แบบ ทก.1)</span>
                </label>
              </div>
            </div>

            {/* Filters */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-color)' }}>เลือก อสบ.</label>
              <select style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                <option value="">-- เลือกทั้งหมด --</option>
                <option value="C001">นางสมศรี รักษ์ดี</option>
                <option value="C002">นางประภา แสนดี</option>
                <option value="C003">นายบุญส่ง มั่นคง</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-color)' }}>ประจำเดือน</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select style={{ flex: 2, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                  <option value="1">มกราคม</option>
                  <option value="2">กุมภาพันธ์</option>
                  <option value="3">มีนาคม</option>
                  <option value="4">เมษายน</option>
                  <option value="5">พฤษภาคม</option>
                  <option value="6" selected>มิถุนายน</option>
                  <option value="7">กรกฎาคม</option>
                  <option value="8">สิงหาคม</option>
                  <option value="9">กันยายน</option>
                  <option value="10">ตุลาคม</option>
                  <option value="11">พฤศจิกายน</option>
                  <option value="12">ธันวาคม</option>
                </select>
                <select style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}>
                  <option value="2569" selected>2569</option>
                  <option value="2568">2568</option>
                </select>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              <Search size={18} />
              ดูตัวอย่างรายงาน
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              <Download size={18} />
              ส่งออก Excel
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }} onClick={() => window.print()}>
              <Printer size={18} />
              พิมพ์ PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
