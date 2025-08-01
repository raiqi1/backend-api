import bcrypt from "bcryptjs";
import { prisma } from "./config/database.js";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.upsert({
      where: { email: "admin@company.com" },
      update: {},
      create: {
        email: "admin@company.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created:", admin.email);

    // Create sample regular user
    const userPassword = await bcrypt.hash("user123", 12);

    const user = await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        password: userPassword,
        role: "USER",
      },
    });

    console.log("✅ Sample user created:", user.email);

    // Create sample biodata for the user
    const biodata = await prisma.biodata.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        namaLengkap: "John Doe",
        tempatLahir: "Jakarta",
        tanggalLahir: new Date("1990-01-15"),
        jenisKelamin: "Laki-laki",
        agama: "Islam",
        statusPernikahan: "Belum Menikah",
        alamatKTP: "Jl. Sudirman No. 123, Jakarta Selatan",
        alamatDomisili: "Jl. Sudirman No. 123, Jakarta Selatan",
        noTelepon: "08123456789",
        email: "john.doe@example.com",
        posisiDilamar: "Software Developer",
        gajiDiharapkan: 8000000,
        bersediaDitempatkanLuarKota: true,
      },
    });

    console.log("✅ Sample biodata created for:", biodata.namaLengkap);

    // Create sample pendidikan
    await prisma.pendidikanTerakhir.deleteMany({
      where: { biodataId: biodata.id },
    });

    await prisma.pendidikanTerakhir.create({
      data: {
        biodataId: biodata.id,
        jenjang: "S1",
        institusi: "Universitas Indonesia",
        jurusan: "Teknik Informatika",
        tahunLulus: 2012,
        ipk: 3.75,
      },
    });

    // Create sample pelatihan
    await prisma.riwayatPelatihan.deleteMany({
      where: { biodataId: biodata.id },
    });

    await prisma.riwayatPelatihan.createMany({
      data: [
        {
          biodataId: biodata.id,
          namaPelatihan: "Node.js Advanced",
          penyelenggara: "Tech Academy",
          tahun: 2023,
          sertifikat: true,
        },
        {
          biodataId: biodata.id,
          namaPelatihan: "React Development",
          penyelenggara: "Code Institute",
          tahun: 2022,
          sertifikat: true,
        },
      ],
    });

    // Create sample pekerjaan
    await prisma.riwayatPekerjaan.deleteMany({
      where: { biodataId: biodata.id },
    });

    await prisma.riwayatPekerjaan.createMany({
      data: [
        {
          biodataId: biodata.id,
          namaPerusahaan: "PT Tech Solutions",
          posisi: "Junior Developer",
          tahunMulai: 2020,
          tahunSelesai: 2023,
          gajiTerakhir: 6000000,
          alasanKeluar: "Mencari tantangan baru",
        },
        {
          biodataId: biodata.id,
          namaPerusahaan: "CV Digital Media",
          posisi: "Web Developer Intern",
          tahunMulai: 2019,
          tahunSelesai: 2020,
          gajiTerakhir: 3000000,
          alasanKeluar: "Kontrak selesai",
        },
      ],
    });

    // Create sample orang terdekat yang dapat dihubungi
    await prisma.orangTerdekatDapatDihubungi.deleteMany({
      where: { biodataId: biodata.id },
    });

    await prisma.orangTerdekatDapatDihubungi.createMany({
      data: [
        {
          biodataId: biodata.id,
          nama: "Jane Doe",
          hubungan: "Istri",
          noTelepon: "08123456788",
          alamat: "Jl. Sudirman No. 123, Jakarta Selatan",
        },
        {
          biodataId: biodata.id,
          nama: "Robert Doe",
          hubungan: "Ayah",
          noTelepon: "08123456787",
          alamat: "Jl. Kebon Jeruk No. 45, Jakarta Barat",
        },
      ],
    });

    // Create sample skills
    await prisma.skill.deleteMany({
      where: { biodataId: biodata.id },
    });

    await prisma.skill.createMany({
      data: [
        {
          biodataId: biodata.id,
          namaSkill: "JavaScript",
          level: "Advanced",
        },
        {
          biodataId: biodata.id,
          namaSkill: "Node.js",
          level: "Advanced",
        },
        {
          biodataId: biodata.id,
          namaSkill: "React",
          level: "Intermediate",
        },
        {
          biodataId: biodata.id,
          namaSkill: "MySQL",
          level: "Intermediate",
        },
        {
          biodataId: biodata.id,
          namaSkill: "Git",
          level: "Advanced",
        },
        {
          biodataId: biodata.id,
          namaSkill: "Docker",
          level: "Beginner",
        },
      ],
    });

    console.log("✅ Sample data created successfully!");
    console.log("\n📋 Test Accounts:");
    console.log("Admin: admin@company.com / admin123");
    console.log("User: user@example.com / user123");
    console.log("\n📋 Sample Data Includes:");
    console.log("- Personal biodata");
    console.log("- Education history");
    console.log("- Training history");
    console.log("- Work experience");
    console.log("- Emergency contacts");
    console.log("- Skills with proficiency levels");
    console.log("- Willingness to work outside city");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
