import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DonationData {
  donorName: string;
  donorEmail: string;
  donorType: "individual" | "organization";
  orgName?: string;
  items: {
    category: string;
    subcategory: string;
    quantity: number;
    estimatedValue?: number;
  }[];
  giftCard?: {
    company: string;
    amount: number;
  };
  date: string;
  receiptId: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DonationData = await req.json();

    // Build items list HTML
    let itemsHtml = "";
    let totalValue = 0;

    if (data.items && data.items.length > 0) {
      itemsHtml = data.items.map(item => {
        const value = item.estimatedValue || 0;
        totalValue += value;
        return `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.category}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.subcategory}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${value > 0 ? `$${value.toFixed(2)}` : "—"}</td>
          </tr>
        `;
      }).join("");
    }

    if (data.giftCard) {
      totalValue += data.giftCard.amount;
      itemsHtml += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">Gift Card</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.giftCard.company}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">1</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${data.giftCard.amount.toFixed(2)}</td>
        </tr>
      `;
    }

    const displayName = data.donorType === "organization" 
      ? (data.orgName || data.donorName) 
      : data.donorName;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Thank You for Your Donation!</h1>
              <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">IFSI Inventory Management</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Dear <strong>${displayName}</strong>,
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Thank you for your generous donation! Your support helps us serve families and individuals in need. Below is your donation receipt for your records.
              </p>
              
              <!-- Receipt Box -->
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                  <div>
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Receipt ID</p>
                    <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 4px 0 0; font-family: monospace;">${data.receiptId}</p>
                  </div>
                  <div style="text-align: right;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0;">Date</p>
                    <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 4px 0 0;">${data.date}</p>
                  </div>
                </div>
              </div>
              
              <!-- Items Table -->
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Category</th>
                    <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Item</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Est. Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background: #f9fafb;">
                    <td colspan="3" style="padding: 12px; font-weight: 600; color: #374151;">Total Estimated Value</td>
                    <td style="padding: 12px; text-align: right; font-weight: 700; color: #2563eb; font-size: 16px;">$${totalValue.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <!-- Tax Note -->
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; margin-bottom: 24px;">
                <p style="color: #065f46; font-size: 13px; margin: 0; line-height: 1.5;">
                  <strong>Tax Deduction:</strong> This receipt may be used for tax purposes. Please consult with your tax advisor regarding deductibility. IFSI is a registered 501(c)(3) nonprofit organization.
                </p>
              </div>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                With gratitude,<br>
                <strong>The IFSI Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                IFSI Inventory Management System<br>
                This is an automated receipt. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "IFSI Donations <onboarding@resend.dev>",
        to: [data.donorEmail],
        subject: `Donation Receipt - ${data.receiptId}`,
        html: emailHtml,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: result }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});