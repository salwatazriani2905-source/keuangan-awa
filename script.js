// 🔹 Global variables (diisi saat loadData)
let total = 0;
let income = 2400000; // Gaji Awa 💸 (ini jadi default jika data kosong)
let savings = 0;
let kategoriList = [];
let jumlahList = [];

// -----------------------------------------------------------
// --- FUNGSI BARU UNTUK LOCALSTORAGE ---
// -----------------------------------------------------------

/**
 * 🔑 Mendapatkan kunci unik untuk localStorage berdasarkan tahun & bulan saat ini.
 * Contoh: "financialData_2025_11"
 */
function getCurrentStorageKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // '11'
  return `financialData_${year}_${month}`;
}

/**
 * 💾 Menyimpan data saat ini (dari variabel global) ke localStorage
 */
function saveData() {
  const key = getCurrentStorageKey();
  const dataToSave = {
    income: income,
    kategoriList: kategoriList,
    jumlahList: jumlahList,
    total: total
  };
  localStorage.setItem(key, JSON.stringify(dataToSave));
}

/**
 * 📥 Memuat data dari localStorage saat halaman dibuka
 */
function loadData() {
  const key = getCurrentStorageKey();
  const dataBulanIni = JSON.parse(localStorage.getItem(key));

  if (dataBulanIni) {
    // Jika ADA data, pakai data itu
    income = dataBulanIni.income;
    kategoriList = dataBulanIni.kategoriList;
    jumlahList = dataBulanIni.jumlahList;
    total = dataBulanIni.total;
  }
  // Jika TIDAK ADA data (null), variabel global default akan dipakai (bulan baru)

  // Setelah data dimuat, update semuanya
  updateDashboard();
  updateChart();
  rebuildTable(); // <-- Fungsi baru untuk mengisi tabel
}

/**
 * 📋 Membangun ulang tabel dari data yang dimuat
 */
function rebuildTable() {
  const tabelBody = document.querySelector('#tabelKeuangan tbody');
  tabelBody.innerHTML = ''; // Kosongkan tabel dulu

  for (let i = 0; i < kategoriList.length; i++) {
    const kategori = kategoriList[i];
    const jumlah = jumlahList[i];

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${kategori}</td>
      <td>${jumlah.toLocaleString()}</td>
      <td><button onclick="hapusData(this, '${kategori}', ${jumlah})">❌</button></td>
    `;
    tabelBody.appendChild(row);
  }

  // Update total di bawah tabel
  document.getElementById('total').textContent = total.toLocaleString();
}

// -----------------------------------------------------------
// --- FUNGSI LAMA ANDA (DENGAN SEDIKIT UBAHAN) ---
// -----------------------------------------------------------

// 🔹 Update dashboard (Tidak ada perubahan)
function updateDashboard() {
  document.getElementById('income').textContent = income.toLocaleString();
  document.getElementById('expenses').textContent = total.toLocaleString();
  document.getElementById('savings').textContent = (income - total).toLocaleString();
}

// 🔹 Tambah data ke tabel
function tambahData() {
  const kategori = document.getElementById('kategori').value;
  const jumlah = parseInt(document.getElementById('jumlah').value);

  if (!kategori || !jumlah) return alert("Isi semua kolom dulu ya 😜");

  const tabelBody = document.querySelector('#tabelKeuangan tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${kategori}</td>
    <td>${jumlah.toLocaleString()}</td>
    <td><button onclick="hapusData(this, '${kategori}', ${jumlah})">❌</button></td>
  `;
  tabelBody.appendChild(row);

  kategoriList.push(kategori);
  jumlahList.push(jumlah);
  total += jumlah;

  document.getElementById('total').textContent = total.toLocaleString();
  updateDashboard();
  updateChart();

  // --- TAMBAHAN ---
  saveData(); // Simpan data setiap kali menambah

  document.getElementById('kategori').value = '';
  document.getElementById('jumlah').value = '';
}

// 🔹 Hapus data dari tabel
function hapusData(button, kategori, jumlah) {
  const row = button.parentElement.parentElement;
  row.remove();

  const index = kategoriList.indexOf(kategori);
  // Catatan: Ini akan menghapus item *pertama* yang cocok.
  // Jika ada 2 kategori "Makan", ini mungkin menghapus yang salah.
  if (index > -1) {
    kategoriList.splice(index, 1);
    jumlahList.splice(index, 1);
  }

  total -= jumlah;
  document.getElementById('total').textContent = total.toLocaleString();
  updateDashboard();
  updateChart();

  // --- TAMBAHAN ---
  saveData(); // Simpan data setiap kali menghapus
}

// -----------------------------------------------------------
// --- KODE CHART (TIDAK BERUBAH) ---
// -----------------------------------------------------------

// 🔹 Buat chart
const ctx = document.getElementById('chartPengeluaran').getContext('2d');
let chart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#A8C3A8', '#D6E2D6', '#C2D1C2', '#B0C5B0', '#9CB59C'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Poppins' },
          color: '#2e2e2e'
        }
      }
    }
  }
});

// 🔹 Update chart tiap kali data berubah (Tidak ada perubahan)
function updateChart() {
  chart.data.labels = kategoriList;
  chart.data.datasets[0].data = jumlahList;
  chart.update();
}

// -----------------------------------------------------------
// --- INISIALISASI ---
// -----------------------------------------------------------

// 🔹 Panggil loadData() saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', loadData);