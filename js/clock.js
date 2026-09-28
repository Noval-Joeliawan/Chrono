// =====================================================
// JAM — jam utama, format 24 jam, diperbarui realtime
// =====================================================

function mulaiJam() {
  const elJam = document.getElementById("jam-utama");
  const elTanggal = document.getElementById("jam-tanggal");
  const elZona = document.getElementById("jam-zona");

  // Tampilkan zona waktu lokal (misalnya "Asia/Jakarta (WIB)")
  const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
  elZona.textContent = "Zona waktu: " + zona;

  function perbarui() {
    const sekarang = new Date();

    // Jam:menit:detik format 24 jam
    elJam.textContent = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(sekarang);

    // Hari dan tanggal dalam Bahasa Indonesia
    elTanggal.textContent = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(sekarang);

    // Jam dunia + alarm ikut diperbarui di sini agar sinkron
    perbaruiJamKota();
    cekAlarm();
  }

  perbarui();
  setInterval(perbarui, 1000);
}
