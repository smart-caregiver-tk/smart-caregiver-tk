'use client';

import { useState, useEffect } from 'react';
import styles from '../visit/visit.module.css'; // Reusing form styles
import { Save, ArrowLeft, CheckCircle2, Utensils, ArrowRightLeft, Scissors, Toilet, Bath, Footprints, ChevronsUp, Shirt, Smile, Droplet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// ADL Questions based on Barthel Index (Thai MOPH standard: 0, 1, 2, 3)
const adlQuestions = [
  { id: 'feed', title: '1. รับประทานอาหารเมื่อเตรียมสำรับไว้ให้เรียบร้อย', icon: <Utensils size={32} color="var(--primary)" />, options: [{score: 0, label: 'ไม่สามารถตักอาหารเข้าปากได้'}, {score: 1, label: 'ตักอาหารเองได้ แต่ต้องมีคนช่วย'}, {score: 2, label: 'ตักอาหารและช่วยเหลือตัวเองได้เป็นปกติ'}] },
  { id: 'groom', title: '2. ล้างหน้า หวีผม แปรงฟัน โกนหนวด ในระยะเวลา 24-48 ชั่วโมงที่ผ่านมา', icon: <Scissors size={32} color="var(--primary)" />, options: [{score: 0, label: 'ต้องการความช่วยเหลือ'}, {score: 1, label: 'ทำเองได้ (รวมทั้งที่ทำได้เองและ ถ้าเตรียมอุปกรณ์ไว้ให้)'}] },
  { id: 'transfer', title: '3. ลุกนั่งจากที่นอน หรือจากเตียง ไปยังเก้าอี้', icon: <ArrowRightLeft size={32} color="var(--primary)" />, options: [{score: 0, label: 'ไม่สามารถนั่งได้ (นั่งแล้วจะล้มเสมอ) หรือต้องใช้คนสองคนช่วยกันยกขึ้น'}, {score: 1, label: 'ต้องการความช่วยเหลืออย่างมากจึงจะนั่งได้ เช่น ต้องใช้คนที่แข็งแรงพยุง'}, {score: 2, label: 'ต้องการความช่วยเหลือบ้าง เช่น บอกให้ทำตาม หรือช่วยพยุงเล็กน้อย'}, {score: 3, label: 'ทำได้เอง'}] },
  { id: 'toilet', title: '4. ใช้ห้องน้ำ', icon: <Toilet size={32} color="var(--primary)" />, options: [{score: 0, label: 'ช่วยตัวเองไม่ได้'}, {score: 1, label: 'ทำเองได้บ้าง แต่ต้องการความช่วยเหลือในบางสิ่ง'}, {score: 2, label: 'ช่วยตัวเองได้ดี (ขึ้นลงโถส้วม ถอดใส่เสื้อผ้า ทำความสะอาดเองได้)'}] },
  { id: 'mobility', title: '5. การเคลื่อนที่ภายในห้องหรือในบ้าน', icon: <Footprints size={32} color="var(--primary)" />, options: [{score: 0, label: 'เคลื่อนที่ไปไหนไม่ได้'}, {score: 1, label: 'ต้องใช้รถเข็นช่วยตัวเองให้เคลื่อนที่ได้เอง และเข้าออกมุมห้องได้'}, {score: 2, label: 'เดินหรือเคลื่อนที่โดยมีคนช่วยพยุง หรือต้องให้ความสนใจดูแล'}, {score: 3, label: 'เดินหรือเคลื่อนที่เองได้'}] },
  { id: 'dress', title: '6. การสวมใส่เสื้อผ้า', icon: <Shirt size={32} color="var(--primary)" />, options: [{score: 0, label: 'ต้องมีคนสวมใส่ให้ช่วยตัวเองแทบไม่ได้'}, {score: 1, label: 'ช่วยตัวเองได้ประมาณร้อยละ 50 ที่เหลือต้องมีคนช่วย'}, {score: 2, label: 'ช่วยตัวเองได้ดี (รวมทั้งติดกระดุม รูดซิป)'}] },
  { id: 'stairs', title: '7. การขึ้นลงบันได 1 ชั้น', icon: <ChevronsUp size={32} color="var(--primary)" />, options: [{score: 0, label: 'ไม่สามารถทำได้'}, {score: 1, label: 'ต้องการคนช่วย'}, {score: 2, label: 'ขึ้นลงเองได้'}] },
  { id: 'bathe', title: '8. การอาบน้ำ', icon: <Bath size={32} color="var(--primary)" />, options: [{score: 0, label: 'ต้องมีคนช่วยหรือทำให้'}, {score: 1, label: 'อาบน้ำเองได้'}] },
  { id: 'bowel', title: '9. การกลั้นการถ่ายอุจจาระใน 1 สัปดาห์ที่ผ่านมา', icon: <Smile size={32} color="var(--primary)" />, options: [{score: 0, label: 'กลั้นไม่ได้ หรือต้องการการสวนอุจจาระอยู่เสมอ'}, {score: 1, label: 'กลั้นไม่ได้บางครั้ง (เป็นน้อยกว่า 1 ครั้ง/สัปดาห์)'}, {score: 2, label: 'กลั้นได้เป็นปกติ'}] },
  { id: 'bladder', title: '10. การกลั้นปัสสาวะใน 1 สัปดาห์ที่ผ่านมา', icon: <Droplet size={32} color="var(--primary)" />, options: [{score: 0, label: 'กลั้นไม่ได้ หรือใส่สายสวนปัสสาวะแต่ดูแลเองไม่ได้'}, {score: 1, label: 'กลั้นไม่ได้บางครั้ง (เป็นน้อยกว่า 1 ครั้ง/วัน)'}, {score: 2, label: 'กลั้นได้เป็นปกติ'}] },
];

export default function ADLAssessmentForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [patientId, setPatientId] = useState<string>('');
  const [caregiverId, setCaregiverId] = useState<string>('');
  const [totalScore, setTotalScore] = useState(0);
  const [adlGroup, setAdlGroup] = useState('ยังไม่ได้ประเมิน');

  useEffect(() => {
    const sessionStr = localStorage.getItem('userSession');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      setCaregiverId(session.id);
    }
    const fetchPatientUuid = async () => {
      const { data } = await supabase.from('patients').select('id').eq('patient_id', params.id).single();
      if (data) setPatientId(data.id);
    };
    fetchPatientUuid();
  }, [params.id]);

  const getAdlGroup = (score: number) => {
      if (score <= 4) return 'ติดเตียง (พึ่งพาผู้อื่นโดยสมบูรณ์)';
      if (score <= 11) return 'ติดบ้าน (พึ่งพาผู้อื่นบางส่วน)';
      return 'ติดสังคม (ช่วยเหลือตัวเองได้ดี)';
  };

  // Calculate total whenever scores change
  useEffect(() => {
    let sum = 0;
    Object.values(scores).forEach(val => sum += val);
    setTotalScore(sum);

    if (Object.keys(scores).length === 10) {
      setAdlGroup(getAdlGroup(sum));
    } else {
      setAdlGroup('กำลังประเมิน...');
    }
  }, [scores]);

  const handleSelect = (questionId: string, score: number) => {
    setScores(prev => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(scores).length < adlQuestions.length) {
      alert('กรุณาประเมินให้ครบทั้ง 10 หัวข้อ');
      return;
    }
    
    if (!patientId || !caregiverId) {
      setError('ไม่พบข้อมูลอ้างอิงผู้ป่วย หรือ อสบ. ในระบบ');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const form = e.target as HTMLFormElement;
      
      const scoresArray = adlQuestions.map(q => scores[q.id]);
      
      const { error: dbError } = await supabase.from('adl_assessments').insert({
        patient_id: patientId,
        caregiver_id: caregiverId,
        assessment_date: (form.elements.namedItem('assessment_date') as HTMLInputElement)?.value || new Date().toISOString(),
        scores: scoresArray,
        total_score: totalScore,
        adl_group: getAdlGroup(totalScore)
      });
      
      // Update patient status as well
      await supabase.from('patients').update({ adl_group: getAdlGroup(totalScore) }).eq('id', patientId);

      if (dbError) throw dbError;

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/caregiver');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  const getCardStyle = () => {
    if (totalScore <= 4 && Object.keys(scores).length === 10) return { backgroundColor: '#fef2f2', borderColor: '#fecaca' }; // Red
    if (totalScore <= 11 && Object.keys(scores).length === 10) return { backgroundColor: '#fffbeb', borderColor: '#fde68a' }; // Yellow
    if (totalScore >= 12 && Object.keys(scores).length === 10) return { backgroundColor: '#f0fdf4', borderColor: '#a7f3d0' }; // Green
    return {};
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <a href={`/caregiver/patient/${params.id}`} className={styles.backBtn}>
          <ArrowLeft size={24} />
        </a>
        <h2 className={styles.title}>ประเมิน ADL (ดัชนีบาร์เธล)</h2>
        <div style={{ width: 24 }}></div>
      </div>

      {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        
        {/* Score Summary Sticky Card */}
        <div className={styles.card} style={{ position: 'sticky', top: '70px', zIndex: 5, ...getCardStyle(), transition: 'all 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>คะแนนรวม: <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{totalScore}</strong> / 20</h3>
              <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600, color: 'var(--primary-hover)' }}>สถานะ: {adlGroup}</p>
            </div>
            {Object.keys(scores).length === 10 && <CheckCircle2 size={32} color="var(--primary)" />}
          </div>
        </div>

        {adlQuestions.map((q) => (
          <div key={q.id} className={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-green-light)', borderRadius: '12px' }}>
                {q.icon}
              </div>
              <h3 className={styles.sectionTitle} style={{ fontSize: '1.1rem', margin: 0, borderBottom: 'none' }}>
                {q.title}
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {q.options.map((opt) => (
                <label key={`${q.id}-${opt.score}`} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '10px',
                  backgroundColor: scores[q.id] === opt.score ? 'var(--bg-green-light)' : 'transparent',
                  borderColor: scores[q.id] === opt.score ? 'var(--primary)' : 'var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <input 
                    type="radio" 
                    name={q.id} 
                    value={opt.score} 
                    checked={scores[q.id] === opt.score}
                    onChange={() => handleSelect(q.id, opt.score)}
                    style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                  />
                  <span style={{ flex: 1, fontSize: '0.95rem' }}>{opt.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)', backgroundColor: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    {opt.score}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className={styles.submitBtn} disabled={Object.keys(scores).length < 10}>
          <Save size={20} />
          บันทึกผลการประเมิน
        </button>
      </form>
    </div>
  );
}
