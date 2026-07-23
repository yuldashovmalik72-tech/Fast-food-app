// Umumiy xatoliklarni ushlab, foydalanuvchiga tushunarli javob qaytaradi
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Serverda kutilmagan xatolik yuz berdi",
  });
}

module.exports = errorHandler;
