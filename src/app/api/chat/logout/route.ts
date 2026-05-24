import { NextRequest, NextResponse } from "next/server";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token");
  const response = await fetch(`${backendURL}/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  const nextRes = NextResponse.json(data, { status: response.status });
  nextRes.cookies.delete("token");
  return nextRes;
}
