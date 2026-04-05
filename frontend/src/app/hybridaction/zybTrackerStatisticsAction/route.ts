import { NextResponse } from "next/server";

export async function GET() {
  // Swallow the locatorjs/extension request to stop 404 spam
  return NextResponse.json({ status: "swallowed" });
}
