// =====================================================
// JAM DUNIA — pakai Intl.DateTimeFormat + timezone IANA
// =====================================================

// Katalog kota: nama kota, negara, timezone IANA
const KATALOG_KOTA = [
  { kota: "Jakarta", negara: "Indonesia", zona: "Asia/Jakarta" },
  { kota: "Surabaya", negara: "Indonesia", zona: "Asia/Jakarta" },
  { kota: "Singapore", negara: "Singapura", zona: "Asia/Singapore" },
  { kota: "Tokyo", negara: "Jepang", zona: "Asia/Tokyo" },
  { kota: "Seoul", negara: "Korea Selatan", zona: "Asia/Seoul" },
  { kota: "London", negara: "Inggris", zona: "Europe/London" },
  { kota: "Paris", negara: "Prancis", zona: "Europe/Paris" },
  { kota: "New York", negara: "Amerika Serikat", zona: "America/New_York" },
  {
    kota: "Los Angeles",
    negara: "Amerika Serikat",
    zona: "America/Los_Angeles",
  },
  { kota: "Dubai", negara: "Uni Emirat Arab", zona: "Asia/Dubai" },
  { kota: "Sydney", negara: "Australia", zona: "Australia/Sydney" },
];

// Kota favorit pengguna (disimpan di localStorage)
let favorit = JSON.parse(localStorage.getItem("chrono-kota") || "[]");

function simpanFavorit() {
  localStorage.setItem("chrono-kota", JSON.stringify(favorit));
}

// Isi dropdown pilihan kota, difilter oleh kotak pencarian
function isiDropdown() {
  const cari = document.getElementById("cari-kota").value.toLowerCase();
  const select = document.getElementById("pilih-kota");

  select.innerHTML = "";

  const hasil = KATALOG_KOTA.filter(
    (k) =>
      k.kota.toLowerCase().includes(cari) ||
      k.negara.toLowerCase().includes(cari),
  );

  if (hasil.length === 0) {
    const opsi = document.createElement("option");
    opsi.textContent = "Kota tidak ditemukan";
    select.appendChild(opsi);
    return;
  }

  hasil.forEach((k) => {
    const opsi = document.createElement("option");
    opsi.value = k.kota;
    opsi.textContent = k.kota + " — " + k.negara;
    select.appendChild(opsi);
  });
}

// Tambah kota yang dipilih ke daftar favorit
function tambahKota() {
  const nama = document.getElementById("pilih-kota").value;
  const data = KATALOG_KOTA.find((k) => k.kota === nama);

  if (!data) return;
  if (favorit.some((k) => k.kota === nama)) return; // sudah ada

  favorit.push(data);
  simpanFavorit();
  renderKota();
}

// Hapus kota dari daftar favorit
function hapusKota(nama) {
  favorit = favorit.filter((k) => k.kota !== nama);
  simpanFavorit();
  renderKota();
}

// Hitung selisih zona waktu kota terhadap waktu lokal (contoh: "+2j")
function selisihZona(zona) {
  // Waktu kota dan waktu lokal, keduanya dihitung dari tanggal yang sama
  const sekarang = new Date();
  const lokal = new Intl.DateTimeFormat("en-GB", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: "numeric",
  }).formatToParts(sekarang);

  const kota = new Intl.DateTimeFormat("en-GB", {
    timeZone: zona,
    hour: "numeric",
  }).formatToParts(sekarang);

  const jamLokal = Number(lokal.find((p) => p.type === "hour").value);
  const jamKota = Number(kota.find((p) => p.type === "hour").value);

  let selisih = jamKota - jamLokal;
  if (selisih > 12) selisih -= 24; // jaga agar rentangnya -11..+12
  if (selisih < -12) selisih += 24;

  return (selisih >= 0 ? "+" : "") + selisih + "j";
}

// Gambar ulang daftar kota favorit
function renderKota() {
  const ul = document.getElementById("daftar-kota");
  const kosong = document.getElementById("kota-kosong");

  ul.innerHTML = "";
  kosong.style.display = favorit.length === 0 ? "block" : "none";

  favorit.forEach((k) => {
    const li = document.createElement("li");

    li.innerHTML =
      "<div class='info'>" +
      "<strong>" +
      k.kota +
      "</strong>" +
      "<small>" +
      k.negara +
      " • " +
      k.zona +
      "</small>" +
      "</div>" +
      "<span class='waktu-kota'>--:--</span>" +
      "<small class='status on'>" +
      selisihZona(k.zona) +
      "</small>" +
      "<button class='btn kecil btn-merah'>Hapus</button>";

    li.querySelector("button").onclick = () => hapusKota(k.kota);

    ul.appendChild(li);
  });

  perbaruiJamKota(); // langsung isi waktu agar tidak tampil "--:--"
}

// Perbarui waktu tiap kota favorit (dipanggil tiap detik dari clock.js)
function perbaruiJamKota() {
  const baris = document.querySelectorAll("#daftar-kota li");

  favorit.forEach((k, i) => {
    if (!baris[i]) return;

    const jam = new Intl.DateTimeFormat("id-ID", {
      timeZone: k.zona,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());

    baris[i].querySelector(".waktu-kota").textContent = jam;
  });
}
