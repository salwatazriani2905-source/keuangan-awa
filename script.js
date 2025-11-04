let total = 0;

function tambahData() {
  const kategori = document.getElementById('kategori').value;
  const jumlah = parseInt(document.getElementById('jumlah').value);
  
  if (!kategori || !jumlah) return alert("Isi semua kolom dulu ya 😅");

  const tabelBody = document.querySelector('#tabelKeuangan tbody');
  const row = document.createElement('tr');
  row.innerHTML = <td>${kategori}</td><td>${jumlah.toLocaleString()}</td>;
  tabelBody.appendChild(row);

  total += jumlah;
  document.getElementById('total').textContent = total.toLocaleString();

  document.getElementById('kategori').value = '';
  document.getElementById('jumlah').value = '';
}
