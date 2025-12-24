
import React, { useState, useMemo } from 'react';
import { ScaleIcon, BeakerIcon, LightBulbIcon, CalculatorIcon } from '@heroicons/react/24/outline';

const LabSetupView: React.FC = () => {
  const [lambda, setLambda] = useState(442); // He-Cd laser
  const [theta, setTheta] = useState(15.5); // Half-angle
  const [index, setIndex] = useState(1.0); // Air
  const [exposureTime, setExposureTime] = useState(120); // Seconds

  const results = useMemo(() => {
    // Bragg Grating Equation: Lambda = lambda / (2 * n * sin(theta))
    const thetaRad = (theta * Math.PI) / 180;
    const period = lambda / (2 * index * Math.sin(thetaRad));
    
    // Frequency
    const frequency = 1 / (period * 1e-3); // lines per um

    return {
      period: period.toFixed(2),
      frequency: frequency.toFixed(2),
      k_vector: (2 * Math.PI / period).toFixed(4)
    };
  }, [lambda, theta, index]);

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      <header className="p-6 lg:p-10 border-b border-slate-900 bg-slate-900/40 backdrop-blur-xl lg:sticky lg:top-0 lg:z-10">
        <div className="flex items-center gap-3 lg:gap-4 mb-2 lg:mb-3">
          <ScaleIcon className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-500" />
          <h2 className="text-xl lg:text-3xl font-black text-white">کالیبراسیون ستاپ رایتینگ</h2>
        </div>
        <p className="text-sm lg:text-base text-slate-400 max-w-2xl leading-relaxed">محاسبه دقیق پارامترهای تداخل برای ایجاد توری‌های پراش (Gratings) در آزمایشگاه اپتیک.</p>
      </header>

      <div className="p-4 lg:p-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className="space-y-6 lg:space-y-8">
          <section className="bg-slate-900/80 border border-slate-800 p-6 lg:p-8 rounded-3xl lg:rounded-[2.5rem] shadow-xl">
            <h3 className="text-base lg:text-lg font-bold text-white mb-6 flex items-center gap-3">
              <CalculatorIcon className="w-5 h-5 text-cyan-500" />
              ورودی‌های فیزیکی
            </h3>
            
            <div className="space-y-5 lg:space-y-6">
              <div>
                <label className="block text-[10px] lg:text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">طول موج لیزر (nm)</label>
                <input 
                  type="number" value={lambda} onChange={(e) => setLambda(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-cyan-400 font-mono focus:border-cyan-500/50 outline-none text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">نیم-زاویه برخورد پرتو (deg)</label>
                <input 
                  type="number" step="0.1" value={theta} onChange={(e) => setTheta(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-cyan-400 font-mono focus:border-cyan-500/50 outline-none text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">ضریب شکست محیط (n)</label>
                <input 
                  type="number" step="0.01" value={index} onChange={(e) => setIndex(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-cyan-400 font-mono focus:border-cyan-500/50 outline-none text-sm lg:text-base"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:space-y-8">
          <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/40 border border-cyan-500/20 p-6 lg:p-10 rounded-3xl lg:rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 lg:w-64 lg:h-64 bg-cyan-500/5 blur-[80px] lg:blur-[100px] group-hover:bg-cyan-500/10 transition-all"></div>
            <h4 className="text-[10px] lg:text-xs font-black text-cyan-500 uppercase tracking-widest mb-6 lg:mb-10">Grating Characteristics</h4>
            
            <div className="space-y-6 lg:space-y-10">
              <div className="flex justify-between items-end border-b border-slate-800 pb-4 lg:pb-6">
                <div>
                  <p className="text-xs lg:text-sm text-slate-400 mb-1">دوره تناوب (Period)</p>
                  <p className="text-3xl lg:text-5xl font-black text-white">{results.period} <span className="text-sm lg:text-xl text-cyan-600">nm</span></p>
                </div>
                <BeakerIcon className="w-6 h-6 lg:w-8 lg:h-8 text-slate-700" />
              </div>

              <div className="flex justify-between items-end border-b border-slate-800 pb-4 lg:pb-6">
                <div>
                  <p className="text-xs lg:text-sm text-slate-400 mb-1">فرکانس فضایی</p>
                  <p className="text-2xl lg:text-4xl font-black text-white">{results.frequency} <span className="text-sm lg:text-lg text-cyan-600">lines/μm</span></p>
                </div>
              </div>

              <div>
                <p className="text-[10px] lg:text-xs text-slate-500 mb-1 uppercase font-bold">Vector Magnitude (k)</p>
                <p className="text-sm lg:text-xl font-mono text-cyan-500">{results.k_vector} rad/nm</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 p-4 lg:p-6 rounded-2xl lg:rounded-3xl flex gap-3 lg:gap-4">
            <LightBulbIcon className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500 shrink-0" />
            <div className="text-xs lg:text-sm text-slate-400 leading-relaxed">
              <strong className="text-amber-500 block mb-1">نکته تجربی:</strong>
              برای دستیابی به دوره تناوب <span className="font-mono text-amber-200">{results.period}nm</span>، از پایداری میز اپتیکی اطمینان حاصل کنید. در این زاویه، حساسیت به لرزش‌ها مکانیکی بالاست.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabSetupView;
