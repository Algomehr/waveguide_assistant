
import React, { useState } from 'react';
import { Material, Equipment } from '../types';
import { getProcurementAdvice } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  CircleStackIcon, 
  MagnifyingGlassIcon, 
  BeakerIcon, 
  LightBulbIcon, 
  ShoppingCartIcon,
  SparklesIcon,
  ChevronRightIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const MATERIALS_DATA: Material[] = [
  { name: 'Silicon', formula: 'Si', index: 3.47, category: 'Semiconductor', description: 'Standard high-index material for SOI photonics at 1550nm.', thermalExpansion: '2.6e-6 /K', bandgap: '1.12 eV' },
  { name: 'Silicon Nitride', formula: 'Si3N4', index: 2.0, category: 'Dielectric', description: 'Low loss material for visible and NIR photonics. Ideal for nonlinear optics.', thermalExpansion: '3.3e-6 /K', bandgap: '5.0 eV' },
  { name: 'Silica', formula: 'SiO2', index: 1.44, category: 'Dielectric', description: 'Low index cladding, transparent in UV to NIR.', thermalExpansion: '0.5e-6 /K' },
  { name: 'SU-8', formula: 'Polymer', index: 1.58, category: 'Photoresist', description: 'High-aspect-ratio negative photoresist for thick layer waveguide fabrication.' },
  { name: 'Lithium Niobate', formula: 'LiNbO3', index: 2.21, category: 'Dielectric', description: 'Excellent electro-optic properties for modulators and frequency converters.' },
  { name: 'AZ 5214E', formula: 'Resist', index: 1.61, category: 'Photoresist', description: 'Image reversal photoresist for liftoff processes and grating writing.' },
];

const EQUIPMENT_DATA: Equipment[] = [
  { 
    name: 'He-Cd Laser (442nm)', 
    type: 'Laser', 
    keySpecs: { 'Coherence Length': '> 10m', 'Power Stability': '< 2%', 'M2 Factor': '< 1.1' }, 
    description: 'Gold standard for interference lithography and grating writing.', 
    application: 'Direct writing and interference patterns.',
    buyingGuide: 'Ensure TEM00 mode and high coherence for stable fringe patterns.'
  },
  { 
    name: 'Polarizing Beam Splitter (PBS)', 
    type: 'Optics', 
    keySpecs: { 'Extinction Ratio': '> 1000:1', 'Surface Quality': '20-10 Scratch-Dig', 'AR Coating': 'Visible/NIR' }, 
    description: 'Separates S and P polarization components with high precision.', 
    application: 'Interferometry setup power balancing.',
    buyingGuide: 'Check for wide-angle acceptance and damage threshold.'
  },
  { 
    name: 'Piezo Nano-Positioner', 
    type: 'Positioning', 
    keySpecs: { 'Resolution': '< 1nm', 'Travel Range': '100um', 'Repeatability': '2nm' }, 
    description: 'Closed-loop positioning for sub-wavelength alignment.', 
    application: 'Fiber-to-chip coupling and scanning.',
    buyingGuide: 'Look for capacitive feedback sensors for maximum stability.'
  }
];

const MaterialsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'equipment' | 'procurement'>('materials');
  const [search, setSearch] = useState('');
  const [requirement, setRequirement] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredMaterials = MATERIALS_DATA.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.formula.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEquipment = EQUIPMENT_DATA.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleGetAdvice = async () => {
    if (!requirement.trim() || isLoading) return;
    setIsLoading(true);
    setAdvice(null);
    try {
      const res = await getProcurementAdvice(requirement);
      setAdvice(res);
    } catch (err) {
      setAdvice('خطا در تولید راهنمای خرید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto scrollbar-hide">
      <header className="p-6 lg:p-10 border-b border-slate-900 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl">
              <CircleStackIcon className="w-8 h-8 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white">مرکز تجهیزات و متریال</h2>
              <p className="text-sm text-slate-400 mt-1">بانک اطلاعاتی دقیق برای مهندسی، طراحی و خرید قطعات فوتونیک.</p>
            </div>
          </div>
        </div>

        <div className="flex p-1 bg-slate-900 rounded-2xl w-fit border border-slate-800">
          {[
            { id: 'materials', label: 'بانک متریال', icon: BeakerIcon },
            { id: 'equipment', label: 'کاتالوگ تجهیزات', icon: LightBulbIcon },
            { id: 'procurement', label: 'مشاور هوشمند خرید', icon: ShoppingCartIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs lg:text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-cyan-600 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab !== 'procurement' && (
          <div className="relative mb-10">
            <input
              type="text"
              placeholder="جستجو در نام، نوع یا فرمول..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-14 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-right text-sm"
            />
            <MagnifyingGlassIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {filteredMaterials.map((mat, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] hover:border-cyan-500/40 transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-black uppercase">{mat.category}</span>
                  <span className="text-3xl font-black text-slate-700">{mat.formula}</span>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{mat.name}</h3>
                <div className="text-4xl font-black text-cyan-500/80 mb-6 font-mono">n={mat.index}</div>
                <p className="text-xs text-slate-400 leading-relaxed text-right mb-6 flex-1">{mat.description}</p>
                <div className="space-y-2 pt-6 border-t border-slate-800">
                  {mat.thermalExpansion && (
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-cyan-600">Thermal Exp.</span>
                      <span className="text-slate-400">{mat.thermalExpansion}</span>
                    </div>
                  )}
                  {mat.bandgap && (
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-cyan-600">Bandgap</span>
                      <span className="text-slate-400">{mat.bandgap}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {filteredEquipment.map((eq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full"></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <h3 className="text-2xl font-black text-white">{eq.name}</h3>
                  <div className="px-4 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter">{eq.type}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {Object.entries(eq.keySpecs).map(([key, val]) => (
                    <div key={key} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">{key}</p>
                      <p className="text-xs font-black text-cyan-400">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase mb-2 flex items-center gap-2">
                      <TagIcon className="w-3 h-3" /> کاربرد در آزمایشگاه
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed text-right">{eq.application}</p>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-2 flex items-center gap-2">
                      <ShoppingCartIcon className="w-3 h-3" /> راهنمای خرید فنی
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed text-right">{eq.buyingGuide}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'procurement' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-cyan-500/20 rounded-2xl">
                    <SparklesIcon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">درخواست مشخصات فنی خرید</h3>
                    <p className="text-sm text-slate-400">نیاز خود را شرح دهید تا هوش مصنوعی دیت‌شیت فنی و استانداردهای لازم را استخراج کند.</p>
                  </div>
                </div>

                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="مثال: من به یک لیزر برای رایتینگ توری با دوره تناوب ۴۰۰ نانومتر روی رزین AZ نیاز دارم. پایداری و طول کوهرنس چقدر باشد؟"
                  className="w-full h-40 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-right resize-none mb-6 shadow-inner"
                ></textarea>

                <button
                  onClick={handleGetAdvice}
                  disabled={isLoading}
                  className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-[1.5rem] transition-all shadow-xl shadow-cyan-600/20 disabled:opacity-50 flex items-center justify-center gap-3 text-base"
                >
                  {isLoading ? 'در حال تحلیل مشخصات...' : 'دریافت پروپوزال فنی خرید'}
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {advice && (
              <div className="mt-10 bg-slate-900/40 p-10 rounded-[3rem] border border-cyan-500/10 animate-in fade-in zoom-in-95 duration-700">
                <div className="flex items-center gap-2 mb-6 text-cyan-400">
                  <LightBulbIcon className="w-6 h-6" />
                  <h4 className="font-black text-lg">پیشنهاد تخصصی تدارکات:</h4>
                </div>
                <MarkdownRenderer content={advice} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsView;
