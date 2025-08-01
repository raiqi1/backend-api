import { body } from "express-validator";

// Auth validators
export const validateSignUp = [
  body("email").isEmail().withMessage("Email tidak valid").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Email tidak valid").normalizeEmail(),
  body("password").notEmpty().withMessage("Password diperlukan"),
];

// Biodata validators
export const validateBiodata = [
  body("namaLengkap")
    .notEmpty()
    .withMessage("Nama lengkap diperlukan")
    .isLength({ max: 255 })
    .withMessage("Nama lengkap maksimal 255 karakter"),

  body("tempatLahir")
    .notEmpty()
    .withMessage("Tempat lahir diperlukan")
    .isLength({ max: 255 })
    .withMessage("Tempat lahir maksimal 255 karakter"),

  body("tanggalLahir")
    .notEmpty()
    .withMessage("Tanggal lahir diperlukan")
    .isISO8601()
    .withMessage("Format tanggal lahir tidak valid"),

  body("jenisKelamin")
    .notEmpty()
    .withMessage("Jenis kelamin diperlukan")
    .isIn(["Laki-laki", "Perempuan"])
    .withMessage("Jenis kelamin harus Laki-laki atau Perempuan"),

  body("agama")
    .notEmpty()
    .withMessage("Agama diperlukan")
    .isLength({ max: 50 })
    .withMessage("Agama maksimal 50 karakter"),

  body("statusPernikahan")
    .notEmpty()
    .withMessage("Status pernikahan diperlukan")
    .isIn(["Belum Menikah", "Menikah", "Cerai", "Duda/Janda"])
    .withMessage("Status pernikahan tidak valid"),

  body("alamatKTP").notEmpty().withMessage("Alamat KTP diperlukan"),

  body("alamatDomisili").notEmpty().withMessage("Alamat domisili diperlukan"),

  body("noTelepon")
    .notEmpty()
    .withMessage("Nomor telepon diperlukan")
    .isMobilePhone("id-ID")
    .withMessage("Format nomor telepon tidak valid"),

  body("email").isEmail().withMessage("Email tidak valid").normalizeEmail(),

  body("posisiDilamar")
    .notEmpty()
    .withMessage("Posisi yang dilamar diperlukan")
    .isLength({ max: 255 })
    .withMessage("Posisi yang dilamar maksimal 255 karakter"),

  body("gajiDiharapkan")
    .isFloat({ min: 0 })
    .withMessage("Gaji yang diharapkan harus berupa angka positif"),

  // Validate pendidikan terakhir array
  body("pendidikanTerakhir")
    .optional()
    .isArray()
    .withMessage("Pendidikan terakhir harus berupa array"),

  body("pendidikanTerakhir.*.jenjang")
    .optional()
    .notEmpty()
    .withMessage("Jenjang pendidikan diperlukan"),

  body("pendidikanTerakhir.*.institusi")
    .optional()
    .notEmpty()
    .withMessage("Institusi pendidikan diperlukan"),

  body("pendidikanTerakhir.*.jurusan")
    .optional()
    .notEmpty()
    .withMessage("Jurusan diperlukan"),

  body("pendidikanTerakhir.*.tahunLulus")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage("Tahun lulus tidak valid"),

  body("pendidikanTerakhir.*.ipk")
    .optional()
    .isFloat({ min: 0, max: 4 })
    .withMessage("IPK harus antara 0-4"),

  // Validate riwayat pelatihan array
  body("riwayatPelatihan")
    .optional()
    .isArray()
    .withMessage("Riwayat pelatihan harus berupa array"),

  body("riwayatPelatihan.*.namaPelatihan")
    .optional()
    .notEmpty()
    .withMessage("Nama pelatihan diperlukan"),

  body("riwayatPelatihan.*.penyelenggara")
    .optional()
    .notEmpty()
    .withMessage("Penyelenggara pelatihan diperlukan"),

  body("riwayatPelatihan.*.tahun")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage("Tahun pelatihan tidak valid"),

  // Validate riwayat pekerjaan array
  body("riwayatPekerjaan")
    .optional()
    .isArray()
    .withMessage("Riwayat pekerjaan harus berupa array"),

  body("riwayatPekerjaan.*.namaPerusahaan")
    .optional()
    .notEmpty()
    .withMessage("Nama perusahaan diperlukan"),

  body("riwayatPekerjaan.*.posisi")
    .optional()
    .notEmpty()
    .withMessage("Posisi diperlukan"),

  body("riwayatPekerjaan.*.tahunMulai")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage("Tahun mulai tidak valid"),

  body("riwayatPekerjaan.*.tahunSelesai")
    .optional({ nullable: true })
    .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
    .withMessage("Tahun selesai tidak valid"),

  body("riwayatPekerjaan.*.gajiTerakhir")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Gaji terakhir harus berupa angka positif"),
];
