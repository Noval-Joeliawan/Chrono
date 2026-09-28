// =====================================================
// STOPWATCH — basis kode lama, ditambah Lanjut & Lap
// =====================================================

let milidetik = 0;
let detik = 0;
let menit = 0;
let interval;
let nomorLap = 0;

function mulaiStopwatch() {
  if (!interval) {
    interval = setInterval(() => {
      milidetik++;

      if (milidetik === 100) {
        milidetik = 0;
        detik++;
      }

      if (detik === 60) {
        detik = 0;
        menit++;
      }

      document.querySelector(".menit").textContent = String(menit).padStart(
        2,
        "0",
      );
      document.querySelector(".detik").textContent = String(detik).padStart(
        2,
        "0",
      );
      document.querySelector(".milidetik").textContent = String(
        milidetik,
      ).padStart(2, "0");
    }, 10);
  }
}

// "Lanjut" = mulai lagi tanpa mengosongkan angka (logikanya sama)
function lanjutStopwatch() {
  mulaiStopwatch();
}

function stopStopwatch() {
  clearInterval(interval);
  interval = null;
}

function resetStopwatch() {
  stopStopwatch();
  milidetik = 0;
  detik = 0;
  menit = 0;
  nomorLap = 0;
  document.querySelector(".menit").textContent = "00";
  document.querySelector(".detik").textContent = "00";
  document.querySelector(".milidetik").textContent = "00";
  document.getElementById("daftar-lap").innerHTML = "";
}

// Catat satu lap: simpan waktu saat ini ke daftar
function catatLap() {
  const daftar = document.getElementById("daftar-lap");
  nomorLap++;

  const waktu =
    String(menit).padStart(2, "0") +
    ":" +
    String(detik).padStart(2, "0") +
    "." +
    String(milidetik).padStart(2, "0");

  const item = document.createElement("li");
  item.innerHTML =
    "<span>Lap " + nomorLap + "</span><span>" + waktu + "</span>";
  daftar.prepend(item); // lap terbaru tampil paling atas
}
