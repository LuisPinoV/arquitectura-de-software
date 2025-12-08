import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try{
        const apiUrl = process.env.BACKEND_ADDRESS || process.env.SERVER_BACKEND_ADDRESS;
        const incomingToken = req.headers.get("authorization") ?? "";

        const box = req.nextUrl.searchParams.get("box") || "0";

        const res = await fetch(`${apiUrl}/box/${box}/inventario`, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            "Authorization": incomingToken,
            },
        });

        const data = await res.json();
        
        if (!data) {
            return NextResponse.json([])
        }

        return NextResponse.json({ success: true, response: data });
    } catch (error) {
        return NextResponse.json(
            {error: "Invalid JSON", ok:false},
            {status:400}
        );
    }
}
