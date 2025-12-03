import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareConfig } from '@/lib/cloudflare-api';

export async function GET() {
  try {
    const config = await getCloudflareConfig();

    if (!config) {
      return NextResponse.json({
        success: false,
        error: "Cloudflare API config belum dikonfigurasi. Silakan setup di Dashboard Config terlebih dahulu.",
        zones: []
      }, { status: 400 });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones?status=active&per_page=50`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      zones: data.result || []
    });
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      zones: []
    }, { status: 500 });
  }
}