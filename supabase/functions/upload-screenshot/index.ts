import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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

interface UploadRequest {
  file: string;
  fileName: string;
  contentType: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { file, fileName, contentType }: UploadRequest = await req.json();

    if (!file || !fileName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Decode base64
    const base64Data = file.includes(",") ? file.split(",")[1] : file;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: uniqueFileName,
      Body: bytes,
      ContentType: contentType || "image/png",
    });

    await s3Client.send(command);

    const publicUrl = `${R2_CONFIG.publicUrl}/${uniqueFileName}`;

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        fileName: uniqueFileName,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Upload failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
