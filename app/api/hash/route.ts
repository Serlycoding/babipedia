import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET() {
  const password = "babikecap";
  const hash = await bcrypt.hash(password, 10);
  return NextResponse.json({ hash });
}

