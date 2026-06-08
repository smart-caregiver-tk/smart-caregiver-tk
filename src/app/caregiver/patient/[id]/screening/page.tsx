'use client';

import { useState, useEffect } from 'react';
import styles from '../visit/visit.module.css';
import { Save, ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';

const q2Questions = [
  { id: 'q2_1', title: '1. ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกหดหู่ เศร้า หรือท้อแท้สิ้นหวัง หรือไม่?' },
  { id: 'q2_2', title: '2. ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลิน หรือไม่?' },
];

const q9Questions = [
  { id: 'q9_1', title: '1. เบื่อ ไม่สนใจอยากทำอะไร' },
  { id: 'q9_2', title: '2. ไม่สบายใจ ซึมเศร้า ท้อแท้' },
  { id: 'q9_3', title: '3. หลับยาก หรือหลับๆ ตื่นๆ หรือหลับมากไป' },
  { id: 'q9_4', title: '4. เหนื่อยง่าย หรือไม่ค่อยมีแรง' },
  { id: 'q9_5', title: '5. เบื่ออาหาร หรือกินมากเกินไป' },
  { id: 'q9_6', title: '6. รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ตนเองหรือครอบครัวผิดหวัง' },
  { id: 'q9_7', title: '7. สมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ' },
  { id: 'q9_8', title: '8. พูดช้า ทำอะไรช้าลง กระสับกระส่าย ไม่สามารถอยู่นิ่งได้เหมือนเคย' },
  { id: 'q9_9', title: '9. คิดทำร้ายตนเอง หรือคิดว่าถ้าตายไปคงจะดี' },
];

const q9Options = [
  { score: 0, label: 'ไม่มีเลย' },
  { score: 1, label: 'เป็นบางวัน (1-7 วัน)' },
  { score: 2, label: 'เป็นบ่อย (มากกว่า 7 วัน)' },
  { score: 3, label: 'เป็นเกือบทุกวัน' },
];

export default function ScreeningForm({ params }: { params: { id: string } }) {
  const [q2Scores, setQ2Scores] = useState<Record<string, number>>({});
  const [q9Scores, setQ9Scores] = useState<Record<string, number>>({});
  
  const [showQ9, setShowQ9] = useState(false);
  const [q9Total, setQ9Total] = useState(0);
  const [severity, setSeverity] = useState('ปกติ');

  // Check 2Q results
  useEffect(() => {
    const totalQ2 = (q2Scores['q2_1'] || 0) + (q2Scores['q2_2'] || 0);
    // If any question is 1 (Yes), show Q9
    if (Object.keys(q2Scores).length === 2) {
      setShowQ9(totalQ2 > 0);
    }
  }, [q2Scores]);

  // Calculate 9Q total
  useEffect(() => {
    if (!showQ9) return;
    let sum = 0;
    Object.values(q9Scores).forEach(val => sum += val);
    setQ9Total(sum);

    if (sum < 7) setSeverity('ไม่มีอาการซึมเศร้า');
    else if (sum < 13) setSeverity('ซึมเศร้าระดับน้อย (Mild)');
    else if (sum < 19) setSeverity('ซึมเศร้าระดับปานกลาง (Moderate)');
    else setSeverity('ซึมเศร้าระดับรุนแรง (Severe)');
  }, [q9Scores, showQ9]);

  const handleQ2 = (id: string, val: number) => setQ2Scores(prev => ({ ...prev, [id]: val }));
  const handleQ9 = (id: string, val: number) => setQ9Scores(prev => ({ ...prev, [id]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(q2Scores).length < 2) {
      alert("กรุณาตอบคำถาม 2Q ให้ครบ");
      return;
    }
    if (showQ9 && Object.keys(q9Scores).length < 9) {
      alert("กรุณาตอบคำถาม 9Q ให้ครบ");
      return;
    }
    
    alert(`ระบบจำลอง: บันทึกการคัดกรองโรคซึมเศร้าสำเร็จ!\nผลลัพธ์: ${showQ9 ? severity : 'ปกติ (ไม่ต้องประเมิน 9Q)'}`);
    window.location.href = `/caregiver/patient/${params.id}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <a href={`/caregiver/patient/${params.id}`} className={styles.backBtn}>
          <ArrowLeft size={24} />
        </a>
        <h2 className={styles.title}>คัดกรองโรคซึมเศร้า (2Q/9Q)</h2>
        <div style={{ width: 24 }}></div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>การคัดกรอง 2 คำถาม (2Q)</h3>
          
          {q2Questions.map(q => (
            <div key={q.id} style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-color)' }}>{q.title}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', backgroundColor: q2Scores[q.id] === 0 ? 'var(--bg-green-light)' : 'transparent', borderColor: q2Scores[q.id] === 0 ? 'var(--primary)' : 'var(--border-color)', cursor: 'pointer' }}>
                  <input type="radio" name={q.id} value={0} style={{ display: 'none' }} checked={q2Scores[q.id] === 0} onChange={() => handleQ2(q.id, 0)} />
                  ไม่มี
                </label>
                <label style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', backgroundColor: q2Scores[q.id] === 1 ? '#fef2f2' : 'transparent', borderColor: q2Scores[q.id] === 1 ? '#ef4444' : 'var(--border-color)', cursor: 'pointer', color: q2Scores[q.id] === 1 ? '#ef4444' : 'inherit' }}>
                  <input type="radio" name={q.id} value={1} style={{ display: 'none' }} checked={q2Scores[q.id] === 1} onChange={() => handleQ2(q.id, 1)} />
                  มี
                </label>
              </div>
            </div>
          ))}

          {Object.keys(q2Scores).length === 2 && !showQ9 && (
            <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46' }}>
              <CheckCircle size={20} />
              <strong>ผลประเมิน 2Q: ปกติ</strong> (ไม่ต้องทำ 9Q ต่อ)
            </div>
          )}
        </div>

        {showQ9 && (
          <div className={styles.card} style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '8px', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', marginBottom: '1.5rem' }}>
              <AlertTriangle size={20} />
              <span>พบความเสี่ยงจาก 2Q กรุณาประเมิน 9Q ต่อเพื่อประเมินความรุนแรง</span>
            </div>

            <h3 className={styles.sectionTitle}>แบบประเมิน 9 คำถาม (9Q)</h3>
            <div style={{ position: 'sticky', top: '70px', backgroundColor: 'var(--card-bg)', padding: '0.5rem 0', zIndex: 5, borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>คะแนนรวม 9Q: <span style={{ fontSize: '1.5rem', color: q9Total > 6 ? '#ef4444' : 'var(--primary)' }}>{q9Total}</span></p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>แปรผล: <strong style={{ color: q9Total > 6 ? '#ef4444' : 'var(--primary)' }}>{severity}</strong></p>
            </div>

            {q9Questions.map((q, idx) => (
              <div key={q.id} style={{ marginBottom: '1.5rem', borderBottom: idx < 8 ? '1px dashed var(--border-color)' : 'none', paddingBottom: '1.5rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-color)', marginBottom: '0.75rem' }}>{q.title}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {q9Options.map(opt => (
                    <label key={`${q.id}-${opt.score}`} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '0.75rem 1rem', 
                      border: '1px solid',
                      borderRadius: '8px',
                      backgroundColor: q9Scores[q.id] === opt.score ? 'var(--bg-green-light)' : 'transparent',
                      borderColor: q9Scores[q.id] === opt.score ? 'var(--primary)' : 'var(--border-color)',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt.score} 
                        checked={q9Scores[q.id] === opt.score}
                        onChange={() => handleQ9(q.id, opt.score)}
                        style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                      />
                      <span style={{ flex: 1, fontSize: '0.9rem' }}>{opt.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{opt.score}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className={styles.submitBtn}>
          <Save size={20} />
          บันทึกผลการคัดกรอง
        </button>
      </form>
    </div>
  );
}
