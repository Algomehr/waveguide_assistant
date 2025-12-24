
import { AcademyTopic, PythonTopic } from './types';

export const ACADEMY_TOPICS: AcademyTopic[] = [
  // --- مبانی و تئوری موج‌بر ---
  {
    id: 'waveguide-theory',
    title: 'تئوری جامع موج‌برهای نوری',
    category: 'مبانی موج‌بر',
    description: 'تحلیل مودال، حل معادلات ماکسول در ساختارهای محدود و بررسی پاشندگی در موج‌برهای دی‌الکتریک.'
  },
  {
    id: 'slot-waveguides',
    title: 'موج‌برهای اسلات (Slot Waveguides)',
    category: 'مبانی موج‌بر',
    description: 'بررسی تمرکز میدان در نواحی با ضریب شکست پایین و کاربرد آن‌ها در سنسورهای نوری.'
  },
  {
    id: 'photonic-crystal-wg',
    title: 'موج‌برهای کریستال فوتونیکی',
    category: 'مبانی موج‌بر',
    description: 'هدایت نور بر اساس شکاف باند فوتونیکی (Photonic Bandgap) و کنترل نور کند (Slow Light).'
  },

  // --- توری‌های نوری (Gratings) ---
  {
    id: 'bragg-gratings',
    title: 'توری‌های براگ فیبری (FBG)',
    category: 'تکنولوژی گرتینگ',
    description: 'تئوری مودهای کوپل شده، پاسخ طیفی و کاربرد FBG در مخابرات و حسگری فشار و دما.'
  },
  {
    id: 'lpg-gratings',
    title: 'توری‌های دوره بلند (LPG)',
    category: 'تکنولوژی گرتینگ',
    description: 'کوپلینگ بین مودهای هسته و غلاف و حساسیت‌های محیطی منحصر به فرد در توری‌های LPG.'
  },
  {
    id: 'swg-gratings',
    title: 'ساختارهای زیر-طول‌موج (SWG)',
    category: 'تکنولوژی گرتینگ',
    description: 'مهندسی ضریب شکست موثر با استفاده از متامتریال‌های دی‌الکتریک دوره تناوبی.'
  },
  {
    id: 'tilted-fbg',
    title: 'توری‌های براگ زاویه‌دار (TFBG)',
    category: 'تکنولوژی گرتینگ',
    description: 'تحلیل کوپلینگ به مودهای غلاف پلاریزه و کاربرد در بیوسنسورهای SPR.'
  },

  // --- کوپلینگ و اینترفیس ---
  {
    id: 'coupling-efficiency-optimization',
    title: 'بهینه‌سازی بازدهی کوپلینگ',
    category: 'کوپلینگ نوری',
    description: 'تکنیک‌های تطبیق مود (Mode Matching) و طراحی لایه‌های ضد بازتاب برای کاهش تلفات کوپلینگ.'
  },
  {
    id: 'grating-couplers-uniform',
    title: 'گرتینگ کوپلرهای یکنواخت',
    category: 'کوپلینگ نوری',
    description: 'اصول طراحی کوپلرهای عمودی برای اتصال فیبر نوری به تراشه‌های فوتونیکی.'
  },
  {
    id: 'apodized-couplers',
    title: 'کوپلرهای گرتینگ آپودایز شده',
    category: 'کوپلینگ نوری',
    description: 'مهندسی پروفیل حکاکی برای تطبیق بهتر با مود گائوسی فیبر و افزایش بازدهی به بالای ۸۰٪.'
  },
  {
    id: 'edge-coupling',
    title: 'کوپلینگ لبه‌ای (Edge Coupling)',
    category: 'کوپلینگ نوری',
    description: 'طراحی مبدل‌های اندازه لکه (Spot-size Converters) برای کوپلینگ پهن‌باند و کم‌تلفات.'
  },

  // --- ادوات و المان‌های مجتمع ---
  {
    id: 'ring-resonators',
    title: 'تشدیدگرهای حلقوی (Ring Resonators)',
    category: 'ادوات فوتونیک',
    description: 'فاکتور کیفیت (Q-factor)، محدوده طیفی آزاد (FSR) و کاربرد در فیلترهای نوری دقیق.'
  },
  {
    id: 'mzi-interferometers',
    title: 'تداخل‌سنج‌های ماخ-زندر (MZI)',
    category: 'ادوات فوتونیک',
    description: 'اصول مدولاسیون فاز و دامنه در ساختارهای یکپارچه نوری.'
  },
  {
    id: 'mmi-couplers',
    title: 'کوپلرهای تداخل چندمودی (MMI)',
    category: 'ادوات فوتونیک',
    description: 'تحلیل خود-تصویری (Self-imaging) در موج‌برهای عریض و طراحی تقسیم‌کننده‌های توان.'
  },
  {
    id: 'awg-demux',
    title: 'توری‌های موج‌بر آرایه‌ای (AWG)',
    category: 'ادوات فوتونیک',
    description: 'طراحی مالتی‌پلکسرهای طول‌موج برای سیستم‌های WDM پرظرفیت.'
  },

  // --- روش‌های ساخت و لیتوگرافی ---
  {
    id: 'interferometric-lithography',
    title: 'لیتوگرافی تداخلی',
    category: 'روش‌های ساخت',
    description: 'ایجاد الگوهای نانومقیاس با تداخل امواج لیزری و کنترل دقیق دوره تناوب.'
  },
  {
    id: 'direct-writing-techniques',
    title: 'تکنیک‌های رایتینگ مستقیم',
    category: 'روش‌های ساخت',
    description: 'حکاکی با لیزرهای فمتوثانیه و ایجاد تغییرات ضریب شکست در حجم شیشه و پلیمر.'
  },
  {
    id: 'e-beam-lithography',
    title: 'لیتوگرافی پرتو الکترونی (EBL)',
    category: 'روش‌های ساخت',
    description: 'ساختارهای نانوفوتونیک با رزولوشن زیر ۱۰ نانومتر و چالش‌های دوز پرتو.'
  },
  {
    id: 'rie-etching',
    title: 'اچینگ یون فعال (RIE/ICP)',
    category: 'روش‌های ساخت',
    description: 'فرآیندهای خشک برای ایجاد دیواره‌های صاف در نیترید سیلیسیم و سیلیکون.'
  },

  // --- مباحث پیشرفته و تست ---
  {
    id: 'nonlinear-optics-wg',
    title: 'اپتیک غیرخطی در موج‌برها',
    category: 'مباحث پیشرفته',
    description: 'اثرات Kerr، ترکیب چهار موج (FWM) و تولید سوپر-کانتینیوم در ساختارهای فشرده.'
  },
  {
    id: 'optimization-algorithms',
    title: 'الگوریتم‌های بهینه‌سازی در فوتونیک',
    category: 'مباحث پیشرفته',
    description: 'کاربرد الگوریتم‌های ژنتیک، PSO و طراحی معکوس (Inverse Design) در ادوات نوری.'
  },
  {
    id: 'characterization-setup',
    title: 'تست و مشخصه‌یابی ادوات نوری',
    category: 'مباحث پیشرفته',
    description: 'روش‌های اندازه‌گیری تلفات انتشاری، پاسخ طیفی و دیاگرام‌های چشم در آزمایشگاه.'
  }
];

export const PYTHON_TOPICS: PythonTopic[] = [
  // --- PYTHON CORE & SCIENTIFIC LIBRARIES ---
  {
    id: 'numpy-scipy-photonics',
    title: 'محاسبات علمی با NumPy و SciPy',
    category: 'Python Core',
    description: 'مدل‌سازی ماتریسی جبهه موج، جبر خطی برای ماتریس‌های انتقال و حل معادلات دیفرانسیل نوری.',
    difficulty: 'Beginner'
  },
  {
    id: 'matplotlib-visualization',
    title: 'مصورسازی پیشرفته با Matplotlib',
    category: 'Python Core',
    description: 'رسم الگوهای تداخلی، دیاگرام‌های مودال، کانتورهای شدت و پاسخ‌های فرکانسی حرفه‌ای.',
    difficulty: 'Beginner'
  },
  {
    id: 'pandas-data-analysis',
    title: 'تحلیل داده‌های آزمایشگاهی با Pandas',
    category: 'Python Core',
    description: 'مدیریت و پردازش فایل‌های حجیم خروجی از اسکنرهای نوری و توان‌سنج‌ها.',
    difficulty: 'Beginner'
  },

  // --- OPTIMIZATION ALGORITHMS ---
  {
    id: 'genetic-algorithms-grating',
    title: 'الگوریتم ژنتیک (GA) در طراحی گرتینگ',
    category: 'Optimization',
    description: 'پیاده‌سازی تکاملی برای یافتن بهترین دوره تناوب و عمق حکاکی جهت حداکثر کوپلینگ.',
    difficulty: 'Intermediate'
  },
  {
    id: 'pso-waveguide-optimization',
    title: 'بهینه‌سازی توده ذرات (PSO)',
    category: 'Optimization',
    description: 'الگوریتم PSO برای تنظیم همزمان چندین پارامتر هندسی در موج‌برهای اسلات و ریج.',
    difficulty: 'Intermediate'
  },
  {
    id: 'bayesian-optimization-photonics',
    title: 'بهینه‌سازی بیزی (Bayesian)',
    category: 'Optimization',
    description: 'روش کارآمد برای بهینه‌سازی توابعی که محاسبه آن‌ها زمان‌بر است (مانند خروجی‌های FDTD).',
    difficulty: 'Advanced'
  },
  {
    id: 'adjoint-method-gradient',
    title: 'روش الحاقی (Adjoint Method)',
    category: 'Optimization',
    description: 'بهینه‌سازی مبتنی بر گرادیان برای طراحی معکوس ساختارهای فوتونیک پیچیده با هزاران متغیر.',
    difficulty: 'Advanced'
  },
  {
    id: 'simulated-annealing-anneal',
    title: 'تبرید شبیه‌سازی شده (SA)',
    category: 'Optimization',
    description: 'الگوریتم SA برای فرار از کمینه‌های محلی در طراحی فیلترهای نوری پیچیده.',
    difficulty: 'Intermediate'
  },
  {
    id: 'differential-evolution',
    title: 'تکامل تفاضلی (DE)',
    category: 'Optimization',
    description: 'یک روش قوی برای بهینه‌سازی سراسری پارامترهای توری‌های پراش در فضای چند بعدی.',
    difficulty: 'Intermediate'
  },

  // --- MACHINE LEARNING & DEEP LEARNING ---
  {
    id: 'ml-foundations-scikit',
    title: 'مبانی یادگیری ماشین با Scikit-Learn',
    category: 'Machine Learning',
    description: 'رگرسیون و دسته‌بندی برای پیش‌بینی ضریب شکست موثر بر اساس ابعاد موج‌بر.',
    difficulty: 'Beginner'
  },
  {
    id: 'neural-networks-proxy',
    title: 'شبکه‌های عصبی به عنوان مدل جایگزین',
    category: 'Machine Learning',
    description: 'ساخت مدل‌های سریع (Proxy Models) برای جایگزینی شبیه‌سازی‌های زمان‌بر FDTD.',
    difficulty: 'Intermediate'
  },
  {
    id: 'cnn-topology-optimization',
    title: 'شبکه‌های کانولوشنی (CNN) در فوتونیک',
    category: 'Machine Learning',
    description: 'استفاده از بینایی ماشین برای تحلیل تصاویر توپولوژی ساختارهای نانو.',
    difficulty: 'Advanced'
  },
  {
    id: 'gan-inverse-design',
    title: 'شبکه‌های مولد (GAN) در طراحی معکوس',
    category: 'Machine Learning',
    description: 'تولید خودکار طرح‌های جدید موج‌بر و گرتینگ که به اهداف عملکردی خاص می‌رسند.',
    difficulty: 'Advanced'
  },
  {
    id: 'reinforcement-learning-alignment',
    title: 'یادگیری تقویت‌پذیر (RL) در آزمایشگاه',
    category: 'Machine Learning',
    description: 'آموزش عامل هوشمند برای تراز خودکار (Auto-alignment) فیبر نوری به موج‌بر.',
    difficulty: 'Advanced'
  },

  // --- HARDWARE CONTROL & PHOTONIC LIBS ---
  {
    id: 'automation-pyvisa',
    title: 'اتوماسیون تجهیزات با PyVISA',
    category: 'Hardware Control',
    description: 'کنترل لیزرها، OSA و استیج‌های حرکتی برای رایتینگ مستقیم گرتینگ.',
    difficulty: 'Intermediate'
  },
  {
    id: 'meep-python-fdtd',
    title: 'شبیه‌سازی FDTD با کتابخانه MEEP',
    category: 'Hardware Control',
    description: 'اسکریپت‌نویسی کامل برای شبیه‌سازی انتشار موج در ساختارهای تناوبی.',
    difficulty: 'Intermediate'
  },
  {
    id: 'tmm-transfer-matrix',
    title: 'روش ماتریس انتقال (TMM) در پایتون',
    category: 'Hardware Control',
    description: 'محاسبه سریع بازتاب و عبور در ساختارهای چندلایه و توری‌های براگ.',
    difficulty: 'Beginner'
  }
];
