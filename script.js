let total = 0;
let income = 2400000; // Gaji Awa 💸
let savings = 0;
let kategoriList = [];
let jumlahList = [];

// 🔹 Update dashboard
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

  document.getElementById('kategori').value = '';
  document.getElementById('jumlah').value = '';
}

// 🔹 Hapus data dari tabel
function hapusData(button, kategori, jumlah) {
  const row = button.parentElement.parentElement;
  row.remove();

  const index = kategoriList.indexOf(kategori);
  if (index > -1) {
    kategoriList.splice(index, 1);
    jumlahList.splice(index, 1);
  }

  total -= jumlah;
  document.getElementById('total').textContent = total.toLocaleString();
  updateDashboard();
  updateChart();
}

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

// 🔹 Update chart tiap kali data berubah
function updateChart() {
  chart.data.labels = kategoriList;
  chart.data.datasets[0].data = jumlahList;
  chart.update();
}

// pertama kali halaman dibuka
updateDashboard();