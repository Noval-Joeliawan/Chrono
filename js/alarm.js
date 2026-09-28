// =====================================================
// ALARM — daftar alarm disimpan di localStorage
// =====================================================

let daftarAlarm = JSON.parse(localStorage.getItem("chrono-alarm") || "[]");
let alarmYangBunyi = null; // id alarm yang sedang berbunyi

// Simpan daftar alarm ke localStorage
function simpanAlarm() {
  localStorage.setItem("chrono-alarm", JSON.stringify(daftarAlarm));
}

// Tambah alarm baru dari form
function tambahAlarm(event) {
  event.preventDefault(); // cegah halaman reload

  const nama = document.getElementById("alarm-nama").value.trim() || "Alarm";
  const waktu = document.getElementById("alarm-waktu").value;

  if (!waktu) return; // waktu kosong, batal

  daftarAlarm.push({
    id: Date.now(), // id unik sederhana
    nama: nama,
    waktu: waktu, // format "HH:MM"
    aktif: true,
  });

  simpanAlarm();
  document.getElementById("form-alarm").reset();
  renderAlarm();
}

// Hapus alarm berdasarkan id
function hapusAlarm(id) {
  daftarAlarm = daftarAlarm.filter((a) => a.id !== id);
  simpanAlarm();
  renderAlarm();
}

// Aktifkan / nonaktifkan alarm
function toggleAlarm(id) {
  const alarm = daftarAlarm.find((a) => a.id === id);
  if (alarm) alarm.aktif = !alarm.aktif;
  simpanAlarm();
  renderAlarm();
}

// Edit nama & waktu alarm (pakai prompt bawaan browser — sederhana untuk pemula)
function editAlarm(id) {
  const alarm = daftarAlarm.find((a) => a.id === id);
  if (!alarm) return;

  const namaBaru = prompt("Nama alarm:", alarm.nama);
  if (namaBaru === null) return;

  const waktuBaru = prompt("Waktu alarm (HH:MM):", alarm.waktu);
  if (waktuBaru === null) return;

  if (waktuBaru.trim() !== "") alarm.waktu = waktuBaru.trim();
  alarm.nama = namaBaru.trim() || alarm.nama;
  simpanAlarm();
  renderAlarm();
}

// Gambar ulang daftar alarm di halaman
function renderAlarm() {
  const ul = document.getElementById("daftar-alarm");
  const kosong = document.getElementById("alarm-kosong");

  ul.innerHTML = "";
  kosong.style.display = daftarAlarm.length === 0 ? "block" : "none";

  daftarAlarm.forEach((alarm) => {
    const li = document.createElement("li");

    li.innerHTML =
      "<div class='info'>" +
      "<strong>" +
      alarm.nama +
      "</strong>" +
      "<small>" +
      alarm.waktu +
      " • " +
      "<span class='status " +
      (alarm.aktif ? "on'>AKTIF" : "off'>NONAKTIF") +
      "</span>" +
      "</small>" +
      "</div>" +
      "<button class='btn kecil " +
      (alarm.aktif ? "btn-kuning" : "btn-nonaktif") +
      "'>" +
      (alarm.aktif ? "Matikan" : "Aktifkan") +
      "</button>" +
      "<button class='btn kecil btn-biru'>Edit</button>" +
      "<button class='btn kecil btn-merah'>Hapus</button>";

    // Pasang aksi tombol (urutan: [0]=toggle, [1]=edit, [2]=hapus)
    const tombol = li.querySelectorAll("button");
    tombol[0].onclick = () => toggleAlarm(alarm.id);
    tombol[1].onclick = () => editAlarm(alarm.id);
    tombol[2].onclick = () => hapusAlarm(alarm.id);

    ul.appendChild(li);
  });
}

// Dipanggil tiap detik dari clock.js: cek apakah ada alarm yang waktunya sama
function cekAlarm() {
  const sekarang = new Date();
  const waktuSekarang =
    String(sekarang.getHours()).padStart(2, "0") +
    ":" +
    String(sekarang.getMinutes()).padStart(2, "0");

  daftarAlarm.forEach((alarm) => {
    const sudahBunyiMenitIni =
      alarm.terakhirBunyi === waktuSekarang + hariIni();

    if (alarm.aktif && alarm.waktu === waktuSekarang && !sudahBunyiMenitIni) {
      alarm.terakhirBunyi = waktuSekarang + hariIni();
      simpanAlarm();
      alarmYangBunyi = alarm;
      tampilkanModal(
        "⏰",
        "Alarm berbunyi!",
        alarm.nama + " — " + alarm.waktu,
        bunyi(),
      );
    }
  });
}

// Penanda hari agar alarm tidak bunyi dua kali di menit yang sama pada hari berbeda
function hariIni() {
  return "-" + new Date().toDateString();
}

// Hentikan alarm yang sedang berbunyi (dipanggil dari tombol modal)
function hentikanAlarm() {
  alarmYangBunyi = null;
}
