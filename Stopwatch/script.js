let milidetik = 0;
let detik = 0;
let menit = 0;
let interval;

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

function stopStopwatch() {
  clearInterval(interval);
  interval = null;
}

function resetStopwatch() {
  stopStopwatch();
  milidetik = 0;
  detik = 0;
  menit = 0;
  document.querySelector(".menit").textContent = "00";
  document.querySelector(".detik").textContent = "00";
  document.querySelector(".milidetik").textContent = "00";
}
