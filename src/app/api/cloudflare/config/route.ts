import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Ambil konfigurasi API
export async function GET() {
  try {
    const config = await prisma.cloudflareConfig.findFirst();
    
    if (!config) {
      return NextResponse.json({
        success: true,
        config: null,
        message: "Belum ada konfigurasi"
      });
    }

    const parsedEmails = JSON.parse(config.destinationEmails);

    return NextResponse.json({
      success: true,
      config: {
        id: config.id,
        apiToken: config.apiToken ? "***" + config.apiToken.slice(-4) : "",
        accountId: config.accountId ? "***" + config.accountId.slice(-4) : "",
        d1Database: config.d1Database ? "***" + config.d1Database.slice(-4) : "",
        workerApi: config.workerApi ? "***" + config.workerApi.slice(-4) : "",
        kvStorage: config.kvStorage ? "***" + config.kvStorage.slice(-4) : "",
        destinationEmails: parsedEmails,
        // Untuk keperluan internal, sediakan nilai penuh
        _full: {
          apiToken: config.apiToken,
          accountId: config.accountId,
          d1Database: config.d1Database,
          workerApi: config.workerApi,
          kvStorage: config.kvStorage,
          destinationEmails: parsedEmails,
        }
      }
    });
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil konfigurasi" },
      { status: 500 }
    );
  }
}

// POST - Simpan atau update konfigurasi API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiToken, accountId, d1Database, workerApi, kvStorage, destinationEmails } = body;

    // Validasi input
    if (!apiToken || !accountId || !d1Database || !workerApi || !kvStorage) {
      return NextResponse.json(
        { success: false, error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Cek apakah sudah ada konfigurasi
    const existingConfig = await prisma.cloudflareConfig.findFirst();

    let config;
    if (existingConfig) {
      // Update
      config = await prisma.cloudflareConfig.update({
        where: { id: existingConfig.id },
        data: {
          apiToken,
          accountId,
          d1Database,
          workerApi,
          kvStorage,
          destinationEmails: destinationEmails ? JSON.stringify(destinationEmails) : "[]",
        }
      });
    } else {
      // Create
      config = await prisma.cloudflareConfig.create({
        data: {
          apiToken,
          accountId,
          d1Database,
          workerApi,
          kvStorage,
          destinationEmails: destinationEmails ? JSON.stringify(destinationEmails) : "[]",
        }
      });
    }

    // Parse kembali destination emails untuk response
    const parsedEmails = JSON.parse(config.destinationEmails);

    return NextResponse.json({
      success: true,
      message: "Konfigurasi berhasil disimpan",
      config: {
        id: config.id,
        apiToken: "***" + config.apiToken.slice(-4),
        accountId: "***" + config.accountId.slice(-4),
        d1Database: "***" + config.d1Database.slice(-4),
        workerApi: "***" + config.workerApi.slice(-4),
        kvStorage: "***" + config.kvStorage.slice(-4),
        destinationEmails: parsedEmails,
      }
    });
  } catch (error) {
    console.error("Error saving config:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan konfigurasi" },
      { status: 500 }
    );
  }
}

// PUT - Update konfigurasi API (untuk endpoint yang lebih semantic)
export async function PUT(request: NextRequest) {
  return POST(request);
}
