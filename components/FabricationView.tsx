
import React, { useState, useMemo } from 'react';
import { WrenchScrewdriverIcon, ChartBarIcon, CpuChipIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const FabricationView: React.FC = () => {
  // Fabrication Parameters
  const [period, setPeriod] = useState(600); // nm
  const [dutyCycle, setDutyCycle] = useState(0.5); 
  const [etchDepth, setEtchDepth] = useState(150); // nm
  const [sinThickness, setSinThickness] = useState(300); // nm (Fixed wafer baseline)
  
  // Coupling Parameters
  const [wavelength, setWavelength] = useState(1550); // nm
  const [angle, setAngle] = useState(10); // degrees
  const [fiberMfd, setFiberMfd] = useState(10); // um

  // Physics constants for SiN platform
  const n_sin = 2.0;
  const n_cladding = 1.44; // SiO2 cladding

  // Simple Analytical Model for Coupling Efficiency (eta)
  // eta = overlap * diffraction_efficiency
  const results = useMemo(() => {
    // 1. Calculate Effective Index (Approximate based on thickness and etch)
    // Weighted average of etched and unetched regions
    const n_unetched = n_sin; 
    const n_etched = (n_sin * (sinThickness - etchDepth) + n_cladding * etchDepth) / sinThickness;
    const n_eff = (n_unetched + n_etched) / 2 * (1 - 0.1 * (1-dutyCycle)); // Rough approximation

    // 2. Grating Coupler Equation: sin(theta) = n_eff - lambda/period
    const targetSinTheta = n_eff - (wavelength / period);
    const actualSinTheta = Math.sin(angle * Math.PI / 180);
    
    // Detuning loss (Gaussian shape)
    const detuning = Math.abs(actualSinTheta - targetSinTheta);
    const angularMatch = Math.exp(-Math.pow(detuning / 0.05, 2));

    // Diffraction efficiency estimate (Simplified based on etch depth)
    // Optimal etch usually around 50-70% of thickness for top coupling
    const etchRatio = etchDepth / sinThickness;
    const diffractionEff = 0.8 * Math.exp(-Math.pow(etchRatio - 0.4, 2) * 5);

    // Final efficiency in percentage
    const efficiency = Math.max(0, diffractionEff * angularMatch * 0.6 * 100); 
    
    return {
      efficiency: efficiency.toFixed(2),
      n_eff: n_eff.toFixed(3),
      detuning: detuning.toFixed(4),
      // Fix: Removed redundant and type-incorrect parseFloat as efficiency is already a number
      loss: (-10 * Math.log10(efficiency / 100 || 0.001)).toFixed(2)
    };
  }, [period, dutyCycle, etchDepth, sinThickness, wavelength, angle]);

  // Generate data for Spectral Plot (Efficiency vs Wavelength)
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
          <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-500" />
          <div>
            <h2 className="text-xl font-bold text-white">آنالیز ساخت و کوپلینگ (SiN Platform)</h2>
            <p className="text-xs text-slate-400">شبیه‌سازی بازدهی کوپلینگ برای ویفرهای نیترید سیلیسیم</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase">Wafer Baseline</span>
            <span className="text-xs font-bold text-slate-300">SiN (n=2.0) on SiO2</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Parameters Sidebar */}
        <div className="w-80 bg-slate-900/50 border-l border-slate-800 p-6 overflow-y-auto space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <CpuChipIcon className="w-4 h-4" />
              پارامترهای ساخت (Fabrication)
            </h3>
            <Slider label="ضخامت کل SiN" value={sinThickness} min={100} max={600} step={10} onChange={setSinThickness} unit="nm" />
            <Slider label="دوره تناوب (Λ)" value={period} min={300} max={1200} step={1} onChange={setPeriod} unit="nm" />
            <Slider label="عمق حکاکی (Etch)" value={etchDepth} min={10} max={sinThickness} step={5} onChange={setEtchDepth} unit="nm" />
            <Slider label="فاکتور وظیفه (Fill)" value={dutyCycle} min={0.1} max={0.9} step={0.05} onChange={setDutyCycle} unit="" />
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4" />
              پارامترهای آزمایشگاه (Setup)
            </h3>
            <Slider label="طول موج مرکزی" value={wavelength} min={1200} max={1700} step={1} onChange={setWavelength} unit="nm" />
            <Slider label="زاویه فیبر" value={angle} min={0} max={30} step={0.1} onChange={setAngle} unit="deg" />
            <Slider label="MFD فیبر" value={fiberMfd} min={5} max={20} step={0.5} onChange={setFiberMfd} unit="μm" />
          </section>
        </div>

        {/* Dashboard Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Efficiency Stats Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
              <h4 className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">Coupling Analysis</h4>
              
              <div className="flex items-end gap-2 mb-1">
                <span className="text-6xl font-bold text-white">{results.efficiency}</span>
                <span className="text-2xl font-bold text-cyan-500 mb-2">%</span>
              </div>
              <p className="text-slate-500 text-sm mb-8">بازدهی کوپلینگ تخمین زده شده</p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Effective Index (n_eff)</p>
                  <p className="text-lg font-bold text-slate-300">{results.n_eff}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Insertion Loss (dB)</p>
                  <p className="text-lg font-bold text-amber-500">{results.loss} dB</p>
                </div>
              </div>
            </div>

            {/* Schematic View */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
              <h4 className="text-sm font-bold text-slate-400 mb-8 uppercase self-start">Grating Schematic (z-x)</h4>
              <div className="w-full h-40 relative flex items-end justify-center">
                {/* SiO2 Bottom Cladding */}
                <div className="absolute bottom-0 w-full h-10 bg-slate-700/50 border-t border-slate-600 rounded-b-lg"></div>
                {/* SiN Layer with Etch */}
                <div className="flex items-end gap-[1px] h-[60px]">
                  {[...Array(12)].map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="bg-cyan-600/80 w-4 border-t border-cyan-400" style={{ height: `${sinThickness/10}px` }}></div>
                      <div className="bg-cyan-600/30 w-4 border-t border-cyan-400/30" style={{ height: `${(sinThickness - etchDepth)/10}px` }}></div>
                    </React.Fragment>
                  ))}
                </div>
                {/* Fiber representation */}
                <div className="absolute -top-10 w-2 h-16 bg-slate-500/20 border-x border-slate-400/50 blur-[1px]" style={{ transform: `rotate(${angle}deg)`, left: '50%' }}></div>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 italic">نمایش شماتیک حکاکی روی نیترید سیلیسیم</p>
            </div>

            {/* Spectral Plot */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase">Spectral Response (Efficiency vs Wavelength)</h4>
              <div className="h-64 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                  {/* Grid Lines */}
                  <line x1="0" y1="0" x2="400" y2="0" stroke="#334155" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#1e293b" strokeWidth="0.5" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeWidth="0.5" />
                  
                  {/* Efficiency Curve */}
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    points={plotData.map((p, i) => `${(i / plotData.length) * 400},${100 - p.y}`).join(' ')}
                  />
                  
                  {/* Current Operating Point Marker */}
                  <circle 
                    cx="200" 
                    cy={100 - parseFloat(results.efficiency)} 
                    r="3" 
                    fill="#06b6d4" 
                    className="animate-pulse"
                  />
                </svg>
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
                  <span>{wavelength - 100} nm</span>
                  <span>{wavelength} nm</span>
                  <span>{wavelength + 100} nm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warnings and Tips */}
          <div className="mt-8 flex gap-4 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl max-w-6xl mx-auto">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 shrink-0" />
            <div className="text-sm">
              <strong className="text-amber-500 block mb-1">هشدار تلرانس ساخت:</strong>
              <p className="text-slate-400 leading-relaxed">
                با توجه به ضریب شکست SiN، حساسیت به عمق حکاکی بسیار بالاست. در صورت افزایش Etch Depth به بیش از ۵۰٪ ضخامت، تلفات بازتابش (Back Reflection) در موج‌بر افزایش می‌یابد. پیشنهاد می‌شود برای این ستاپ از Duty Cycle نزدیک به ۰.۴۵ برای سرکوب مودهای ناخواسته استفاده کنید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricationView;
