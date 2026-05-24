import { NextResponse } from "next/server";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export async function POST(req: Request) {
  const { name } = (await req.json()) as { name: string };
  const genearetedEmail = `${name.replace(/[^a-zA-Z0-9]+/g, "")}${Date.now()}@galihsuks.com`;
  const genearetedPassword = process.env.GENERATED_PASSWORD?.trim() || "123456";

  const responseRegist = await fetch(`${backendURL}/auth/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: genearetedEmail,
      sandi: genearetedPassword,
    }),
  });
  const dataRegist = await responseRegist.json();
  if (responseRegist.status !== 200) {
    return NextResponse.json(dataRegist, { status: responseRegist.status });
  }

  const response = await fetch(`${backendURL}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: genearetedEmail,
      sandi: genearetedPassword,
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
