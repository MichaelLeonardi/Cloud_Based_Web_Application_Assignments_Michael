import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Guest";
  const time = searchParams.get("time") || "N/A";

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Escape Room Result</title>
      <style>
        body {
          background: #0f172a;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          padding-top: 60px;
        }
        .card {
          background: #1e293b;
          padding: 30px;
          border-radius: 20px;
          display: inline-block;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        h1 {
          color: #22c55e;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Escape Completed!</h1>
        <p><strong>Player:</strong> ${name}</p>
        <p><strong>Time Taken:</strong> ${time} seconds</p>
        <p>Generated via Vercel Serverless Function</p>
      </div>
    </body>
  </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
