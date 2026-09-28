// =====================================================
// TIMER — countdown jam:menit:detik
// =====================================================

let sisaDetik = 0; // sisa waktu dalam detik
let timerInterval = null;

// Ambil input dari 3 kotak jam/menit/detik (dengan validasi agar tidak NaN)
function ambilTotalDetik() {
  const jam = Math.max(
    0,
    parseInt(document.getElementById("timer-jam").value) || 0,
  );
  const menit = Math.max(
    0,
    parseInt(document.getElementById("timer-menit").value) || 0,
  );
  const detik = Math.max(
    0,
    parseInt(document.getElementById("timer-detik").value) || 0,
  );
  return jam * 3600 + menit * 60 + detik;
}

// Tampilkan sisa waktu sebagai HH:MM:SS (tidak pernah negatif)
function tampilkanTimer() {
  const sisa = Math.max(0, sisaDetik);
  const jam = String(Math.floor(sisa / 3600)).padStart(2, "0");
  const menit = String(Math.floor((sisa % 3600) / 60)).padStart(2, "0");
  const detik = String(sisa % 60).padStart(2, "0");
  document.getElementById("timer-tampilan").textContent =
    jam + ":" + menit + ":" + detik;
}

function mulaiTimer() {
  if (timerInterval) return; // sudah berjalan

  sisaDetik = ambilTotalDetik();

  if (sisaDetik <= 0) {
    tampilkanTimer();
    return; // jangan jalankan timer 00:00:00
  }

  document.getElementById("timer-tampilan").classList.remove("timer-selesai");
  tampilkanTimer();

  timerInterval = setInterval(() => {
    sisaDetik--;

    if (sisaDetik <= 0) {
      sisaDetik = 0; // jangan sampai negatif
      tampilkanTimer();
      selesaiTimer();
      return;
    }

    tampilkanTimer();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// "Lanjut" = jalankan lagi dari sisa waktu terakhir
function lanjutTimer() {
  if (sisaDetik > 0 && !timerInterval) {
    mulaiTimerDariSisa();
  }
}

// Sama seperti mulaiTimer, tetapi tanpa membaca ulang input
function mulaiTimerDariSisa() {
  document.getElementById("timer-tampilan").classList.remove("timer-selesai");
  tampilkanTimer();

  timerInterval = setInterval(() => {
    sisaDetik--;

    if (sisaDetik <= 0) {
      sisaDetik = 0;
      tampilkanTimer();
      selesaiTimer();
      return;
    }

    tampilkanTimer();
  }, 1000);
}

function resetTimer() {
  pauseTimer();
  sisaDetik = 0;
  document.getElementById("timer-tampilan").classList.remove("timer-selesai");
  document.getElementById("timer-jam").value = 0;
  document.getElementById("timer-menit").value = 5;
  document.getElementById("timer-detik").value = 0;
  tampilkanTimer();
}

// Timer habis: tampilkan modal + bunyi (jika diizinkan browser)
function selesaiTimer() {
  pauseTimer();
  tampilkanModal(
    "⌛",
    "Timer selesai!",
    "Waktu countdown sudah habis. Waktu " +
      document.getElementById("timer-tampilan").textContent +
      " tercapai.",
    bunyi(), // mulai bunyi; kalau browser menolak, modal tetap muncul
  );
}
