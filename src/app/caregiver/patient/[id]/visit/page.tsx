'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './visit.module.css';
import { Camera, Save, ArrowLeft, Trash2, CheckCircle2, X } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { compressImage } from '@/lib/imageCompression';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function HomeVisitForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const sigCanvas = useRef<any>(null);
  const [patientId, setPatientId] = useState<string>('');
  const [caregiverId, setCaregiverId] = useState<string>('');

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (photos.length >= 4) {
      alert("อัปโหลดรูปภาพได้สูงสุด 4 รูปเท่านั้น");
      return;
    }

    setIsCompressing(true);
    try {
      const file = e.target.files[0];
      const compressedBase64 = await compressImage(file, 800, 0.7);
      setPhotos(prev => [...prev, compressedBase64]);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("ไม่สามารถประมวลผลรูปภาพได้");
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const removePhoto = (indexToRemove: number) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sigCanvas.current?.isEmpty()) {
      alert('กรุณาลงลายมือชื่อก่อนบันทึกข้อมูล');
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
      
      const uploadedPhotoUrls = [];
      for (let i = 0; i < photos.length; i++) {
        const base64Data = photos[i].split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let j = 0; j < byteCharacters.length; j++) {
          byteNumbers[j] = byteCharacters.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        const fileName = `visit_${Date.now()}_${i}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, blob, { contentType: 'image/jpeg' });
          
        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);
          uploadedPhotoUrls.push(publicUrlData.publicUrl);
        }
      }

      const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const sigBase64Data = signatureDataUrl.split(',')[1];
      const sigBlob = new Blob([new Uint8Array(atob(sigBase64Data).split('').map(c => c.charCodeAt(0)))], { type: 'image/png' });
      const sigFileName = `sig_${Date.now()}.png`;
      let finalSignatureUrl = '';
      
      const { data: sigUploadData, error: sigUploadError } = await supabase.storage
        .from('images')
        .upload(sigFileName, sigBlob, { contentType: 'image/png' });
        
      if (!sigUploadError && sigUploadData) {
        const { data: sigPublicUrl } = supabase.storage.from('images').getPublicUrl(sigFileName);
        finalSignatureUrl = sigPublicUrl.publicUrl;
      }

      const { error: dbError } = await supabase.from('home_visits').insert({
        patient_id: patientId,
        caregiver_id: caregiverId,
        visit_date: (form.elements.namedItem('visit_date') as HTMLInputElement).value,
        symptoms: (form.elements.namedItem('symptoms') as HTMLTextAreaElement).value,
        temperature: parseFloat((form.elements.namedItem('temperature') as HTMLInputElement).value) || null,
        pulse: parseInt((form.elements.namedItem('pulse') as HTMLInputElement).value) || null,
        resp_rate: parseInt((form.elements.namedItem('resp_rate') as HTMLInputElement).value) || null,
        bp_sys: parseInt((form.elements.namedItem('bp_sys') as HTMLInputElement).value) || null,
        bp_dia: parseInt((form.elements.namedItem('bp_dia') as HTMLInputElement).value) || null,
        care_given: (form.elements.namedItem('care_given') as HTMLTextAreaElement).value,
        advice: (form.elements.namedItem('advice') as HTMLTextAreaElement).value,
        signature_url: finalSignatureUrl,
        photos_url: uploadedPhotoUrls
      });

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <a href="/caregiver" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </a>
        <h2 className={styles.title}>บันทึกการเยี่ยมบ้าน</h2>
        <div style={{ width: 24 }}></div> {/* Spacer for centering */}
      </div>

      {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>ข้อมูลสุขภาพเบื้องต้น</h3>
          
          <div className={styles.inputGroup}>
            <label>อาการสำคัญ (Symptoms)</label>
            <textarea placeholder="ระบุอาการสำคัญของผู้ป่วยในวันนี้..." rows={3}></textarea>
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label>ความดันโลหิต (SYS/DIA)</label>
              <div className={styles.bpGroup}>
                <input type="number" placeholder="SYS" />
                <span>/</span>
                <input type="number" placeholder="DIA" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>ชีพจร (Pulse)</label>
              <input type="number" placeholder="ครั้ง/นาที" />
            </div>
            <div className={styles.inputGroup}>
              <label>อุณหภูมิ (Temp)</label>
              <input type="number" step="0.1" placeholder="°C" />
            </div>
            <div className={styles.inputGroup}>
              <label>การหายใจ (Resp Rate)</label>
              <input type="number" placeholder="ครั้ง/นาที" />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>การพยาบาลและการให้คำแนะนำ</h3>
          
          <div className={styles.inputGroup}>
            <label>การพยาบาลที่ให้ (Care Given)</label>
            <textarea placeholder="ระบุการพยาบาลที่ได้ดำเนินการ..." rows={3}></textarea>
          </div>
          
          <div className={styles.inputGroup}>
            <label>คำแนะนำ (Advice)</label>
            <textarea placeholder="ระบุคำแนะนำที่ให้แก่ผู้ป่วยหรือญาติ..." rows={2}></textarea>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>รูปภาพการเยี่ยมบ้าน (สูงสุด 4 รูป)</h3>
            <span className={styles.photoCount}>{photos.length}/4</span>
          </div>
          <p className={styles.helpText}>ระบบจะทำการบีบอัดรูปภาพอัตโนมัติเพื่อประหยัดเน็ตมือถือ</p>
          
          <div className={styles.photoGrid}>
            {photos.map((photo, index) => (
              <div key={index} className={styles.photoPreview}>
                <img src={photo} alt={`รูปภาพเยี่ยมบ้าน ${index + 1}`} />
                <button type="button" className={styles.removePhotoBtn} onClick={() => removePhoto(index)}>
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {photos.length < 4 && (
              <label className={styles.photoUploadBtn}>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                  disabled={isCompressing}
                />
                {isCompressing ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <>
                    <Camera size={32} />
                    <span>ถ่ายรูป / อัปโหลด</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>
          <Save size={20} />
          บันทึกการเยี่ยมบ้าน
        </button>
      </form>
    </div>
  );
}
