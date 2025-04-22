import { NextResponse } from "next/server";
/**
 * @description waitlist webhook that sends notifications to the Discord server
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook URL not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const timestamp = new Date().toISOString();

    // Get IP and location info
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "Unknown IP";

    // Fetch location data from ipapi
    const locationData = await fetch(`https://ipapi.co/${ip}/json/`).then(
      (res) => res.json()
    );

    // Send to Discord with embed
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: "🎉 New Waitlist Entry",
            color: 0x00ff00,
            fields: [
              {
                name: "📧 Email",
                value: body.email || "Not provided",
                inline: true,
              },
              {
                name: "🌐 IP Address",
                value: ip,
                inline: true,
              },
              {
                name: "📍 Location",
                value: `${locationData.city || "Unknown"}, ${
                  locationData.country_name || "Unknown"
                }\n${locationData.timezone || "Unknown"}`,
                inline: false,
              },
            ],
            footer: {
              text: "Waitlist Notification System",
            },
            timestamp: timestamp,
          },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
