
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  recipientEmail: string;
  ccEmail: string;
  subject: string;
  messageBody: string;
  fileUrl: string;
  fileName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let requestBody;
    try {
      const text = await req.text();
      requestBody = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      throw new Error("Invalid request body");
    }

    console.log("Received request body:", requestBody);

    const { recipientEmail, ccEmail, subject, messageBody, fileUrl, fileName }: EmailRequest = requestBody;

    // Validate inputs
    if (!recipientEmail || !subject || !messageBody) {
      throw new Error("Missing required fields");
    }

    let emailConfig: any = {
      from: "FITT-DAK <onboarding@resend.dev>",
      to: [recipientEmail],
      cc: [ccEmail],
      subject: subject,
      html: messageBody,
    };

    // Only add attachment if fileUrl is provided
    if (fileUrl && fileName) {
      try {
        console.log("Attempting to download file from:", fileUrl);
        const fileResponse = await fetch(fileUrl);
        
        if (!fileResponse.ok) {
          console.error("File download failed:", fileResponse.status);
          throw new Error("Failed to download attachment");
        }

        const arrayBuffer = await fileResponse.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        console.log("File downloaded successfully, size:", uint8Array.length);
        
        emailConfig.attachments = [{
          filename: fileName,
          content: Array.from(uint8Array)
        }];
      } catch (fileError) {
        console.error("File attachment error:", fileError);
        throw new Error(`File attachment error: ${fileError.message}`);
      }
    }

    console.log("Sending email with config:", {
      to: emailConfig.to,
      cc: emailConfig.cc,
      subject: emailConfig.subject,
      hasAttachment: !!emailConfig.attachments
    });

    const { data, error } = await resend.emails.send(emailConfig);

    if (error) {
      console.error("Resend API error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ success: true, data }), 
      {
        status: 200,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.response?.data || error.stack
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
};

serve(handler);
