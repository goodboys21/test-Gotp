// File: server.js
// ⚠️ PERINGATAN: JANGAN UPLOAD FILE INI KE GITHUB JIKA ADA KUNCI API

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// === 🔴 KUNCI RAHASIA ANDA DITARUH LANGSUNG DI SINI (BERISIKO TINGGI) ===
const CASHIFY_KEY = "cashify_90bbca42fc70c3861a5f9be1f9ae15d4417bb5a33fbc84067a156dceb0450a83";
const QRIS_ID = "796c8480-5ab5-46e3-bf3b-dda565f81317";
// ======================================================================

// Middleware
app.use(cors()); // Izinkan permintaan dari frontend
app.use(express.json()); // Izinkan server membaca JSON

// --- Endpoint/URL API Anda ---
app.post("/api/create-qris", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount diperlukan" });
    }

    // Panggil API Cashify
    const { data } = await axios.post(
      "https://cashify.my.id/api/generate/qris",
      {
        id: QRIS_ID,
        amount: parseInt(amount),
        useUniqueCode: false,
        packageIds: ["id.dana"],
        expiredInMinutes: 15,
      },
      { headers: { "x-license-key": CASHIFY_KEY, "content-type": "application/json" } }
    );

    const { transactionId, qr_string } = data.data;
    
    const qrUrl = `https://larabert-qrgen.hf.space/v1/create-qr-code?size=500x500&style=2&color=000000&data=${encodeURIComponent(
      qr_string
    )}`;

    // Kirim balasan sukses ke frontend
    res.json({
      qrUrl: qrUrl,
      transactionId: transactionId,
    });

  } catch (err) {
    console.error("Error QRIS:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "Gagal membuat QRIS" });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
