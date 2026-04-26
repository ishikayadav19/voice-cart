'use client';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IconArrowDown, IconArrowDownBar, IconArrowUp, IconArrowUpBar, IconMicrophoneOff, IconPlayerRecordFilled, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { FaMicrophone } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion';

const InfoModal = ({ icon, title, description, showModal, setShowModal, centered = false, duration = 2000 }) => {

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [showModal, duration]);

  return <AnimatePresence>
    {showModal && (
      <motion.div
        className={` ${centered ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'top-10 left-10'} flex flex-col items-center gap-3 column fixed z-30 bg-slate-700 opacity-25 text-white text-center p-10 rounded-xl`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p>{icon}</p>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <p>{description}</p>
      </motion.div>
    )}
  </AnimatePresence>
}

const InstructionModal = ({ setShowModal }) => {
  return <AnimatePresence>
    <motion.div
      className={`top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed z-30 bg-white text-slate-800 p-10 rounded-xl`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* close button */}
      <button onClick={() => setShowModal(false)} className='absolute top-10 right-10 text-xl'>
        <IconX size={20} />
      </button>
      <h3 className='text-center text-3xl font-bold mb-4'>Basic Instructions</h3>
      <p className='text-lg mb-2 align-middle'>{`1. Say "Open <page name> page" to open navigate to any page`}</p>
      <p className='text-lg mb-2 align-middle'>{`2. Say "I want to create an account" to navigate to the signup page`}</p>
      <p className='text-lg mb-2 align-middle'>{`3. Say "I want to login" to navigate to the login page`}</p>
      <p className='text-lg mb-2 align-middle'>{`4. Say "Move down" to scroll down and vice-versa`}</p>
      <p className='text-lg mb-2 align-middle'>{`5. Say "Move to bottom" to scroll to bottom of page and vice-versa`}</p>
    </motion.div>
  </AnimatePresence>
}

const pageDetails = [
  // Main user pages
  { pageName: 'home', pagePath: '/' },
  { pageName: 'login', pagePath: '/login' },
  { pageName: 'user login', pagePath: '/user/login' },
  { pageName: 'seller login', pagePath: '/seller/login' },
  { pageName: 'admin login', pagePath: '/admin/login' },
  { pageName: 'signup', pagePath: '/signup' },
  { pageName: 'user signup', pagePath: '/user/signup' },
  { pageName: 'seller signup', pagePath: '/seller/signup' },
  { pageName: 'profile', pagePath: '/user/profile' },
  { pageName: 'cart', pagePath: '/cart' },
  { pageName: 'wishlist', pagePath: '/wishlist' },
  { pageName: 'orders', pagePath: '/orders' },
  { pageName: 'order details', pagePath: '/orders' }, // dynamic, handled in logic
  { pageName: 'products', pagePath: '/products' },
  { pageName: 'product details', pagePath: '/product' }, // dynamic, handled in logic
  { pageName: 'checkout', pagePath: '/checkout' },
  { pageName: 'checkout success', pagePath: '/checkout/success' },
  { pageName: 'search', pagePath: '/search' },
  { pageName: 'deals', pagePath: '/deals' },
  { pageName: 'sale', pagePath: '/sale' },
  { pageName: 'new arrivals', pagePath: '/new-arrivals' },
  { pageName: 'contact', pagePath: '/contact' },
  { pageName: 'voice shopping', pagePath: '/voice-shopping' },
  // Seller pages
  { pageName: 'seller dashboard', pagePath: '/seller/dashboard' },
  { pageName: 'seller products', pagePath: '/seller/products' },
  { pageName: 'add product', pagePath: '/seller/addproduct' },
  { pageName: 'edit product', pagePath: '/seller/products/edit' }, // dynamic
  { pageName: 'seller orders', pagePath: '/seller/orders' },
  { pageName: 'seller order details', pagePath: '/seller/orders' }, // dynamic
  { pageName: 'seller profile', pagePath: '/seller/profile' },
  // Admin pages
  { pageName: 'admin dashboard', pagePath: '/admin' },
  { pageName: 'admin users', pagePath: '/admin/users' },
  { pageName: 'admin sellers', pagePath: '/admin/sellers' },
  { pageName: 'admin products', pagePath: '/admin/products' },
  { pageName: 'admin settings', pagePath: '/admin/settings' },
];

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  
  const speechRef = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined" && "SpeechSynthesisUtterance" in window) {
      speechRef.current = new window.SpeechSynthesisUtterance();
    }
  }, []);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  const [modalOptions, setModalOptions] = useState({
    icon: <FaMicrophone size={60} />,
    title: '',
    description: '',
    centered: true
  })

  const hasRun = useRef(false);
  const router = useRouter();

  const [voices, setVoices] = useState([]);
  const [cartProducts, setCartProducts] = useState([])
  const updateCartProducts = (products) => setCartProducts(products)

  const [intentHistory, setIntentHistory] = useState([]);
  const intentHistoryRef = useRef([]);
  const pushIntentHistory = (intent) => {
    const next = [...intentHistoryRef.current, intent].slice(-3);
    intentHistoryRef.current = next;
    setIntentHistory(next);
  };

  const NAV_PAGE_MAP = {
    home: '/',
    cart: '/cart',
    wishlist: '/wishlist',
    orders: '/orders',
    checkout: '/checkout',
    deals: '/deals',
    sale: '/sale',
    'new-arrivals': '/new-arrivals',
    'new arrivals': '/new-arrivals',
    products: '/products',
    search: '/search',
    contact: '/contact',
    'voice-shopping': '/voice-shopping',
    'voice shopping': '/voice-shopping',
    profile: '/user/profile',
    login: '/login',
    signup: '/signup',
  };

  const buildSearchParams = (params = {}) => {
    const sp = new URLSearchParams();
    if (params.category) sp.set('category', params.category);
    if (params.color) sp.set('color', params.color);
    if (params.size) sp.set('size', params.size);
    if (params.brand) sp.set('brand', params.brand);
    if (params.query) sp.set('q', params.query);
    if (params.min_price !== undefined) sp.set('min_price', String(params.min_price));
    if (params.max_price !== undefined) sp.set('max_price', String(params.max_price));
    return sp.toString();
  };

  const localQuickMatch = (raw) => {
    const t = raw.toLowerCase().trim();
    if (!t) return null;

    // Scrolling
    if (/\b(scroll\s*down|neeche\s*ja|niche\s*ja|page\s*down)\b/.test(t))
      return { intent: 'SCROLL', params: { direction: 'down' }, confidence: 1 };
    if (/\b(scroll\s*up|upar\s*ja|page\s*up)\b/.test(t))
      return { intent: 'SCROLL', params: { direction: 'up' }, confidence: 1 };
    if (/\b(top|sabse\s*upar|upar\s*tak)\b/.test(t) && /\b(scroll|move|jao|chalo|le)\b/.test(t))
      return { intent: 'SCROLL', params: { direction: 'top' }, confidence: 1 };
    if (/\b(bottom|sabse\s*neeche|niche\s*tak)\b/.test(t) && /\b(scroll|move|jao|chalo|le)\b/.test(t))
      return { intent: 'SCROLL', params: { direction: 'bottom' }, confidence: 1 };

    // Mic control
    if (/\b(stop\s*listening|band\s*karo|chup\s*ho)\b/.test(t))
      return { intent: 'STOP_LISTENING', params: {}, confidence: 1 };
    if (/\b(goodbye|good\s*bye|bye|alvida)\b/.test(t))
      return { intent: 'FAREWELL', params: {}, confidence: 1 };

    // Greetings
    if (/^\s*(hello|hi|hey|namaste|namaskar)\b/.test(t))
      return { intent: 'GREETING', params: {}, confidence: 1 };

    // Help
    if (/\b(help|instructions|kaise|how do)\b/.test(t) && t.length < 40)
      return { intent: 'HELP', params: {}, confidence: 0.9 };

    // Checkout
    if (/\b(checkout|check\s*out|place\s*order|order\s*kar)\b/.test(t))
      return { intent: 'CHECKOUT', params: {}, confidence: 1 };

    // "add <X> to (my) wishlist" / "<X> ko wishlist me daal do" / "save <X> for later"
    {
      const wlAdd = t.match(
        /^(?:add\s+|put\s+|save\s+)?(.+?)\s+(?:to(?:\s+my)?\s+wishlist|ko\s+wishlist(?:\s+me)?(?:\s+daal\s+do)?|for\s+later)$/
      );
      if (wlAdd) {
        const name = wlAdd[1].replace(/^(the|a|an)\s+/, '').trim();
        if (name.length >= 2) {
          return { intent: 'ADD_WISHLIST', params: { query: name }, confidence: 0.9 };
        }
      }
      const wlRemove = t.match(
        /^remove\s+(.+?)\s+from(?:\s+my)?\s+wishlist$/
      );
      if (wlRemove) {
        const name = wlRemove[1].replace(/^(the|a|an)\s+/, '').trim();
        if (name.length >= 2) {
          return { intent: 'REMOVE_WISHLIST', params: { query: name }, confidence: 0.9 };
        }
      }
    }

    // "add <X> to (my) cart" / "<X> ko cart me daal do"
    {
      const cAdd = t.match(
        /^(?:add\s+|put\s+)?(.+?)\s+(?:to(?:\s+my)?\s+(?:cart|basket)|ko\s+cart(?:\s+me)?(?:\s+daal\s+do)?)$/
      );
      if (cAdd) {
        const name = cAdd[1].replace(/^(the|a|an)\s+/, '').trim();
        if (name.length >= 2) {
          return { intent: 'ADD_CART', params: { query: name }, confidence: 0.9 };
        }
      }
      const cRemove = t.match(
        /^remove\s+(.+?)\s+from(?:\s+my)?\s+cart$/
      );
      if (cRemove) {
        const name = cRemove[1].replace(/^(the|a|an)\s+/, '').trim();
        if (name.length >= 2) {
          return { intent: 'REMOVE_CART', params: { query: name }, confidence: 0.9 };
        }
      }
    }

    // "open <product name>" / "show me <product name>" — when the phrase
    // doesn't match a known page, treat it as PRODUCT_OPEN. The server-side
    // matcher will resolve the name to a product_id (or fall back to search).
    const productOpenMatch = t.match(
      /^(?:open|show(?:\s+me)?|khol(?:\s+do)?|dikhao|le\s+chalo|jao|take\s+me\s+to)\s+(.+)$/
    );
    if (productOpenMatch) {
      const after = productOpenMatch[1].trim();
      const looksLikePage = /\b(cart|wishlist|orders?|deals?|sale|home|profile|login|signup|contact|new\s*arrivals?|voice\s*shopping)\b/.test(after);
      if (!looksLikePage && after.length >= 2) {
        return { intent: 'PRODUCT_OPEN', params: { query: after }, confidence: 0.85 };
      }
    }

    // Navigation — quick page matches
    const pageRules = [
      [/\b(cart|basket)\b/, 'cart'],
      [/\bwishlist\b/, 'wishlist'],
      [/\b(my\s+)?orders?\b/, 'orders'],
      [/\b(deals?|offers?)\b/, 'deals'],
      [/\bsale\b/, 'sale'],
      [/\bnew\s*arrivals?\b/, 'new-arrivals'],
      [/\bcontact\b/, 'contact'],
      [/\bvoice\s*shopping\b/, 'voice-shopping'],
      [/\bprofile\b/, 'profile'],
      [/\b(login|sign\s*in)\b/, 'login'],
      [/\bsignup|sign\s*up\b/, 'signup'],
      [/\bhome\b/, 'home'],
    ];
    if (/\b(open|go\s*to|show|take\s*me\s*to|khol|le\s*chalo|jao)\b/.test(t)) {
      for (const [re, page] of pageRules) {
        if (re.test(t)) return { intent: 'NAVIGATE', params: { page }, confidence: 1 };
      }
    }

    return null;
  };

  // Pick a voice response variant based on the sentiment-derived hint.
  // Brief → urgent (≤2 words); verbose → frustrated (longer + reassuring).
  const pickResponse = (params, brief, normal, verbose) => {
    const hint = params?.response_hint;
    if (hint === 'brief') return brief;
    if (hint === 'verbose') return verbose;
    return normal;
  };

  // Re-rank a product list by how often each id appears in vc_interactions.
  // Stable: ties keep their original relative order. No-op when there's no
  // interaction history yet (cold start) or input isn't an array.
  const personaliseResults = (products) => {
    if (!Array.isArray(products) || products.length === 0) return products;
    if (typeof window === 'undefined') return products;
    let interactions = [];
    try {
      const raw = localStorage.getItem('vc_interactions');
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) interactions = parsed;
    } catch { return products; }
    if (!interactions.length) return products;
    const counts = new Map();
    for (const i of interactions) {
      if (!i?.productId) continue;
      const key = String(i.productId);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    if (counts.size === 0) return products;
    return products
      .map((p, idx) => ({ p, idx, score: counts.get(String(p?._id || p?.id)) || 0 }))
      .sort((a, b) => b.score - a.score || a.idx - b.idx)
      .map((x) => x.p);
  };

  // Append a query to the rolling vc_last_searches list (cap 10, oldest dropped).
  const recordLastSearch = (q) => {
    if (typeof window === 'undefined') return;
    const trimmed = String(q || '').trim();
    if (!trimmed) return;
    try {
      const raw = localStorage.getItem('vc_last_searches');
      const parsed = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      list.push(trimmed);
      const next = list.length > 10 ? list.slice(-10) : list;
      localStorage.setItem('vc_last_searches', JSON.stringify(next));
    } catch (err) {
      console.error('recordLastSearch failed:', err);
    }
  };

  const dispatchIntent = async (intentObj) => {
    if (!intentObj || !intentObj.intent) return;
    const { intent, params = {} } = intentObj;
    console.log('[voice] dispatch:', intent, params);

    switch (intent) {
      case 'PRODUCT_OPEN': {
        const q = (params.query || '').trim();
        if (!q) {
          voiceResponse('Which product would you like to open?');
          break;
        }
        triggerModal('Looking up product…', q);
        try {
          const res = await fetch(`/api/voice/product-search?q=${encodeURIComponent(q)}`);
          const data = await res.json();
          if (data?.match?.id) {
            router.push(`/product/${data.match.id}`);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('voice:record-interaction', {
                detail: { productId: data.match.id, type: 'view' },
              }));
            }
            voiceResponse(`Opening ${data.match.name}`);
            triggerModal('Opening product', data.match.name);
          } else {
            router.push(`/search?q=${encodeURIComponent(q)}`);
            voiceResponse(`I couldn't find an exact match. Showing search results for ${q}.`);
            triggerModal("Couldn't find that product", `Searching for ${q}`);
          }
        } catch (err) {
          console.error('PRODUCT_OPEN lookup failed:', err);
          router.push(`/search?q=${encodeURIComponent(q)}`);
          voiceResponse(`Searching for ${q}`);
        }
        break;
      }
      case 'FILTER': {
        const qs = buildSearchParams(params);
        const base = params.category ? '/search' : '/search';
        router.push(qs ? `${base}?${qs}` : base);
        recordLastSearch(params.query || params.category || params.brand);
        voiceResponse(pickResponse(params,
          'Filtered',
          'Showing filtered results',
          "I understood you want to narrow the results. I'm applying those filters and loading the matching products now."
        ));
        triggerModal('Filtering', qs || 'Showing results');
        break;
      }
      case 'NAVIGATE': {
        const slug = (params.page || '').toLowerCase().trim();
        const path = NAV_PAGE_MAP[slug];
        if (path) {
          router.push(path);
          voiceResponse(pickResponse(params,
            slug,
            `Navigating to ${slug}`,
            `I understood you want to go to the ${slug} page. Taking you there now.`
          ));
          triggerModal('Navigating...', `Going to ${slug}`);
        } else if (slug) {
          voicePageNavigator(slug);
        }
        break;
      }
      case 'ADD_CART': {
        const q = (params.query || '').trim();
        const productId = params.product_id;
        let product = null;
        if (!productId && q) {
          triggerModal('Adding to cart…', q);
          try {
            const res = await fetch(`/api/voice/product-search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (data?.match?.id) product = data.match;
          } catch (err) { console.error('ADD_CART lookup failed:', err); }
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:add-to-cart', {
            detail: { product_id: productId || product?.id, product, query: q, quantity: 1 },
          }));
        }
        if (product) {
          voiceResponse(pickResponse(params,
            'Added',
            `Added ${product.name} to your cart`,
            `I understood you want ${product.name} in your cart. Done — it's been added to your cart.`
          ));
          triggerModal('Added to cart', product.name);
        } else if (q) {
          voiceResponse(pickResponse(params,
            'Not found',
            `I couldn't find ${q}. Try a clearer name.`,
            `I wasn't able to find a product matching "${q}". Could you try saying the full or clearer product name so I can locate it?`
          ));
          triggerModal("Couldn't find product", q);
        } else {
          voiceResponse(pickResponse(params,
            'Adding',
            'Adding to your cart',
            "I understood. I'm adding the item to your cart now."
          ));
        }
        break;
      }
      case 'REMOVE_CART': {
        const q = (params.query || '').trim();
        const productId = params.product_id;
        let product = null;
        if (!productId && q) {
          try {
            const res = await fetch(`/api/voice/product-search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (data?.match?.id) product = data.match;
          } catch (err) { console.error('REMOVE_CART lookup failed:', err); }
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:remove-from-cart', {
            detail: { product_id: productId || product?.id, query: q },
          }));
        }
        voiceResponse(product ? `Removed ${product.name} from your cart` : 'Removing from your cart');
        break;
      }
      case 'ADD_WISHLIST': {
        const q = (params.query || '').trim();
        const productId = params.product_id;
        let product = null;
        if (!productId && q) {
          triggerModal('Adding to wishlist…', q);
          try {
            const res = await fetch(`/api/voice/product-search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (data?.match?.id) product = data.match;
          } catch (err) { console.error('ADD_WISHLIST lookup failed:', err); }
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:add-to-wishlist', {
            detail: { product_id: productId || product?.id, product, query: q },
          }));
        }
        if (product) {
          voiceResponse(`Added ${product.name} to your wishlist`);
          triggerModal('Added to wishlist', product.name);
        } else if (q) {
          voiceResponse(`I couldn't find ${q}. Try a clearer name.`);
          triggerModal("Couldn't find product", q);
        } else {
          voiceResponse('Adding to your wishlist');
        }
        break;
      }
      case 'REMOVE_WISHLIST': {
        const q = (params.query || '').trim();
        const productId = params.product_id;
        let product = null;
        if (!productId && q) {
          try {
            const res = await fetch(`/api/voice/product-search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            if (data?.match?.id) product = data.match;
          } catch (err) { console.error('REMOVE_WISHLIST lookup failed:', err); }
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:remove-from-wishlist', {
            detail: { product_id: productId || product?.id, query: q },
          }));
        }
        voiceResponse(product ? `Removed ${product.name} from your wishlist` : 'Removing from your wishlist');
        break;
      }
      case 'CHECKOUT': {
        router.push('/checkout');
        voiceResponse('Taking you to checkout');
        triggerModal('Checkout', 'Proceeding to checkout');
        break;
      }
      case 'REFINE': {
        const qs = buildSearchParams(params);
        if (qs) router.push(`/search?${qs}`);
        voiceResponse('Refining your results');
        break;
      }
      case 'COMPARE': {
        voiceResponse('Compare view is not available yet');
        break;
      }
      case 'RECOMMEND': {
        router.push('/products');
        voiceResponse('Here are some recommendations');
        break;
      }
      case 'SEARCH': {
        const q = (params.query || '').trim();
        if (q) {
          router.push(`/search?q=${encodeURIComponent(q)}`);
          recordLastSearch(q);
          voiceResponse(pickResponse(params,
            'Searching',
            `Searching for ${q}`,
            `Got it. I'll search the catalog for ${q} and load the matching results for you now.`
          ));
          triggerModal('Searching', q);
        } else {
          voiceResponse(pickResponse(params,
            'Search what?',
            'What would you like to search for?',
            "I'd love to help you search — what product or category would you like me to look for?"
          ));
        }
        break;
      }
      case 'SCROLL': {
        const dir = (params.direction || 'down').toLowerCase();
        if (typeof window === 'undefined') break;
        if (dir === 'up') {
          window.scrollBy(0, -window.innerHeight / 2);
          triggerModal('Scrolling Up', '', true, <IconArrowUp size={50} />);
        } else if (dir === 'top') {
          window.scrollTo(0, 0);
          triggerModal('Moving to Top', '', true, <IconArrowUpBar size={50} />);
        } else if (dir === 'bottom') {
          window.scrollTo(0, document.body.scrollHeight);
          triggerModal('Moving to Bottom', '', true, <IconArrowDownBar size={50} />);
        } else {
          window.scrollBy(0, window.innerHeight / 2);
          triggerModal('Scrolling Down', '', true, <IconArrowDown size={50} />);
        }
        // Only speak when sentiment forced a hint — keep neutral scrolls silent.
        if (params?.response_hint) {
          voiceResponse(pickResponse(params,
            dir,
            `Scrolling ${dir}`,
            `Got it. Scrolling ${dir} for you now.`
          ));
        }
        break;
      }
      case 'LOGOUT': {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:logout'));
        }
        voiceResponse('Logging you out');
        triggerModal('Logging out', '');
        break;
      }
      case 'HELP': {
        setShowInstruction(true);
        voiceResponse('Here are the things you can say');
        break;
      }
      case 'GREETING': {
        voiceResponse('Hello! How can I help you?');
        triggerModal('Hello', 'How can I help?');
        break;
      }
      case 'FAREWELL': {
        voiceResponse('Goodbye! Have a nice day');
        triggerModal('Goodbye', '', false, <IconMicrophoneOff size={50} />);
        SpeechRecognition.stopListening();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:deactivate'));
        }
        break;
      }
      case 'STOP_LISTENING': {
        voiceResponse('Okay, I will stop listening');
        triggerModal('Stopped listening', '', false, <IconMicrophoneOff size={50} />);
        SpeechRecognition.stopListening();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:deactivate'));
        }
        break;
      }
      case 'UNKNOWN':
      default: {
        const heard = (params.query || '').trim();
        voiceResponse("Sorry, I didn't catch that. Please try again.", false);
        triggerModal("Didn't catch that", heard ? `Heard: "${heard}"` : 'Please try again');
        break;
      }
    }
  };

  const triggerModal = (title, description, centered = true, icon = <FaMicrophone size={50} />) => {
    setModalOptions({
      icon,
      title,
      description,
      centered
    });
    setShowModal(true);
  }

  const commands = [
    // ===== General Navigation & Greetings =====
    { command: 'go to :pageName', callback: (pageName) => voicePageNavigator(pageName) },
    { command: 'open :pageName', callback: (pageName) => voicePageNavigator(pageName) },
    { command: 'show :pageName', callback: (pageName) => voicePageNavigator(pageName) },
    { command: 'search for *', callback: (query) => { router.push(`/search?q=${query}`); voiceResponse(`Searching for ${query}`); } },
    { command: 'scroll up', callback: () => { window.scrollBy(0, -window.innerHeight / 2); triggerModal('Scrolling Up', '', true, <IconArrowUp size={50} />); } },
    { command: 'scroll down', callback: () => { window.scrollBy(0, window.innerHeight / 2); triggerModal('Scrolling Down', '', true, <IconArrowDown size={50} />); } },
    { command: 'move to top', callback: () => { window.scrollTo(0, 0); triggerModal('Moving to Top', '', true, <IconArrowUpBar size={50} />); } },
    { command: 'move to bottom', callback: () => { window.scrollTo(0, document.body.scrollHeight); triggerModal('Moving to Bottom', '', true, <IconArrowDownBar size={50} />); } },
    { command: 'hello', callback: () => voiceResponse('Hello! How can I help you?') },
    { command: 'goodbye', callback: () => voiceResponse('Goodbye! Have a nice day!') },
    { command: 'start listening', callback: () => { voiceResponse('I am listening'); SpeechRecognition.startListening({ continuous: true }); triggerModal('Voice Assistant', 'I am listening'); } },
    { command: 'stop listening', callback: () => { voiceResponse('Okay, I will stop listening now'); SpeechRecognition.stopListening(); triggerModal('Voice Assistant', 'Good Bye! Have a nice day!', false, <IconMicrophoneOff size={50} />); } },

    // ===== Home/Main/Voice Shopping =====
    { command: 'show deals', callback: () => voicePageNavigator('deals') },
    { command: 'show sale', callback: () => voicePageNavigator('sale') },
    { command: 'show new arrivals', callback: () => voicePageNavigator('new arrivals') },
    { command: 'go to voice shopping', callback: () => voicePageNavigator('voice shopping') },
    { command: 'try voice shopping', callback: () => voicePageNavigator('voice shopping') },
    { command: 'show all products', callback: () => voicePageNavigator('products') },
    { command: 'sort by price', callback: () => { /* Implement sort logic if needed */ voiceResponse('Sorting by price'); } },
    { command: 'filter by brand', callback: () => { /* Implement filter logic if needed */ voiceResponse('Filtering by brand'); } },

    // ===== Cart =====
    { command: 'show my cart', callback: () => voicePageNavigator('cart') },
    { command: 'remove * from cart', callback: (item) => { voiceResponse(`Removing ${item} from cart. Please confirm on the cart page.`); } },
    { command: 'increase quantity of *', callback: (item) => { voiceResponse(`Increasing quantity of ${item}. Please confirm on the cart page.`); } },
    { command: 'decrease quantity of *', callback: (item) => { voiceResponse(`Decreasing quantity of ${item}. Please confirm on the cart page.`); } },
    { command: 'apply promo code *', callback: (code) => { voiceResponse(`Applying promo code ${code}. Please confirm on the cart page.`); } },
    { command: 'proceed to checkout', callback: () => voicePageNavigator('checkout') },
    { command: 'continue shopping', callback: () => voicePageNavigator('products') },

    // ===== Checkout =====
    { command: 'fill shipping details', callback: () => voiceResponse('Please fill your shipping details on the checkout page.') },
    { command: 'select payment method *', callback: (method) => voiceResponse(`Selecting payment method: ${method}`) },
    { command: 'place order', callback: () => voiceResponse('Placing your order. Please confirm on the checkout page.') },
    { command: 'go back to cart', callback: () => voicePageNavigator('cart') },

    // ===== Wishlist =====
    { command: 'show my wishlist', callback: () => voicePageNavigator('wishlist') },
    { command: 'add * to cart from wishlist', callback: (item) => voiceResponse(`Adding ${item} to cart from wishlist. Please confirm on the wishlist page.`) },
    { command: 'remove * from wishlist', callback: (item) => voiceResponse(`Removing ${item} from wishlist. Please confirm on the wishlist page.`) },
    { command: 'start shopping', callback: () => voicePageNavigator('products') },

    // ===== Orders =====
    { command: 'show my orders', callback: () => voicePageNavigator('orders') },
    { command: 'view order details for order :orderNumber', callback: (orderNumber) => voiceResponse(`Viewing details for order #${orderNumber}`) },
    { command: 'cancel order :orderNumber', callback: (orderNumber) => voiceResponse(`Cancelling order #${orderNumber}. Please confirm on the orders page.`) },
    { command: 'track order :orderNumber', callback: (orderNumber) => voiceResponse(`Tracking order #${orderNumber}`) },

    // ===== Product & Products =====
    { command: 'filter by *', callback: (filter) => voiceResponse(`Filtering by ${filter}`) },
    { command: 'sort by *', callback: (sort) => voiceResponse(`Sorting by ${sort}`) },
    { command: 'add * to cart', callback: (item) => voiceResponse(`Adding ${item} to cart. Please use the product page to confirm.`) },
    { command: 'add * to wishlist', callback: (item) => voiceResponse(`Adding ${item} to wishlist. Please use the product page to confirm.`) },
    { command: 'quick view *', callback: (item) => voiceResponse(`Quick viewing ${item}. Please use the product page to confirm.`) },
    { command: 'clear filters', callback: () => voiceResponse('Clearing all filters.') },

    // ===== User Account =====
    { command: 'go to user login', callback: () => voicePageNavigator('user login') },
    { command: 'go to user signup', callback: () => voicePageNavigator('user signup') },
    { command: 'go to user profile', callback: () => voicePageNavigator('profile') },
    { command: 'edit profile', callback: () => voiceResponse('Editing profile. Please use the profile page to confirm.') },
    { command: 'save profile', callback: () => voiceResponse('Saving profile. Please use the profile page to confirm.') },
    { command: 'logout', callback: () => voiceResponse('Logging out. Please confirm on the profile page.') },
    { command: 'view my orders', callback: () => voicePageNavigator('orders') },
    { command: 'view my wishlist', callback: () => voicePageNavigator('wishlist') },

    // ===== Seller Account =====
    { command: 'go to seller login', callback: () => voicePageNavigator('seller login') },
    { command: 'go to seller signup', callback: () => voicePageNavigator('seller signup') },
    { command: 'go to seller profile', callback: () => voicePageNavigator('seller profile') },
    { command: 'go to seller dashboard', callback: () => voicePageNavigator('seller dashboard') },
    { command: 'add new product', callback: () => voicePageNavigator('add product') },
    { command: 'edit product', callback: () => voicePageNavigator('edit product') },
    { command: 'view my products', callback: () => voicePageNavigator('seller products') },
    { command: 'view my seller orders', callback: () => voicePageNavigator('seller orders') },
    { command: 'logout seller', callback: () => voiceResponse('Logging out as seller. Please confirm on the seller profile page.') },

    // ===== Admin =====
    { command: 'go to admin login', callback: () => voicePageNavigator('admin login') },
    { command: 'go to admin dashboard', callback: () => voicePageNavigator('admin dashboard') },
    { command: 'go to admin settings', callback: () => voicePageNavigator('admin settings') },
    { command: 'go to admin users', callback: () => voicePageNavigator('admin users') },
    { command: 'go to admin sellers', callback: () => voicePageNavigator('admin sellers') },
    { command: 'go to admin products', callback: () => voicePageNavigator('admin products') },
    { command: 'edit site settings', callback: () => voiceResponse('Editing site settings. Please use the admin settings page to confirm.') },
    { command: 'change security settings', callback: () => voiceResponse('Changing security settings. Please use the admin settings page to confirm.') },
    { command: 'change email settings', callback: () => voiceResponse('Changing email settings. Please use the admin settings page to confirm.') },
    { command: 'change notification settings', callback: () => voiceResponse('Changing notification settings. Please use the admin settings page to confirm.') },
    { command: 'change appearance settings', callback: () => voiceResponse('Changing appearance settings. Please use the admin settings page to confirm.') },
    { command: 'change system settings', callback: () => voiceResponse('Changing system settings. Please use the admin settings page to confirm.') },
    { command: 'save settings', callback: () => voiceResponse('Saving settings. Please use the admin settings page to confirm.') },
    { command: 'reset to default', callback: () => voiceResponse('Resetting to default settings. Please use the admin settings page to confirm.') },
    { command: 'clear cache', callback: () => voiceResponse('Clearing cache. Please use the admin settings page to confirm.') },
    { command: 'backup database', callback: () => voiceResponse('Backing up database. Please use the admin settings page to confirm.') },
    { command: 'check system health', callback: () => voiceResponse('Checking system health. Please use the admin settings page to confirm.') },

    // ===== Other =====
    { command: 'contact support', callback: () => voicePageNavigator('contact') },
    { command: 'go to contact page', callback: () => voicePageNavigator('contact') },
    { command: 'show instructions', callback: () => setShowInstruction(true) },
    { command: 'show help', callback: () => setShowInstruction(true) },

    // ===== Dynamic/Contextual =====
    { command: 'view details for *', callback: (item) => voiceResponse(`Viewing details for ${item}`) },
    { command: 'add :quantity :item to cart', callback: (quantity, item) => voiceResponse(`Adding ${quantity} ${item} to cart. Please use the product page to confirm.`) },
    { command: 'remove :item from wishlist', callback: (item) => voiceResponse(`Removing ${item} from wishlist. Please confirm on the wishlist page.`) },
    { command: 'track order :orderNumber', callback: (orderNumber) => voiceResponse(`Tracking order #${orderNumber}`) },
    { command: 'cancel order :orderNumber', callback: (orderNumber) => voiceResponse(`Cancelling order #${orderNumber}. Please confirm on the orders page.`) },
    // Wildcard fallback: catch all unmatched input
    { command: '*', callback: () => {
      SpeechRecognition.stopListening();
      resetTranscript();
    }}
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript
  } = useSpeechRecognition({ commands });

  if (isMounted && !browserSupportsSpeechRecognition) {
    // Display a message if the browser is not supported, but still render children.
    console.warn("Speech recognition is not supported by this browser.");
    // Optionally, you could show a toast notification here.
  }

  const isNavigating = useRef(false);
  const voicePageNavigator = (pageName) => {
    if (isNavigating.current) return; // Prevent multiple navigations
    const page = pageDetails.find(page => pageName.toLowerCase().includes(page.pageName.toLowerCase()));
    if (page) {
      isNavigating.current = true;
      voiceResponse(`Navigating to ${pageName} page...`);
      triggerModal('Navigating...', `Navigating to ${pageName} page...`);
      router.push(page.pagePath);
      setTimeout(() => { isNavigating.current = false; }, 1500); // Reset after 1.5s
    } else {
      console.log('Page not found!');
    }
  }

  const fillInputUsingVoice = (cb) => {
    if (finalTranscript.toLowerCase().startsWith('enter')) {
      cb();
    }
  }

  const performActionUsingVoice = (triggerCommand, command, cb) => {
    if (finalTranscript.toLowerCase().startsWith(triggerCommand) && finalTranscript.toLowerCase().includes(command)) {
      cb();
    }
  }

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      // SpeechRecognition.startListening({ continuous: true });
      // voiceResponse('Welcome to Vox Market. What are you shopping today?');
      // triggerModal('Voice Assistant', 'I am listening');
    }
  }, [])

  // open instruction modal after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setShowInstruction(true);
    }, 3000);
  }, [])


  useEffect(() => {
    if (!listening) return; // Prevent running if not listening
    if (finalTranscript === 'start listening') {
      voiceResponse('I am listening');
      SpeechRecognition.startListening({ continuous: true });
      triggerModal('Voice Assistant', 'I am listening');
      resetTranscript();
    }
    if (finalTranscript.includes('top listening')) {
      voiceResponse('Okay, I will stop listening now');
      SpeechRecognition.stopListening();
      triggerModal('Voice Assistant', 'Good Bye! Have a nice day!', false, <IconMicrophoneOff size={50} />);
      resetTranscript();
    }
    if (finalTranscript.includes('hello box')) {
      resetTranscript();
      voiceResponse('Hello! How can I help you today?');
      SpeechRecognition.startListening({ continuous: true });
    }
    if (finalTranscript.includes('goodbye box')) {
      voiceResponse('Goodbye! Have a nice day!');
      SpeechRecognition.stopListening();
      triggerModal('Voice Assistant', 'Good bye! have a nice Day', false, <IconMicrophoneOff size={50} />);
      resetTranscript();
    }
    if (finalTranscript.includes('scroll up')) {
      window.scrollBy(0, -window.innerHeight / 2);
      triggerModal('Scrolling Up');
      resetTranscript();
      triggerModal('Scrolling Up', '', true, <IconArrowUp size={50} />);
    }

    if (finalTranscript.includes('scroll down')) {
      window.scrollBy(0, window.innerHeight / 2);
      triggerModal('Scrolling Down');
      resetTranscript();
      triggerModal('Scrolling Down', '', true, <IconArrowDown size={50} />);
    }

    if (finalTranscript.includes('move to bottom')) {
      window.scrollTo(0, document.body.scrollHeight);
      resetTranscript();
      triggerModal('Moving to Bottom', '', true, <IconArrowDownBar size={50} />);
    }

    if (finalTranscript.includes('move to top')) {
      window.scrollTo(0, 0);
      resetTranscript();
      triggerModal('Moving to Top', '', true, <IconArrowUpBar size={50} />);
    }
    if (finalTranscript.includes('browse products') || finalTranscript.includes('view all products')) {
      resetTranscript();
      voiceResponse('Showing all products');
      router.push('/productView');
    }
  }, [finalTranscript, listening])
  
  const voiceResponse = (text, stopListening = false) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Chrome has a known bug where reusing the same SpeechSynthesisUtterance
      // (or queueing without cancel) leaves `speechSynthesis.speaking === true`
      // forever, which then locks our mic echo guard. Always cancel first and
      // create a fresh utterance per call.
      try { window.speechSynthesis.cancel(); } catch (e) {}
      const u = new SpeechSynthesisUtterance(text);
      if (voices && voices.length > 5) u.voice = voices[5];

      // Set our own time-bounded "speaking until" timestamp. The voice-assistant
      // echo guard reads this instead of speechSynthesis.speaking (which can
      // get stuck true). Estimate ~80ms per character + 500ms padding, capped.
      const estimatedMs = Math.min(8000, 500 + text.length * 80);
      window.__VC_SPEAKING_UNTIL__ = Date.now() + estimatedMs;

      const clearFlag = () => { window.__VC_SPEAKING_UNTIL__ = 0; };
      const clearTimer = setTimeout(() => {
        try { window.speechSynthesis.cancel(); } catch (e) {}
        clearFlag();
      }, estimatedMs + 1000);
      u.onend = () => { clearTimeout(clearTimer); clearFlag(); };
      u.onerror = () => { clearTimeout(clearTimer); clearFlag(); };
      try { window.speechSynthesis.speak(u); }
      catch (e) { clearTimeout(clearTimer); clearFlag(); }
    }
    if (stopListening) {
      SpeechRecognition.stopListening();
    }
  }

  // Sentiment ("neutral" | "urgent" | "frustrated") is computed in the mic
  // component from speech rate and repeat detection. Map it onto a verbosity
  // hint that downstream voiceResponse calls will branch on.
  const hintForSentiment = (sentiment) => {
    if (sentiment === 'frustrated') return 'verbose';
    if (sentiment === 'urgent') return 'brief';
    return undefined;
  };

  const interpretVoiceCommand = async (inputTranscript, sentiment = 'neutral') => {
    const raw = (inputTranscript || transcript || '').trim();

    if (!raw) {
      resetTranscript();
      return;
    }

    const hint = hintForSentiment(sentiment);

    // Fast path: handle obvious commands locally without an API round-trip.
    const quick = localQuickMatch(raw);
    if (quick) {
      const params = { ...(quick.params || {}) };
      if (hint) params.response_hint = hint;
      const enriched = { ...quick, params };
      pushIntentHistory(enriched);
      dispatchIntent(enriched);
      resetTranscript();
      return;
    }

    try {
      const res = await fetch('/api/voice/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: raw,
          history: intentHistoryRef.current,
          sentiment,
        }),
      });

      const data = await res.json();
      if (data && data.intent) {
        pushIntentHistory(data);
        dispatchIntent(data);
      }
    } catch (err) {
      console.error('Voice intent fetch failed:', err);
      const params = { query: raw };
      if (hint) params.response_hint = hint;
      const fallback = { intent: 'UNKNOWN', params, confidence: 0 };
      pushIntentHistory(fallback);
      dispatchIntent(fallback);
    } finally {
      resetTranscript();
    }
  }


  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('voice:toggle'));
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [])


  useEffect(() => {
    const synth = window.speechSynthesis;
    if ("onvoiceschanged" in synth) {
      setVoices(voices);
      console.log(voices);
      synth.onvoiceschanged = loadVoices;
    }
  }, [])

  const loadVoices = () => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    // console.log(voices);
    
    setVoices(voices);
    // console.log(voices);
    if(speechRef.current) {
      speechRef.current.voice = voices[5];
    }
  }

  const checkExistenceInTranscript = (commandArray) => {
    const command = commandArray.find(command => finalTranscript.includes(command));
    return command;
  }

  return (
    <VoiceContext.Provider value={{
      transcript,
      resetTranscript,
      interpretVoiceCommand,
      fillInputUsingVoice,
      performActionUsingVoice,
      finalTranscript,
      voiceResponse,
      voices,
      triggerModal,
      checkExistenceInTranscript,
      cartProducts,
      updateCartProducts,
      intentHistory,
      dispatchIntent,
      personaliseResults
    }}>

      {children}
      {isMounted && <InfoModal {...modalOptions} showModal={showModal} setShowModal={setShowModal} />}
      {/* {
        showInstruction &&
        <div className='fixed top-0 left-0 w-full h-full bg-slate-900 opacity-90 z-20'>
          <div className='h-full backdrop-blur-md'>
            <InstructionModal setShowModal={setShowInstruction} />
          </div>
        </div>
      } */}
    </VoiceContext.Provider>
  )
}

const useVoiceContext = () => useContext(VoiceContext);
export default useVoiceContext;