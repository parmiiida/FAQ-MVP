import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";// adjust your path

export async function GET() {
  const { data, error } = await supabase
    .from("faqs")
    .select("question, answer");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
