'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Search, Plus, Edit, Trash2, UserCog, UserCheck } from 'lucide-react';

const mockPatients = [
  { id: 'E001', name: 'คุณตา สมชาย ใจดี', idCard: '1100200300400', age: 75, moo: 'หมู่ 1', caregiver: 'นางสมศรี รักษ์ดี', adlGroup: 'ติดบ้าน' },
  { id: 'E002', name: 'คุณยาย สมศรี รักสงบ', idCard: '2200300400500', age: 82, moo: 'หมู่ 2', caregiver: 'นางประภา แสนดี', adlGroup: 'ติดเตียง' },
  { id: 'E003', name: 'คุณตา บุญมี ศรีสุข', idCard: '3300400500600', age: 68, moo: 'หมู่ 1', caregiver: 'นายบุญส่ง มั่นคง', adlGroup: 'ติดสังคม' },
];

const mockCaregivers = [
  { id: 'C001', name: 'นางสมศรี รักษ์ดี', phone: '081-111-1111', moo: 'หมู่ 1', assignedCount: 3 },
  { id: 'C002', name: 'นางประภา แสนดี', phone: '082-222-2222', moo: 'หมู่ 2', assignedCount: 5 },
  { id: 'C003', name: 'นายบุญส่ง มั่นคง', phone: '083-333-3333', moo: 'หมู่ 4', assignedCount: 2 },
];

export default function ManagementPage() {
  const [activeTab, setActiveTab] = useState<'patients' | 'caregivers'>('patients');

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>จัดการข้อมูลผู้ป่วย และ อสบ.</h1>
        <p className={styles.pageSubtitle}>เพิ่ม ลบ แก้ไข ข้อมูลในระบบฐานข้อมูล</p>
      </div>

      <div className={styles.dashboardCard}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', padding: '0 1.5rem' }}>
          <button 
            onClick={() => setActiveTab('patients')}
            style={{ 
              padding: '1rem 1.5rem', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'patients' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'patients' ? 'var(--primary)' : '#64748b',
              fontWeight: activeTab === 'patients' ? 700 : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            <UserCheck size={20} />
            ข้อมูลผู้สูงอายุ (พึ่งพิง)
          </button>
          <button 
            onClick={() => setActiveTab('caregivers')}
            style={{ 
              padding: '1rem 1.5rem', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'caregivers' ? '3px solid var(--primary)' : '3px solid transparent',
              color: activeTab === 'caregivers' ? 'var(--primary)' : '#64748b',
              fontWeight: activeTab === 'caregivers' ? 700 : 500,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            <UserCog size={20} />
            ข้อมูล อสบ. (ผู้ดูแล)
          </button>
        </div>

        <div className={styles.cardBody} style={{ paddingTop: 0 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder={activeTab === 'patients' ? "ค้นหาชื่อ หรือ รหัสผู้ป่วย..." : "ค้นหาชื่อ หรือ เบอร์โทร อสบ...."} 
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              <Plus size={18} />
              เพิ่มข้อมูลใหม่
            </button>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
                  {activeTab === 'patients' ? (
                    <>
                      <th style={{ padding: '1rem', color: '#64748b' }}>รหัส</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>ชื่อ-นามสกุล</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>เลขบัตร ปชช.</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>หมู่ที่</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>อสบ. ผู้ดูแล</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>กลุ่ม ADL</th>
                      <th style={{ padding: '1rem', color: '#64748b', textAlign: 'center' }}>จัดการ</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '1rem', color: '#64748b' }}>รหัส อสบ.</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>ชื่อ-นามสกุล</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>เบอร์โทรศัพท์ (รหัสผ่าน)</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>หมู่ที่รับผิดชอบ</th>
                      <th style={{ padding: '1rem', color: '#64748b' }}>จำนวนผู้ป่วยในดูแล</th>
                      <th style={{ padding: '1rem', color: '#64748b', textAlign: 'center' }}>จัดการ</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'patients' && mockPatients.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-hover)' }}>{p.id}</td>
                    <td style={{ padding: '1rem' }}>{p.name} <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>(อายุ {p.age})</span></td>
                    <td style={{ padding: '1rem' }}>{p.idCard}</td>
                    <td style={{ padding: '1rem' }}>{p.moo}</td>
                    <td style={{ padding: '1rem' }}>{p.caregiver}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '6px', 
                        fontSize: '0.85rem',
                        backgroundColor: p.adlGroup === 'ติดเตียง' ? '#fef2f2' : p.adlGroup === 'ติดสังคม' ? '#f0fdf4' : '#fffbeb',
                        color: p.adlGroup === 'ติดเตียง' ? '#dc2626' : p.adlGroup === 'ติดสังคม' ? '#16a34a' : '#d97706',
                        border: '1px solid currentColor'
                      }}>
                        {p.adlGroup}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '0.5rem' }} title="แก้ไข"><Edit size={18} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="ลบ"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'caregivers' && mockCaregivers.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary-hover)' }}>{c.id}</td>
                    <td style={{ padding: '1rem' }}>{c.name}</td>
                    <td style={{ padding: '1rem' }}>{c.phone}</td>
                    <td style={{ padding: '1rem' }}>{c.moo}</td>
                    <td style={{ padding: '1rem' }}>{c.assignedCount} คน</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '0.5rem' }} title="แก้ไข"><Edit size={18} /></button>
                      <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="ลบ"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {((activeTab === 'patients' && mockPatients.length === 0) || (activeTab === 'caregivers' && mockCaregivers.length === 0)) && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <p>ไม่มีข้อมูลในระบบ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
