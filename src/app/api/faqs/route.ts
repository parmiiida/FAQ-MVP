import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function GET() {
  try {
    console.log('Fetching FAQs from database...');

    // Get all FAQs without any filters first
    const { data: allFaqs, error: allError } = await supabase
      .from("faqs")
      .select("*");

    console.log('All FAQs response:', { data: allFaqs, error: allError, count: allFaqs?.length });

    if (allError) {
      console.error('Supabase error:', allError);
      return NextResponse.json({ error: allError.message }, { status: 500 });
    }

    // Now get only visible FAQs (if is_visible column exists and has data)
    let data: any[] = allFaqs || [];
    let error = null;

    if (allFaqs && allFaqs.length > 0 && (allFaqs[0] as any).hasOwnProperty('is_visible')) {
      data = allFaqs.filter((faq: any) => faq.is_visible === true);
      console.log(`Filtered to ${data.length} visible FAQs out of ${allFaqs.length} total`);
    } else {
      console.log('No is_visible column or no data, returning all FAQs');
    }

    console.log('Visible FAQs response:', { data, error, count: data?.length });

    // No need to check error here since we're not making a second query

    return NextResponse.json({
      data,
      count: data?.length || 0,
      totalCount: allFaqs?.length || 0,
      visibleCount: data?.length || 0
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
