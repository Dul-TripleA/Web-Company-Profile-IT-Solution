<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Do It - Modern Digital Solutions</title>

    <!-- Google Fonts: Plus Jakarta Sans / Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (Vite) -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
    </style>
</head>

<body class="bg-[#fcfbf7] text-slate-800 antialiased selection:bg-[#99e344] selection:text-black">

    <!-- Top Info Bar (Tambahkan id="top-bar" dan z-index) -->
    <div id="top-bar" class="relative z-50 bg-[#99e344] text-[#0d2e28] text-xs font-semibold py-2 px-4 sm:px-8 transition-all duration-300">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <div class="flex items-center gap-6">
                <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    We are one of the best software houses in Indonesia.
                </span>
                <span class="flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    example@doit.com
                </span>
            </div>
            <div class="flex items-center gap-4 text-xs font-bold">
                <span>Follow Us —</span>
                <a href="#" class="hover:opacity-75 transition">f</a>
                <a href="#" class="hover:opacity-75 transition">𝕏</a>
                <a href="#" class="hover:opacity-75 transition">ig</a>
                <a href="#" class="hover:opacity-75 transition">🌐</a>
            </div>
        </div>
    </div>

    <!-- Hero Section with Dark Green Theme -->
    <!-- Header dimulai di bawah top bar, transparan, dengan transisi halus 500ms -->
    <header id="main-header" class="fixed left-0 w-full z-40 bg-transparent text-white transition-all duration-500 ease-in-out">
        <!-- Navigation -->
        <nav class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between transition-all duration-500">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-[#99e344] flex items-center justify-center text-[#0b2923]">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span class="text-2xl font-bold tracking-tight">Do It</span>
            </div>

            <ul class="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-200">
                <!-- Home (Active) -->
                <li>
                    <a href="#" class="text-[#99e344] transition-colors duration-200">Home</a>
                </li>

                <!-- About Us -->
                <li>
                    <a href="#" class="relative py-1 transition-colors duration-200 hover:text-[#99e344] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#99e344] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
                        About Us
                    </a>
                </li>

                <!-- Pages (Dropdown Trigger) -->
                <li class="group flex items-center gap-1.5 cursor-pointer py-1 transition-colors duration-200 hover:text-[#99e344]">
                    <span>Pages</span>
                    <svg class="w-3.5 h-3.5 opacity-70 transition-all duration-300 group-hover:rotate-180 group-hover:text-[#99e344] group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </li>

                <!-- Services (Dropdown Trigger) -->
                <li class="group flex items-center gap-1.5 cursor-pointer py-1 transition-colors duration-200 hover:text-[#99e344]">
                    <span>Services</span>
                    <svg class="w-3.5 h-3.5 opacity-70 transition-all duration-300 group-hover:rotate-180 group-hover:text-[#99e344] group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </li>

                <!-- Blog (Dropdown Trigger) -->
                <li class="group flex items-center gap-1.5 cursor-pointer py-1 transition-colors duration-200 hover:text-[#99e344]">
                    <span>Blog</span>
                    <svg class="w-3.5 h-3.5 opacity-70 transition-all duration-300 group-hover:rotate-180 group-hover:text-[#99e344] group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </li>

                <!-- Contact -->
                <li>
                    <a href="#" class="relative py-1 transition-colors duration-200 hover:text-[#99e344] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#99e344] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300">
                        Contact
                    </a>
                </li>
            </ul>

            <div>
                <a href="#appointment" class="group inline-flex items-center gap-2 bg-[#99e344] hover:bg-[#a8f553] text-[#0b2923] text-xs font-bold py-2.5 px-5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(153,227,68,0.35)] active:translate-y-0">
                    <span>Free Consultation</span>
                    <span class="relative inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b2923] text-[#99e344] transition-colors duration-300">
                        <!-- Panah Utama -->
                        <svg class="h-2.5 w-2.5 stroke-current transition-transform duration-300 ease-in-out group-hover:translate-x-4" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        <!-- Panah Masuk Saat Hover -->
                        <svg class="absolute h-2.5 w-2.5 -translate-x-4 stroke-current transition-transform duration-300 ease-in-out group-hover:translate-x-0" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </span>
                </a>
            </div>
        </nav>
    </header>

    <!-- Hero Container Utama -->
    <section class="relative min-h-[600px] lg:h-[750px] w-full flex items-center overflow-hidden bg-[#0b2923]">

        <!-- Gambar Latar Belakang -->
        <div class="absolute inset-0 w-full h-full z-0">
            <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=85"
                alt="Hero Background"
                class="w-full h-full object-cover object-right">
        </div>

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0b2923] via-[#0b2923] via-[45%] to-transparent"></div>

        <!-- Kandungan Hero -->
        <div class="relative z-20 w-full px-6 sm:px-12 lg:pl-16 xl:pl-24 py-16 pt-36 sm:py-24 sm:pt-44 flex items-center">

            <!-- Bahagian Teks & Butang -->
            <div class="w-full space-y-6 text-left">
                <!-- Review Badge -->
                <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs text-white">
                    <span class="font-bold">4.9</span>
                    <div class="flex text-[#99e344]">★★★★★</div>
                    <span class="text-slate-300">5K+ Reviews</span>
                </div>

                <!-- Tajuk Utama -->
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] uppercase text-white">
                    Modern Digital Solutions <br> For <span class="text-[#99e344]">Your Growth Business</span>
                </h1>

                <!-- Penerangan Ringkas -->
                <p class="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                    <span class="text-[#99e344] font-bold">Do It Solutions </span> is a software house that provides modern technology solutions to address your business challenges. Through our website development services, we help businesses across Indonesia undergo digital transformation, enabling them to grow more optimally.
                </p>

                <!-- Butang Aksi & Hubungi -->
                <div class="flex flex-wrap items-center gap-4 pt-2">
                    <a href="#appointment" class="group inline-flex items-center gap-2 bg-[#99e344] hover:bg-[#a8f553] text-[#0b2923] text-xs font-bold py-2.5 px-5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(153,227,68,0.35)] active:translate-y-0">
                        <span>Free Consultation</span>
                        <span class="relative inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b2923] text-[#99e344] transition-colors duration-300">
                            <!-- Panah Utama -->
                            <svg class="h-2.5 w-2.5 stroke-current transition-transform duration-300 ease-in-out group-hover:translate-x-4" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                            <!-- Panah Masuk Saat Hover -->
                            <svg class="absolute h-2.5 w-2.5 -translate-x-4 stroke-current transition-transform duration-300 ease-in-out group-hover:translate-x-0" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </span>
                    </a>

                    <div class="flex items-center gap-3 pl-2">
                        <div class="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-[#99e344]">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 4V3z" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-[10px] block uppercase tracking-wider text-slate-300/80 font-semibold">Call Us</span>
                            <span class="text-xs font-bold text-white">+62851 1053 0560</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </section>


    <!-- Section 2: Essential Features -->
    <section class="max-w-7xl mx-auto px-6 py-20">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <span class="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                    <span class="text-emerald-700">✱</span> Our Approach
                </span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0b2923] tracking-tight mt-2">
                    Digital Systems Built to Align with Your Actual Business Processes
                </h2>
            </div>
            <p class="text-xs text-slate-500 max-w-xs leading-relaxed">
                We provide modern digital solutions through software engineering, process automation, and intuitive interfaces to enhance efficiency and accelerate your business operations.
            </p>
        </div>

        <!-- Container Layout Rasio 8:4 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            <!-- Kolom Kiri: Rasio 8 (Kartu Utama Aplikasi Web & Sistem Kustom) -->
            <div class="lg:col-span-8 rounded-3xl border border-emerald-900/60 bg-[#071d18] p-8 sm:p-10 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-emerald-800/80">
                <div>
                    <!-- Top Badge Pill -->
                    <div class="mb-6">
                        <span class="inline-flex items-center rounded-xl border border-[#99e344]/30 bg-[#99e344]/10 px-3.5 py-1.5 text-xs font-semibold text-[#99e344] backdrop-blur-sm">
                            Cloud & SaaS Ready
                        </span>
                    </div>

                    <!-- Title & Description -->
                    <div class="space-y-4">
                        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#99e344]">
                            Web Apps & Custom Systems
                        </h2>
                        <p class="max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
                            Building operational portals, document management systems, and high-speed API integrations that safeguard against data leaks and handle thousands of daily transactions seamlessly.
                        </p>
                    </div>

                    <!-- 3 Sub-Feature Mini Cards (Grid 3 Kolom) -->
                    <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <!-- Feature 1 -->
                        <div class="rounded-2xl border border-emerald-900/50 bg-[#0b2923]/70 p-4 transition-all duration-300 hover:border-[#99e344]/40 hover:bg-[#0b2923]">
                            <div class="flex items-center gap-2">
                                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#99e344]/20 text-[#99e344]">
                                    <svg class="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 class="text-sm font-semibold text-white">API-First</h4>
                            </div>
                            <p class="mt-2 text-xs text-slate-300/80 pl-7 leading-relaxed">
                                Seamless cross-system connectivity
                            </p>
                        </div>

                        <!-- Feature 2 -->
                        <div class="rounded-2xl border border-emerald-900/50 bg-[#0b2923]/70 p-4 transition-all duration-300 hover:border-[#99e344]/40 hover:bg-[#0b2923]">
                            <div class="flex items-center gap-2">
                                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#99e344]/20 text-[#99e344]">
                                    <svg class="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 class="text-sm font-semibold text-white">Lightning Fast</h4>
                            </div>
                            <p class="mt-2 text-xs text-slate-300/80 pl-7 leading-relaxed">
                                Zero-lag data access
                            </p>
                        </div>

                        <!-- Feature 3 -->
                        <div class="rounded-2xl border border-emerald-900/50 bg-[#0b2923]/70 p-4 transition-all duration-300 hover:border-[#99e344]/40 hover:bg-[#0b2923]">
                            <div class="flex items-center gap-2">
                                <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#99e344]/20 text-[#99e344]">
                                    <svg class="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4 class="text-sm font-semibold text-white">Multi-Platform</h4>
                            </div>
                            <p class="mt-2 text-xs text-slate-300/80 pl-7 leading-relaxed">
                                Responsive on desktop & mobile
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <!-- Divider Line -->
                    <div class="mt-8 border-t border-emerald-900/60"></div>

                    <!-- Bottom Action Link -->
                    <div class="mt-6 flex items-center justify-between">
                        <a href="#" class="group inline-flex items-center gap-2 text-sm font-bold text-[#99e344] transition-all duration-200 hover:text-[#b4f268]">
                            <span>Explore Web Apps</span>
                            <svg class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Kolom Kanan: Rasio 4 (Memuat 2 Card Bertumpuk) -->
            <div class="lg:col-span-4 flex gap-6">

                <!-- Card Atas (Lime Accent) -->
                <div class="h-full bg-[#99e344] p-8 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col justify-between text-[#0b2923] relative overflow-hidden">
                    <div class="relative z-10 space-y-4">
                        <!-- Badge Pill -->
                        <div>
                            <span class="inline-flex items-center rounded-xl bg-[#0b2923]/10 px-3 py-1 text-xs font-semibold text-[#0b2923] backdrop-blur-sm">
                                Operational Efficiency
                            </span>
                        </div>

                        <!-- Title & Description -->
                        <div>
                            <h3 class="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0b2923] mb-2">
                                Management Systems & ERP
                            </h3>
                            <p class="text-xs sm:text-sm text-[#0b2923]/80 leading-relaxed font-medium">
                                Centralize inventory control, sales data, transaction logging, and team coordination into a single, easy-to-monitor analytics dashboard.
                            </p>
                        </div>

                        <!-- Feature Checklist -->
                        <ul class="space-y-2 pt-2">
                            <li class="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#0b2923]">
                                <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                                    <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Eliminate manual recaps and calculation errors</span>
                            </li>
                            <li class="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#0b2923]">
                                <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                                    <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Automated operational and financial reporting</span>
                            </li>
                            <li class="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#0b2923]">
                                <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                                    <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Multi-tiered permission access control by division</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Bottom Action & Subtext -->
                    <div class="relative z-10 pt-6">
                        <div class="border-t border-[#0b2923]/15 mb-4"></div>
                        <div class="flex items-center justify-between gap-2">
                            <span class="text-xs font-semibold text-[#0b2923]/70">
                                POS, Inventory & Custom ERP Solutions
                            </span>
                            <a href="#" class="group inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0b2923] hover:underline">
                                <span>View Features</span>
                                <svg class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <!-- Elemen Dekorasi Cahaya -->
                    <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-white/25 rounded-full blur-xl pointer-events-none"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 3: Comprehensive Solution -->
    <section class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left Side Media Grid -->
            <div class="lg:col-span-6 grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                        alt="Team Meeting"
                        class="rounded-3xl w-full h-56 object-cover shadow-sm">
                </div>
                <!-- Stat Card 10K+ -->
                <div class="bg-[#99e344] p-6 rounded-3xl flex flex-col justify-between">
                    <div class="w-7 h-7 bg-[#0b2923] text-[#99e344] rounded-full flex items-center justify-center text-xs">
                        ✓
                    </div>
                    <div>
                        <span class="text-2xl font-black text-[#0b2923] block mt-4">10K+</span>
                        <p class="text-[11px] font-semibold text-[#0b2923]/80 leading-tight mt-1">Our Total Completed Works</p>
                    </div>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
                        alt="Collaboration"
                        class="rounded-3xl w-full h-full min-h-[140px] object-cover shadow-sm">
                </div>
            </div>

            <!-- Right Side Details (Layout Mirip Sisi Kiri Gambar dengan Tema Warna Hijau Biztop) -->
            <div class="lg:col-span-6 space-y-8">

                <!-- Header Content: Badge, Heading & Paragraph -->
                <div class="space-y-4">
                    <span class="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                        <span class="text-emerald-700">✱</span> WHY CHOSE US
                    </span>

                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b2923] tracking-tight leading-[1.15]">
                        Building Digital Solutions That Drive <span class="text-[#84cb32] underline decoration-[#99e344]/40 underline-offset-8">Real Impact</span>
                    </h2>

                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                        Trusted by government agencies, private enterprises, and leading institutions across multiple regions to deliver innovative, secure, and highly scalable digital solutions.
                    </p>
                </div>

                <!-- 4 Stats Counter Row (Horizontal Flow) -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-emerald-950/10">
                    <!-- Stat 1 -->
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#99e344]/25 text-[#0b2923]">
                            <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-base font-black text-[#0b2923] block leading-none">100+</span>
                            <span class="text-[11px] font-semibold text-slate-500">Clients</span>
                        </div>
                    </div>

                    <!-- Stat 2 -->
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#99e344]/25 text-[#0b2923]">
                            <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-base font-black text-[#0b2923] block leading-none">12+</span>
                            <span class="text-[11px] font-semibold text-slate-500">Regions</span>
                        </div>
                    </div>

                    <!-- Stat 3 -->
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#99e344]/25 text-[#0b2923]">
                            <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-base font-black text-[#0b2923] block leading-none">200+</span>
                            <span class="text-[11px] font-semibold text-slate-500">Projects</span>
                        </div>
                    </div>

                    <!-- Stat 4 -->
                    <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#99e344]/25 text-[#0b2923]">
                            <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-base font-black text-[#0b2923] block leading-none">98%</span>
                            <span class="text-[11px] font-semibold text-slate-500">Satisfaction</span>
                        </div>
                    </div>
                </div>

                <!-- Value Propositions (Grid Checklist 2 Kolom) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    <div class="flex items-center gap-2.5">
                        <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                            <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-800">Government & Private Expertise</span>
                    </div>

                    <div class="flex items-center gap-2.5">
                        <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                            <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-800">Dedicated Support & Maintenance</span>
                    </div>

                    <div class="flex items-center gap-2.5">
                        <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                            <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-800">End-to-End Digital Solution</span>
                    </div>

                    <div class="flex items-center gap-2.5">
                        <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                            <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-800">Agile Development Process</span>
                    </div>

                    <div class="flex items-center gap-2.5">
                        <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                            <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-800">Secure & Scalable Architecture</span>
                    </div>

                    <div class="flex items-center gap-2.5">
                        <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                            <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-800">Innovation & Technology Driven</span>
                    </div>
                </div>

                <!-- Dual Action Buttons -->
                <div class="flex flex-wrap items-center gap-4 pt-2">
                    <!-- Primary Action -->
                    <a href="#consultation" class="group inline-flex items-center gap-2.5 bg-[#99e344] hover:bg-[#88d234] text-[#0b2923] text-xs font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                        <span>Schedule Consultation</span>
                        <svg class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>

                    <!-- Secondary Action (Outline) -->
                    <a href="#portfolio" class="group inline-flex items-center gap-2 border border-[#0b2923]/30 hover:border-[#0b2923] bg-transparent hover:bg-[#0b2923]/5 text-[#0b2923] text-xs font-bold py-3 px-6 rounded-full transition-all duration-300">
                        <span>View Our Portfolio</span>
                        <svg class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>

            </div>
        </div>
    </section>

    <!-- Digital Development Services Section -->
    <section id="services" class="relative bg-[#071d18] text-white py-24 px-6 overflow-hidden">
        <!-- Ambient Background Glows -->
        <div class="absolute -top-32 left-1/4 w-96 h-96 bg-[#99e344]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto relative z-10">

            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div class="space-y-3">
                    <span class="text-xs font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                        <span class="text-emerald-700">✱</span> Our Core Service
                    </span>
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Innovative <span class="text-[#99e344]">Digital Solutions</span> For Growing Enterprises
                    </h2>
                </div>
                <p class="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                    Empowering your business with scalable custom web platforms, robust ERP architectures, native-grade mobile apps, and user-centric interfaces.
                </p>
            </div>

            <!-- Row 1: Ratio 8:4 (Custom Web & ERP System) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">

                <!-- 1. Custom Web Applications (Span 8) -->
                <div class="lg:col-span-8 rounded-3xl border border-emerald-900/60 bg-[#0b2923]/80 p-8 sm:p-10 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-[#99e344]/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)]">
                    <div>
                        <!-- Badge -->
                        <div class="mb-6 flex items-center justify-between">
                            <span class="inline-flex items-center rounded-xl border border-[#99e344]/30 bg-[#99e344]/10 px-3.5 py-1.5 text-xs font-semibold text-[#99e344]">
                                High Performance & Scalable
                            </span>
                            <span class="text-xs font-mono text-slate-400">01 / WEB CUSTOM</span>
                        </div>

                        <!-- Title & Description -->
                        <div class="space-y-4">
                            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#99e344]">
                                Custom Web Applications & Portals
                            </h3>
                            <p class="max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
                                Engineering bespoke operational dashboards, customer portals, and distributed web platforms optimized for fast loading speeds, bulletproof data protection, and seamless API integrations.
                            </p>
                        </div>

                        <!-- 3 Micro Features -->
                        <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div class="rounded-2xl border border-emerald-900/50 bg-[#071d18]/70 p-4 transition-all duration-300 hover:border-[#99e344]/40">
                                <div class="flex items-center gap-2">
                                    <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#99e344]/20 text-[#99e344]">
                                        <svg class="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h4 class="text-xs sm:text-sm font-semibold text-white">API-First Design</h4>
                                </div>
                                <p class="mt-2 text-[11px] text-slate-400 pl-7 leading-relaxed">Seamless cross-system & third-party connectivity.</p>
                            </div>

                            <div class="rounded-2xl border border-emerald-900/50 bg-[#071d18]/70 p-4 transition-all duration-300 hover:border-[#99e344]/40">
                                <div class="flex items-center gap-2">
                                    <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#99e344]/20 text-[#99e344]">
                                        <svg class="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h4 class="text-xs sm:text-sm font-semibold text-white">Lightning Fast</h4>
                                </div>
                                <p class="mt-2 text-[11px] text-slate-400 pl-7 leading-relaxed">Sub-second query times with scalable caching.</p>
                            </div>

                            <div class="rounded-2xl border border-emerald-900/50 bg-[#071d18]/70 p-4 transition-all duration-300 hover:border-[#99e344]/40">
                                <div class="flex items-center gap-2">
                                    <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#99e344]/20 text-[#99e344]">
                                        <svg class="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h4 class="text-xs sm:text-sm font-semibold text-white">Multi-Device</h4>
                                </div>
                                <p class="mt-2 text-[11px] text-slate-400 pl-7 leading-relaxed">Pixel-perfect layouts on desktop, tablet, and mobile.</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-6 border-t border-emerald-900/60 flex items-center justify-between">
                        <a href="#contact" class="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#99e344] transition-colors hover:text-[#b4f268]">
                            <span>Explore Custom Web</span>
                            <svg class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                        <span class="text-[11px] text-slate-400">Laravel / Vue / React / Node.js</span>
                    </div>
                </div>

                <!-- 2. System ERP (Span 4 - Lime Highlight) -->
                <div class="lg:col-span-4 rounded-3xl bg-[#99e344] p-8 shadow-sm hover:shadow-xl transition flex flex-col justify-between text-[#0b2923] relative overflow-hidden">
                    <div class="relative z-10 space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center rounded-xl bg-[#0b2923]/10 px-3 py-1 text-xs font-bold text-[#0b2923]">
                                Operational Efficiency
                            </span>
                            <span class="text-xs font-mono font-bold text-[#0b2923]/70">02 / SYSTEM ERP</span>
                        </div>

                        <div>
                            <h3 class="text-2xl font-extrabold tracking-tight text-[#0b2923] mb-2">
                                Management System & ERP
                            </h3>
                            <p class="text-xs sm:text-sm text-[#0b2923]/80 leading-relaxed font-medium">
                                Centralize stock inventory, sales workflows, invoicing, and cross-department collaboration within a unified monitoring dashboard.
                            </p>
                        </div>

                        <ul class="space-y-2 pt-2">
                            <li class="flex items-center gap-2.5 text-xs font-semibold text-[#0b2923]">
                                <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                                    <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Eliminate manual data entries & errors</span>
                            </li>
                            <li class="flex items-center gap-2.5 text-xs font-semibold text-[#0b2923]">
                                <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                                    <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Automated financial & audit reporting</span>
                            </li>
                            <li class="flex items-center gap-2.5 text-xs font-semibold text-[#0b2923]">
                                <div class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0b2923] text-[#99e344]">
                                    <svg class="h-2.5 w-2.5 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>Granular role-based divisional permissions</span>
                            </li>
                        </ul>
                    </div>

                    <div class="relative z-10 pt-6">
                        <div class="border-t border-[#0b2923]/15 mb-4"></div>
                        <div class="flex items-center justify-between">
                            <span class="text-[11px] font-semibold text-[#0b2923]/70">Custom ERP & POS</span>
                            <a href="#contact" class="group inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0b2923] hover:underline">
                                <span>Explore ERP</span>
                                <svg class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-white/25 rounded-full blur-xl pointer-events-none"></div>
                </div>

            </div>

            <!-- Row 2: Equal Ratio 6:6 (Mobile App & UI/UX Design) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                <!-- 3. Mobile App Development -->
                <div class="rounded-3xl border border-emerald-900/60 bg-[#0b2923]/80 p-8 sm:p-10 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-[#99e344]/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)]">
                    <div>
                        <div class="mb-6 flex items-center justify-between">
                            <span class="inline-flex items-center rounded-xl border border-[#99e344]/30 bg-[#99e344]/10 px-3.5 py-1.5 text-xs font-semibold text-[#99e344]">
                                iOS & Android Native Performance
                            </span>
                            <span class="text-xs font-mono text-slate-400">03 / MOBILE APP</span>
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                Mobile App Development
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Crafting high-engagement mobile applications using Flutter and React Native. Built with offline-first synchronization, real-time push messaging, biometric security, and native device hardware utilization.
                            </p>
                        </div>

                        <div class="grid grid-cols-2 gap-3 mt-6">
                            <div class="rounded-2xl border border-emerald-900/50 bg-[#071d18]/70 p-3.5">
                                <span class="text-xs font-bold text-white block">Cross-Platform</span>
                                <span class="text-[11px] text-slate-400">Single codebase for iOS & Android</span>
                            </div>
                            <div class="rounded-2xl border border-emerald-900/50 bg-[#071d18]/70 p-3.5">
                                <span class="text-xs font-bold text-white block">Offline Mode</span>
                                <span class="text-[11px] text-slate-400">Instant local caching & auto-sync</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-6 border-t border-emerald-900/60 flex items-center justify-between">
                        <a href="#contact" class="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#99e344] transition-colors hover:text-[#b4f268]">
                            <span>Discover Mobile Solutions</span>
                            <svg class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                        <span class="text-[11px] text-slate-400">Flutter / React Native / Kotlin</span>
                    </div>
                </div>

                <!-- 4. UI/UX Design & Product Strategy -->
                <div class="rounded-3xl border border-emerald-900/60 bg-[#0b2923]/80 p-8 sm:p-10 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-[#99e344]/40 hover:shadow-[0_10px_30px_rgba(153,227,68,0.1)]">
                    <div>
                        <div class="mb-6 flex items-center justify-between">
                            <span class="inline-flex items-center rounded-xl border border-[#99e344]/30 bg-[#99e344]/10 px-3.5 py-1.5 text-xs font-semibold text-[#99e344]">
                                User-Centric & Interactive
                            </span>
                            <span class="text-xs font-mono text-slate-400">04 / UI UX DESIGN</span>
                        </div>

                        <div class="space-y-4">
                            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                UI/UX Design & Prototyping
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Transforming complex business logic into intuitive user experiences. We deliver end-to-end design systems, wireframing, high-fidelity Figma prototypes, and validated usability testing.
                            </p>
                        </div>

                        <div class="grid grid-cols-2 gap-3 mt-6">
                            <div class="rounded-2xl border border-emerald-900/50 bg-[#071d18]/70 p-3.5">
                                <span class="text-xs font-bold text-white block">Design Systems</span>
                                <span class="text-[11px] text-slate-400">Reusable components & brand kits</span>
                            </div>
                            <div class="rounded-2xl border border-emerald-900/50 bg-[#071d18]/70 p-3.5">
                                <span class="text-xs font-bold text-white block">Interactive Prototypes</span>
                                <span class="text-[11px] text-slate-400">Figma click-through flows</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-6 border-t border-emerald-900/60 flex items-center justify-between">
                        <a href="#contact" class="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#99e344] transition-colors hover:text-[#b4f268]">
                            <span>Explore Design Services</span>
                            <svg class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                        <span class="text-[11px] text-slate-400">Figma / Research / Testing</span>
                    </div>
                </div>

            </div>

        </div>
    </section>

    <!-- Technology Stack Section (Static / No Animation) -->
    <section class="relative bg-white text-slate-900 py-20 overflow-hidden border-t border-slate-200/70">

        <!-- Ambient Background Glow Effect -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-64 bg-[#99e344]/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-6 relative z-10 text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0b2923] mb-3">
                Modern Technologies We Use
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Battle-tested global industry standards engineered to build high-performance, secure, and easily maintainable digital applications.
            </p>
        </div>

        <!-- Static Technology Badges Container -->
        <div class="max-w-5xl mx-auto px-6 relative z-10 space-y-4">

            <!-- Row 1: Frameworks, Languages & Core Tools -->
            <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    LARAVEL
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    PHP
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    CODEIGNITER
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    TYPESCRIPT
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    REACT
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    NEXT.JS
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    NODE.JS
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    VUE.JS
                </div>
            </div>

            <!-- Row 2: Databases, Cloud & Infrastructure -->
            <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    POSTGRESQL
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    MYSQL
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    REDIS
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    DOCKER
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    AWS
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    TAILWIND CSS
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    MONGODB
                </div>
                <div class="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm text-xs font-bold tracking-wider text-slate-700 hover:border-[#99e344] hover:bg-white hover:shadow-md transition-all">
                    FLUTTER
                </div>
            </div>

        </div>
    </section>

    <!-- Development Workflow / Process Section (English Version) -->
    <section id="workflow" class="relative bg-[#071d18] text-white py-24 px-6 overflow-hidden border-t border-emerald-950/60">
        <!-- Ambient Glow Background -->
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#99e344]/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div class="max-w-7xl mx-auto relative z-10">

            <!-- Section Header -->
            <div class="text-center max-w-3xl mx-auto mb-20 space-y-4">
                <span class="text-xs font-bold tracking-wider text-white uppercase gap-1.5">
                    <span class="text-emerald-700">✱</span> HOW WE DELIVER RESULTS
                </span>
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    Our Structured <span class="text-[#99e344]">Development Lifecycle</span>
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    From initial discovery to full-scale cloud deployment, we adhere to an agile framework that is transparent, sprint-driven, and centered around measurable business impact.
                </p>
            </div>

            <!-- 4-Step Process Grid -->
            <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                <!-- Step 1: Consultation & Discovery -->
                <div class="group relative rounded-3xl border border-emerald-900/60 bg-[#0b2923]/70 p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-[#99e344]/40 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(153,227,68,0.12)]">
                    <div>
                        <!-- Step Header: Number & Icon -->
                        <div class="flex items-center justify-between mb-6">
                            <span class="text-3xl font-black font-mono text-[#99e344]">01</span>
                            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#99e344]/15 text-[#99e344] transition-colors group-hover:bg-[#99e344] group-hover:text-[#0b2923]">
                                <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>

                        <h3 class="text-xl font-bold text-white mb-2">Discovery & Consultation</h3>
                        <p class="text-xs text-slate-300 leading-relaxed mb-6">
                            Understanding operational bottlenecks, clarifying business objectives, assessing budget parameters, and outlining technical project scopes.
                        </p>

                        <!-- Milestone Checklist -->
                        <ul class="space-y-2 border-t border-emerald-900/50 pt-4 text-[11px] text-slate-300">
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Business requirements interview
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Technical feasibility analysis
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Project roadmap & timeline estimation
                            </li>
                        </ul>
                    </div>

                    <div class="mt-6 pt-3 text-[10px] font-mono uppercase tracking-wider text-[#99e344]/80">
                        Phase 1: Scope Definition
                    </div>
                </div>

                <!-- Step 2: Architecture & Design -->
                <div class="group relative rounded-3xl border border-emerald-900/60 bg-[#0b2923]/70 p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-[#99e344]/40 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(153,227,68,0.12)]">
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <span class="text-3xl font-black font-mono text-[#99e344]">02</span>
                            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#99e344]/15 text-[#99e344] transition-colors group-hover:bg-[#99e344] group-hover:text-[#0b2923]">
                                <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                                </svg>
                            </div>
                        </div>

                        <h3 class="text-xl font-bold text-white mb-2">Design & Architecture</h3>
                        <p class="text-xs text-slate-300 leading-relaxed mb-6">
                            Crafting interactive UI/UX prototypes, database schemas, and robust API architectures designed for high concurrency.
                        </p>

                        <ul class="space-y-2 border-t border-emerald-900/50 pt-4 text-[11px] text-slate-300">
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> High-fidelity Figma wireframes
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Database schema & API blueprints
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Design system & component library
                            </li>
                        </ul>
                    </div>

                    <div class="mt-6 pt-3 text-[10px] font-mono uppercase tracking-wider text-[#99e344]/80">
                        Phase 2: UI/UX & System Design
                    </div>
                </div>

                <!-- Step 3: Development & Testing -->
                <div class="group relative rounded-3xl border border-emerald-900/60 bg-[#0b2923]/70 p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-[#99e344]/40 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(153,227,68,0.12)]">
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <span class="text-3xl font-black font-mono text-[#99e344]">03</span>
                            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#99e344]/15 text-[#99e344] transition-colors group-hover:bg-[#99e344] group-hover:text-[#0b2923]">
                                <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                        </div>

                        <h3 class="text-xl font-bold text-white mb-2">Development & QA</h3>
                        <p class="text-xs text-slate-300 leading-relaxed mb-6">
                            Iterative modular coding via weekly sprints, automated test pipelines, and rigorous security code reviews.
                        </p>

                        <ul class="space-y-2 border-t border-emerald-900/50 pt-4 text-[11px] text-slate-300">
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Clean code & scalable architecture
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Automated unit & integration testing
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Penetration testing & speed optimization
                            </li>
                        </ul>
                    </div>

                    <div class="mt-6 pt-3 text-[10px] font-mono uppercase tracking-wider text-[#99e344]/80">
                        Phase 3: Coding & Sprint Cycles
                    </div>
                </div>

                <!-- Step 4: Deployment & Maintenance -->
                <div class="group relative rounded-3xl border border-emerald-900/60 bg-[#0b2923]/70 p-7 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-[#99e344]/40 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(153,227,68,0.12)]">
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <span class="text-3xl font-black font-mono text-[#99e344]">04</span>
                            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#99e344]/15 text-[#99e344] transition-colors group-hover:bg-[#99e344] group-hover:text-[#0b2923]">
                                <svg class="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>

                        <h3 class="text-xl font-bold text-white mb-2">Deployment & Scaling</h3>
                        <p class="text-xs text-slate-300 leading-relaxed mb-6">
                            Production release with zero-downtime CI/CD workflows, user training sessions, real-time logging, and ongoing SLA support.
                        </p>

                        <ul class="space-y-2 border-t border-emerald-900/50 pt-4 text-[11px] text-slate-300">
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Automated CI/CD cloud deployment
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> Comprehensive user training & manuals
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-[#99e344] font-bold">✓</span> 24/7 uptime monitoring & daily backups
                            </li>
                        </ul>
                    </div>

                    <div class="mt-6 pt-3 text-[10px] font-mono uppercase tracking-wider text-[#99e344]/80">
                        Phase 4: Launch & Maintenance
                    </div>
                </div>

            </div>

            <!-- Bottom Call to Action Card -->
            <div class="mt-14 rounded-3xl border border-emerald-900/60 bg-gradient-to-r from-[#0b2923] via-[#071d18] to-[#0b2923] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div class="space-y-1 text-center md:text-left">
                    <h4 class="text-lg font-bold text-white">Ready to plan your next digital system?</h4>
                    <p class="text-xs text-slate-400">Schedule a 30-minute free technical consultation with our lead solutions architect.</p>
                </div>
                <a href="#appointment" class="group inline-flex items-center gap-2 bg-[#99e344] hover:bg-[#a8f553] text-[#0b2923] text-xs font-bold py-2.5 px-5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(153,227,68,0.35)] active:translate-y-0">
                    <span>Start Free Consultation</span>
                    <span class="relative inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b2923] text-[#99e344] transition-colors duration-300">
                        <!-- Panah Utama -->
                        <svg class="h-2.5 w-2.5 stroke-current transition-transform duration-300 ease-in-out group-hover:translate-x-4" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        <!-- Panah Masuk Saat Hover -->
                        <svg class="absolute h-2.5 w-2.5 -translate-x-4 stroke-current transition-transform duration-300 ease-in-out group-hover:translate-x-0" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </span>
                </a>
            </div>

        </div>
    </section>

    <!-- Client Reviews / Testimonials Section -->
    <section id="reviews" class="relative bg-white text-slate-900 py-24 px-6 overflow-hidden border-t border-slate-200/80">
        <!-- Ambient Glow -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-72 bg-[#99e344]/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div class="max-w-7xl mx-auto relative z-10">
            <!-- Section Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div class="space-y-3">
                    <span class="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                        <span class="text-emerald-700">✱</span> Client Testimonial
                    </span>
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0b2923] leading-tight">
                        Trusted by Leaders, <br><span class="text-[#84cb32]">Validated by Results</span>
                    </h2>
                </div>
                <!-- Overall Rating Summary -->
                <div class="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                    <div class="text-3xl font-black text-[#0b2923]">4.9<span class="text-sm text-slate-400 font-normal">/5.0</span></div>
                    <div class="space-y-1 border-l border-slate-200 pl-4">
                        <div class="flex text-[#99e344] text-sm">★★★★★</div>
                        <p class="text-xs font-semibold text-slate-600">Based on 120+ client reviews</p>
                    </div>
                </div>
            </div>

            <!-- Reviews Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Review Card 1 -->
                <div class="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#99e344]">
                    <div class="space-y-4">
                        <div class="flex text-[#99e344] text-base">★★★★★</div>
                        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                            "Biztop revolutionized our operational efficiency. The custom ERP system they engineered replaced three disconnected software tools and eliminated manual data duplication entirely."
                        </p>
                    </div>
                    <div class="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Sarah Jenkins" class="w-11 h-11 rounded-full object-cover">
                        <div>
                            <h4 class="text-xs font-bold text-[#0b2923]">Sarah Jenkins</h4>
                            <p class="text-[11px] text-slate-500">COO — Nexus Logistics</p>
                        </div>
                    </div>
                </div>

                <!-- Review Card 2 (Featured Accent) -->
                <div class="bg-[#0b2923] text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl transition-all duration-300 relative overflow-hidden">
                    <div class="relative z-10 space-y-4">
                        <div class="flex text-[#99e344] text-base">★★★★★</div>
                        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                            "Their technical competence in building high-throughput web applications is unmatched. Our customer portal now seamlessly handles thousands of concurrent transactions with zero downtime."
                        </p>
                    </div>
                    <div class="relative z-10 flex items-center gap-3 pt-6 mt-6 border-t border-emerald-900/60">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="David Pratama" class="w-11 h-11 rounded-full object-cover">
                        <div>
                            <h4 class="text-xs font-bold text-white">David Pratama</h4>
                            <p class="text-[11px] text-[#99e344]">VP of Engineering — FinFlow</p>
                        </div>
                    </div>
                    <div class="absolute -right-8 -bottom-8 w-28 h-28 bg-[#99e344]/10 rounded-full blur-xl pointer-events-none"></div>
                </div>

                <!-- Review Card 3 -->
                <div class="bg-slate-50/70 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#99e344]">
                    <div class="space-y-4">
                        <div class="flex text-[#99e344] text-base">★★★★★</div>
                        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                            "The agile sprint process was transparent and disciplined. They delivered our cross-platform mobile application two weeks ahead of schedule with flawless UI/UX execution."
                        </p>
                    </div>
                    <div class="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200">
                        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" alt="Elena Rostova" class="w-11 h-11 rounded-full object-cover">
                        <div>
                            <h4 class="text-xs font-bold text-[#0b2923]">Elena Rostova</h4>
                            <p class="text-[11px] text-slate-500">Product Director — SmartHealth</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Simple & Clean Footer Section -->
    <footer class="bg-[#071d18] text-slate-400 py-12 px-6 border-t border-emerald-950/70">
        <div class="max-w-7xl mx-auto">

            <!-- Top Area: Brand, Quick Links, Socials -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-emerald-950/60">

                <!-- Brand & Short Tagline -->
                <div class="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-[#99e344] flex items-center justify-center text-[#0b2923] shadow-sm">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span class="text-xl font-bold tracking-tight text-white">Do It</span>
                    </div>
                    <span class="hidden sm:inline text-emerald-900">•</span>
                    <p class="text-xs text-slate-400">A Modern Digitak Solutions</p>
                </div>

                <!-- Navigation Links -->
                <ul class="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300">
                    <li><a href="#home" class="hover:text-[#99e344] transition-colors">Home</a></li>
                    <li><a href="#services" class="hover:text-[#99e344] transition-colors">Services</a></li>
                    <li><a href="#workflow" class="hover:text-[#99e344] transition-colors">Workflow</a></li>
                    <li><a href="#reviews" class="hover:text-[#99e344] transition-colors">Reviews</a></li>
                    <li><a href="#contact" class="hover:text-[#99e344] transition-colors">Contact</a></li>
                </ul>

                <!-- Social Media Icons -->
                <div class="flex items-center gap-2.5">
                    <a href="#" aria-label="LinkedIn" class="w-8 h-8 rounded-full bg-[#0b2923] border border-emerald-900/60 text-slate-300 flex items-center justify-center text-xs hover:text-[#99e344] hover:border-[#99e344]/50 transition-all">
                        in
                    </a>
                    <a href="#" aria-label="Twitter / X" class="w-8 h-8 rounded-full bg-[#0b2923] border border-emerald-900/60 text-slate-300 flex items-center justify-center text-xs hover:text-[#99e344] hover:border-[#99e344]/50 transition-all">
                        𝕏
                    </a>
                    <a href="#" aria-label="Instagram" class="w-8 h-8 rounded-full bg-[#0b2923] border border-emerald-900/60 text-slate-300 flex items-center justify-center text-xs hover:text-[#99e344] hover:border-[#99e344]/50 transition-all">
                        ig
                    </a>
                    <a href="#" aria-label="GitHub" class="w-8 h-8 rounded-full bg-[#0b2923] border border-emerald-900/60 text-slate-300 flex items-center justify-center text-xs hover:text-[#99e344] hover:border-[#99e344]/50 transition-all">
                        git
                    </a>
                </div>

            </div>

            <!-- Bottom Area: Copyright & Legal Policies -->
            <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <p>© 2026 Do It Solution. All rights reserved.</p>
                <div class="flex items-center gap-5 text-xs">
                    <a href="#" class="hover:text-slate-300 transition-colors">Privacy Policy</a>
                    <span>•</span>
                    <a href="#" class="hover:text-slate-300 transition-colors">Terms of Service</a>
                    <span>•</span>
                    <a href="#" class="hover:text-slate-300 transition-colors">Security</a>
                </div>
            </div>

        </div>
    </footer>

</body>

<!-- Script Controller -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const header = document.getElementById('main-header');
        const topBar = document.getElementById('top-bar');

        function updateHeader() {
            const topBarHeight = topBar ? topBar.offsetHeight : 0;
            const scrollY = window.scrollY;

            if (scrollY >= topBarHeight) {
                // Saat sudah melewati top-bar: menempel di paling atas (top: 0) dan background solid
                header.style.top = '0px';
                header.classList.remove('bg-transparent');
                header.classList.add('bg-[#0b2923]/95', 'backdrop-blur-md', 'shadow-xl');
            } else {
                // Di posisi atas: beri jarak setinggi top-bar agar tidak saling menabrak/menimpa
                header.style.top = `${topBarHeight - scrollY}px`;
                header.classList.add('bg-transparent');
                header.classList.remove('bg-[#0b2923]/95', 'backdrop-blur-md', 'shadow-xl');
            }
        }

        window.addEventListener('scroll', updateHeader);
        window.addEventListener('resize', updateHeader);
        updateHeader(); // Jalankan sekali saat inisialisasi
    });
</script>

</html>