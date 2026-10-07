# Teshy Labs — audit identitas dan discoverability

Tanggal: 7 Oktober 2026. Baseline produksi/source: `5f0dc9e`.
Status: perbaikan di working tree lokal; tidak commit, push, deploy, atau mengubah DNS/WAF pada pekerjaan audit ini.

## Temuan dan prioritas

| Prioritas | Masalah dan bukti | Perbaikan / alasan | Status |
| --- | --- | --- | --- |
| P0 | Tidak ditemukan blocker akses pada homepage utama. Homepage, robots, sitemap memberi 200; HTTP memberi 308 ke HTTPS; www memberi 307 ke apex lalu 200. Tidak ada X-Robots-Tag/noindex, challenge, autentikasi, atau 429 pada probe. | Pertahankan konfigurasi akses; tidak perlu melonggarkan security. | Tidak ada perubahan infrastruktur. |
| P1 | KLK sebelumnya dikelompokkan sebagai produk milik perusahaan melalui Organization.owns. Situs KLK menampilkan login internal berlabel PT. Kemilau Lintas Khatulistiwa / KLK Express. Founder mengklarifikasi bahwa ia membuat aplikasi untuk PT KLK, bisnis keluarganya. | Tampilkan KLK sebagai proyek yang dikembangkan founder, bukan aset Teshy Labs. Hapus dari owns; gunakan SoftwareApplication dengan creator Person. Ini menghindari penyatuan dua identitas perusahaan. | Diimplementasikan lokal. |
| P1 | Identitas awal tersedia, tetapi tanggal pendirian/founder tersebar di daftar fakta; hubungan perusahaan-produk lebih tersirat. | Paragraf About menyebut nama, Indonesia, founder, bulan pendirian, lokasi, dan fokus. Kassentix diberi hubungan eksplisit sebagai produk; KLK diberi atribusi founder. | Diimplementasikan lokal. |
| P1 | About/Products/Contact sebelumnya hanya section homepage. Tidak ada URL profil perusahaan terpisah. | Tambah /about.html yang ringkas dengan navigasi, kontak, dan hubungan software yang akurat. Halaman berguna untuk manusia dan URL rujukan langsung; bukan persyaratan formal program. | Diimplementasikan lokal. |
| P1 eksternal | HTML publik Kassentix tidak menyebut/menautkan Teshy Labs; menggunakan alamat support Gmail. KLK initial HTML hanya menampilkan judul dan “Memuat...”, lalu browser diarahkan ke login; tidak ada atribusi developer. | Tautan perusahaan pada Kassentix dan kredit pengembang yang akurat pada KLK, hanya jika diizinkan pemilik situs. Jangan memakai footer kepemilikan Teshy Labs untuk KLK. | Tidak mengubah situs produk. |
| P2 | Organization awal mempunyai URL produk tanpa nama, tidak punya ID entitas; belum ada WebSite/AboutPage, Twitter metadata atau URL logo yang dapat diambil langsung. | Tambah nama/deskripsi, ID stabil, WebSite.publisher, AboutPage.mainEntity, metadata Twitter, dan aset SVG dari monogram favicon yang sudah dipakai. | Diimplementasikan lokal. |
| P2 | Sitemap sebelumnya hanya homepage. | Tambah canonical About ke sitemap. Robots sudah benar dan dipertahankan. | Diimplementasikan lokal. |
| P2 eksternal | Satu pencarian exact nama/domain tidak mengembalikan hasil. Satu layanan web-fetch gagal membuka homepage, tetapi request HTTPS langsung dan browser berhasil. | Periksa Google Search Console URL Inspection dan submit sitemap setelah deploy. Hasil pencarian/web-fetch ini tidak membuktikan tidak terindeks atau diblok WAF. | Memerlukan akses/verifikasi eksternal. |
| P3 | Tidak ada social preview image khusus atau profile perusahaan resmi yang dikonfirmasi. | Tidak membuat profil, gambar dekoratif, sameAs, maupun llms.txt spekulatif. Keberadaan file semacam itu tidak membuktikan identitas legal atau menjamin verifikasi. | Sengaja tidak ditambahkan. |

## Bukti akses produksi sebelum perubahan lokal

Hasil terperinci dan header: `output/qa/audit-http.json`.

| Request | Hasil |
| --- | --- |
| https://teshylabs.me/ | 200, Server Vercel, initial HTML memuat nama perusahaan dan founder |
| http://teshylabs.me/ | 308 → https://teshylabs.me/ → 200 |
| https://www.teshylabs.me/ | 307 → https://teshylabs.me/ → 200 |
| https://teshylabs.me/robots.txt | 200, text/plain; User-agent: *, Allow: /, sitemap benar |
| https://teshylabs.me/sitemap.xml | 200, application/xml; XML valid, canonical homepage |
| Homepage dengan Googlebot / ClaudeBot / Claude-User | Masing-masing 200 dan HTML identitas lengkap |
| https://kassentix.cloud/ | 200; AI Assistant dipresentasikan; tidak ada link teshylabs.me pada HTML yang diambil |
| https://klkinvoice.my.id/ | 307 → https://www.klkinvoice.my.id/ → 200; initial body “Memuat...”; browser kemudian /login |

Probe user-agent bukan akses dari IP bot terverifikasi dan bukan simulasi algoritma Anthropic. Tidak ada pengujian load/rate limit, log keputusan Anthropic, atau audit menyeluruh semua rule WAF. Apex telah memakai DNS only dan responsnya langsung dari Vercel; tidak ada indikasi Cloudflare challenge pada apex dalam tes ini. www masih melalui Cloudflare. Pengaturan keamanan tidak disentuh.

## Perubahan dan sumber fakta

- `index.html`: metadata, paragraf identitas, tautan About, atribusi software, urutan KLK lebih dahulu, dan JSON-LD. H1, tema, motion, video, serta pendekatan HTML statis dipertahankan.
- `about.html`: halaman profil perusahaan mandiri dengan design yang sama, skip link, focus states, dark mode, serta satu h1.
- `assets/teshylabs-mark.svg`: monogram favicon yang sudah ada, diekspos sebagai aset 128×128 untuk logo. Bukan merek atau logo baru.
- `sitemap.xml`: menambah /about.html. Tidak menambah tanggal lastmod spekulatif.
- `footer-snippet.html`: komentar membatasi penggunaan ownership link ke Kassentix.
- `scripts/check-site.mjs`: satu pemeriksaan Node tanpa dependency untuk identitas statis, canonical, metadata, JSON-LD, local links/assets, urutan software, robots, dan sitemap.
- `.vercelignore`: mengecualikan script pemeriksaan dan laporan audit. README menjelaskan verifikasi dan batas deployment.

Nama, founder, tanggal, Manado/Indonesia, alamat kontak dan fokus berasal dari brief pengguna serta source existing. Feature set kedua software diperiksa pada `C:/projects/aboutme-2026/dev-folio/src/data/portfolio.ts`. Pemakaian Claude untuk development dan analytics Kassentix dikonfirmasi pengguna sebelumnya; tidak diaudit terhadap backend produk pada audit ini. Tidak ada klaim AI di dalam KLK. Klarifikasi pengguna terakhir menjadi acuan untuk atribusi KLK, menggantikan pengelompokan lama sebagai produk milik perusahaan.

Tidak menambahkan legalName, PT/CV, nomor registrasi, alamat jalan, sameAs sosial, atau hubungan korporasi antara Teshy Labs dan PT KLK. `hello@teshylabs.me` tetap kontak publik. `chrisfivo@teshylabs.me` berasal dari data aplikasi pengguna; kepemilikan/kemampuan menerima email belum diuji dan tidak perlu dipublikasikan agar domain email konsisten.

Klarifikasi terakhir pengguna: fokus Teshy Labs adalah membantu bisnis membangun software dengan AI di dalamnya. Hero, About, metadata, dan deskripsi Organization diselaraskan ke fokus ini. Tidak menambahkan jenis layanan atau kapabilitas AI baru pada KLK.

Pemeriksaan GitHub langsung pada 7 Oktober 2026 mengonfirmasi repositori publik [Jordannst/klk-excl-frontend](https://github.com/Jordannst/klk-excl-frontend) dan [Jordannst/klk-excl-backend](https://github.com/Jordannst/klk-excl-backend) dimiliki akun Jordannst; konektor menunjukkan akses admin. README keduanya menjelaskan sistem invoice/transaksi untuk operasional internal perusahaan ekspedisi. Ini mendukung atribusi pengembangan dan kontrol repositori, tetapi tidak menetapkan hak kekayaan intelektual Teshy Labs atau kewenangan mewakili PT KLK. README yang dibaca tidak menyatakan fitur AI di dalam KLK; ini bukan audit seluruh implementasi backend.

## Verifikasi lokal

- `node scripts/check-site.mjs`: PASS. JSON.parse berhasil; ID/referensi graph resolve; tipe utama dan hubungan creator/owns sesuai fakta terkonfirmasi; canonical/sitemap/link file konsisten.
- PowerShell XML parser: sitemap dan logo SVG well-formed.
- `git diff --check`: PASS. Tidak ada build/lint framework karena situs adalah file statis tanpa bundler/dependency runtime.
- Browser lokal: homepage dan About pada lebar 360, 768, 1440 px, light/dark; tidak ada horizontal overflow. Identitas tetap tersedia tanpa JavaScript.
- Navigasi homepage → About → Products dan skip link ke main teruji; focus outline terlihat. Sumber video sesuai software setelah urutan berubah; file media tidak diubah.
- Pemeriksaan ini bukan full HTML validator, Google Rich Results validation, atau bukti indexing. Product/SoftwareApplication schema menjelaskan entitas, bukan mengklaim kelayakan rich results komersial; harga/rating tidak ditambahkan.
- `foundingDate` tetap 2025-12 sesuai presisi informasi. Tidak mengarang hari untuk memuaskan validator yang mungkin meminta tanggal lengkap.

Screenshot dan hasil browser berada di `output/qa/audit-*`, tidak termasuk deployment. Perubahan final tetap perlu pemeriksaan HTTP setelah deployment yang secara eksplisit disetujui.

## Tindakan eksternal sebelum mengajukan ulang

1. Review draft dan berikan instruksi deployment secara terpisah. Working tree ini belum mengubah situs live, termasuk klaim kepemilikan KLK yang lama.
2. Setelah deploy, pastikan homepage/About/robots/sitemap/logo memberi 200, canonical cocok, dan tidak ada noindex/challenge. Verifikasi data baru benar-benar tampil pada domain publik.
3. Gunakan Google Search Console untuk URL Inspection, submit sitemap, dan lihat status indexing aktual. Jangan berasumsi indexing segera terjadi setelah deploy.
4. Jika sesuai fakta dan izin pemilik, tautkan Kassentix → Teshy Labs; untuk KLK gunakan kredit pengembang yang akurat, bukan klaim kepemilikan atau kemitraan.
5. Uji sendiri penerimaan email ke chrisfivo@teshylabs.me dan hello@teshylabs.me. Domain login yang aktif belum membuktikan setiap mailbox menerima email.
6. Profil LinkedIn/GitHub perusahaan dapat melengkapi jejak publik hanya jika benar-benar dibuat/dimiliki perusahaan dan informasinya konsisten. Personal repository GitHub tidak otomatis menjadi profil resmi Organization.sameAs.
7. Pada aplikasi, gunakan satu identitas perusahaan, founder/peran sebenarnya, tanggal yang benar, domain resmi, serta uraian penggunaan Claude yang aktual. Jika mempertimbangkan PT KLK, periksa kewenangan pemohon, usia/peran PT, domain email, dan siapa pengguna manfaat program; jangan memakai tanggal berdirinya Teshy Labs untuk PT KLK.
8. Jika tetap ditolak, gunakan kanal dukungan resmi dengan fakta dan URL yang konsisten; jangan menganggap perubahan SEO menjamin penerimaan.

## Ketidakpastian penting

- Alasan penolakan persis, waktu request verifier, dan aturan internal Anthropic tidak tersedia. Cepatnya keputusan bukan bukti adanya error; FAQ resmi menyebut sebagian besar keputusan keluar dalam hitungan menit.
- Domain baru dialihkan dari situs lama ke Teshy Labs pada sesi ini. Cache/index lama mungkin belum diperbarui, tetapi ini hipotesis, bukan sebab penolakan yang terbukti.
- Status badan hukum Teshy Labs tidak diketahui dan tidak diklaim. Tahun pendirian, struktur kepemilikan, serta kewenangan pengguna untuk mengajukan atas nama PT KLK belum dikonfirmasi. Hubungan keluarga tidak dianggap bukti jabatan/otorisasi.
- Authorship KLK dikonfirmasi, tetapi hak kekayaan intelektual/ownership belum ditetapkan. Jangan memberi ownership schema kepada Teshy Labs berdasarkan authorship semata.
- Persyaratan program dapat berubah; kelayakan dan keputusan penerimaan ditentukan Anthropic, bukan kelengkapan JSON-LD.

## Rujukan

- [Claude for Startups — FAQ](https://claude.com/programs/startups): persyaratan domain email, usia startup, informasi aplikasi dan waktu review; dibaca 7 Oktober 2026. Halaman langsung diprioritaskan dibanding snippet pencarian yang dapat stale.
- [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization): homepage/About boleh menjadi lokasi data Organization; hanya tambahkan properti yang berlaku. Tidak ada properti wajib universal.
- [Schema.org owns](https://schema.org/owns), [WebSite](https://schema.org/WebSite), [AboutPage](https://schema.org/AboutPage), [foundingDate](https://schema.org/foundingDate), [Date](https://schema.org/Date): dasar tipe/properti dan makna hubungan.
