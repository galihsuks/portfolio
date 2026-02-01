// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { locale } = await req.json();
    const response = NextResponse.json(
        {
            locale,
            message: `success change language to ${locale}`,
        },
        { status: 200 },
    );
    response.cookies.set("locale", locale, {
        expires: new Date("9999-12-31T23:59:59.000Z"),
    });
    return response;
}
