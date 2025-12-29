
import React, { useState, useMemo } from 'react';
import { 
  WrenchScrewdriverIcon, 
  ChartBarIcon, 
  CpuChipIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { GoogleGenAI } from "@google/genai";

const FabricationView: React.FC = () => {
  // Fabrication Parameters
  const [period, setPeriod] = useState(600); // nm
  const [dutyCycle, setDutyCycle] = useState(0.5); 
  const [etchDepth, setEtchDepth] = useState(150); // nm
  const [sinThickness, setSinThickness] = useState(300); // nm 
  
  // Coupling Parameters
  const [wavelength, setWavelength] = useState(1550); // nm
  const [angle, setAngle] = useState(10); // degrees
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const n_sin = 2.0;
  const n_cladding = 1.44;

  const results = useMemo(() => {
    // Effective Index Approximation using EMT (Effective Medium Theory)
    const n_etched_region = (n_sin * (sinThickness - etchDepth) + n_cladding * etchDepth) / sinThickness;
    const n_avg = (n_sin * dutyCycle) + (n_etched_region * (1 - dutyCycle));
    
    // Grating Coupler Equation: sin(theta) = n_eff - m*(lambda/Lambda)
    const n_eff = n_avg * 0.98; // Correction factor for mode confinement
    const targetSinTheta = n_eff - (wavelength / period);
    const actualSinTheta = Math.sin(angle * Math.PI / 180);
    
    // Detuning and Efficiency estimation
    const detuning = Math.abs(actualSinTheta - targetSinTheta);
    const angularMatch = Math.exp(-Math.pow(detuning / 0.04, 2));
    
    // Bragg overlap estimation
    const etchRatio = etchDepth / sinThickness;
    const diffractionEff = 0.85 * Math.exp(-Math.pow(etchRatio - 0.5, 2) * 4);
    
    const efficiency = Math.max(0, diffractionEff * angularMatch * 0.7 * 100);
    
    // Sensitivity Calculation (dEff/dEtch)
    const sensitivity = (efficiency * 0.02).toFixed(2); // Simplified derivative for UX

    return {
      efficiency: efficiency.toFixed(2),
      n_eff: n_eff.toFixed(3),
      detuning: detuning.toFixed(4),
      loss: (-10 * Math.log10(efficiency / 100 || 0.001)).toFixed(2),
      sensitivity
    };
  }, [period, dutyCycle, etchDepth, sinThickness, wavelength, angle]);

  const handleAiOptimize = async () => {
    setIsOptimizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", // Flash tier is very cost-effective/free for R&D
        contents: `Analyze this SiN Grating Coupler: 
        Thickness: ${sinThickness}nm, Period: ${period}nm, Etch: ${etchDepth}nm, Duty Cycle: ${dutyCycle}, 
        Target Wavelength: ${wavelength}nm, Angle: ${angle}deg. 
        Current Efficiency: ${results.efficiency}%. 
        Suggest 3 specific geometric changes to improve efficiency and reduce back-reflection. Respond in Persian.`,
      });
      setAiAdvice(response.text);
    } catch (err) {
      setAiAdvice("خطا در برقراری ارتباط با بهینه‌ساز هوشمند.");
    } finally {
      setIsOptimizing(false);
    }
  };

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
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-l border-slate-800 p-6 overflow-y-auto scrollbar-hide space-y-8">
        <section className="space-y-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <CpuChipIcon className="w-4 h-4" />
            هندسه نانو ساختار
          </h3>
          <Slider label="ضخامت نیترید (T)" value={sinThickness} min={100} max={500} step={10} onChange={setSinThickness} unit="nm" />
          <Slider label="دوره تناوب (Λ)" value={period} min={400} max={1000} step={1} onChange={setPeriod} unit="nm" />
          <Slider label="عمق حکاکی (E)" value={etchDepth} min={0} max={sinThickness} step={5} onChange={setEtchDepth} unit="nm" />
          <Slider label="Duty Cycle" value={dutyCycle} min={0.1} max={0.9} step={0.05} onChange={setDutyCycle} unit="" />
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4" />
            شرایط تزریق نور
          </h3>
          <Slider label="طول موج مرکزی" value={wavelength} min={1450} max={1650} step={1} onChange={setWavelength} unit="nm" />
          <Slider label="زاویه فیبر (θ)" value={angle} min={0} max={25} step={0.5} onChange={setAngle} unit="deg" />
        </section>

        <button 
          onClick={handleAiOptimize}
          disabled={isOptimizing}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          {isOptimizing ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
          بهینه‌سازی هوشمند (AI)
        </button>
      </div>

      {/* Main Analysis Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Main Visualizer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <h4 className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-widest">Dimensioned Cross-Section View</h4>
            <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-12">
              {/* SVG Schematic */}
              <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                {/* SiO2 Substrate */}
                <rect x="0" y="140" width="400" height="60" fill="#1e293b" />
                <text x="10" y="190" fill="#475569" fontSize="10" fontWeight="bold">SiO2 Substrate</text>
                
                {/* SiN Grating Bars */}
                {[...Array(6)].map((_, i) => (
                  <g key={i} transform={`translate(${i * 65}, 0)`}>
                    {/* Unetched part */}
                    <rect x="0" y={140 - (sinThickness/3)} width={65 * dutyCycle} height={sinThickness/3} fill="#0ea5e9" fillOpacity="0.9" />
                    {/* Etched part */}
                    <rect x={65 * dutyCycle} y={140 - (sinThickness/3 - etchDepth/3)} width={65 * (1 - dutyCycle)} height={(sinThickness - etchDepth)/3} fill="#0ea5e9" fillOpacity="0.4" />
                  </g>
                ))}

                {/* Dimension Lines */}
                <line x1="5" y1={140 - (sinThickness/3)} x2="5" y2="140" stroke="#94a3b8" strokeWidth="1" />
                <text x="10" y={140 - (sinThickness/6)} fill="#94a3b8" fontSize="8" transform={`rotate(-90, 10, ${140 - (sinThickness/6)})`}>T={sinThickness}nm</text>
                
                <line x1="130" y1={140 - (sinThickness/3)} x2="195" y2={140 - (sinThickness/3)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                <text x="150" y={140 - (sinThickness/3) - 5} fill="#94a3b8" fontSize="8">Λ={period}nm</text>
              </svg>
            </div>
            <div className="mt-6 flex items-center gap-4 text-[10px] text-slate-500">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-sky-500 rounded"></div> SiN Core</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-700 rounded"></div> SiO2 Underclad</div>
            </div>
          </div>

          {/* Efficiency & Metrics Card */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Coupling Efficiency</h4>
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold">Estimated</div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black text-white">{results.efficiency}</span>
                <span className="text-2xl font-bold text-cyan-500">%</span>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[9px] text-slate-500 uppercase mb-1">Loss</p>
                  <p className="text-lg font-bold text-rose-500">{results.loss}dB</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[9px] text-slate-500 uppercase mb-1">n_eff</p>
                  <p className="text-lg font-bold text-slate-300">{results.n_eff}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-[9px] text-slate-500 uppercase mb-1">Sens.</p>
                  <p className="text-lg font-bold text-amber-500">±{results.sensitivity}%</p>
                </div>
              </div>
            </div>

            {/* AI Advice Overlay */}
            {aiAdvice && (
              <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-[2rem] p-6 animate-in slide-in-from-right-4">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="w-5 h-5 text-cyan-400" />
                  <h5 className="text-sm font-bold text-cyan-400">توصیه‌های بهینه‌سازی هوشمند:</h5>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto pr-2 scrollbar-hide whitespace-pre-wrap">
                  {aiAdvice}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Warning & Insight Footer */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl flex gap-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-500 mb-1">هشدار تلورانس ساخت (Fabrication Error):</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                با توجه به پارامترهای فعلی، حساسیت بازدهی به عمق حکاکی <strong>{results.sensitivity}% بر نانومتر</strong> است. 
                پیشنهاد می‌شود برای کاهش حساسیت، ضخامت نیترید را به ۳۵۰ نانومتر افزایش داده و از حکاکی کم‌عمق‌تر استفاده کنید.
              </p>
            </div>
          </div>
          <div className="flex-1 bg-blue-500/5 border border-blue-500/20 p-6 rounded-3xl flex gap-4">
            <CpuChipIcon className="w-6 h-6 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-500 mb-1">تحلیل کوپلینگ فیبر:</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                برای این گرتینگ، زاویه بهینه برای فیبر SMF-28 حدود <strong>{angle} درجه</strong> است. 
                اطمینان حاصل کنید که فاصله عمودی فیبر تا سطح تراشه (Gap) کمتر از ۱۰ میکرون باشد تا از پخش شدگی مود جلوگیری شود.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricationView;
