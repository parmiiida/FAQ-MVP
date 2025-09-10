import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  category: string | null;
  tags: string[] | null;
  is_visible: boolean | null;
  sort_order: number | null;
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("faqs")
      .select(
        "id, question, answer, category, tags, assistant_id, is_visible, sort_order,  created_at, updated_at"
      )
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const faqs: FAQ[] = (data ?? []) as FAQ[];
    return NextResponse.json(faqs);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
