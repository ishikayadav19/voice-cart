import { NextResponse } from 'next/server';

const ALLOWED_INTENTS = [
  'FILTER',
  'ADD_CART',
  'REMOVE_CART',
  'ADD_WISHLIST',
  'REMOVE_WISHLIST',
  'NAVIGATE',
  'PRODUCT_OPEN',
  'CHECKOUT',
  'REFINE',
  'COMPARE',
  'RECOMMEND',
  'SEARCH',
  'SCROLL',
  'LOGOUT',
  'HELP',
  'GREETING',
  'FAREWELL',
  'STOP_LISTENING',
  'UNKNOWN',
];

const ALLOWED_PARAM_KEYS = [
  'category',
  'color',
  'size',
  'max_price',
  'min_price',
  'brand',
  'query',
  'page',
  'product_id',
  'direction',
];

const SYSTEM_PROMPT = `You are a voice command interpreter for an e-commerce voice assistant called Voice Cart.

You receive a user transcript (which may be in English, Hindi, or Hinglish - Hindi-English mixed) and must classify it into a single intent and extract structured parameters. The user can ask for shopping actions OR general site/system actions (navigation, scrolling, logout, help, etc.). Pick whichever intent best matches.

Allowed intents (pick exactly one):
- FILTER         : narrow product results by attributes (category, brand, price, color, size).
- SEARCH         : free-text product search ("search for headphones").
- ADD_CART       : add a product to cart. Put the product name in params.query.
- REMOVE_CART    : remove a product from cart. Put the product name in params.query.
- ADD_WISHLIST   : add a product to the WISHLIST (NOT cart). Put the product name in params.query. Use this whenever the user mentions "wishlist", "save for later", "favourite", "pasand".
- REMOVE_WISHLIST: remove a product from the wishlist. Put the product name in params.query.
- CHECKOUT       : proceed to checkout / place order.
- NAVIGATE       : open a known page (home, cart, wishlist, orders, login, signup, profile, deals, sale, new-arrivals, products, contact, voice-shopping).
- PRODUCT_OPEN   : open a SPECIFIC product detail page when the user names the product. Put the product name/keywords in params.query. Use this whenever the user says things like "open the red Nike air max", "show me iPhone 15", "us wale headphones dikhao", "Sony bravia khol do".
- SCROLL         : scroll the current page. Use params.direction = "up" | "down" | "top" | "bottom".
- REFINE         : refine current results ("cheaper", "more options", "thoda sasta").
- COMPARE        : compare products.
- RECOMMEND      : suggest products.
- LOGOUT         : sign the user out.
- HELP           : the user wants instructions / list of commands.
- GREETING       : "hello", "hi", "namaste".
- FAREWELL       : "goodbye", "bye", "alvida".
- STOP_LISTENING : "stop listening", "band karo", "stop".
- UNKNOWN        : transcript is unintelligible, empty, or doesn't fit any intent above. Use this instead of guessing.

Examples (English / Hindi / Hinglish — all must work):
- "mujhe red color ki shirt dikhao under 1000 rupees" -> FILTER (category: shirt, color: red, max_price: 1000)
- "search for wireless headphones"                    -> SEARCH (query: wireless headphones)
- "ye wala add karo cart me"                          -> ADD_CART
- "add the Nike air max to my cart"                   -> ADD_CART (query: Nike air max)
- "add iPhone 15 to my wishlist"                      -> ADD_WISHLIST (query: iPhone 15)
- "Sony headphones ko wishlist me daal do"            -> ADD_WISHLIST (query: Sony headphones)
- "save the red dress for later"                      -> ADD_WISHLIST (query: red dress)
- "remove Nike from wishlist"                         -> REMOVE_WISHLIST (query: Nike)
- "checkout pe le chalo"                              -> CHECKOUT
- "Nike ke shoes dikhao"                              -> FILTER (brand: Nike, category: shoes)
- "thoda sasta dikhao"                                -> REFINE
- "isko compare karo us wale se"                      -> COMPARE
- "kuch suggest karo gift ke liye"                    -> RECOMMEND
- "wishlist khol do"                                  -> NAVIGATE (page: wishlist)
- "open the iPhone 15 pro"                            -> PRODUCT_OPEN (query: iPhone 15 pro)
- "show me Sony WH 1000"                              -> PRODUCT_OPEN (query: Sony WH 1000)
- "us wale Nike air max ko khol do"                   -> PRODUCT_OPEN (query: Nike air max)
- "ye headphones dikhao"                              -> PRODUCT_OPEN (query: headphones)
- "scroll down"                                       -> SCROLL (direction: down)
- "neeche jao"                                        -> SCROLL (direction: down)
- "upar jao"                                          -> SCROLL (direction: up)
- "page ke top pe le chalo"                           -> SCROLL (direction: top)
- "logout kar do"                                     -> LOGOUT
- "help chahiye"                                      -> HELP
- "namaste"                                           -> GREETING
- "alvida"                                            -> FAREWELL
- "stop listening"                                    -> STOP_LISTENING
- "asdfgh blah blah"                                  -> UNKNOWN

Allowed param keys: category, color, size, max_price, min_price, brand, query, page, product_id, direction.
- category, color, size, brand, query, page, product_id, direction are strings (lowercase where natural).
- max_price and min_price are numbers in INR (no currency symbol).
- page is a route slug from this list ONLY: home, cart, wishlist, orders, checkout, deals, sale, new-arrivals, products, search, contact, voice-shopping, profile, login, signup.
- direction is one of: up, down, top, bottom.
- Omit any key you cannot determine. Do NOT invent values.

confidence is a number between 0 and 1 reflecting how certain you are. If unsure, return UNKNOWN with low confidence rather than guessing NAVIGATE.

Output STRICT JSON ONLY in this exact shape and nothing else:
{"intent":"<INTENT>","params":{...},"confidence":<number>}

Do not include markdown fences, comments, or any text outside the JSON object.`;

const FALLBACK = (query = '') => ({
  intent: 'UNKNOWN',
  params: { query: String(query || '').slice(0, 200) },
  confidence: 0,
});

const sanitizeParams = (raw) => {
  if (!raw || typeof raw !== 'object') return {};
  const out = {};
  for (const key of ALLOWED_PARAM_KEYS) {
    if (raw[key] === undefined || raw[key] === null || raw[key] === '') continue;
    if (key === 'max_price' || key === 'min_price') {
      const n = Number(raw[key]);
      if (Number.isFinite(n) && n >= 0) out[key] = n;
    } else {
      out[key] = String(raw[key]).slice(0, 200);
    }
  }
  return out;
};

const validateIntent = (parsed, transcript) => {
  if (!parsed || typeof parsed !== 'object') return FALLBACK(transcript);
  const intent = ALLOWED_INTENTS.includes(parsed.intent) ? parsed.intent : null;
  if (!intent) return FALLBACK(transcript);
  const params = sanitizeParams(parsed.params);
  const conf = Number(parsed.confidence);
  const confidence = Number.isFinite(conf) ? Math.min(Math.max(conf, 0), 1) : 0.5;
  return { intent, params, confidence };
};

const extractJSON = (text) => {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch {}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

export async function POST(request) {
  let transcript = '';
  let history = [];

  try {
    const body = await request.json();
    transcript = String(body?.transcript || '').trim();
    history = Array.isArray(body?.history) ? body.history.slice(-3) : [];
  } catch {
    return NextResponse.json(FALLBACK(''));
  }

  if (!transcript) {
    return NextResponse.json(FALLBACK(''));
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY is not configured');
    return NextResponse.json(FALLBACK(transcript));
  }

  const historyContext = history.length
    ? history.map((h) => `${h.intent}${h.params ? ' ' + JSON.stringify(h.params) : ''}`).join(' | ')
    : '';

  const userContent = historyContext
    ? `Prior intents: ${historyContext}\nUser said: "${transcript}"`
    : `User said: "${transcript}"`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0,
        max_tokens: 120,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text().catch(() => '');
      console.error('Groq API error:', groqRes.status, errText);
      return NextResponse.json(FALLBACK(transcript));
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = extractJSON(content);
    return NextResponse.json(validateIntent(parsed, transcript));
  } catch (err) {
    console.error('Voice intent route error:', err?.message || err);
    return NextResponse.json(FALLBACK(transcript));
  }
}
