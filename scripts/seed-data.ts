// Data contoh untuk pengembangan (bun run db:seed). Bukan konten asli: isinya saran umum yang
// ditulis netral, tanpa angka, klaim, atau klien yang dikarang. Proyek portofolio selalu
// bertanda "contoh" (is_sample) sehingga tidak diindeks dan tidak masuk sitemap.
// Hapus semuanya dengan `bun run db:unseed` (berdasarkan slug di berkas ini).

export type SeedCategory = { slug: string; id: string; en: string };
export type SeedArticle = {
  slug: string;
  category: string;
  daysAgo: number;
  cover?: { image: string; altId: string; altEn: string };
  id: { title: string; excerpt: string; content: string };
  en?: { title: string; excerpt: string; content: string };
};
export type SeedProject = {
  slug: string;
  serviceSlug: string;
  techStack: string[];
  id: ProjectCopy;
  en: ProjectCopy;
};
type ProjectCopy = {
  title: string;
  summary: string;
  client: string;
  problem: string;
  solution: string;
  result: string;
};

export const SEED_CATEGORIES: SeedCategory[] = [
  { slug: 'teknologi', id: 'Teknologi', en: 'Technology' },
  { slug: 'bisnis-digital', id: 'Bisnis Digital', en: 'Digital Business' },
  { slug: 'desain', id: 'Desain', en: 'Design' },
];

export const SEED_ARTICLES: SeedArticle[] = [
  {
    slug: 'kapan-bisnis-butuh-website-company-profile',
    category: 'bisnis-digital',
    daysAgo: 2,
    cover: {
      image: '/images/collaboration.jpg',
      altId: 'Tim sedang berdiskusi di meja kerja',
      altEn: 'A team discussing around a work table',
    },
    id: {
      title: 'Kapan Bisnis Anda Butuh Website Company Profile?',
      excerpt:
        'Website company profile bukan sekadar pajangan. Kenali tanda-tanda bisnis Anda sudah waktunya memilikinya.',
      content: `Banyak pemilik usaha menunda membuat website karena merasa pelanggan sudah datang lewat media sosial atau rekomendasi. Padahal ada momen-momen tertentu ketika website company profile menjadi kebutuhan, bukan pelengkap.

## Tanda-tanda sudah waktunya

- **Calon klien mencari Anda di Google** sebelum menghubungi. Bila hasil pencarian hanya menampilkan akun media sosial, kesan pertama ditentukan oleh platform lain.
- **Anda sering menjelaskan hal yang sama** berulang kali: layanan apa saja, proses kerja, atau cara memesan. Website bisa menjawabnya setiap saat.
- **Anda mulai menjangkau pelanggan baru** di luar lingkaran kenalan, termasuk perusahaan yang biasanya meminta profil resmi sebelum bekerja sama.

## Apa yang sebaiknya ada

Cukup mulai dari yang sederhana: siapa Anda, layanan yang ditawarkan, contoh pekerjaan, dan cara menghubungi. Halaman yang jelas lebih berguna daripada halaman yang ramai tetapi membingungkan.

## Langkah awal

Tulis dulu dalam beberapa kalimat apa yang ingin dipahami pengunjung setelah membuka halaman utama. Dari situ struktur halaman biasanya terbentuk dengan sendirinya. Jika perlu teman diskusi, tim kami siap membantu menyusunnya.`,
    },
    en: {
      title: 'When Does Your Business Need a Company Website?',
      excerpt:
        'A company website is more than decoration. Learn the signs that it is time to build one.',
      content: `Many business owners put off building a website because customers already arrive through social media or referrals. Yet there are moments when a company website stops being optional.

## Signs it is time

- **Prospects search for you on Google** before getting in touch. If the results only show social media accounts, another platform shapes the first impression.
- **You keep explaining the same things**: what you offer, how you work, how to order. A website answers those questions at any hour.
- **You are reaching new customers** beyond your own circle, including companies that ask for an official profile before working together.

## What it should include

Start simple: who you are, the services you offer, examples of your work, and how to reach you. A clear page beats a busy one that confuses visitors.

## A first step

Write down, in a few sentences, what a visitor should understand after opening your home page. The structure of the site usually follows from that.`,
    },
  },
  {
    slug: 'website-cepat-untuk-seo',
    category: 'teknologi',
    daysAgo: 5,
    id: {
      title: 'Mengapa Kecepatan Website Memengaruhi SEO dan Pengunjung',
      excerpt:
        'Website yang lambat membuat pengunjung pergi dan menyulitkan pencarian. Berikut hal-hal praktis yang bisa diperbaiki.',
      content: `Kecepatan bukan hanya soal kenyamanan. Mesin pencari memperhatikan seberapa cepat halaman tampil dan merespons, dan pengunjung cenderung meninggalkan halaman yang terasa lambat, terutama di ponsel.

## Penyebab yang paling sering

- **Gambar terlalu besar.** Foto langsung dari kamera sering berukuran beberapa megabita. Kecilkan ukurannya dan gunakan format modern seperti WebP atau AVIF.
- **Skrip pihak ketiga berlebihan.** Setiap widget chat, pelacak, atau font tambahan menambah waktu muat.
- **Hosting yang jauh dari pengunjung.** Server di benua lain menambah jeda pada setiap permintaan.

## Yang bisa Anda periksa sendiri

Jalankan Lighthouse di Chrome DevTools atau PageSpeed Insights, lalu lihat tiga hal: seberapa cepat konten utama muncul, apakah tata letak melompat saat memuat, dan seberapa cepat halaman merespons klik.

## Perbaikan yang berdampak besar

Mulai dari gambar dan skrip, karena biasanya paling mudah. Pastikan halaman penting dibuat di sisi server agar konten sudah ada saat tiba di browser. Ukur sebelum dan sesudah, supaya jelas perubahan mana yang benar-benar membantu.`,
    },
    en: {
      title: 'Why Website Speed Matters for SEO and Visitors',
      excerpt:
        'A slow website drives visitors away and hurts discoverability. Here are practical things you can fix.',
      content: `Speed is about more than comfort. Search engines look at how quickly a page appears and responds, and visitors tend to leave pages that feel slow, especially on phones.

## The usual suspects

- **Oversized images.** Photos straight from a camera can be several megabytes. Resize them and use modern formats such as WebP or AVIF.
- **Too many third-party scripts.** Every chat widget, tracker, or extra font adds loading time.
- **Hosting far from visitors.** A server on another continent adds delay to every request.

## What you can check yourself

Run Lighthouse in Chrome DevTools or PageSpeed Insights and look at three things: how fast the main content appears, whether the layout jumps while loading, and how quickly the page responds to a click.

## High-impact fixes

Start with images and scripts, since they are usually the easiest. Make sure important pages render on the server so content is already there when it reaches the browser. Measure before and after to see which change actually helped.`,
    },
  },
  {
    slug: 'aplikasi-custom-atau-software-siap-pakai',
    category: 'bisnis-digital',
    daysAgo: 8,
    id: {
      title: 'Aplikasi Custom atau Software Siap Pakai: Mana yang Cocok?',
      excerpt:
        'Tidak semua kebutuhan harus dibuat dari nol. Pertimbangkan beberapa hal ini sebelum memutuskan.',
      content: `Pertanyaan ini hampir selalu muncul di awal proyek. Jawabannya bukan soal mana yang lebih baik, melainkan mana yang lebih sesuai dengan cara kerja bisnis Anda.

## Software siap pakai cocok bila

- Proses Anda mirip dengan kebanyakan bisnis sejenis, misalnya akuntansi dasar atau absensi.
- Anda butuh solusi cepat dan bersedia menyesuaikan cara kerja dengan fitur yang ada.
- Anggaran awal terbatas dan kebutuhan belum terlalu spesifik.

## Aplikasi custom cocok bila

- Alur kerja Anda unik dan menjadi keunggulan bisnis, sehingga sayang bila dipaksa mengikuti aturan produk lain.
- Anda sudah memakai beberapa alat yang tidak saling terhubung dan butuh satu tampilan terpadu.
- Biaya langganan per pengguna terus membengkak seiring tim bertambah.

## Jalan tengah

Sering kali pilihan terbaik adalah menggabungkan: memakai produk siap pakai untuk hal umum, lalu membangun bagian khusus yang terhubung ke sana. Mulailah dengan memetakan proses yang ada. Dari situ biasanya terlihat bagian mana yang pantas dibuat khusus.`,
    },
    en: {
      title: 'Custom App or Off-the-Shelf Software: Which Fits?',
      excerpt:
        'Not every need has to be built from scratch. Consider these points before you decide.',
      content: `This question comes up at the start of almost every project. The answer is not which option is better, but which fits the way your business works.

## Off-the-shelf software fits when

- Your process resembles most businesses like yours, such as basic accounting or attendance.
- You need a quick solution and are willing to adapt your workflow to the product.
- The budget is tight and the requirements are not yet specific.

## A custom app fits when

- Your workflow is unique and part of your edge, so forcing it into someone else's rules would hurt.
- You already use several tools that do not talk to each other and need one unified view.
- Per-user subscription costs keep growing as the team grows.

## The middle path

Often the best choice is a mix: use a ready-made product for the common parts, then build the specific parts and connect them. Begin by mapping your current process; it usually shows which part deserves custom work.`,
    },
  },
  {
    slug: 'dasar-ui-ux-untuk-aplikasi-bisnis',
    category: 'desain',
    daysAgo: 11,
    cover: {
      image: '/images/team-meeting.jpg',
      altId: 'Rapat tim membahas rancangan antarmuka',
      altEn: 'A team meeting about interface designs',
    },
    id: {
      title: 'Dasar UI/UX untuk Aplikasi Bisnis yang Mudah Dipakai',
      excerpt:
        'Aplikasi internal pun perlu dirancang dengan baik. Prinsip sederhana ini membantu pengguna bekerja lebih cepat.',
      content: `Aplikasi bisnis sering dianggap cukup asal fungsinya ada. Padahal antarmuka yang membingungkan membuat pengguna salah input, bertanya terus, atau kembali ke spreadsheet lama.

## Prinsip yang mudah diterapkan

- **Satu layar, satu tujuan.** Hindari memasukkan semua fitur ke satu halaman. Pisahkan tugas utama dari tugas jarang.
- **Konsisten.** Tombol simpan selalu di tempat yang sama dengan nama yang sama. Pengguna tidak perlu belajar ulang di setiap halaman.
- **Beri umpan balik.** Setelah menekan tombol, pengguna harus tahu apa yang terjadi: berhasil, gagal, atau sedang diproses.
- **Cegah kesalahan.** Konfirmasi sebelum menghapus, beri nilai awal yang masuk akal, dan jelaskan format isian.

## Libatkan pengguna sejak awal

Buat prototipe kasar dan minta dua atau tiga orang yang akan memakainya mencoba tugas nyata. Perhatikan di mana mereka ragu. Temuan sederhana seperti ini biasanya lebih berharga daripada diskusi panjang tentang warna.

## Aksesibilitas bukan tambahan

Kontras yang cukup, ukuran tombol yang nyaman disentuh, dan label yang jelas membantu semua orang, bukan hanya pengguna dengan kebutuhan khusus.`,
    },
  },
  {
    slug: 'cara-menyiapkan-brief-proyek-software',
    category: 'bisnis-digital',
    daysAgo: 14,
    id: {
      title: 'Cara Menyiapkan Brief Proyek Software yang Jelas',
      excerpt:
        'Brief yang baik menghemat waktu dan biaya. Ini hal-hal yang perlu Anda siapkan sebelum berdiskusi dengan tim pengembang.',
      content: `Banyak proyek software tersendat bukan karena teknologinya sulit, melainkan karena tujuan dan batasannya belum jelas di awal. Brief yang singkat tetapi tepat sudah sangat membantu.

## Isi brief yang disarankan

1. **Masalah yang ingin diselesaikan.** Ceritakan situasi saat ini dan apa yang menyulitkan, bukan langsung fitur yang diinginkan.
2. **Siapa penggunanya.** Berapa orang, apa perannya, dan seberapa terbiasa mereka dengan teknologi.
3. **Hasil yang diharapkan.** Bagaimana Anda tahu proyek ini berhasil? Contoh: waktu pelaporan berkurang, atau pelanggan bisa memesan sendiri.
4. **Batasan.** Anggaran, tenggat, sistem yang sudah ada dan harus tetap terhubung.
5. **Contoh yang Anda sukai.** Aplikasi atau website lain sebagai gambaran, bukan untuk ditiru persis.

## Yang boleh belum pasti

Anda tidak perlu tahu teknologi apa yang dipakai atau rincian fiturnya. Itu bagian dari diskusi. Yang penting adalah masalahnya jelas.

## Setelah brief

Tim pengembang biasanya akan mengajukan pertanyaan lanjutan, lalu mengusulkan lingkup tahap pertama yang kecil tetapi berguna. Mulai dari yang kecil membuat Anda bisa menilai hasilnya sebelum melangkah lebih jauh.`,
    },
    en: {
      title: 'How to Prepare a Clear Software Project Brief',
      excerpt:
        'A good brief saves time and money. Here is what to prepare before talking to a development team.',
      content: `Many software projects stall not because the technology is hard, but because goals and constraints were unclear at the start. A short but precise brief goes a long way.

## What a good brief contains

1. **The problem to solve.** Describe the current situation and what makes it hard, rather than jumping to features.
2. **Who the users are.** How many, what roles, and how comfortable they are with technology.
3. **The expected outcome.** How will you know it worked? For example, reports take less time, or customers can order on their own.
4. **Constraints.** Budget, deadline, and existing systems that must stay connected.
5. **Examples you like.** Other apps or sites as reference, not to copy exactly.

## What can stay undecided

You do not need to know the technology or the exact features. That is part of the discussion. What matters is that the problem is clear.

## After the brief

The team will usually ask follow-up questions, then propose a small but useful first scope. Starting small lets you judge the result before going further.`,
    },
  },
  {
    slug: 'mengapa-aplikasi-internal-sering-tidak-dipakai',
    category: 'teknologi',
    daysAgo: 18,
    id: {
      title: 'Mengapa Aplikasi Internal Sering Tidak Dipakai Timnya',
      excerpt:
        'Aplikasi sudah jadi tetapi tim tetap memakai cara lama. Biasanya penyebabnya bukan teknologi.',
      content: `Cerita ini cukup umum: aplikasi internal selesai dibuat, diluncurkan, lalu beberapa bulan kemudian tim kembali memakai spreadsheet dan chat. Masalahnya jarang ada di kode.

## Penyebab yang sering muncul

- **Tidak melibatkan pengguna sejak awal.** Aplikasi dirancang berdasarkan asumsi manajer, bukan cara kerja orang yang memakainya setiap hari.
- **Lebih lambat dari cara lama.** Bila mengisi satu data butuh lebih banyak langkah daripada spreadsheet, orang akan kembali ke spreadsheet.
- **Tidak ada pemilik.** Tanpa orang yang bertanggung jawab atas data dan aturan pemakaian, aplikasi cepat ditinggalkan.
- **Peralihan terlalu mendadak.** Cara lama dimatikan sebelum cara baru benar-benar nyaman.

## Cara mencegahnya

Mulailah dari satu proses kecil yang paling sering menyulitkan, dan selesaikan dengan baik. Libatkan dua atau tiga pengguna sebagai penguji sejak prototipe. Tentukan siapa yang mengelola aplikasi setelah diluncurkan.

## Ukur pemakaian

Setelah rilis, perhatikan apakah tugas yang dituju benar-benar dikerjakan lewat aplikasi. Bila tidak, tanyakan alasannya langsung kepada tim. Jawabannya biasanya sederhana dan bisa diperbaiki.`,
    },
  },
  {
    slug: 'checklist-sebelum-meluncurkan-website',
    category: 'teknologi',
    daysAgo: 22,
    id: {
      title: 'Checklist Sebelum Meluncurkan Website Baru',
      excerpt:
        'Sebelum menekan tombol rilis, periksa daftar singkat ini agar website siap dikunjungi dan ditemukan.',
      content: `Meluncurkan website adalah momen yang menyenangkan, tetapi beberapa hal kecil sering terlewat dan baru disadari setelah pengunjung pertama datang. Gunakan daftar ini sebagai pengingat.

## Konten

- Semua teks sudah dibaca ulang, tidak ada sisa tulisan contoh.
- Informasi kontak benar dan formulir sudah dicoba sampai pesan benar-benar diterima.
- Gambar memiliki teks alternatif yang bermakna.

## Teknis

- Tampilan sudah dicek di ponsel, tablet, dan desktop.
- Setiap halaman punya judul dan deskripsi unik.
- Halaman tidak ditemukan menampilkan pesan yang ramah, bukan galat.
- HTTPS aktif dan alamat dengan atau tanpa www diarahkan ke satu versi.

## Pencarian dan pengukuran

- Sitemap dan robots.txt tersedia.
- Domain sudah didaftarkan di Google Search Console.
- Alat pengukuran pengunjung terpasang sesuai kebijakan privasi Anda.

## Setelah rilis

Cek ulang kecepatan di lingkungan sebenarnya, bukan hanya di komputer pengembang, dan pantau pesan yang masuk dari formulir selama beberapa hari pertama.`,
    },
    en: {
      title: 'A Checklist Before Launching a New Website',
      excerpt:
        'Before you press the launch button, run through this short list so the site is ready to be visited and found.',
      content: `Launching a website is exciting, but small things are often missed and only noticed after the first visitors arrive. Use this list as a reminder.

## Content

- Every text has been proofread and no sample copy is left.
- Contact details are correct and the form has been tested until a message is actually received.
- Images have meaningful alternative text.

## Technical

- The layout has been checked on phone, tablet, and desktop.
- Every page has a unique title and description.
- A missing page shows a friendly message, not an error.
- HTTPS is on and the www and non-www addresses redirect to a single version.

## Search and measurement

- A sitemap and robots.txt exist.
- The domain is registered in Google Search Console.
- Visitor measurement is set up in line with your privacy policy.

## After launch

Re-check speed in the real environment, not just on the developer's computer, and watch incoming form messages for the first few days.`,
    },
  },
  {
    slug: 'desain-formulir-yang-mudah-diisi',
    category: 'desain',
    daysAgo: 27,
    id: {
      title: 'Desain Formulir yang Mudah Diisi dan Tidak Membuat Frustrasi',
      excerpt:
        'Formulir adalah tempat banyak calon pelanggan menyerah. Beberapa perbaikan kecil bisa membuat perbedaan.',
      content: `Formulir kontak, pendaftaran, atau pemesanan sering menjadi titik terakhir sebelum pengunjung menjadi pelanggan. Formulir yang membingungkan membuat mereka berhenti di tengah jalan.

## Tanyakan seperlunya

Setiap kolom tambahan mengurangi kemungkinan formulir diselesaikan. Tanyakan hanya yang benar-benar Anda butuhkan sekarang. Informasi lain bisa ditanyakan setelah percakapan dimulai.

## Label yang jelas

Letakkan label di atas kolom dan jangan mengandalkan teks contoh di dalam kolom sebagai satu-satunya petunjuk, karena hilang saat pengguna mulai mengetik.

## Pesan galat yang membantu

Katakan dengan jelas apa yang salah dan cara memperbaikinya, di dekat kolom yang bermasalah. Hindari menghapus isian yang sudah ditulis pengguna.

## Nyaman di ponsel

Gunakan jenis kolom yang tepat agar keyboard yang muncul sesuai, misalnya angka untuk telepon dan email untuk alamat surel. Tombol kirim sebaiknya mudah ditekan dengan jempol.

## Beri kepastian setelah mengirim

Tampilkan pesan bahwa data diterima dan jelaskan apa yang terjadi berikutnya, misalnya perkiraan waktu balasan. Kepastian kecil ini membangun kepercayaan.`,
    },
  },
  {
    slug: 'mengenal-postgresql-untuk-aplikasi-bisnis',
    category: 'teknologi',
    daysAgo: 33,
    id: {
      title: 'Mengenal PostgreSQL untuk Aplikasi Bisnis',
      excerpt:
        'Database relasional ini banyak dipilih untuk aplikasi bisnis. Berikut alasan dan hal dasar yang perlu diketahui.',
      content: `Setiap aplikasi yang menyimpan data butuh database. PostgreSQL adalah salah satu pilihan populer untuk aplikasi bisnis karena stabil, terbuka, dan memiliki fitur yang lengkap.

## Mengapa banyak dipilih

- **Data yang terstruktur dan konsisten.** Aturan seperti kolom wajib diisi, nilai unik, atau relasi antar tabel ditegakkan oleh database itu sendiri, bukan hanya oleh aplikasi.
- **Transaksi.** Beberapa perubahan bisa dijalankan sebagai satu kesatuan: berhasil semua atau dibatalkan semua. Ini penting untuk pesanan dan pembayaran.
- **Fleksibel.** Mendukung data berformat JSON untuk bagian yang strukturnya berubah-ubah, tanpa meninggalkan keunggulan tabel relasional.

## Hal dasar yang perlu diketahui

Rancang tabel dan relasinya dengan hati-hati sejak awal, karena mengubahnya setelah data banyak lebih sulit. Gunakan indeks pada kolom yang sering dicari agar kueri tetap cepat. Dan selalu simpan cadangan data secara berkala.

## Layanan terkelola

Anda tidak harus mengurus server sendiri. Penyedia layanan database terkelola menangani pembaruan, cadangan, dan skala, sehingga tim bisa fokus pada aplikasi.`,
    },
  },
  {
    slug: 'keamanan-dasar-aplikasi-web',
    category: 'teknologi',
    daysAgo: 40,
    cover: {
      image: '/images/hero-2.jpg',
      altId: 'Ilustrasi suasana kerja tim teknologi',
      altEn: 'Illustration of a technology team at work',
    },
    id: {
      title: 'Keamanan Dasar yang Wajib Ada di Aplikasi Web',
      excerpt:
        'Keamanan bukan fitur tambahan. Pastikan hal-hal mendasar ini sudah diterapkan sebelum aplikasi digunakan.',
      content: `Aplikasi web yang menyimpan data pelanggan memegang tanggung jawab yang nyata. Kabar baiknya, sebagian besar insiden berasal dari kelalaian dasar yang bisa dicegah.

## Hal-hal mendasar

- **Validasi di server.** Jangan percaya data dari browser. Periksa ulang semua masukan di sisi server, meskipun formulir sudah memeriksanya.
- **Simpan password dengan benar.** Jangan pernah menyimpan password asli. Gunakan algoritma hash yang dirancang untuk itu, seperti scrypt atau argon2.
- **Batasi percobaan masuk.** Tanpa batasan, password mudah ditebak dengan program otomatis.
- **Rahasia di luar kode.** Kunci API dan kredensial disimpan sebagai variabel lingkungan, tidak dimasukkan ke repositori.
- **Gunakan HTTPS** di mana pun, dan atur cookie sesi agar tidak bisa dibaca oleh skrip.

## Perbarui secara berkala

Pustaka yang dipakai aplikasi ikut mendapat perbaikan keamanan dari waktu ke waktu. Jadwalkan pembaruan dan periksa peringatan dari alat audit dependensi.

## Siapkan rencana

Tentukan lebih dulu siapa yang dihubungi bila terjadi insiden, dan bagaimana mengganti kredensial dengan cepat. Rencana sederhana yang sudah ditulis jauh lebih berguna daripada keputusan yang dibuat saat panik.`,
    },
    en: {
      title: 'Basic Security Every Web Application Needs',
      excerpt:
        'Security is not an add-on. Make sure these fundamentals are in place before the app goes live.',
      content: `A web application that stores customer data carries real responsibility. The good news is that most incidents come from basic oversights that can be prevented.

## The fundamentals

- **Validate on the server.** Never trust data from the browser. Re-check every input on the server, even if the form already checked it.
- **Store passwords properly.** Never store the real password. Use a hashing algorithm designed for it, such as scrypt or argon2.
- **Limit login attempts.** Without limits, passwords can be guessed by automated programs.
- **Keep secrets out of code.** API keys and credentials belong in environment variables, not in the repository.
- **Use HTTPS** everywhere, and configure session cookies so scripts cannot read them.

## Keep things updated

The libraries an application uses receive security fixes over time. Schedule updates and watch the warnings from dependency audit tools.

## Have a plan

Decide in advance who to contact if an incident happens and how to rotate credentials quickly. A simple written plan is far more useful than decisions made in a panic.`,
    },
  },
];

export const SEED_PROJECTS: SeedProject[] = [
  {
    slug: 'company-profile-website',
    serviceSlug: 'web-development',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    id: {
      title: 'Website Company Profile',
      summary:
        'Website perusahaan dua bahasa yang cepat, lengkap dengan blog yang bisa dikelola timnya sendiri.',
      client: 'Klien contoh (perusahaan jasa)',
      problem:
        'Bisnis memiliki website lama yang lambat di ponsel dan sulit diperbarui, sehingga layanan dan artikel baru jarang terbit.',
      solution:
        'Kami membangun ulang sebagai website responsif dengan halaman layanan yang jelas, form kontak, dan area admin sederhana agar tim menulis artikel tanpa menyentuh kode.',
      result:
        'Tim dapat menerbitkan pembaruan sendiri, dan situs dirancang agar cepat dimuat serta mudah ditemukan di mesin pencari.',
    },
    en: {
      title: 'Company Profile Website',
      summary: 'A fast, bilingual company website with a blog the team can update on its own.',
      client: 'Sample client (a services company)',
      problem:
        'The business had an outdated website that loaded slowly on mobile and was hard to update, so new services and articles rarely got published.',
      solution:
        'We rebuilt it as a responsive website with clear service pages, a contact form, and a simple admin area where the team writes articles without touching code.',
      result:
        'The team can publish updates themselves, and the site is built to load quickly and be found on search engines.',
    },
  },
  {
    slug: 'inventory-dashboard',
    serviceSlug: 'custom-software-development',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    id: {
      title: 'Dashboard Inventaris',
      summary:
        'Aplikasi web internal yang menggantikan spreadsheet stok dengan satu tampilan bersama.',
      client: 'Klien contoh (bisnis ritel)',
      problem:
        'Data stok tersebar di beberapa spreadsheet, sehingga staf sering memakai angka berbeda dan menyamakannya memakan waktu.',
      solution:
        'Kami membangun dashboard internal dengan satu daftar stok, akses berdasarkan peran, dan laporan sederhana yang mengikuti cara kerja tim.',
      result:
        'Semua orang memakai satu sumber data, dan pengecekan stok rutin tidak lagi bergantung pada penggabungan file manual.',
    },
    en: {
      title: 'Inventory Dashboard',
      summary: 'An internal web app that replaces stock spreadsheets with one shared view.',
      client: 'Sample client (a retail business)',
      problem:
        'Stock data lived in several spreadsheets, so staff often worked from different numbers and reconciling them took time.',
      solution:
        'We built an internal dashboard with a single stock list, role-based access, and simple reports that follow the way the team already works.',
      result:
        'Everyone works from one source of truth, and routine stock checks no longer depend on merging files by hand.',
    },
  },
  {
    slug: 'booking-app-redesign',
    serviceSlug: 'ui-ux-design',
    techStack: ['Figma', 'Design System', 'Usability Testing'],
    id: {
      title: 'Redesain Pengalaman Pemesanan',
      summary: 'Alur pemesanan yang lebih jelas, dirancang dan diuji sebelum pengembangan dimulai.',
      client: 'Klien contoh (platform pemesanan)',
      problem:
        'Pelanggan meninggalkan proses pemesanan karena langkahnya tidak jelas dan layar terlalu padat di ponsel.',
      solution:
        'Kami memetakan perjalanan pengguna, menyederhanakannya menjadi lebih sedikit langkah, membuat prototipe interaktif di Figma, dan mengujinya dengan pengguna sebelum menyerahkan design system.',
      result:
        'Tim menerima desain yang sudah diuji dan komponen yang dapat dipakai ulang, sehingga pengembangan dimulai dengan lebih sedikit ketidakpastian.',
    },
    en: {
      title: 'Booking Experience Redesign',
      summary: 'A clearer booking flow designed and tested before any development began.',
      client: 'Sample client (a booking platform)',
      problem:
        'Customers abandoned the booking flow because the steps were unclear and the screens were crowded on mobile.',
      solution:
        'We mapped the journey, simplified it to fewer steps, built clickable prototypes in Figma, and tested them with real users before handing over a design system.',
      result:
        'The team received tested designs and reusable components, so development could start with fewer unknowns.',
    },
  },
  {
    slug: 'clinic-reservation-system',
    serviceSlug: 'custom-software-development',
    techStack: ['Next.js', 'PostgreSQL', 'Drizzle ORM'],
    id: {
      title: 'Sistem Reservasi Klinik',
      summary:
        'Pendaftaran kunjungan online dengan jadwal dokter, agar antrean di resepsionis lebih tertata.',
      client: 'Klien contoh (klinik pratama)',
      problem:
        'Pendaftaran dilakukan lewat telepon dan catatan kertas, sehingga jadwal sering bentrok dan pasien tidak tahu perkiraan waktu giliran.',
      solution:
        'Kami membuat sistem reservasi dengan jadwal praktik per dokter, pilihan jam yang masih kosong, konfirmasi lewat email, dan layar admin untuk resepsionis.',
      result:
        'Jadwal tercatat di satu tempat dan resepsionis dapat melihat kunjungan hari itu tanpa membuka catatan kertas.',
    },
    en: {
      title: 'Clinic Reservation System',
      summary:
        'Online appointment booking with doctor schedules, so the front desk queue is better organised.',
      client: 'Sample client (a primary care clinic)',
      problem:
        'Bookings were taken by phone and paper notes, so schedules often clashed and patients had no idea when their turn would be.',
      solution:
        'We built a reservation system with per-doctor schedules, available time slots, email confirmation, and an admin screen for the receptionist.',
      result:
        'Schedules live in one place and the receptionist can see the day’s visits without opening paper notes.',
    },
  },
  {
    slug: 'msme-digital-catalog',
    serviceSlug: 'web-development',
    techStack: ['Next.js', 'Tailwind CSS', 'PostgreSQL'],
    id: {
      title: 'Katalog Digital untuk UMKM',
      summary:
        'Katalog produk online yang mudah diperbarui pemilik usaha, dengan tombol pesan langsung ke WhatsApp.',
      client: 'Klien contoh (usaha makanan rumahan)',
      problem:
        'Produk hanya dipromosikan lewat foto di media sosial, sehingga harga dan ketersediaan sulit dicari dan sering ditanyakan berulang.',
      solution:
        'Kami membuat katalog dengan halaman produk, kategori, harga yang mudah diubah lewat admin, dan tombol pesan yang membuka WhatsApp dengan pesan terisi.',
      result:
        'Pelanggan dapat melihat produk dan harga terbaru sendiri, sehingga pemilik usaha menjawab lebih sedikit pertanyaan yang sama.',
    },
    en: {
      title: 'Digital Catalog for a Small Business',
      summary:
        'An online product catalog the owner can update easily, with an order button that opens WhatsApp.',
      client: 'Sample client (a home-based food business)',
      problem:
        'Products were promoted only through social media photos, so prices and availability were hard to find and asked about repeatedly.',
      solution:
        'We built a catalog with product pages, categories, prices that are easy to change from the admin, and an order button that opens WhatsApp with a prefilled message.',
      result:
        'Customers can check current products and prices themselves, so the owner answers fewer repeated questions.',
    },
  },
];
