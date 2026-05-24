import { ucwords } from "@/src/app/_services/utils";
import { NextResponse } from "next/server";

type BackendUser = {
  id?: string;
  _id?: string;
  email?: string;
  nama?: string;
  timezone?: string;
  token?: string;
};

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const generatedPassword = process.env.GENERATED_PASSWORD?.trim() || "123456";
const OWNER_EMAIL = "galih8.4.2001@gmail.com";

function normalizeUser(data: BackendUser) {
  return {
    id: String(data.id ?? data._id ?? ""),
    email: String(data.email ?? ""),
    nama: String(data.nama ?? ""),
    timezone: String(data.timezone ?? "Asia/Jakarta"),
  };
}

async function backendLogin(email: string, sandi: string) {
  const response = await fetch(`${backendURL}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, sandi }),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data: data.data };
}

async function backendSignup(email: string, sandi: string, nama: string) {
  const response = await fetch(`${backendURL}/auth/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, sandi, nama }),
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data: data.data };
}

async function backendCreateRoom(token: string) {
  const response = await fetch(`${backendURL}/room`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tipe: "private", anggota: [OWNER_EMAIL] }),
  });
  const data = await response.json();
  return {
    status: response.status,
    message: data.message,
  };
}

async function tryFindUserByName(nama: string) {
  const response = await fetch(`${backendURL}/user/one`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nama }),
  });
  const data = await response.json();
  const payload = (data?.data ?? data) as {
    _id?: string;
    email?: string;
    nama?: string;
  };
  if (payload._id) return payload;
  return null;
}

export async function POST(req: Request) {
  if (!backendURL) {
    return NextResponse.json({ message: "Konfigurasi backend belum lengkap" }, { status: 500 });
  }

  const body = (await req.json()) as {
    name?: string;
    confirmKnown?: boolean;
  };
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ message: "Nama wajib diisi" }, { status: 400 });
  }

  const found = await tryFindUserByName(name);
  if (found && typeof body.confirmKnown !== "boolean") {
    return NextResponse.json(
      {
        needConfirm: true,
        message: "Kamu sudah pernah chat Galih, kan? ya/tidak",
      },
      { status: 200 },
    );
  }

  let email = found?.email ?? "";
  const shouldRegister = !email || body.confirmKnown === false;

  if (shouldRegister) {
    const sanitizedName = name.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase() || "guest";
    email = `${sanitizedName}${Date.now()}@galihsuks.com`;
    const ucwordName = ucwords(name);
    const signupResult = await backendSignup(email, generatedPassword, ucwordName);
    if (signupResult.status !== 200) {
      return NextResponse.json(signupResult.data, { status: signupResult.status });
    }
  }

  const loginResult = await backendLogin(email, generatedPassword);
  if (loginResult.status !== 200) {
    return NextResponse.json(loginResult.data, { status: loginResult.status });
  }

  const token = String(loginResult.data?.token ?? "");
  if (token && shouldRegister) {
    const resCreateRoom = await backendCreateRoom(token);
    if (resCreateRoom.status !== 200) {
      return NextResponse.json(resCreateRoom.message, { status: resCreateRoom.status });
    }
  }

  return NextResponse.json(
    {
      user: normalizeUser(loginResult.data),
      token,
      isOwner: false,
    },
    { status: 200 },
  );
}
