import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const apiUrl = process.env.BACKEND_ADDRESS || process.env.SERVER_BACKEND_ADDRESS;

    const incomingToken = req.headers.get("authorization") ?? "";

    const res = await fetch(`${apiUrl}/funcionario`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": incomingToken,
        },
    });

    const data = await res.json();

    return NextResponse.json(data);
}