export type Locale = "en" | "id" | "ar";

type LocalizedString = Record<Locale, string>;
type LocalizedStringArray = Record<Locale, string[]>;

export function t(obj: LocalizedString, locale: Locale): string {
  return obj[locale] || obj.en;
}

export function tArr(obj: LocalizedStringArray, locale: Locale): string[] {
  return obj[locale] || obj.en;
}

export const content = {
  dir: { en: "ltr" as const, id: "ltr" as const, ar: "rtl" as const },

  hero: {
    badge: {
      en: "Prepared by: PT Shifr Asia Inovasi",
      id: "Disiapkan oleh: PT Shifr Asia Inovasi",
      ar: "إعداد: PT Shifr Asia Inovasi",
    },
    confidential: {
      en: "Confidential Proposal",
      id: "Proposal Rahasia",
      ar: "عرض سري",
    },
    titleLine1: {
      en: "Digital Transformation",
      id: "Transformasi Digital",
      ar: "التحول الرقمي",
    },
    titleHighlight: {
      en: "Masterplan",
      id: "Masterplan",
      ar: "الخطة الرئيسية",
    },
    titleLine2: {
      en: "for Educational Institutions",
      id: "untuk Institusi Pendidikan",
      ar: "للمؤسسات التعليمية",
    },
    subtitle: {
      en: "An Integrated Information System & IT Governance Proposal",
      id: "Proposal Sistem Informasi Terintegrasi & Tata Kelola TI",
      ar: "اقتراح نظام معلومات متكامل وحوكمة تكنولوجيا المعلومات",
    },
    execSummaryLabel: {
      en: "1. Executive Summary",
      id: "1. Ringkasan Eksekutif",
      ar: "١. الملخص التنفيذي",
    },
    execSummaryP1: {
      en: "In education today, software is often bought in pieces: one application for grading, another for tuition, and a separate one for attendance. This fragmentation leaves the executive board blind to real-time operations.",
      id: "Dalam dunia pendidikan saat ini, perangkat lunak sering kali dibeli secara terpisah: satu aplikasi untuk penilaian, satu lagi untuk pembayaran SPP, dan satu lagi untuk absensi. Fragmentasi ini membuat dewan eksekutif tidak dapat memantau operasional secara real-time.",
      ar: "في مجال التعليم اليوم، غالبًا ما يتم شراء البرمجيات بشكل مجزأ: تطبيق واحد للدرجات، وآخر للرسوم الدراسية، وتطبيق منفصل للحضور. هذا التجزؤ يترك المجلس التنفيذي في حالة عمى عن العمليات في الوقت الفعلي.",
    },
    execSummaryP2: {
      en: "This proposal outlines the IT Blueprint and execution roadmap to build an Integrated Digital Education Ecosystem. We utilize a modular architecture—meaning you can roll it out in phases based on your immediate priorities—that ultimately connects to a Single Sign-On (SSO) centralized database. The end result is absolute operational control for the board, immediate transparency for parents, and a lighter administrative workload for teachers.",
      id: "Proposal ini menguraikan Cetak Biru TI dan peta jalan eksekusi untuk membangun Ekosistem Pendidikan Digital Terintegrasi. Kami menggunakan arsitektur modular—yang berarti Anda dapat mengimplementasikannya secara bertahap berdasarkan prioritas mendesak—yang pada akhirnya terhubung ke database terpusat Single Sign-On (SSO). Hasil akhirnya adalah kendali operasional penuh bagi dewan, transparansi langsung bagi orang tua, dan beban administrasi yang lebih ringan bagi guru.",
      ar: "يحدد هذا الاقتراح مخطط تكنولوجيا المعلومات وخارطة طريق التنفيذ لبناء نظام تعليمي رقمي متكامل. نحن نستخدم بنية معمارية نمطية - مما يعني أنه يمكنك طرحها على مراحل بناءً على أولوياتك الفورية - والتي تتصل في النهاية بقاعدة بيانات مركزية موحدة لتسجيل الدخول (SSO). النتيجة النهائية هي السيطرة التشغيلية المطلقة للمجلس، والشفافية الفورية لأولياء الأمور، وعبء إداري أخف للمعلمين.",
    },
    scroll: {
      en: "Scroll",
      id: "Gulir",
      ar: "تمرير",
    },
  },

  needs: {
    title: {
      en: "Understanding Your Needs",
      id: "Memahami Kebutuhan Anda",
      ar: "فهم احتياجاتك",
    },
    subtitle: {
      en: "Based on our experience auditing modern educational operations, foundations and school boards typically struggle with three systemic bottlenecks:",
      id: "Berdasarkan pengalaman kami mengaudit operasional pendidikan modern, yayasan dan dewan sekolah umumnya menghadapi tiga hambatan sistemik:",
      ar: "بناءً على خبرتنا في تدقيق العمليات التعليمية الحديثة، عادةً ما تعاني المؤسسات ومجالس إدارة المدارس من ثلاثة اختناقات منهجية:",
    },
    items: [
      {
        title: {
          en: "Data Silos & Delayed Reporting",
          id: "Silo Data & Pelaporan yang Terlambat",
          ar: "صوامع البيانات وتأخير إعداد التقارير",
        },
        desc: {
          en: "Relying on disconnected spreadsheets and manual paperwork means consolidating financial and academic data takes weeks instead of minutes.",
          id: "Mengandalkan spreadsheet yang terpisah dan dokumen manual berarti konsolidasi data keuangan dan akademik membutuhkan waktu berminggu-minggu, bukan hitungan menit.",
          ar: "إن الاعتماد على جداول البيانات المنفصلة والأعمال الورقية اليدوية يعني أن دمج البيانات المالية والأكاديمية يستغرق أسابيع بدلاً من دقائق.",
        },
      },
      {
        title: {
          en: "Parent Engagement Gaps",
          id: "Kesenjangan Keterlibatan Orang Tua",
          ar: "فجوات مشاركة أولياء الأمور",
        },
        desc: {
          en: "Parents expect instant updates on their child's academic progress and tuition billing, yet most schools lack a secure, two-way communication channel.",
          id: "Orang tua mengharapkan pembaruan instan mengenai perkembangan akademik dan tagihan SPP anak mereka, namun sebagian besar sekolah belum memiliki saluran komunikasi dua arah yang aman.",
          ar: "يتوقع أولياء الأمور تحديثات فورية حول التقدم الأكاديمي لأطفالهم وفواتير الرسوم الدراسية، ومع ذلك تفتقر معظم المدارس إلى قناة اتصال آمنة وذات اتجاهين.",
        },
      },
      {
        title: {
          en: "The Risk of Stalled IT Projects",
          id: "Risiko Proyek TI yang Terhenti",
          ar: "مخاطر توقف مشاريع تكنولوجيا المعلومات",
        },
        desc: {
          en: "Schools often invest in custom software that ultimately fails during implementation due to poor change management and a lack of proper training for the teaching staff.",
          id: "Sekolah sering berinvestasi dalam perangkat lunak khusus yang pada akhirnya gagal selama implementasi karena manajemen perubahan yang buruk dan kurangnya pelatihan yang memadai bagi tenaga pengajar.",
          ar: "غالبًا ما تستثمر المدارس في برامج مخصصة تفشل في النهاية أثناء التنفيذ بسبب سوء إدارة التغيير ونقص التدريب المناسب لهيئة التدريس.",
        },
      },
    ],
  },

  solution: {
    title: {
      en: "Our Solution: An Integrated Digital Ecosystem",
      id: "Solusi Kami: Ekosistem Digital Terintegrasi",
      ar: "حلنا: نظام بيئي رقمي متكامل",
    },
    p1: {
      en: "We do not just sell software; we deliver operational governance. PT Shifr Asia Inovasi proposes a web-based platform built on a ",
      id: "Kami tidak sekadar menjual perangkat lunak; kami menghadirkan tata kelola operasional. PT Shifr Asia Inovasi mengajukan platform berbasis web yang dibangun di atas ",
      ar: "نحن لا نبيع البرمجيات فحسب؛ بل نقدم حوكمة تشغيلية. تقترح PT Shifr Asia Inovasi منصة قائمة على الويب مبنية على ",
    },
    p1Bold: {
      en: "Centralized-Modular framework",
      id: "kerangka kerja Terpusat-Modular",
      ar: "إطار عمل مركزي ونمطي",
    },
    p1End: {
      en: ".",
      id: ".",
      ar: ".",
    },
    p2: {
      en: "Each functional module (Academic, Finance, HR) can operate independently during the initial rollout, but they automatically communicate with each other through a ",
      id: "Setiap modul fungsional (Akademik, Keuangan, SDM) dapat beroperasi secara mandiri selama tahap awal, namun secara otomatis saling berkomunikasi melalui ",
      ar: "يمكن لكل وحدة وظيفية (الأكاديمية، والمالية، والموارد البشرية) العمل بشكل مستقل خلال الطرح الأولي، ولكنها تتواصل تلقائيًا مع بعضها البعض من خلال ",
    },
    p2Bold: {
      en: "Single Sign-On (SSO) gateway",
      id: "gateway Single Sign-On (SSO)",
      ar: "بوابة تسجيل الدخول الموحد (SSO)",
    },
    p2End: {
      en: ". The backend infrastructure is built on high-performance database technology (PostgreSQL) to ensure the system remains fast and stable, even when accessed by thousands of users simultaneously.",
      id: ". Infrastruktur backend dibangun di atas teknologi database berkinerja tinggi (PostgreSQL) untuk memastikan sistem tetap cepat dan stabil, bahkan ketika diakses oleh ribuan pengguna secara bersamaan.",
      ar: ". تم بناء البنية التحتية الخلفية على تقنية قواعد بيانات عالية الأداء (PostgreSQL) لضمان بقاء النظام سريعًا ومستقرًا، حتى عند الوصول إليه من قبل آلاف المستخدمين في وقت واحد.",
    },
    ssoGateway: {
      en: "SSO Gateway",
      id: "Gateway SSO",
      ar: "بوابة SSO",
    },
    ssoSub: {
      en: "Single Sign-On",
      id: "Single Sign-On",
      ar: "تسجيل الدخول الموحد",
    },
    moduleLabels: {
      en: ["Academic", "Finance", "HR"],
      id: ["Akademik", "Keuangan", "SDM"],
      ar: ["الأكاديمية", "المالية", "الموارد البشرية"],
    },
    dbLabel: {
      en: "PostgreSQL High-Performance Backend",
      id: "Backend Berkinerja Tinggi PostgreSQL",
      ar: "قاعدة بيانات خلفية عالية الأداء PostgreSQL",
    },
  },

  modules: {
    title: {
      en: "Modular Breakdown",
      id: "Rincian Modul",
      ar: "التقسيم النمطي",
    },
    subtitle: {
      en: "The system is divided into four strategic pillars, which can be activated based on your foundation's needs:",
      id: "Sistem dibagi menjadi empat pilar strategis, yang dapat diaktifkan berdasarkan kebutuhan yayasan Anda:",
      ar: "ينقسم النظام إلى أربع ركائز استراتيجية، يمكن تنشيطها بناءً على احتياجات مؤسستك:",
    },
    pillars: [
      {
        label: { en: "Pillar A", id: "Pilar A", ar: "الركيزة أ" },
        title: { en: "Core Foundation", id: "Fondasi Inti", ar: "الأساس الجوهري" },
        subtitle: {
          en: "The Command Center",
          id: "Pusat Komando",
          ar: "مركز القيادة",
        },
        items: [
          {
            en: "Single Sign-On (SSO): One gateway and one password for all school applications.",
            id: "Single Sign-On (SSO): Satu pintu masuk dan satu kata sandi untuk semua aplikasi sekolah.",
            ar: "تسجيل الدخول الموحد (SSO): بوابة واحدة وكلمة مرور واحدة لجميع التطبيقات المدرسية.",
          },
          {
            en: "Executive Dashboard: A real-time analytics dashboard for the C-Suite/Board to monitor cash flow, attendance rates, and branch performance.",
            id: "Dashboard Eksekutif: Dashboard analitik real-time bagi Direksi/Dewan untuk memantau arus kas, tingkat kehadiran, dan kinerja cabang.",
            ar: "لوحة القيادة التنفيذية: لوحة معلومات تحليلات في الوقت الفعلي لمجلس الإدارة لمراقبة التدفق النقدي ومعدلات الحضور وأداء الفروع.",
          },
        ],
      },
      {
        label: { en: "Pillar B", id: "Pilar B", ar: "الركيزة ب" },
        title: {
          en: "Academic & Learning",
          id: "Akademik & Pembelajaran",
          ar: "الأكاديمية والتعلم",
        },
        subtitle: { en: "", id: "", ar: "" },
        items: [
          {
            en: "Centralized Curriculum & Scheduling Management.",
            id: "Manajemen Kurikulum & Penjadwalan Terpusat.",
            ar: "الإدارة المركزية للمناهج والجدولة.",
          },
          {
            en: "Real-time grading system for teachers.",
            id: "Sistem penilaian real-time untuk guru.",
            ar: "نظام تصنيف في الوقت الفعلي للمعلمين.",
          },
          {
            en: "Learning Management System (LMS) for material and assignment distribution.",
            id: "Sistem Manajemen Pembelajaran (LMS) untuk distribusi materi dan tugas.",
            ar: "نظام إدارة التعلم (LMS) لتوزيع المواد والواجبات.",
          },
        ],
      },
      {
        label: { en: "Pillar C", id: "Pilar C", ar: "الركيزة ج" },
        title: {
          en: "Operational & Finance",
          id: "Operasional & Keuangan",
          ar: "العمليات والمالية",
        },
        subtitle: { en: "", id: "", ar: "" },
        items: [
          {
            en: "Financial Information System (Tuition billing and payment reconciliation).",
            id: "Sistem Informasi Keuangan (Penagihan SPP dan rekonsiliasi pembayaran).",
            ar: "نظام المعلومات المالية (فواتير الرسوم الدراسية وتسوية المدفوعات).",
          },
          {
            en: "HRIS (Staff management, attendance, and payroll).",
            id: "HRIS (Manajemen staf, kehadiran, dan penggajian).",
            ar: "نظام معلومات الموارد البشرية (إدارة الموظفين والحضور والرواتب).",
          },
          {
            en: "Integrated POS (Point of Sales) System for the school cafeteria or cooperative.",
            id: "Sistem POS (Point of Sales) Terintegrasi untuk kantin atau koperasi sekolah.",
            ar: "نظام نقطة البيع (POS) المتكامل لمقصف المدرسة أو التعاونية.",
          },
        ],
      },
      {
        label: { en: "Pillar D", id: "Pilar D", ar: "الركيزة د" },
        title: {
          en: "Engagement Portal",
          id: "Portal Keterlibatan",
          ar: "بوابة المشاركة",
        },
        subtitle: { en: "", id: "", ar: "" },
        items: [
          {
            en: "A dedicated Parent Portal to track bills, grades, and disciplinary records.",
            id: "Portal Orang Tua khusus untuk melacak tagihan, nilai, dan catatan kedisiplinan.",
            ar: "بوابة مخصصة لأولياء الأمور لتتبع الفواتير والدرجات والسجلات التأديبية.",
          },
          {
            en: "A Student Admission Portal (PPDB) directly linked to the student and finance databases.",
            id: "Portal Penerimaan Siswa (PPDB) yang terhubung langsung ke database siswa dan keuangan.",
            ar: "بوابة قبول الطلاب (PPDB) مرتبطة مباشرة بقواعد بيانات الطلاب والمالية.",
          },
        ],
      },
    ],
  },

  security: {
    title: {
      en: "Data Security & Compliance",
      id: "Keamanan Data & Kepatuhan",
      ar: "أمن البيانات والامتثال",
    },
    subtitle: {
      en: "Protecting the data of hundreds of students and teachers is our absolute priority. We implement corporate-grade security standards:",
      id: "Melindungi data ratusan siswa dan guru adalah prioritas mutlak kami. Kami menerapkan standar keamanan setara korporasi:",
      ar: "تعد حماية بيانات مئات الطلاب والمعلمين أولويتنا المطلقة. نحن نطبق معايير أمان على مستوى الشركات:",
    },
    items: [
      {
        title: {
          en: "Role-Based Access Control (RBAC)",
          id: "Kontrol Akses Berbasis Peran (RBAC)",
          ar: "التحكم في الوصول القائم على الدور (RBAC)",
        },
        desc: {
          en: "Strict access rights. Teachers only see their classes, finance admins cannot alter grades, and the board has full visibility.",
          id: "Hak akses ketat. Guru hanya melihat kelas mereka, admin keuangan tidak dapat mengubah nilai, dan dewan memiliki visibilitas penuh.",
          ar: "حقوق وصول صارمة. يرى المعلمون فصولهم فقط، ولا يمكن لمسؤولي الشؤون المالية تغيير الدرجات، والمجلس لديه رؤية كاملة.",
        },
      },
      {
        title: {
          en: "Data Privacy Compliance",
          id: "Kepatuhan Privasi Data",
          ar: "الامتثال لخصوصية البيانات",
        },
        desc: {
          en: "An architecture designed in alignment with data protection regulations.",
          id: "Arsitektur yang dirancang selaras dengan regulasi perlindungan data.",
          ar: "بنية مصممة بما يتماشى مع لوائح حماية البيانات.",
        },
      },
      {
        title: {
          en: "Automated Backups",
          id: "Pencadangan Otomatis",
          ar: "النسخ الاحتياطي التلقائي",
        },
        desc: {
          en: "Routine cloud-based backups to ensure zero data loss from hardware failure or human error.",
          id: "Pencadangan rutin berbasis cloud untuk memastikan tidak ada kehilangan data akibat kerusakan perangkat keras atau kesalahan manusia.",
          ar: "نسخ احتياطي روتيني قائم على السحابة لضمان عدم فقدان أي بيانات بسبب فشل الأجهزة أو الخطأ البشري.",
        },
      },
    ],
  },

  implementation: {
    title: {
      en: "Implementation & Governance",
      id: "Implementasi & Tata Kelola",
      ar: "التنفيذ والحوكمة",
    },
    desc: {
      en: "The success of an IT project lies in its execution, not just the code. To guarantee that teachers and staff actually adopt the new system, we do not leave the project until the system becomes the new working culture for your institution.",
      id: "Keberhasilan proyek TI terletak pada eksekusinya, bukan hanya kodenya. Untuk menjamin guru dan staf benar-benar mengadopsi sistem baru, kami tidak meninggalkan proyek sampai sistem tersebut menjadi budaya kerja baru di institusi Anda.",
      ar: "يكمن نجاح أي مشروع تكنولوجيا معلومات في تنفيذه، وليس فقط الكود. لضمان أن المعلمين والموظفين يعتمدون النظام الجديد بالفعل، فإننا لا نترك المشروع حتى يصبح النظام ثقافة العمل الجديدة لمؤسستك.",
    },
    items: [
      {
        title: { en: "PMO Standards", id: "Standar PMO", ar: "معايير مكتب إدارة المشاريع (PMO)" },
        desc: {
          en: "Strict Project Management Office discipline to control scope, timeline, and budget.",
          id: "Disiplin ketat Project Management Office untuk mengendalikan ruang lingkup, jadwal, dan anggaran.",
          ar: "انضباط صارم لمكتب إدارة المشاريع للتحكم في النطاق والجدول الزمني والميزانية.",
        },
      },
      {
        title: { en: "Agile Framework", id: "Kerangka Kerja Agile", ar: "إطار عمل أجايل (Agile)" },
        desc: {
          en: "Iterative sprints so you see progress every 2 weeks, not after 12 months.",
          id: "Sprint iteratif agar Anda melihat kemajuan setiap 2 minggu, bukan setelah 12 bulan.",
          ar: "فترات تطوير متكررة لتتمكن من رؤية التقدم كل أسبوعين، وليس بعد 12 شهرًا.",
        },
      },
      {
        title: { en: "4DX Methodology", id: "Metodologi 4DX", ar: "منهجية 4DX" },
        desc: {
          en: "The 4 Disciplines of Execution integrated into change management for real adoption.",
          id: "4 Disiplin Eksekusi yang terintegrasi ke dalam manajemen perubahan untuk adopsi nyata.",
          ar: "4 تخصصات للتنفيذ مدمجة في إدارة التغيير من أجل تبني حقيقي.",
        },
      },
      {
        title: {
          en: "Change Management",
          id: "Manajemen Perubahan",
          ar: "إدارة التغيير",
        },
        desc: {
          en: "Dedicated training and cultural onboarding so the system becomes daily habit.",
          id: "Pelatihan khusus dan onboarding budaya agar sistem menjadi kebiasaan sehari-hari.",
          ar: "تدريب مخصص وتأهيل ثقافي ليصبح النظام عادة يومية.",
        },
      },
    ],
  },

  timeline: {
    title: {
      en: "Timeline & Modular Roadmap",
      id: "Jadwal & Peta Jalan Modular",
      ar: "الجدول الزمني وخارطة الطريق النمطية",
    },
    subtitle: {
      en: 'We avoid the rigid "wait a year to see results" approach. Through Agile delivery, your foundation will experience tangible operational benefits in structured phases:',
      id: 'Kami menghindari pendekatan kaku "tunggu setahun untuk melihat hasil". Melalui penyampaian Agile, yayasan Anda akan merasakan manfaat operasional nyata dalam fase-fase terstruktur:',
      ar: 'نحن نتجنب النهج الصارم المتمثل في "الانتظار لمدة عام لرؤية النتائج". من خلال التسليم السريع، ستختبر مؤسستك فوائد تشغيلية ملموسة في مراحل منظمة:',
    },
    phases: [
      {
        phase: { en: "Phase 1", id: "Fase 1", ar: "المرحلة الأولى" },
        label: { en: "Foundation", id: "Fondasi", ar: "التأسيس" },
        items: {
          en: ["UI/UX Design", "Centralized Database Setup", "Admission Module"],
          id: ["Desain UI/UX", "Pengaturan Database Terpusat", "Modul Penerimaan"],
          ar: ["تصميم واجهة المستخدم/تجربة المستخدم", "إعداد قاعدة البيانات المركزية", "وحدة القبول"],
        },
      },
      {
        phase: { en: "Phase 2", id: "Fase 2", ar: "المرحلة الثانية" },
        label: { en: "Operational", id: "Operasional", ar: "التشغيل" },
        items: {
          en: ["HRIS", "Tuition Billing", "POS Modules"],
          id: ["HRIS", "Penagihan SPP", "Modul POS"],
          ar: ["نظام الموارد البشرية", "فواتير الرسوم الدراسية", "وحدات نقاط البيع"],
        },
      },
      {
        phase: { en: "Phase 3", id: "Fase 3", ar: "المرحلة الثالثة" },
        label: {
          en: "Academic & Go-Live",
          id: "Akademik & Go-Live",
          ar: "الأكاديمية والانطلاق",
        },
        items: {
          en: [
            "Grading System Rollout",
            "LMS",
            "Parent Portal",
            "Executive Dashboard Full Activation",
          ],
          id: [
            "Peluncuran Sistem Penilaian",
            "LMS",
            "Portal Orang Tua",
            "Aktivasi Penuh Dashboard Eksekutif",
          ],
          ar: [
            "طرح نظام الدرجات",
            "نظام إدارة التعلم",
            "بوابة أولياء الأمور",
            "التفعيل الكامل للوحة القيادة التنفيذية",
          ],
        },
      },
    ],
  },

  training: {
    title: {
      en: "Training, SLA & Managed Service",
      id: "Pelatihan, SLA & Layanan Terkelola",
      ar: "التدريب واتفاقية مستوى الخدمة والخدمات المدارة",
    },
    subtitle: {
      en: "PT Shifr Asia Inovasi is committed to being a long-term strategic partner:",
      id: "PT Shifr Asia Inovasi berkomitmen menjadi mitra strategis jangka panjang:",
      ar: "تلتزم PT Shifr Asia Inovasi بأن تكون شريكًا استراتيجيًا طويل الأجل:",
    },
    items: [
      {
        title: {
          en: "Capacity Building",
          id: "Peningkatan Kapasitas",
          ar: "بناء القدرات",
        },
        desc: {
          en: "Comprehensive training for Super Users (admins) and daily users (teachers/staff).",
          id: "Pelatihan komprehensif untuk Super User (admin) dan pengguna harian (guru/staf).",
          ar: "تدريب شامل للمستخدمين المتميزين (المسؤولين) والمستخدمين اليوميين (المعلمين/الموظفين).",
        },
      },
      {
        title: {
          en: "SLA & Bug Fixing",
          id: "SLA & Perbaikan Bug",
          ar: "اتفاقية مستوى الخدمة وإصلاح الأخطاء",
        },
        desc: {
          en: "Guaranteed system repairs to ensure optimal operational uptime.",
          id: "Perbaikan sistem yang dijamin untuk memastikan waktu operasional yang optimal.",
          ar: "إصلاحات مضمونة للنظام لضمان وقت تشغيل مثالي للعمليات.",
        },
      },
      {
        title: {
          en: "Managed Service (Optional)",
          id: "Layanan Terkelola (Opsional)",
          ar: "الخدمة المدارة (اختياري)",
        },
        desc: {
          en: "Ongoing server maintenance, cloud management, and a technical helpdesk so your team can focus on education, not IT troubleshooting.",
          id: "Pemeliharaan server berkelanjutan, manajemen cloud, dan helpdesk teknis agar tim Anda dapat fokus pada pendidikan, bukan pemecahan masalah TI.",
          ar: "صيانة مستمرة للخادم، وإدارة السحابة، ومكتب مساعدة فني حتى يتمكن فريقك من التركيز على التعليم، وليس استكشاف أخطاء تكنولوجيا المعلومات.",
        },
      },
    ],
  },

  trackRecord: {
    title: {
      en: "Proven Track Record",
      id: "Rekam Jejak Terbukti",
      ar: "سجل حافل بالنجاح",
    },
    badge: { en: "Case Study", id: "Studi Kasus", ar: "دراسة حالة" },
    cases: [
      {
        title: {
          en: "Al-Fatih Pilar Peradaban",
          id: "Al-Fatih Pilar Peradaban",
          ar: "Al-Fatih Pilar Peradaban",
        },
        desc: {
          en: "PT Shifr was brought in to rescue a stalled IT project that had been stuck in development for four years. We restructured their IT Blueprint and successfully pushed the system to go live during the peak of the pandemic. Today, the digital ecosystem we built is actively used by over 8,000 users (parents, teachers, and management) across 36 locations nationwide. This became the official technology roadmap for the central foundation, 34 primary education branches, and 2 secondary school campuses.",
          id: "PT Shifr didatangkan untuk menyelamatkan proyek TI yang mandek selama empat tahun pengembangan. Kami merestrukturisasi Cetak Biru TI mereka dan berhasil mendorong sistem untuk go live pada puncak pandemi. Saat ini, ekosistem digital yang kami bangun secara aktif digunakan oleh lebih dari 8.000 pengguna (orang tua, guru, dan manajemen) di 36 lokasi se-Indonesia. Ini menjadi peta jalan teknologi resmi untuk yayasan pusat, 34 cabang pendidikan dasar, dan 2 kampus sekolah menengah.",
          ar: "تم الاستعانة بـ PT Shifr لإنقاذ مشروع تكنولوجيا معلومات متوقف كان عالقًا في التطوير لمدة أربع سنوات. قمنا بإعادة هيكلة مخطط تكنولوجيا المعلومات الخاص بهم ودفعنا النظام بنجاح إلى البث المباشر خلال ذروة الوباء. اليوم، يتم استخدام النظام البيئي الرقمي الذي قمنا ببنائه بنشاط من قبل أكثر من 8000 مستخدم (أولياء الأمور والمعلمين والإدارة) في 36 موقعًا على الصعيد الوطني. أصبح هذا هو خارطة طريق التكنولوجيا الرسمية للمؤسسة المركزية، و 34 فرعًا للتعليم الابتدائي، وحرمين مدرسيين ثانويين.",
        },
        stats: [
          {
            value: "8,000+",
            label: { en: "Active Users", id: "Pengguna Aktif", ar: "مستخدمين نشطين" },
          },
          { value: "36", label: { en: "Locations", id: "Lokasi", ar: "موقعًا" } },
          {
            value: "34",
            label: {
              en: "Primary Education Branches",
              id: "Cabang Pendidikan Dasar",
              ar: "فرع للتعليم الابتدائي",
            },
          },
          {
            value: "2",
            label: {
              en: "Secondary School Campuses",
              id: "Kampus Sekolah Menengah",
              ar: "حرم مدرسة ثانوية",
            },
          },
        ],
      },
      {
        title: {
          en: "Asy-Syuuraa Batam",
          id: "Asy-Syuuraa Batam",
          ar: "Asy-Syuuraa Batam",
        },
        subtitle: {
          en: "Holistic Institutional Transformation",
          id: "Transformasi Institusional Holistik",
          ar: "تحول مؤسسي شامل",
        },
        desc: {
          en: "For Asy Syuuraa Batam, we led a complete organizational turnaround that bridged technology, human resources, and commercial viability. Our strategic interventions included:",
          id: "Untuk Asy Syuuraa Batam, kami memimpin transformasi organisasi menyeluruh yang menjembatani teknologi, sumber daya manusia, dan kelayakan komersial. Intervensi strategis kami meliputi:",
          ar: "بالنسبة لأسى الشورى باتام، قمنا بقيادة تحول تنظيمي كامل يربط بين التكنولوجيا والموارد البشرية والجدوى التجارية. شملت تدخلاتنا الاستراتيجية:",
        },
        cards: [
          {
            title: {
              en: "Commercial & Welfare Optimization",
              id: "Optimalisasi Komersial & Kesejahteraan",
              ar: "التحسين التجاري والرفاهية"
            },
            desc: {
              en: "Restructured the foundation's business units into measurable, profit-generating ventures, which directly improved the financial welfare of the teaching staff.",
              id: "Merestrukturisasi unit bisnis yayasan menjadi usaha terukur yang menghasilkan keuntungan, yang secara langsung meningkatkan kesejahteraan finansial tenaga pengajar.",
              ar: "إعادة هيكلة وحدات أعمال المؤسسة إلى مشاريع قابلة للقياس ومدرة للربح، مما أدى بشكل مباشر إلى تحسين الرفاهية المالية لهيئة التدريس."
            }
          },
          {
            title: {
              en: "Digital Branding & Engagement",
              id: "Branding & Keterlibatan Digital",
              ar: "العلامة التجارية الرقمية والمشاركة"
            },
            desc: {
              en: "Revamped the institution's social media management and digital presence to strengthen public trust and brand positioning.",
              id: "Memperbarui manajemen media sosial dan kehadiran digital institusi untuk memperkuat kepercayaan publik dan posisi merek.",
              ar: "تجديد إدارة وسائل التواصل الاجتماعي والحضور الرقمي للمؤسسة لتعزيز ثقة الجمهور ومكانة العلامة التجارية."
            }
          },
          {
            title: {
              en: "Resources Upgrading",
              id: "Peningkatan Sumber Daya",
              ar: "الارتقاء بالموارد"
            },
            desc: {
              en: "Elevated the overall quality of human resources and foundation staff through targeted management restructuring and regular training.",
              id: "Meningkatkan kualitas sumber daya manusia dan staf yayasan secara keseluruhan melalui restrukturisasi manajemen yang ditargetkan dan pelatihan rutin.",
              ar: "رفع مستوى الجودة الشاملة للموارد البشرية وموظفي المؤسسة من خلال إعادة الهيكلة الإدارية المستهدفة والتدريب المنتظم."
            }
          },
          {
            title: {
              en: "System Integration",
              id: "Integrasi Sistem",
              ar: "تكامل النظام"
            },
            desc: {
              en: "Designed and deployed a fully integrated information system to serve as the secure backbone for this newly optimized management structure.",
              id: "Merancang dan menerapkan sistem informasi yang terintegrasi penuh sebagai tulang punggung yang aman untuk struktur manajemen yang baru dioptimalkan ini.",
              ar: "تصميم ونشر نظام معلومات متكامل تمامًا ليكون بمثابة العمود الفقري الآمن لهيكل الإدارة المحسن حديثًا."
            }
          }
        ]
      }
    ],
  },

  investment: {
    title: {
      en: "Investment & Commercials",
      id: "Investasi & Komersial",
      ar: "الاستثمار والجوانب التجارية",
    },
    subtitle: {
      en: "To ensure transparency and accommodate your foundation's cash flow, our pricing structure is divided into two parts:",
      id: "Untuk memastikan transparansi dan mengakomodasi arus kas yayasan Anda, struktur harga kami dibagi menjadi dua bagian:",
      ar: "لضمان الشفافية واستيعاب التدفق النقدي لمؤسستك، ينقسم هيكل التسعير لدينا إلى جزأين:",
    },
    capex: {
      title: {
        en: "Capital Expenditure (CAPEX)",
        id: "Belanja Modal (CAPEX)",
        ar: "النفقات الرأسمالية (CAPEX)",
      },
      desc: {
        en: "The cost of architectural development and software modules (billed according to phase milestones).",
        id: "Biaya pengembangan arsitektur dan modul perangkat lunak (ditagih sesuai pencapaian fase).",
        ar: "تكلفة التطوير المعماري ووحدات البرامج (يتم تحصيلها وفقًا للمعالم الرئيسية للمرحلة).",
      },
    },
    opex: {
      title: {
        en: "Operational Expenditure (OPEX)",
        id: "Belanja Operasional (OPEX)",
        ar: "النفقات التشغيلية (OPEX)",
      },
      desc: {
        en: "The post-launch monthly subscription for cloud hosting infrastructure and Managed Services.",
        id: "Langganan bulanan pasca-peluncuran untuk infrastruktur hosting cloud dan Layanan Terkelola.",
        ar: "الاشتراك الشهري بعد الإطلاق في البنية التحتية للاستضافة السحابية والخدمات المدارة.",
      },
    },
    note: {
      en: "(A detailed commercial breakdown will be provided in a separate document once the final scope is agreed upon).",
      id: "(Rincian komersial terperinci akan disediakan dalam dokumen terpisah setelah ruang lingkup akhir disepakati).",
      ar: "(سيتم تقديم تفصيل تجاري دقيق في مستند منفصل بمجرد الاتفاق على النطاق النهائي).",
    },
  },

  nextSteps: {
    title: { en: "Next Steps", id: "Langkah Selanjutnya", ar: "الخطوات التالية" },
    subtitle: {
      en: "To initiate this operational transformation, we propose the following steps:",
      id: "Untuk memulai transformasi operasional ini, kami mengusulkan langkah-langkah berikut:",
      ar: "لبدء هذا التحول التشغيلي، نقترح الخطوات التالية:",
    },
    steps: [
      {
        title: {
          en: "Alignment Kick-Off",
          id: "Pertemuan Awal Penyelarasan",
          ar: "الاجتماع التمهيدي للمحاذاة",
        },
        desc: {
          en: "A brief meeting to identify the most urgent module priorities for this academic year.",
          id: "Pertemuan singkat untuk mengidentifikasi prioritas modul paling mendesak untuk tahun ajaran ini.",
          ar: "اجتماع موجز لتحديد أولويات الوحدة الأكثر إلحاحًا للعام الدراسي الحالي.",
        },
      },
      {
        title: {
          en: "Contract Signing (NDA/PKS)",
          id: "Penandatanganan Kontrak (NDA/PKS)",
          ar: "توقيع العقد (NDA/PKS)",
        },
        desc: {
          en: "Formalizing the scope of work and execution timeline.",
          id: "Memformalisasi ruang lingkup pekerjaan dan jadwal pelaksanaan.",
          ar: "إضفاء الطابع الرسمي على نطاق العمل والجدول الزمني للتنفيذ.",
        },
      },
      {
        title: {
          en: "IT Blueprint Audit",
          id: "Audit Cetak Biru TI",
          ar: "تدقيق مخطط تكنولوجيا المعلومات",
        },
        desc: {
          en: "Our team will begin mapping out your actual day-to-day business processes.",
          id: "Tim kami akan mulai memetakan proses bisnis sehari-hari Anda yang sesungguhnya.",
          ar: "سيبدأ فريقنا في تخطيط عمليات عملك اليومية الفعلية.",
        },
      },
    ],
  },

  cta: {
    title: {
      en: "Let's Build Your\nDigital Ecosystem",
      id: "Mari Bangun\nEkosistem Digital Anda",
      ar: "دعنا نبني\nنظامك البيئي الرقمي",
    },
    subtitle: {
      en: "Please reach out to schedule your Alignment Kick-Off:",
      id: "Silakan hubungi kami untuk menjadwalkan Pertemuan Awal Penyelarasan:",
      ar: "يرجى التواصل لتحديد موعد الاجتماع التمهيدي:",
    },
    contactName: "Ardi",
    contactRole: {
      en: "Education Transformation Advisor",
      id: "Penasihat Transformasi Pendidikan",
      ar: "مستشار تحول التعليم",
    },
    contactCompany: "PT Shifr Asia Inovasi",
    email: "solutions@shifr.asia",
    phone: "+62 856 1758 523",
    phoneLink: "https://wa.me/628561758523",
  },

  footer: {
    copyright: {
      en: `© ${new Date().getFullYear()} PT Shifr Asia Inovasi. All rights reserved.`,
      id: `© ${new Date().getFullYear()} PT Shifr Asia Inovasi. Hak cipta dilindungi undang-undang.`,
      ar: `© ${new Date().getFullYear()} PT Shifr Asia Inovasi. جميع الحقوق محفوظة.`,
    },
    visitSite: {
      en: "Visit shifr.asia",
      id: "Kunjungi shifr.asia",
      ar: "زيارة shifr.asia",
    },
  },
};
