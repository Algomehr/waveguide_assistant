
import React from 'react';
import { 
  InformationCircleIcon, 
  ChatBubbleLeftRightIcon, 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  CodeBracketSquareIcon, 
  BeakerIcon, 
  WrenchScrewdriverIcon, 
  CircleStackIcon, 
  ScaleIcon,
  CpuChipIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const GuideView: React.FC = () => {
  const guideSections = [
    {
      title: '۱. بخش گفتگو و دستیار صوتی',
      icon: ChatBubbleLeftRightIcon,
      color: 'text-cyan-400',
      description: 'این بخش قلب تپنده تعامل کاربر با هوش مصنوعی است. شامل دستیار متنی برای سوالات فیزیکی و دستیار صوتی زنده (Live API) که به شما اجازه می‌دهد در حین کار با ستاپ آزمایشگاهی، بدون استفاده از دست با سیستم مشورت کنید. همچنین کدهای SVG بصری مستقیماً در همین محیط رندر می‌شوند.'
    },
    {
      title: '۲. بخش آموزشگاه تخصصی',
      icon: AcademicCapIcon,
      color: 'text-emerald-400',
      description: 'یک مرجع آموزشی تعاملی برای یادگیری عمیق فوتونیک. از تئوری موج‌برهای اسلات تا تکنولوژی‌های پیشرفته لیتوگرافی. هوش مصنوعی برای هر مبحث یک جزوه اختصاصی همراه با دیاگرام‌های شماتیک SVG تولید می‌کند.'
    },
    {
      title: '۳. بخش اکتشاف هوشمند منابع',
      icon: MagnifyingGlassIcon,
      color: 'text-blue-400',
      description: 'جایگزینی هوشمند برای جستجوهای سنتی. این بخش با اتصال زنده به دیتابیس‌های آنلاین، جدیدترین مقالات IEEE و Nature را پیدا کرده، خلاصه‌ای فنی به فارسی ارائه می‌دهد و لینک مستقیم منابع را در اختیار شما می‌گذارد.'
    },
    {
      title: '۴. بخش مرکز پایتون و هوش مصنوعی',
      icon: CodeBracketSquareIcon,
      color: 'text-purple-400',
      description: 'تمرکز بر توانمندسازی در برنامه‌نویسی محاسباتی. شامل آموزش کتابخانه‌های NumPy، SciPy و مباحث پیشرفته مثل طراحی معکوس (Inverse Design) با شبکه‌های عصبی و تولید نمونه کدهای آماده برای شبیه‌سازی.'
    },
    {
      title: '۵. بخش شبیه‌ساز تداخلی',
      icon: BeakerIcon,
      color: 'text-rose-400',
      description: 'یک ابزار بصری برای مدل‌سازی فیزیکی تداخل دو پرتو گائوسی. با کنترل پارامترهایی مثل طول‌موج، زاویه و اختلاف فاز، می‌توانید الگوی تداخلی نهایی را قبل از انجام آزمایش واقعی پیش‌بینی کنید.'
    },
    {
      title: '۶. بخش ساخت و کوپلینگ (SiN)',
      icon: WrenchScrewdriverIcon,
      color: 'text-amber-400',
      description: 'ابزار مهندسی برای طراحان تراشه‌های نوری. محاسبه بازدهی کوپلینگ نور به فیبر بر اساس ابعاد هندسی و استفاده از بهینه‌ساز هوشمند (AI Optimizer) برای کاهش تلفات و حساسیت به خطاهای ساخت.'
    },
    {
      title: '۷. بخش مرکز متریال و بازار جهانی',
      icon: CircleStackIcon,
      color: 'text-indigo-400',
      description: 'بانک اطلاعاتی مواد و ابزار خرید هوشمند. علاوه بر ضرایب شکست مواد مرجع، امکان جستجوی زنده در سایت‌های Thorlabs و Newport برای یافتن تجهیزات واقعی با پارت‌نامبر دقیق و لینک خرید فراهم شده است.'
    },
    {
      title: '۸. بخش تنظیمات ستاپ آزمایشگاه',
      icon: ScaleIcon,
      color: 'text-sky-400',
      description: 'ماشین‌حساب فیزیکی دقیق برای کالیبراسیون روزانه. محاسبه رابطه براگ، دوره تناوب توری و زاویه برخورد لیزر با دقت نانومتری جهت تنظیم دقیق چیدمان‌های لیتوگرافی.'
    },
    {
      title: '۹. سیستم رندرینگ هوشمند',
      icon: PresentationChartLineIcon,
      color: 'text-teal-400',
      description: 'موتور نمایشگر اختصاصی که در پس‌زمینه تمام بخش‌ها فعال است. این سیستم کدهای SVG و فرمول‌های LaTeX پیچیده را با بالاترین کیفیت بصری نمایش می‌دهد تا مفاهیم مهندسی به بهترین شکل منتقل شوند.'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto scrollbar-hide">
      <header className="p-8 lg:p-12 border-b border-slate-900 bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl">
            <InformationCircleIcon className="w-10 h-10 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">راهنمای جامع WaveOptix AI</h2>
            <p className="text-slate-400 mt-1">آشنایی با قابلیت‌ها و ماژول‌های پلتفرم تخصصی فوتونیک.</p>
          </div>
        </div>
      </header>

      <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="bg-cyan-600/5 border border-cyan-500/20 p-8 rounded-[2.5rem] mb-12 text-right">
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            برنامه <span className="text-cyan-400 font-black">WaveOptix AI</span> یک پلتفرم جامع برای پژوهشگران حوزه فوتونیک است که با هدف ایجاد یک <span className="italic">«همکار هوشمند»</span> طراحی شده تا فاصله بین تئوری، شبیه‌سازی و ساخت را به حداقل برساند. در اینجا با جزئیات هر بخش آشنا می‌شوید:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guideSections.map((section, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 transition-all group flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-slate-800 group-hover:bg-slate-700 transition-colors`}>
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                </div>
                <h3 className="text-lg font-black text-white">{section.title}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed text-right flex-1">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-20 py-10 border-t border-slate-900 text-center">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-bold">WaveOptix AI - Documentation v2.0</p>
          <p className="text-[10px] text-slate-700 mt-2">طراحی شده برای گروه‌های پیشرفته لیتوگرافی و طراحی موج‌بر.</p>
        </footer>
      </div>
    </div>
  );
};

export default GuideView;
