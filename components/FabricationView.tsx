
import React, { useState, useMemo } from 'react';
import { WrenchScrewdriverIcon, ChartBarIcon, CpuChipIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const FabricationView: React.FC = () => {
  // Fabrication Parameters
  const [period, setPeriod] = useState(600); // nm
  const [dutyCycle, setDutyCycle] = useState(0.5); 
  const [etchDepth, setEtchDepth] = useState(150); // nm
  const [sinThickness, setSinThickness] = useState(300); // nm 
  
  // Coupling Parameters
  const [wavelength, setWavelength] = useState(1550); // nm
  const [angle, setAngle] = useState(10); // degrees
  const [fiberMfd, setFiberMfd] = useState(10); // um

  const n_sin = 2.0;
  const n_cladding = 1.44;

  const results = useMemo(() => {
    const n_unetched = n_sin; 
    const n_etched = (n_sin * (sinThickness - etchDepth) + n_cladding * etchDepth) / sinThickness;
    const n_eff = (n_unetched + n_etched) / 2 * (1 - 0.1 * (1-dutyCycle));

    const targetSinTheta = n_eff - (wavelength / period);
    const actualSinTheta = Math.sin(angle * Math.PI / 180);
    const detuning = Math.abs(actualSinTheta - targetSinTheta);
    const angularMatch = Math.exp(-Math.pow(detuning / 0.05, 2));

    const etchRatio = etchDepth / sinThickness;
    const diffractionEff = 0.8 * Math.exp(-Math.pow(etchRatio - 0.4, 2) * 5);

    const efficiency = Math.max(0, diffractionEff * angularMatch * 0.6 * 100); 
    
    return {
      efficiency: efficiency.toFixed(2),
      n_eff: n_eff.toFixed(3),
      detuning: detuning.toFixed(4),
      loss: (-10 * Math.log10(efficiency / 100 || 0.001)).toFixed(2)
    };
  }, [period, dutyCycle, etchDepth, sinThickness, wavelength, angle]);

  const plotData = useMemo(() => {
    const points = [];
    for (let lam = wavelength - 100; lam <= wavelength + 100; lam += 5) {
      const n_unetched = n_sin;
      const n_etched = (n_sin * (sinThickness - etchDepth) + n_cladding * etchDepth) / sinThickness;
      const n_eff = (n_unetched + n_etched) / 2 * (1 - 0.1 * (1-dutyCycle));
      const targetSinTheta = n_eff - (lam / period);
      const actualSinTheta = Math.sin(angle * Math.PI / 180);
      const detuning = Math.abs(actualSinTheta - targetSinTheta);
      const angularMatch = Math.exp(-Math.pow(detuning / 0.05, 2));
      const etchRatio = etchDepth / sinThickness;
      const diffractionEff = 0.8 * Math.exp(-Math.pow(etchRatio - 0.4, 2) * 5);
      const eff = Math.max(0, diffractionEff * angularMatch * 0.6 * 100);
      points.push({ x: lam, y: eff });
    }
    return points;
  }, [period, dutyCycle, etchDepth, sinThickness, angle, wavelength]);

  const Slider = ({ label, value, min, max, step, onChange, unit }: any) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[10px] lg:text-[11px] font-bold text-slate-400">
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
    <div className="flex flex-col lg:flex-row h-full bg-slate-950 overflow-hidden">
      {/* Parameters Sidebar - Top on Mobile, Right on Desktop */}
      <div className="w-full lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-l border-slate-800 p-4 lg:p-6 overflow-y-auto max-h-[40vh] lg:max-h-full scrollbar-hide">
        <div className="flex lg:flex-col gap-8 lg:gap-10">
          <section className="space-y-4 min-w-[240px] lg:min-w-0">
            <h3 className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
              <CpuChipIcon className="w-4 h-4" />
              پارامترهای ساخت
            </h3>
            <Slider label="ضخامت SiN" value={sinThickness} min={100} max={600} step={10} onChange={setSinThickness} unit="nm" />
            <Slider label="دوره تناوب" value={period} min={300} max={1200} step={1} onChange={setPeriod} unit="nm" />
            <Slider label="عمق حکاکی" value={etchDepth} min={10} max={sinThickness} step={5} onChange={setEtchDepth} unit="nm" />
          </section>

          <section className="space-y-4 min-w-[240px] lg:min-w-0">
            <h3 className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-4">
              <ChartBarIcon className="w-4 h-4" />
              پارامترهای آزمایشگاه
            </h3>
            <Slider label="طول موج" value={wavelength} min={1200} max={1700} step={1} onChange={setWavelength} unit="nm" />
            <Slider label="زاویه فیبر" value={angle} min={0} max={30} step={0.1} onChange={setAngle} unit="deg" />
          </section>
        </div>
      </div>

      {/* Main Dashboard area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <header className="mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-3">
              <WrenchScrewdriverIcon className="w-6 h-6 text-cyan-500" />
              آنالیز ساخت و کوپلینگ
            </h2>
            <p className="text-xs text-slate-400 mt-1">شبیه‌سازی بازدهی کوپلینگ SiN Platform</p>
          </div>
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-500 uppercase block">Material System</span>
            <span className="text-xs font-bold text-slate-300">SiN (n=2.0) / SiO2</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 max-w-6xl mx-auto">
          {/* Efficiency Stats Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Efficiency Result</h4>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-5xl lg:text-6xl font-bold text-white">{results.efficiency}</span>
              <span className="text-xl lg:text-2xl font-bold text-cyan-500 mb-2">%</span>
            </div>
            <p className="text-slate-500 text-xs lg:text-sm mb-6 lg:mb-8">تخمین بازدهی کوپلینگ</p>
            <div className="grid grid-cols-2 gap-4 pt-4 lg:pt-6 border-t border-slate-800">
              <div>
                <p className="text-[9px] lg:text-[10px] text-slate-500 uppercase">Effective Index</p>
                <p className="text-base lg:text-lg font-bold text-slate-300">{results.n_eff}</p>
              </div>
              <div>
                <p className="text-[9px] lg:text-[10px] text-slate-500 uppercase">Loss (dB)</p>
                <p className="text-base lg:text-lg font-bold text-amber-500">{results.loss} dB</p>
              </div>
            </div>
          </div>

          {/* Schematic */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col items-center">
            <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 mb-6 uppercase self-start">Cross-Section (z-x)</h4>
            <div className="w-full h-32 lg:h-40 relative flex items-end justify-center overflow-hidden">
              <div className="absolute bottom-0 w-full h-10 bg-slate-700/30 border-t border-slate-600"></div>
              <div className="flex items-end gap-[1px]">
                {[...Array(8)].map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="bg-cyan-600/80 w-3 lg:w-4" style={{ height: `${sinThickness/10}px` }}></div>
                    <div className="bg-cyan-600/20 w-3 lg:w-4" style={{ height: `${(sinThickness - etchDepth)/10}px` }}></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <p className="mt-4 text-[10px] text-slate-500 italic">شماتیک حکاکی نیترید سیلیسیم</p>
          </div>

          {/* Spectral Plot */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
            <h4 className="text-[10px] lg:text-xs font-bold text-slate-400 mb-4 uppercase">Spectral Response</h4>
            <div className="h-48 lg:h-64 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                <polyline fill="none" stroke="#06b6d4" strokeWidth="1.5" points={plotData.map((p, i) => `${(i / plotData.length) * 400},${100 - p.y}`).join(' ')} />
                <circle cx="200" cy={100 - parseFloat(results.efficiency)} r="3" fill="#06b6d4" className="animate-pulse" />
              </svg>
              <div className="flex justify-between text-[8px] lg:text-[10px] text-slate-500 mt-2 px-1">
                <span>{wavelength - 100} nm</span>
                <span>{wavelength} nm</span>
                <span>{wavelength + 100} nm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-8 flex gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl max-w-6xl mx-auto">
          <ExclamationTriangleIcon className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 shrink-0" />
          <p className="text-[10px] lg:text-xs text-slate-400 leading-relaxed">
            <strong className="text-amber-500 mb-1 block">هشدار:</strong>
            حساسیت به عمق حکاکی بالاست. پیشنهاد می‌شود از Duty Cycle نزدیک به ۰.۴۵ برای سرکوب مودها استفاده کنید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FabricationView;
