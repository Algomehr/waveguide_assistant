
import React, { useState } from 'react';
import { Material } from '../types';
import { CircleStackIcon, MagnifyingGlassIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const MATERIALS_DATA: Material[] = [
  { name: 'Silicon', formula: 'Si', index: 3.47, category: 'Semiconductor', description: 'Standard high-index material for SOI photonics at 1550nm.' },
  { name: 'Silica', formula: 'SiO2', index: 1.44, category: 'Dielectric', description: 'Low index cladding, transparent in UV to NIR.' },
  { name: 'Lithium Niobate', formula: 'LiNbO3', index: 2.21, category: 'Dielectric', description: 'Excellent electro-optic properties for modulators.' },
  { name: 'Gallium Arsenide', formula: 'GaAs', index: 3.3, category: 'Semiconductor', description: 'Direct bandgap material for integrated lasers.' },
  { name: 'PMMA', formula: 'C5H8O2', index: 1.49, category: 'Polymer', description: 'Common e-beam resist and waveguide polymer.' },
  { name: 'Silicon Nitride', formula: 'Si3N4', index: 2.0, category: 'Dielectric', description: 'Low loss material for visible and NIR photonics.' },
];

const MaterialsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = MATERIALS_DATA.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.formula.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <header className="p-8 border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <CircleStackIcon className="w-8 h-8 text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">بانک متریال‌های فوتونیک</h2>
        </div>
        <p className="text-slate-400">مشخصات اپتیکی و ضرایب شکست مواد رایج در طراحی موج‌بر.</p>
      </header>

      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="جستجوی نام یا فرمول شیمیایی (مثلاً Si3N4)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-14 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-right"
          />
          <MagnifyingGlassIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mat, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl hover:border-cyan-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${
                  mat.category === 'Semiconductor' ? 'bg-amber-500/10 text-amber-500' : 
                  mat.category === 'Polymer' ? 'bg-purple-500/10 text-purple-500' : 'bg-cyan-500/10 text-cyan-500'
                }`}>
                  {mat.category}
                </span>
                <span className="text-2xl font-bold text-white opacity-50">{mat.formula}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{mat.name}</h3>
              <div className="flex items-center gap-2 mb-4 text-cyan-400 font-mono">
                <ChartBarIcon className="w-4 h-4" />
                <span>n ≈ {mat.index} (@1550nm)</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed text-right">{mat.description}</p>
              <button className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 transition-colors">
                مشاهده منحنی دیسپرژن
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialsView;
