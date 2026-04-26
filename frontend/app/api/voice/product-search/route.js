import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'open', 'show', 'me', 'please', 'product',
  'item', 'page', 'wala', 'waali', 'wali', 'ye', 'yeh', 'vo', 'woh',
  'mujhe', 'dikhao', 'khol', 'do', 'dikhana', 'chahiye',
  'i', 'want', 'to', 'see', 'of', 'for', 'with',
]);

const tokenize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

const scoreProduct = (queryTokens, product) => {
  const haystack = `${product.name || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
  let score = 0;
  for (const tok of queryTokens) {
    if (haystack.includes(tok)) score += 1;
    if ((product.name || '').toLowerCase().includes(tok)) score += 1;
  }
  return score;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const queryTokens = tokenize(q);

    if (queryTokens.length === 0) {
      return NextResponse.json({ match: null, candidates: [] });
    }

    // Pull a candidate set using ilike OR over the strongest token, then refine in memory.
    // Using top 1-2 tokens keeps the result set small without missing matches.
    const probe = queryTokens.slice(0, 3);
    const orFilter = probe
      .map((t) => `name.ilike.%${t}%,brand.ilike.%${t}%,category.ilike.%${t}%`)
      .join(',');

    const { data, error } = await supabase
      .from('productsdata')
      .select('id, name, brand, category, main_image, price, discount_price')
      .or(orFilter)
      .limit(50);

    if (error) {
      console.error('product-search supabase error:', error);
      return NextResponse.json({ match: null, candidates: [] }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ match: null, candidates: [] });
    }

    const ranked = data
      .map((p) => ({ product: p, score: scoreProduct(queryTokens, p) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    if (ranked.length === 0) {
      return NextResponse.json({ match: null, candidates: [] });
    }

    const formatProduct = (p) => ({
      id: p.id,
      _id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      mainImage: p.main_image,
      main_image: p.main_image,
      price: p.price,
      discountPrice: p.discount_price,
      discount_price: p.discount_price,
    });

    const best = ranked[0].product;
    return NextResponse.json({
      match: { ...formatProduct(best), score: ranked[0].score },
      candidates: ranked.slice(0, 5).map((r) => ({ ...formatProduct(r.product), score: r.score })),
    });
  } catch (err) {
    console.error('product-search error:', err?.message || err);
    return NextResponse.json({ match: null, candidates: [] }, { status: 500 });
  }
}
