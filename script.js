// 🔹 Variabel Global
let transactions = []; // SATU array untuk menyimpan semua data (pemasukan & pengeluaran)
let chart; // Variabel untuk menyimpan instance Chart.js

// -----------------------------------------------------------
// --- FUNGSI LOCALSTORAGE (Simpan per Bulan) ---
// -----------------------------------------------------------

/**
 * 🔑 Mendapatkan kunci unik untuk localStorage berdasarkan tahun & bulan saat ini.
 */
function getCurrentStorageKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // '11'
  return `financialData_${year}_${month}`;
}

/**
 * 💾 Menyimpan array 'transactions' ke localStorage
 */
function saveData() {
  const key = getCurrentStorageKey();
  const dataToSave = {
    transactions: transactions
  };
  localStorage.setItem(key, JSON.stringify(dataToSave));
}

/**
 * 📥 Memuat data dari localStorage saat halaman dibuka
 */
function loadData() {
  updateTampilanBulan(); // Tampilkan bulan & tahun

  const key = getCurrentStorageKey();
  const dataBulanIni = JSON.parse(localStorage.getItem(key));

  if (dataBulanIni && dataBulanIni.transactions) {
    transactions = dataBulanIni.transactions;
  } else {
    transactions = []; // Kosongkan jika bulan baru
  }

  updateUI(); // Perbarui semua tampilan
}

/**
 * 📅 Memperbarui tampilan bulan dan tahun saat ini
 */
function updateTampilanBulan() {
  const now = new Date();
  const options = { month: 'long', year: 'numeric' };
  const namaBulanTahun = now.toLocaleDateString('id-ID', options);
  
  const displayElement = document.getElementById('tampilanBulanTahun');
  if (displayElement) {
    displayElement.textContent = namaBulanTahun;
  }
}

// -----------------------------------------------------------
// --- FUNGSI INTI APLIKASI ---
// -----------------------------------------------------------

/**
 * 💸 Tambah data (Pemasukan atau Pengeluaran)
 */
function tambahData() {
  const tipe = document.getElementById('tipe').value;
  const kategori = document.getElementById('kategori').value;
  const jumlah = parseInt(document.getElementById('jumlah').value);

  // Validasi
  if (!tipe || !kategori || !jumlah || jumlah <= 0) {
    alert("Isi semua kolom (Tipe, Kategori, Jumlah) dulu ya 😜");
    return;
  }

  // Buat objek transaksi baru
  const newTransaction = {
    id: Date.now(), // ID unik untuk mempermudah penghapusan
    tipe: tipe,
    kategori: kategori,
    jumlah: jumlah
  };

  transactions.push(newTransaction);
  
  saveData(); // Simpan data
  updateUI(); // Perbarui tampilan

  // Kosongkan form
  document.getElementById('tipe').value = '';
  document.getElementById('kategori').value = '';
  document.getElementById('jumlah').value = '';
}

/**
 * ❌ Hapus data berdasarkan ID uniknya
 */
function hapusData(id) {
  const index = transactions.findIndex(t => t.id === id);
  
  if (index > -1) {
    transactions.splice(index, 1); // Hapus dari array
    saveData(); // Simpan
    updateUI(); // Perbarui tampilan
  }
}

/**
 * 🔄 FUNGSI UTAMA: Memperbarui semua elemen UI (Kartu, Tabel, Grafik)
 */
function updateUI() {
  // 1. Dapatkan elemen tabel
  const pemasukanBody = document.getElementById('tabelPemasukanBody');
  const pengeluaranBody = document.getElementById('tabelPengeluaranBody');
  
  // Kosongkan tabel
  pemasukanBody.innerHTML = '';
  pengeluaranBody.innerHTML = '';

  // 2. Hitung Total
  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  // Data untuk grafik (hanya pengeluaran)
  const expenseCategories = [];
  const expenseAmounts = [];

  // 3. Loop melalui semua transaksi
  transactions.forEach(t => {
    // Buat baris tabel
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.kategori}</td>
      <td>${t.jumlah.toLocaleString()}</td>
      <td><button onclick="hapusData(${t.id})">❌</button></td>
    `;

    // Masukkan ke tabel yang benar dan hitung total
    if (t.tipe === 'pemasukan') {
      pemasukanBody.appendChild(row);
      totalPemasukan += t.jumlah;
    } else {
      pengeluaranBody.appendChild(row);
      totalPengeluaran += t.jumlah;
      
      // Tambahkan ke data grafik
      expenseCategories.push(t.kategori);
      expenseAmounts.push(t.jumlah);
    }
  });

  // 4. Update Kartu Dashboard
  const totalTabungan = totalPemasukan - totalPengeluaran;
  document.getElementById('income').textContent = totalPemasukan.toLocaleString();
  document.getElementById('expenses').textContent = totalPengeluaran.toLocaleString();
  document.getElementById('savings').textContent = totalTabungan.toLocaleString();

  // 5. Update Total Pengeluaran (di bawah tabel)
  document.getElementById('total').textContent = totalPengeluaran.toLocaleString();

  // 6. Update Grafik
  if (chart) {
    chart.data.labels = expenseCategories;
    chart.data.datasets[0].data = expenseAmounts;
    chart.update();
  }
}


// -----------------------------------------------------------
// --- INISIALISASI ---
// -----------------------------------------------------------

/**
 * 🎨 Inisialisasi Chart.js
 */
function initializeChart() {
  const ctx = document.getElementById('chartPengeluaran').getContext('2d');
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [], // Diisi oleh updateUI
      datasets: [{
        data: [], // Diisi oleh updateUI
        backgroundColor: ['#A8C3A8', '#D6E2D6', '#C2D1C2', '#B0C5B0', '#9CB59C', '#8AA18A', '#7B917B'],
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
}

// 🔹 Panggil inisialisasi saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
  initializeChart(); // Buat chart dulu
  loadData(); // Baru muat data (yang akan mengisi chart)
});
