import { NextResponse } from "next/server";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export async function POST(req: Request) {
  const body = (await req.json()) as { email: string; sandi: string };
  const response = await fetch(`${backendURL}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.email,
      sandi: body.sandi,
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
