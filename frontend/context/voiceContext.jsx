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
  
  const voiceResponse = (text, stopListening = true) => {
    if (speechRef.current) {
      speechRef.current.text = text;
      window.speechSynthesis.speak(speechRef.current);
    }
    if (stopListening) {
      SpeechRecognition.stopListening();
    }
  }

  const interpretVoiceCommand = (inputTranscript) => {
    const cmd = (inputTranscript || transcript).toLowerCase();
    // Try to match with pageDetails
    for (const page of pageDetails) {
      if (cmd.includes(page.pageName)) {
        voicePageNavigator(page.pageName);
        SpeechRecognition.stopListening();
        resetTranscript();
        return;
      }
    }
    // Try to match with specific keywords
    if (cmd.startsWith('search for ')) {
      const query = cmd.replace('search for ', '').trim();
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        voiceResponse(`Searching for ${query}`);
        SpeechRecognition.stopListening();
        resetTranscript();
        return;
      }
    }
    if (cmd.startsWith('add ') && cmd.includes(' to cart')) {
      const item = cmd.replace('add ', '').replace(' to cart', '').trim();
      voiceResponse(`Adding ${item} to cart. Please use the product page to confirm.`);
      SpeechRecognition.stopListening();
      resetTranscript();
      return;
    }
    if (cmd.includes('scroll up')) {
      window.scrollBy(0, -window.innerHeight / 2);
      triggerModal('Scrolling Up', '', true, <IconArrowUp size={50} />);
      SpeechRecognition.stopListening();
      resetTranscript();
      return;
    }
    if (cmd.includes('scroll down')) {
      window.scrollBy(0, window.innerHeight / 2);
      triggerModal('Scrolling Down', '', true, <IconArrowDown size={50} />);
      SpeechRecognition.stopListening();
      resetTranscript();
      return;
    }
    if (cmd.includes('move to top')) {
      window.scrollTo(0, 0);
      triggerModal('Moving to Top', '', true, <IconArrowUpBar size={50} />);
      SpeechRecognition.stopListening();
      resetTranscript();
      return;
    }
    if (cmd.includes('move to bottom')) {
      window.scrollTo(0, document.body.scrollHeight);
      triggerModal('Moving to Bottom', '', true, <IconArrowDownBar size={50} />);
      SpeechRecognition.stopListening();
      resetTranscript();
      return;
    }
    if (cmd.includes('hello')) {
      voiceResponse('Hello! How can I help you?');
      SpeechRecognition.stopListening();
      resetTranscript();
      return;
    }
    if (cmd.includes('goodbye')) {
      voiceResponse('Goodbye! Have a nice day!');
      SpeechRecognition.stopListening();
      resetTranscript();
      return;
    }
    // Fallback: no voice response, just stop listening and reset
    SpeechRecognition.stopListening();
    resetTranscript();
  }


  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      // console.log(e.code);
      if (e.code === 'Space' && e.ctrlKey) {
        SpeechRecognition.startListening();
      }
    });
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
      updateCartProducts
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