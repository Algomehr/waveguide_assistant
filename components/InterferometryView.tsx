
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

    const qReal = zL;
    const qImag = zR;
    const qMagSq = qReal*qReal + qImag*qImag;

    const invQReal = qReal / qMagSq;
    const invQImag = -qImag / qMagSq;

    const factReal = amp * (zR * zR) / qMagSq;
    const factImag = amp * (zR * zL) / qMagSq;

    const e1Real = (k * rhoSq / 2) * invQImag;
    const e1Imag = -(k * rhoSq / 2) * invQReal;

    const e2Imag = -k * zL;

    const totalExpReal = e1Real;
    const totalExpImag = e1Imag + e2Imag;

    const expVal = Math.exp(totalExpReal);
    const cosVal = Math.cos(totalExpImag);
    const sinVal = Math.sin(totalExpImag);

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

    for (let k = 0; k < intensitiesR.length; k++) {
      const idx = k * 4;
      const val1 = Math.min(255, (intensities1[k] / (maxI || 1)) * 1000);
      const val2 = Math.min(255, (intensities2[k] / (maxI || 1)) * 1000);
      const valR = Math.min(255, (intensitiesR[k] / (maxI || 1)) * 1000);

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
    <div className="flex flex-col gap-2 w-full mb-4">
      <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
        <label className="flex items-center gap-1">
          {label}
          <span className="text-[9px] text-slate-600 font-normal">({unit})</span>
        </label>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            value={value} 
            step={step}
            min={min}
            max={max}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-16 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-cyan-400 font-mono text-[10px] focus:border-cyan-500/50 outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <input 
          type="range" min={min} max={max} step={step} value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>
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
        <div className="w-80 bg-slate-900/50 border-l border-slate-800 p-6 overflow-y-auto custom-scrollbar">
          <section className="mb-10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 mb-6 tracking-widest">
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              پارامترهای لیزر
            </h3>
            <Slider label="طول موج ۱" value={lam1} min={400} max={800} step={1} onChange={setLam1} unit="nm" />
            <Slider label="طول موج ۲" value={lam2} min={400} max={800} step={1} onChange={setLam2} unit="nm" />
            <Slider label="کمر پرتو ۱ (w0)" value={w01} min={1} max={100} step={1} onChange={setW01} unit="μm" />
            <Slider label="کمر پرتو ۲ (w0)" value={w02} min={1} max={100} step={1} onChange={setW02} unit="μm" />
          </section>

          <section className="mb-10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">هندسه و ستاپ</h3>
            <Slider label="زاویه جدایش" value={angleSep} min={0} max={45} step={0.1} onChange={setAngleSep} unit="deg" />
            <Slider label="موقعیت Z پرتو ۱" value={z1} min={-10} max={10} step={0.1} onChange={setZ1} unit="mm" />
            <Slider label="موقعیت Z پرتو ۲" value={z2} min={-10} max={10} step={0.1} onChange={setZ2} unit="mm" />
            <Slider label="اختلاف فاز" value={phase} min={0} max={360} step={1} onChange={setPhase} unit="deg" />
          </section>

          <section className="mb-10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">تنظیمات تصویر</h3>
            <Slider label="میدان دید (FOV)" value={fov} min={10} max={500} step={5} onChange={setFov} unit="μm" />
            <Slider label="رزولوشن" value={res} min={100} max={400} step={10} onChange={setRes} unit="px" />
          </section>
        </div>

        {/* Viewport */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#020617]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col items-center shadow-2xl transition-all hover:border-slate-700">
              <h4 className="text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-tighter">پرتو اول (Beam 1)</h4>
              <canvas ref={canvas1Ref} width={res} height={res} className="rounded-xl w-full aspect-square shadow-inner bg-black" />
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col items-center shadow-2xl transition-all hover:border-slate-700">
              <h4 className="text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-tighter">پرتو دوم (Beam 2)</h4>
              <canvas ref={canvas2Ref} width={res} height={res} className="rounded-xl w-full aspect-square shadow-inner bg-black" />
            </div>

            <div className="lg:col-span-3 bg-slate-900 border-2 border-cyan-500/10 rounded-[2.5rem] p-8 flex flex-col items-center shadow-[0_0_60px_rgba(6,182,212,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px]"></div>
              <h4 className="text-xl font-black text-cyan-400 mb-8 flex items-center gap-3 relative z-10">
                الگوی تداخلی نهایی (Resulting Intensity)
              </h4>
              <div className="relative group w-full max-w-xl">
                <canvas ref={canvasResultRef} width={res} height={res} className="rounded-3xl w-full aspect-square shadow-2xl bg-black border border-slate-800 group-hover:border-cyan-500/30 transition-all duration-500" />
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                  <p className="text-[10px] text-slate-400 font-bold">نمایش شدت نوری در سطح مقطع z=0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-cyan-950/10 border border-cyan-500/10 rounded-[2rem] flex gap-5 max-w-7xl mx-auto shadow-xl">
            <InformationCircleIcon className="w-7 h-7 text-cyan-500 shrink-0" />
            <div className="text-sm text-slate-400 leading-relaxed text-right">
              <strong className="text-cyan-400 block mb-2 font-black">تحلیل فیزیکی و آزمایشگاهی:</strong>
              این شبیه‌ساز با استفاده از مدل جبهه موج کروی (Spherical Wavefront) در تقریب پاراکسیال، تداخل را محاسبه می‌کند. ورودی‌های عددی بالا به شما اجازه می‌دهند تا مقادیر واقعی کاتالوگ لیزرها و استیج‌های حرکتی خود را مستقیماً وارد کرده و تلورانس‌های تداخلی را پیش از انجام لیتوگرافی تحلیل کنید.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterferometryView;
