import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3@3.470.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const R2_CONFIG = {
  accountId: "f3e33c72814f5cc2e77608ba623ca260",
  accessKeyId: "589223b7d3a63209d992959de2031b58",
  secretAccessKey: "10b64c5dd4a840c5246c4280111298e664c6049820a05c4ec1e2fd1014b59b53",
  bucketName: "poker-mentor-screenshots",
  endpoint: "https://f3e33c72814f5cc2e77608ba623ca260.r2.cloudflarestorage.com",
  publicUrl: "https://pub-0de556b04ac54bfca4bc6b7c58830e8e.r2.dev",
};

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_CONFIG.endpoint,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
});

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const migrationResults = {
      handAnalysis: { total: 0, migrated: 0, failed: 0 },
      screenshotNotes: { total: 0, migrated: 0, failed: 0 },
    };

    // Migrate hand_analysis screenshots
    const { data: handAnalysisData, error: haError } = await supabase
      .from("hand_analysis")
      .select("id, screenshot_url")
      .not("screenshot_url", "is", null);

    if (haError) throw haError;

    migrationResults.handAnalysis.total = handAnalysisData?.length || 0;

    for (const record of handAnalysisData || []) {
      try {
        if (!record.screenshot_url.startsWith("https://ngxacysmtarsfoypogmh")) {
          continue;
        }

        // Download from Supabase
        const response = await fetch(record.screenshot_url);
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Extract filename
        const urlParts = record.screenshot_url.split("/");
        const originalFilename = urlParts[urlParts.length - 1];
        const newFilename = `migrated-ha-${record.id}-${originalFilename}`;

        // Upload to R2
        const command = new PutObjectCommand({
          Bucket: R2_CONFIG.bucketName,
          Key: newFilename,
          Body: bytes,
          ContentType: blob.type || "image/png",
        });

        await s3Client.send(command);

        const newUrl = `${R2_CONFIG.publicUrl}/${newFilename}`;

        // Update database
        await supabase
          .from("hand_analysis")
          .update({ screenshot_url: newUrl })
          .eq("id", record.id);

        migrationResults.handAnalysis.migrated++;
      } catch (error) {
        console.error(`Failed to migrate hand_analysis ${record.id}:`, error);
        migrationResults.handAnalysis.failed++;
      }
    }

    // Migrate screenshot_notes
    const { data: screenshotNotesData, error: snError } = await supabase
      .from("screenshot_notes")
      .select("id, screenshot_url")
      .not("screenshot_url", "is", null);

    if (snError) throw snError;

    migrationResults.screenshotNotes.total = screenshotNotesData?.length || 0;

    for (const record of screenshotNotesData || []) {
      try {
        if (!record.screenshot_url.startsWith("https://ngxacysmtarsfoypogmh")) {
          continue;
        }

        const response = await fetch(record.screenshot_url);
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        const urlParts = record.screenshot_url.split("/");
        const originalFilename = urlParts[urlParts.length - 1];
        const newFilename = `migrated-sn-${record.id}-${originalFilename}`;

        const command = new PutObjectCommand({
          Bucket: R2_CONFIG.bucketName,
          Key: newFilename,
          Body: bytes,
          ContentType: blob.type || "image/png",
        });

        await s3Client.send(command);

        const newUrl = `${R2_CONFIG.publicUrl}/${newFilename}`;

        await supabase
          .from("screenshot_notes")
          .update({ screenshot_url: newUrl })
          .eq("id", record.id);

        migrationResults.screenshotNotes.migrated++;
      } catch (error) {
        console.error(`Failed to migrate screenshot_notes ${record.id}:`, error);
        migrationResults.screenshotNotes.failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: migrationResults,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Migration error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Migration failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
