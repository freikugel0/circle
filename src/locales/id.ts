export const id = {
  // Auth page form validation
  EMAIL_INVALID: "Email tidak valid",
  PASSWORD_MIN: "Password minimal 8 karakter",
  REPEAT_PASSWORD_REQUIRED: "Konfirmasi password wajib diisi",
  PASSWORD_MISMATCH: "Password dan konfirmasi password tidak sama",
  USERNAME_MIN: "Username minimal 5 karakter",
  USERNAME_MAX: "Username maksimal 20 karakter",
  USERNAME_REQUIRED: "Username wajib diisi",
  PASSWORD_REQUIRED: "Password wajib diisi",

  // Time ago in thread list
  TIME: {
    seconds: "{{count}} detik yang lalu",
    minutes: "{{count}} menit yang lalu",
    hours: "{{count}} jam yang lalu",
    days: "{{count}} hari yang lalu",
    months: "{{count}} bulan yang lalu",
    years: "{{count}} tahun yang lalu",
  },

  // Index page (thread list)
  THREAD_TITLE_EMPTY: "Judul dari thread tidak boleh kosong",
  THREAD_TITLE_TOO_LONG: "Judul dari thread maksimal 150 karakter",
  THREAD_CONTENT_EMPTY: "Konten dari thread tidak boleh kosong",
  THREAD_CONTENT_TOO_LONG: "Konten dari thread maksimal 1000 karakter",

  // Thread detail page (reply list)
  REPLY_CONTENT_EMPTY: "Konten dari reply tidak boleh kosong",
  REPLY_CONTENT_TOO_LONG: "Konten dari reply maksimal 1000 karakter",

  // User edit form dialog
  FULLNAME_MIN: "Nama lengkap tidak boleh kosong",
  FULLNAME_MAX: "Nama lengkap maksimal 50 karakter",
  BIO_MAX: "Bio harus dibawah 150 karakter",

  // API
  API_NOT_FOUND: "Endpoint API tidak ditemukan",
  API_UNEXPECTED_ERROR: "Terjadi kesalahan pada server",
  API_LIMIT_EXCEEDED: "Batas permintaan telah terlampaui",

  // File
  FILE_TOO_LARGE: "Ukuran file terlalu besar, max 3MB",
  FILE_UPLOAD_FAILED: "Gagal mengunggah file",
  FILE_INVALID_TYPE: "Jenis file tidak valid untuk file gambar",

  // Auth
  AUTH_TOKEN_MISSING: "Token autentikasi tidak ditemukan",
  AUTH_TOKEN_INVALID: "Token autentikasi tidak valid",
  AUTH_UNAUTHORIZED: "Anda tidak memiliki otorisasi",
  AUTH_FORBIDDEN: "Akses ditolak",
  AUTH_VALIDATION_ERROR: "Terjadi kesalahan validasi",

  // Register
  AUTH_EMAIL_ALREADY_REGISTERED: "Email sudah terdaftar",

  // Login
  AUTH_USER_NOT_FOUND: "Pengguna tidak ditemukan",
  AUTH_INCORRECT_PASSWORD: "Password salah, mohon di cek kembali",

  // Reset
  AUTH_RESET_TOKEN_INVALID: "Token reset tidak valid",
};
