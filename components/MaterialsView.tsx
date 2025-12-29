
import React, { useState } from 'react';
import { Material, Equipment, GroundingLink } from '../types';
import { getProcurementAdvice, searchGlobalMarket } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  CircleStackIcon, 
  MagnifyingGlassIcon, 
  BeakerIcon, 
  LightBulbIcon, 
  ShoppingCartIcon,
  SparklesIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  LinkIcon,
  ExclamationCircleIcon
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
  }
];

const MaterialsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'equipment' | 'procurement' | 'global'>('materials');
  const [search, setSearch] = useState('');
  const [requirement, setRequirement] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [marketResult, setMarketResult] = useState<{ text: string; links: GroundingLink[] } | null>(null);
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

  const handleGlobalSearch = async () => {
    if (!requirement.trim() || isLoading) return;
    setIsLoading(true);
    setMarketResult(null);
    try {
      const res = await searchGlobalMarket(requirement);
      setMarketResult(res);
    } catch (err) {
      setMarketResult({ text: 'خطا در جستجوی بازار.', links: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto scrollbar-hide">
      <header className="p-6 lg:p-10 border-b border-slate-900 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl">
              <CircleStackIcon className="w-8 h-8 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-white">بانک متریال و جستجوی بازار</h2>
              <p className="text-sm text-slate-400 mt-1">اطلاعات فنی مواد و جستجوی زنده محصولات در بازارهای داخلی و خارجی.</p>
            </div>
          </div>
          {activeTab === 'global' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <ExclamationCircleIcon className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black text-amber-500 uppercase">Premium Search Tool Active</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap p-1 bg-slate-900 rounded-2xl w-fit border border-slate-800 gap-1">
          {[
            { id: 'materials', label: 'بانک متریال', icon: BeakerIcon },
            { id: 'equipment', label: 'تجهیزات مرجع', icon: LightBulbIcon },
            { id: 'procurement', label: 'مشاور فنی', icon: ShoppingCartIcon },
            { id: 'global', label: 'جستجوی بازار (زنده)', icon: GlobeAltIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] lg:text-xs font-bold transition-all ${
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
        { (activeTab === 'materials' || activeTab === 'equipment') && (
          <div className="relative mb-10">
            <input
              type="text"
              placeholder="جستجو در دیتابیس داخلی..."
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
                  {mat.thermalExpansion && <div className="flex justify-between text-[10px] font-bold"><span className="text-cyan-600">Thermal Exp.</span><span className="text-slate-400">{mat.thermalExpansion}</span></div>}
                  {mat.bandgap && <div className="flex justify-between text-[10px] font-bold"><span className="text-cyan-600">Bandgap</span><span className="text-slate-400">{mat.bandgap}</span></div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {filteredEquipment.map((eq, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
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
                <div className="space-y-4">
                   <p className="text-xs text-slate-400 leading-relaxed text-right">{eq.application}</p>
                   <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                     <p className="text-xs text-slate-400 leading-relaxed text-right">{eq.buyingGuide}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'procurement' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative">
              <div className="flex items-center gap-4 mb-8">
                <ShoppingCartIcon className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-black text-white">دریافت پروپوزال فنی خرید</h3>
              </div>
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="مثال: من به یک لیزر برای رایتینگ توری با دوره تناوب ۴۰۰ نانومتر روی رزین AZ نیاز دارم. مشخصات فنی پیشنهادی چیست؟"
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-right resize-none mb-6"
              ></textarea>
              <button onClick={handleGetAdvice} disabled={isLoading} className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
                {isLoading ? 'در حال تحلیل...' : 'دریافت مشخصات فنی خرید'}
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
            {advice && <div className="mt-10 bg-slate-900/40 p-10 rounded-[3rem] border border-cyan-500/10 animate-in fade-in duration-700"><MarkdownRenderer content={advice} /></div>}
          </div>
        )}

        {activeTab === 'global' && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl mb-12">
               <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-cyan-500/10 rounded-2xl">
                   <GlobeAltIcon className="w-8 h-8 text-cyan-500" />
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-white">جستجوی هوشمند بازار (داخلی و خارجی)</h3>
                   <p className="text-sm text-slate-400">جستجوی ابزار، تجهیزات اپتیکی، مواد شیمیایی و قطعات در تامین‌کنندگان جهانی و ایرانی.</p>
                 </div>
               </div>
               <div className="relative">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch()}
                    placeholder="نام کالا یا نیاز فنی (مثلاً: منشور PBS یا پودر سیلیکون نیترید)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-right"
                  />
                  <button 
                    onClick={handleGlobalSearch} 
                    disabled={isLoading} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-xl font-black transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'در حال جستجو...' : 'جستجوی زنده در بازار'}
                  </button>
               </div>
               <p className="mt-4 text-[10px] text-slate-500 text-right pr-2">
                 * این جستجو شامل شرکت‌های دانش‌بنیان ایرانی و توزیع‌کنندگان معتبر جهانی است.
               </p>
            </div>

            {marketResult && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[3rem]">
                   <h4 className="text-lg font-black text-cyan-400 mb-6 flex items-center gap-2">
                     <SparklesIcon className="w-6 h-6" /> تحلیل موجودی و پیشنهادات هوشمند
                   </h4>
                   <MarkdownRenderer content={marketResult.text} />
                </div>

                {marketResult.links.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketResult.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all group shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          <LinkIcon className="w-5 h-5 text-cyan-500" />
                          <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate max-w-[200px]">{link.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-black">Link</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsView;
