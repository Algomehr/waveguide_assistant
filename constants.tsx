
import { AcademyTopic, PythonTopic } from './types';

export const ACADEMY_TOPICS: AcademyTopic[] = [
  {
    id: 'bragg-gratings',
    title: 'توری‌های براگ فیبری (FBG)',
    category: 'مبانی گرتینگ',
    description: 'بررسی تئوری مودهای کوپل شده و فیزیک بازتابش در توری‌های براگ.'
  },
  {
    id: 'interferometric-lithography',
    title: 'لیتوگرافی تداخلی',
    category: 'روش‌های ساخت',
    description: 'اصول تداخل دو موج و تشکیل الگوهای تناوبی برای رایتینگ توری.'
  },
  {
    id: 'direct-writing-techniques',
    title: 'تکنیک‌های رایتینگ مستقیم (Direct Writing)',
    category: 'روش‌های ساخت',
    description: 'استفاده از پرتوهای متمرکز UV و لیزرهای فمتوثانیه برای ایجاد تغییر ضریب شکست.'
  },
  {
    id: 'coupling-efficiency-optimization',
    title: 'بهینه‌سازی بازدهی کوپلینگ',
    category: 'اپتیک کاربردی',
    description: 'روش‌های تطبیق مود (Mode Matching) و طراحی لایه‌های واسط برای کاهش تلفات.'
  },
  {
    id: 'waveguide-theory',
    title: 'تئوری موج‌برهای نوری',
    category: 'مبانی موج‌بر',
    description: 'حل معادلات ماکسول در ساختارهای محدود و بررسی مودهای انتشاری.'
  },
  {
    id: 'optimization-algorithms',
    title: 'الگوریتم‌های بهینه‌سازی در فوتونیک',
    category: 'شبیه‌سازی',
    description: 'کاربرد الگوریتم‌های ژنتیک (GA) و PSO در طراحی ادوات نوری.'
  }
];

export const PYTHON_TOPICS: PythonTopic[] = [
  {
    id: 'numpy-scipy-photonics',
    title: 'محاسبات علمی با NumPy و SciPy',
    category: 'Python Core',
    description: 'مدل‌سازی ماتریسی جبهه موج و حل معادلات دیفرانسیل نوری در پایتون.',
    difficulty: 'Beginner'
  },
  {
    id: 'genetic-algorithms-grating',
    title: 'الگوریتم ژنتیک در طراحی گرتینگ',
    category: 'Optimization',
    description: 'پیاده‌سازی GA برای یافتن بهترین دوره تناوب و عمق حکاکی جهت حداکثر کوپلینگ.',
    difficulty: 'Intermediate'
  },
  {
    id: 'inverse-design-nn',
    title: 'طراحی معکوس با شبکه‌های عصبی',
    category: 'Machine Learning',
    description: 'آموزش مدل‌های Deep Learning برای پیش‌بینی پاسخ طیفی ساختارهای نانو.',
    difficulty: 'Advanced'
  },
  {
    id: 'pso-waveguide-optimization',
    title: 'بهینه‌سازی توده ذرات (PSO)',
    category: 'Optimization',
    description: 'الگوریتم PSO برای تنظیم پارامترهای هندسی موج‌برهای ریج و اسلات.',
    difficulty: 'Intermediate'
  },
  {
    id: 'automation-pyvisa',
    title: 'اتوماسیون ستاپ با PyVISA',
    category: 'Hardware Control',
    description: 'کنترل لیزرهای قابل تنظیم و توان‌سنج‌های نوری در محیط آزمایشگاه.',
    difficulty: 'Advanced'
  },
  {
    id: 'matplotlib-visualization',
    title: 'مصورسازی داده‌های اپتیکی',
    category: 'Python Core',
    description: 'رسم الگوهای تداخلی، دیاگرام‌های مودال و پاسخ‌های فرکانسی حرفه‌ای.',
    difficulty: 'Beginner'
  }
];
