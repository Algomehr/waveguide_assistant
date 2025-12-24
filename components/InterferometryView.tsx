
import React, { useState, useEffect, useRef } from 'react';
import { BeakerIcon, AdjustmentsHorizontalIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const InterferometryView: React.FC = () => {
  // Parameters
  const [lam1, setLam1] = useState(532);
  const [lam2, setLam2] = useState(532);
  const [w01, setW01] = useState(15);
  const [w02, setW02] = useState(15);
  const [angleSep, setAngleSep] = useState(5);
  const [z1, setZ1] = useState(-2);
  const [z2, setZ2] = useState(-2);
  const [int1, setInt1] = useState(1);
  const [int2, setInt2] = useState(1);
  const [phase, setPhase] = useState(0);
  const [fov, setFov] = useState(100);
  const [res, setRes] = useState(200);

  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const canvasResultRef = useRef<HTMLCanvasElement>(null);

  // Helper for Complex Math
  const calcGaussianField = (
    x: number, y: number, 
    lam_nm: number, w0_um: number, amp: number,
    wx: number, wy: number, wz: number, // waist pos
    ax_deg: number, ay_deg: number
  ) => {
    const lam = lam_nm * 1e-9;
    const w0 = w0_um * 1e-6;
    const k = (2 * Math.PI) / lam;
    const zR = (Math.PI * w0 * w0) / lam;

    const tx = (ax_deg * Math.PI) / 180;
    const ty = (ay_deg * Math.PI) / 180;

    const nz = Math.cos(tx) * Math.cos(ty);
    const nx = Math.sin(tx);
    const ny = Math.sin(ty);
    const norm = Math.sqrt(nx*nx + ny*ny + nz*nz);
    const kv = [nx/norm, ny/norm, nz/norm];

    const dx = x - wx;
    const dy = y - wy;
    const dz = 0 - wz;

    const zL = dx * kv[0] + dy * kv[1] + dz * kv[2];
    const rSq = dx*dx + dy*dy + dz*dz;
    const rhoSq = rSq - zL*zL;

    // q = zL + i*zR
    const qReal = zL;
    const qImag = zR;
    const qMagSq = qReal*qReal + qImag*qImag;

    // 1/q = (qReal - i*qImag) / qMagSq
    const invQReal = qReal / qMagSq;
    const invQImag = -qImag / qMagSq;

    // factor = amp * (i * zR / q)
    // i*zR / (zL + i*zR) = (i*zR * (zL - i*zR)) / qMagSq = (zR*zR + i*zR*zL) / qMagSq
    const factReal = amp * (zR * zR) / qMagSq;
    const factImag = amp * (zR * zL) / qMagSq;

    // exponent1 = -i * k * rhoSq / (2 * q) 
    // = -i * (k * rhoSq / 2) * (invQReal + i*invQImag)
    // = (k * rhoSq / 2) * (invQImag - i*invQReal)
    const e1Real = (k * rhoSq / 2) * invQImag;
    const e1Imag = -(k * rhoSq / 2) * invQReal;

    // plane_phase = -i * k * zL
    const e2Imag = -k * zL;

    const totalExpReal = e1Real;
    const totalExpImag = e1Imag + e2Imag;

    const expVal = Math.exp(totalExpReal);
    const cosVal = Math.cos(totalExpImag);
    const sinVal = Math.sin(totalExpImag);

    // E = fact * exp(totalExp)
    // (factR + i*factI) * expVal * (cos + i*sin)
    const Er = expVal * (factReal * cosVal - factImag * sinVal);
    const Ei = expVal * (factReal * sinVal + factImag * cosVal);

    return [Er, Ei];
  };

  const drawPattern = () => {
    const ctx1 = canvas1Ref.current?.getContext('2d');
    const ctx2 = canvas2Ref.current?.getContext('2d');
    const ctxR = canvasResultRef.current?.getContext('2d');
    if (!ctx1 || !ctx2 || !ctxR) return;

    const width = res;
    const height = res;
    const imgData1 = ctx1.createImageData(width, height);
    const imgData2 = ctx2.createImageData(width, height);
    const imgDataR = ctxR.createImageData(width, height);

    const fovM = fov * 1e-6;
    const phaseRad = (phase * Math.PI) / 180;
    const isCoherent = Math.abs(lam1 - lam2) < 0.1;

    let maxI = 0;
    const intensities1: number[] = [];
    const intensities2: number[] = [];
    const intensitiesR: number[] = [];

    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const x = ((i / width) - 0.5) * fovM;
        const y = ((j / height) - 0.5) * fovM;

        const [E1r, E1i] = calcGaussianField(x, y, lam1, w01, Math.sqrt(int1), 0, 0, z1 * 1e-3, -angleSep/2, 0);
        const [E2r_raw, E2i_raw] = calcGaussianField(x, y, lam2, w02, Math.sqrt(int2), 0, 0, z2 * 1e-3, angleSep/2, 0);
        
        // Apply manual phase to E2
        const E2r = E2r_raw * Math.cos(phaseRad) - E2i_raw * Math.sin(phaseRad);
        const E2i = E2r_raw * Math.sin(phaseRad) + E2i_raw * Math.cos(phaseRad);

        const I1 = E1r*E1r + E1i*E1i;
        const I2 = E2r*E2r + E2i*E2i;
        
        let IR;
        if (isCoherent) {
          IR = Math.pow(E1r + E2r, 2) + Math.pow(E1i + E2i, 2);
        } else {
          IR = I1 + I2;
        }

        intensities1.push(I1);
        intensities2.push(I2);
        intensitiesR.push(IR);
        if (IR > maxI) maxI = IR;
      }
    }

    // Normalization and Rendering
    for (let k = 0; k < intensitiesR.length; k++) {
      const idx = k * 4;
      const val1 = Math.min(255, (intensities1[k] / (maxI || 1)) * 1000);
      const val2 = Math.min(255, (intensities2[k] / (maxI || 1)) * 1000);
      const valR = Math.min(255, (intensitiesR[k] / (maxI || 1)) * 1000);

      // Inferno-ish mapping
      imgData1.data[idx] = val1; imgData1.data[idx+1] = val1*0.3; imgData1.data[idx+2] = val1*0.1; imgData1.data[idx+3] = 255;
      imgData2.data[idx] = val2; imgData2.data[idx+1] = val2*0.3; imgData2.data[idx+2] = val2*0.1; imgData2.data[idx+3] = 255;
      imgDataR.data[idx] = valR; imgDataR.data[idx+1] = valR*0.5; imgDataR.data[idx+2] = valR*0.1; imgDataR.data[idx+3] = 255;
    }

    ctx1.putImageData(imgData1, 0, 0);
    ctx2.putImageData(imgData2, 0, 0);
    ctxR.putImageData(imgDataR, 0, 0);
  };

  useEffect(() => {
    drawPattern();
  }, [lam1, lam2, w01, w02, angleSep, z1, z2, int1, int2, phase, fov, res]);

  const Slider = ({ label, value, min, max, step, onChange, unit }: any) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[11px] font-bold text-slate-400">
        <span>{label}</span>
        <span className="text-cyan-400">{value} {unit}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <BeakerIcon className="w-8 h-8 text-cyan-500" />
          <div>
            <h2 className="text-xl font-bold text-white">شبیه‌ساز لیتوگرافی تداخلی</h2>
            <p className="text-xs text-slate-400">مدل‌سازی فیزیکی تداخل پرتوهای گائوسی</p>
          </div>
        </div>
        <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${Math.abs(lam1 - lam2) < 0.1 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
          {Math.abs(lam1 - lam2) < 0.1 ? 'Coherent Interference' : 'Incoherent Addition'}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Controls Sidebar */}
        <div className="w-80 bg-slate-900/50 border-l border-slate-800 p-6 overflow-y-auto custom-scrollbar space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              پارامترهای لیزر
            </h3>
            <Slider label="طول موج ۱" value={lam1} min={400} max={800} step={1} onChange={setLam1} unit="nm" />
            <Slider label="طول موج ۲" value={lam2} min={400} max={800} step={1} onChange={setLam2} unit="nm" />
            <Slider label="کمر پرتو ۱ (w0)" value={w01} min={1} max={100} step={1} onChange={setW01} unit="μm" />
            <Slider label="کمر پرتو ۲ (w0)" value={w02} min={1} max={100} step={1} onChange={setW02} unit="μm" />
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase">هندسه و ستاپ</h3>
            <Slider label="زاویه جدایش" value={angleSep} min={0} max={45} step={0.1} onChange={setAngleSep} unit="deg" />
            <Slider label="موقعیت Z پرتو ۱" value={z1} min={-10} max={10} step={0.1} onChange={setZ1} unit="mm" />
            <Slider label="موقعیت Z پرتو ۲" value={z2} min={-10} max={10} step={0.1} onChange={setZ2} unit="mm" />
            <Slider label="اختلاف فاز" value={phase} min={0} max={360} step={1} onChange={setPhase} unit="deg" />
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase">تنظیمات تصویر</h3>
            <Slider label="میدان دید (FOV)" value={fov} min={10} max={500} step={5} onChange={setFov} unit="μm" />
            <Slider label="رزولوشن" value={res} min={100} max={400} step={10} onChange={setRes} unit="px" />
          </section>
        </div>

        {/* Viewport */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col items-center shadow-2xl">
              <h4 className="text-sm font-bold text-slate-400 mb-4">پرتو اول (Beam 1)</h4>
              <canvas ref={canvas1Ref} width={res} height={res} className="rounded-xl w-full aspect-square shadow-inner bg-black" />
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col items-center shadow-2xl">
              <h4 className="text-sm font-bold text-slate-400 mb-4">پرتو دوم (Beam 2)</h4>
              <canvas ref={canvas2Ref} width={res} height={res} className="rounded-xl w-full aspect-square shadow-inner bg-black" />
            </div>

            <div className="lg:col-span-3 bg-slate-900 border-2 border-cyan-500/20 rounded-3xl p-6 flex flex-col items-center shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              <h4 className="text-lg font-bold text-cyan-400 mb-6 flex items-center gap-2">
                الگوی تداخلی نهایی (Resulting Intensity)
              </h4>
              <div className="relative group w-full max-w-2xl">
                <canvas ref={canvasResultRef} width={res} height={res} className="rounded-2xl w-full aspect-square shadow-2xl bg-black border border-slate-700" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="text-[10px] text-slate-300">نمایش شدت نوری در سطح مقطع z=0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-cyan-900/10 border border-cyan-900/30 rounded-2xl flex gap-4 max-w-7xl mx-auto">
            <InformationCircleIcon className="w-6 h-6 text-cyan-500 shrink-0" />
            <div className="text-sm text-slate-400 leading-relaxed">
              <strong className="text-cyan-400 block mb-1">تحلیل فیزیکی:</strong>
              این شبیه‌ساز از مدل کامل پارامتر مختلط پرتو (Complex Beam Parameter q) برای محاسبه جبهه موج استفاده می‌کند. تغییر در موقعیت Z کمر پرتو (Waist) باعث تغییر در انحنای جبهه موج شده و فرکانس فضایی تداخل را در نقاط مختلف میدان دید تغییر می‌دهد.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterferometryView;
