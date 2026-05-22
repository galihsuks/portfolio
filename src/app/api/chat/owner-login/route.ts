import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json()) as { code?: string };
  const code = body.code?.toLowerCase() ?? "";
  const ownerCode = process.env.CHAT_OWNER_CODE?.trim().toLowerCase() || "galihsuks1234#";

  if (code !== ownerCode) {
    return NextResponse.json({ message: "Kode unik tidak valid" }, { status: 401 });
  }

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
  const ownerEmail = process.env.CHAT_OWNER_EMAIL?.trim() || "galih8.4.2001@gmail.com";
  const ownerPassword = process.env.CHAT_OWNER_PASSWORD?.trim() || "123456";

  if (!backendURL) {
    return NextResponse.json({ message: "Konfigurasi owner login belum lengkap" }, { status: 500 });
  }

  const response = await fetch(`${backendURL}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: ownerEmail,
      sandi: ownerPassword,
    }),
  });

  const data = await response.json();
  if (response.status !== 200) {
    return NextResponse.json(data, { status: response.status });
  }

  const nextRes = NextResponse.json(
    {
      user: {
        id: data.id,
        email: data.email,
        nama: data.nama,
        timezone: data.timezone,
      },
    },
    { status: 200 },
  );
  nextRes.cookies.set("token", data.token, {
    expires: new Date("9999-12-31T23:59:59.000Z"),
  });
  return nextRes;
}
