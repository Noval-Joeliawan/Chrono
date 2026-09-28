// =====================================================
// APP — navigasi halaman, modal, dan suara notifikasi
// =====================================================

// ---------- Navigasi ----------
document.querySelectorAll(".navigasi button").forEach((tombol) => {
  tombol.addEventListener("click", () => {
    // Hapus tanda aktif di semua tombol & halaman
    document
      .querySelectorAll(".navigasi button")
      .forEach((b) => b.classList.remove("aktif"));
    document
      .querySelectorAll(".halaman")
      .forEach((h) => h.classList.remove("aktif"));

    // Aktifkan yang dipilih
    tombol.classList.add("aktif");
    document
      .getElementById("halaman-" + tombol.dataset.halaman)
      .classList.add("aktif");
  });
});

// ---------- Modal notifikasi ----------
let suaraSedangBunyi = null;

function tampilkanModal(ikon, judul, pesan, mulaiSuara) {
  document.getElementById("modal-ikon").textContent = ikon;
  document.getElementById("modal-judul").textContent = judul;
  document.getElementById("modal-pesan").textContent = pesan;
  document.getElementById("modal").hidden = false;

  if (mulaiSuara) mulaiSuara();
}

function tutupModal() {
  document.getElementById("modal").hidden = true;
  hentikanSuara();
  hentikanAlarm(); // hentikan alarm yang sedang berbunyi (jika ada)
}

document.getElementById("modal-tutup").addEventListener("click", tutupModal);

// ---------- Suara notifikasi (Web Audio API) ----------
// Bunyi "beep-beep". Jika browser menolak audio otomatis,
// fungsi ini gagal diam-diam dan notifikasi visual tetap muncul.
function bunyi() {
  return function () {
    try {
      const konteks = new (window.AudioContext || window.webkitAudioContext)();

      function beep(waktuMulai) {
        const osilator = konteks.createOscillator();
        const gain = konteks.createGain();
        osilator.connect(gain);
        gain.connect(konteks.destination);
        osilator.frequency.value = 880;
        gain.gain.setValueAtTime(0.2, konteks.currentTime + waktuMulai);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          konteks.currentTime + waktuMulai + 0.3,
        );
        osilator.start(konteks.currentTime + waktuMulai);
        osilator.stop(konteks.currentTime + waktuMulai + 0.3);
      }

      // Dua beep: detik ke-0 dan ke-0.4
      beep(0);
      beep(0.4);

      suaraSedangBunyi = konteks;
    } catch (e) {
      // Browser tidak mengizinkan audio — abaikan, modal tetap tampil
    }
  };
}

function hentikanSuara() {
  if (suaraSedangBunyi) {
    try {
      suaraSedangBunyi.close();
    } catch (e) {
      // sudah tertutup
    }
    suaraSedangBunyi = null;
  }
}

// ---------- Inisialisasi saat halaman dibuka ----------
document.getElementById("form-alarm").addEventListener("submit", tambahAlarm);
document
  .getElementById("btn-tambah-kota")
  .addEventListener("click", tambahKota);
document.getElementById("cari-kota").addEventListener("input", isiDropdown);

renderAlarm();
isiDropdown();
renderKota();
tampilkanTimer(); // timer langsung menampilkan nilai default (00:05:00)
mulaiJam();
