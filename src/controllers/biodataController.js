import { validationResult } from "express-validator";
import { prisma } from "../config/database.js";

// Create or Update Biodata
export const createOrUpdateBiodata = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const userId = req.user.userId;
    const {
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      statusPernikahan,
      alamatKTP,
      alamatDomisili,
      noTelepon,
      email,
      posisiDilamar,
      gajiDiharapkan,
      bersediaDitempatkanLuarKota,
      pendidikanTerakhir,
      riwayatPelatihan,
      riwayatPekerjaan,
      orangTerdekatDapatDihubungi,
      skill,
    } = req.body;

    // Check if biodata already exists
    const existingBiodata = await prisma.biodata.findUnique({
      where: { userId },
    });

    let biodata;

    if (existingBiodata) {
      // Update existing biodata
      biodata = await prisma.$transaction(async (tx) => {
        // Delete existing related records
        await tx.pendidikanTerakhir.deleteMany({
          where: { biodataId: existingBiodata.id },
        });
        await tx.riwayatPelatihan.deleteMany({
          where: { biodataId: existingBiodata.id },
        });
        await tx.riwayatPekerjaan.deleteMany({
          where: { biodataId: existingBiodata.id },
        });
        await tx.orangTerdekatDapatDihubungi.deleteMany({
          where: { biodataId: existingBiodata.id },
        });
        await tx.skill.deleteMany({
          where: { biodataId: existingBiodata.id },
        });

        // Update biodata
        const updatedBiodata = await tx.biodata.update({
          where: { id: existingBiodata.id },
          data: {
            namaLengkap,
            tempatLahir,
            tanggalLahir: new Date(tanggalLahir),
            jenisKelamin,
            agama,
            statusPernikahan,
            alamatKTP,
            alamatDomisili,
            noTelepon,
            email,
            posisiDilamar,
            gajiDiharapkan: parseFloat(gajiDiharapkan),
            bersediaDitempatkanLuarKota: Boolean(bersediaDitempatkanLuarKota),
          },
        });

        // Create new related records
        if (pendidikanTerakhir && pendidikanTerakhir.length > 0) {
          await tx.pendidikanTerakhir.createMany({
            data: pendidikanTerakhir.map((p) => ({
              biodataId: updatedBiodata.id,
              jenjang: p.jenjang,
              institusi: p.institusi,
              jurusan: p.jurusan,
              tahunLulus: parseInt(p.tahunLulus),
              ipk: p.ipk ? parseFloat(p.ipk) : null,
            })),
          });
        }

        if (riwayatPelatihan && riwayatPelatihan.length > 0) {
          await tx.riwayatPelatihan.createMany({
            data: riwayatPelatihan.map((p) => ({
              biodataId: updatedBiodata.id,
              namaPelatihan: p.namaPelatihan,
              penyelenggara: p.penyelenggara,
              tahun: parseInt(p.tahun),
              sertifikat: Boolean(p.sertifikat),
            })),
          });
        }

        if (riwayatPekerjaan && riwayatPekerjaan.length > 0) {
          await tx.riwayatPekerjaan.createMany({
            data: riwayatPekerjaan.map((p) => ({
              biodataId: updatedBiodata.id,
              namaPerusahaan: p.namaPerusahaan,
              posisi: p.posisi,
              tahunMulai: parseInt(p.tahunMulai),
              tahunSelesai: p.tahunSelesai ? parseInt(p.tahunSelesai) : null,
              gajiTerakhir: parseFloat(p.gajiTerakhir),
              alasanKeluar: p.alasanKeluar || null,
            })),
          });
        }

        // Create orang terdekat yang dapat dihubungi
        if (
          orangTerdekatDapatDihubungi &&
          orangTerdekatDapatDihubungi.length > 0
        ) {
          await tx.orangTerdekatDapatDihubungi.createMany({
            data: orangTerdekatDapatDihubungi.map((o) => ({
              biodataId: updatedBiodata.id,
              nama: o.nama,
              hubungan: o.hubungan,
              noTelepon: o.noTelepon,
              alamat: o.alamat || null,
            })),
          });
        }

        // Create skills
        if (skill && skill.length > 0) {
          await tx.skill.createMany({
            data: skill.map((s) => ({
              biodataId: updatedBiodata.id,
              namaSkill: s.namaSkill,
              level: s.level,
            })),
          });
        }

        return updatedBiodata;
      });

      res.json({
        success: true,
        message: "Biodata berhasil diperbarui",
        data: biodata,
      });
    } else {
      // Create new biodata
      biodata = await prisma.$transaction(async (tx) => {
        const newBiodata = await tx.biodata.create({
          data: {
            userId,
            namaLengkap,
            tempatLahir,
            tanggalLahir: new Date(tanggalLahir),
            jenisKelamin,
            agama,
            statusPernikahan,
            alamatKTP,
            alamatDomisili,
            noTelepon,
            email,
            posisiDilamar,
            gajiDiharapkan: parseFloat(gajiDiharapkan),
            bersediaDitempatkanLuarKota: Boolean(bersediaDitempatkanLuarKota),
          },
        });

        // Create related records
        if (pendidikanTerakhir && pendidikanTerakhir.length > 0) {
          await tx.pendidikanTerakhir.createMany({
            data: pendidikanTerakhir.map((p) => ({
              biodataId: newBiodata.id,
              jenjang: p.jenjang,
              institusi: p.institusi,
              jurusan: p.jurusan,
              tahunLulus: parseInt(p.tahunLulus),
              ipk: p.ipk ? parseFloat(p.ipk) : null,
            })),
          });
        }

        if (riwayatPelatihan && riwayatPelatihan.length > 0) {
          await tx.riwayatPelatihan.createMany({
            data: riwayatPelatihan.map((p) => ({
              biodataId: newBiodata.id,
              namaPelatihan: p.namaPelatihan,
              penyelenggara: p.penyelenggara,
              tahun: parseInt(p.tahun),
              sertifikat: Boolean(p.sertifikat),
            })),
          });
        }

        if (riwayatPekerjaan && riwayatPekerjaan.length > 0) {
          await tx.riwayatPekerjaan.createMany({
            data: riwayatPekerjaan.map((p) => ({
              biodataId: newBiodata.id,
              namaPerusahaan: p.namaPerusahaan,
              posisi: p.posisi,
              tahunMulai: parseInt(p.tahunMulai),
              tahunSelesai: p.tahunSelesai ? parseInt(p.tahunSelesai) : null,
              gajiTerakhir: parseFloat(p.gajiTerakhir),
              alasanKeluar: p.alasanKeluar || null,
            })),
          });
        }

        // Create orang terdekat yang dapat dihubungi
        if (
          orangTerdekatDapatDihubungi &&
          orangTerdekatDapatDihubungi.length > 0
        ) {
          await tx.orangTerdekatDapatDihubungi.createMany({
            data: orangTerdekatDapatDihubungi.map((o) => ({
              biodataId: newBiodata.id,
              nama: o.nama,
              hubungan: o.hubungan,
              noTelepon: o.noTelepon,
              alamat: o.alamat || null,
            })),
          });
        }

        // Create skills
        if (skill && skill.length > 0) {
          await tx.skill.createMany({
            data: skill.map((s) => ({
              biodataId: newBiodata.id,
              namaSkill: s.namaSkill,
              level: s.level,
            })),
          });
        }

        return newBiodata;
      });

      res.status(201).json({
        success: true,
        message: "Biodata berhasil dibuat",
        data: biodata,
      });
    }
  } catch (error) {
    console.error("Create/Update biodata error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get User's Biodata
export const getUserBiodata = async (req, res) => {
  try {
    const userId = req.user.userId;

    const biodata = await prisma.biodata.findUnique({
      where: { userId },
      include: {
        pendidikanTerakhir: {
          orderBy: { tahunLulus: "desc" },
        },
        riwayatPelatihan: {
          orderBy: { tahun: "desc" },
        },
        riwayatPekerjaan: {
          orderBy: { tahunMulai: "desc" },
        },
        orangTerdekatDapatDihubungi: {},
        skill: {},
      },
    });

    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: "Biodata tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: biodata,
    });
  } catch (error) {
    console.error("Get user biodata error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllBiodata = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      nama = "",
      posisi = "",
      pendidikan = "",
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const currentAdminId = req.user.userId;

    const whereConditions = {
      userId: { not: currentAdminId },
    };

    if (nama) {
      whereConditions.namaLengkap = {
        contains: nama,
      };
    }

    if (posisi) {
      whereConditions.posisiDilamar = {
        contains: posisi,
      };
    }

    if (pendidikan) {
      whereConditions.pendidikanTerakhir = {
        some: {
          jenjang: {
            contains: pendidikan,
          },
        },
      };
    }

    const where = whereConditions;

    const [biodata, total] = await Promise.all([
      prisma.biodata.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          namaLengkap: true,
          tempatLahir: true,
          tanggalLahir: true,
          posisiDilamar: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.biodata.count({ where }),
    ]);

    const formattedData = biodata.map((item) => ({
      id: item.id,
      userId: item.user.id,
      namaLengkap: item.namaLengkap,
      tempatTanggalLahir: `${
        item.tempatLahir
      }, ${item.tanggalLahir.toLocaleDateString("id-ID")}`,
      posisiDilamar: item.posisiDilamar,
      email: item.user.email,
      createdAt: item.createdAt,
    }));

    res.json({
      success: true,
      message: "Data biodata berhasil diambil",
      data: {
        biodata: formattedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get all biodata error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Get Biodata by ID (Admin only)
export const getBiodataById = async (req, res) => {
  try {
    const { id } = req.params;

    const biodata = await prisma.biodata.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
        pendidikanTerakhir: {
          orderBy: { tahunLulus: "desc" },
        },
        riwayatPelatihan: {
          orderBy: { tahun: "desc" },
        },
        riwayatPekerjaan: {
          orderBy: { tahunMulai: "desc" },
        },
        orangTerdekatDapatDihubungi: {},
        skill: {},
      },
    });

    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: "Biodata tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: biodata,
    });
  } catch (error) {
    console.error("Get biodata by id error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Biodata by ID (Admin only)
export const updateBiodataById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const {
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      statusPernikahan,
      alamatKTP,
      alamatDomisili,
      noTelepon,
      email,
      posisiDilamar,
      gajiDiharapkan,
      pendidikanTerakhir,
      riwayatPelatihan,
      riwayatPekerjaan,
    } = req.body;

    // Check if biodata exists
    const existingBiodata = await prisma.biodata.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBiodata) {
      return res.status(404).json({
        success: false,
        message: "Biodata tidak ditemukan",
      });
    }

    // Update biodata with transaction
    const updatedBiodata = await prisma.$transaction(async (tx) => {
      // Delete existing related records
      await tx.pendidikanTerakhir.deleteMany({
        where: { biodataId: parseInt(id) },
      });
      await tx.riwayatPelatihan.deleteMany({
        where: { biodataId: parseInt(id) },
      });
      await tx.riwayatPekerjaan.deleteMany({
        where: { biodataId: parseInt(id) },
      });

      // Update biodata
      const updated = await tx.biodata.update({
        where: { id: parseInt(id) },
        data: {
          namaLengkap,
          tempatLahir,
          tanggalLahir: new Date(tanggalLahir),
          jenisKelamin,
          agama,
          statusPernikahan,
          alamatKTP,
          alamatDomisili,
          noTelepon,
          email,
          posisiDilamar,
          gajiDiharapkan: parseFloat(gajiDiharapkan),
        },
      });

      // Create new related records
      if (pendidikanTerakhir && pendidikanTerakhir.length > 0) {
        await tx.pendidikanTerakhir.createMany({
          data: pendidikanTerakhir.map((p) => ({
            biodataId: updated.id,
            jenjang: p.jenjang,
            institusi: p.institusi,
            jurusan: p.jurusan,
            tahunLulus: parseInt(p.tahunLulus),
            ipk: p.ipk ? parseFloat(p.ipk) : null,
          })),
        });
      }

      if (riwayatPelatihan && riwayatPelatihan.length > 0) {
        await tx.riwayatPelatihan.createMany({
          data: riwayatPelatihan.map((p) => ({
            biodataId: updated.id,
            namaPelatihan: p.namaPelatihan,
            penyelenggara: p.penyelenggara,
            tahun: parseInt(p.tahun),
            sertifikat: Boolean(p.sertifikat),
          })),
        });
      }

      if (riwayatPekerjaan && riwayatPekerjaan.length > 0) {
        await tx.riwayatPekerjaan.createMany({
          data: riwayatPekerjaan.map((p) => ({
            biodataId: updated.id,
            namaPerusahaan: p.namaPerusahaan,
            posisi: p.posisi,
            tahunMulai: parseInt(p.tahunMulai),
            tahunSelesai: p.tahunSelesai ? parseInt(p.tahunSelesai) : null,
            gajiTerakhir: parseFloat(p.gajiTerakhir),
            alasanKeluar: p.alasanKeluar || null,
          })),
        });
      }

      return updated;
    });

    res.json({
      success: true,
      message: "Biodata berhasil diperbarui",
      data: updatedBiodata,
    });
  } catch (error) {
    console.error("Update biodata by id error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Biodata (Admin only)
export const deleteBiodata = async (req, res) => {
  try {
    const { id } = req.params;

    const biodata = await prisma.biodata.findUnique({
      where: { id: parseInt(id) },
    });

    if (!biodata) {
      return res.status(404).json({
        success: false,
        message: "Biodata tidak ditemukan",
      });
    }

    await prisma.biodata.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Biodata berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete biodata error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
