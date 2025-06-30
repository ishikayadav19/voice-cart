# Voice Feature Setup Guide

## Overview
The voice feature in VoiceCart allows users to navigate the website and search for products using voice commands. It uses the Web Speech API for speech recognition and synthesis.

## Features
- **Voice Search**: Search for products by speaking
- **Category Navigation**: Navigate to different product categories
- **Cart & Wishlist Access**: Open cart and wishlist with voice commands
- **Smart Command Processing**: Understands natural language commands

## How to Use

### Basic Commands
1. **Search Commands**:
   - "Search for phones"
   - "Find laptops"
   - "Look for electronics"

2. **Navigation Commands**:
   - "Go to electronics"
   - "Navigate to fashion"
   - "Open my cart"
   - "Show wishlist"

3. **Category-Specific Search**:
   - "Search for phones in electronics"
   - "Find dresses in fashion"

### Voice Assistant Button
- Click the microphone icon in the bottom-right corner
- Speak your command clearly
- The assistant will process and execute your command

## Technical Requirements

### Browser Support
The voice feature requires a modern browser with Web Speech API support:
- Chrome (recommended)
- Edge
- Safari (limited support)
- Firefox (limited support)

### Environment Variables
Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API Endpoints Required
The voice feature uses these backend endpoints:
- `GET /product/search?q={query}` - General product search
- `GET /product/category/{category}` - Category-specific products

## Troubleshooting

### Voice Recognition Not Working
1. **Check Browser Support**: Ensure you're using a supported browser
2. **Microphone Permissions**: Allow microphone access when prompted
3. **HTTPS Required**: Voice features work best over HTTPS
4. **Clear Browser Cache**: Clear cache and cookies

### Commands Not Being Recognized
1. **Speak Clearly**: Enunciate your words clearly
2. **Reduce Background Noise**: Minimize background noise
3. **Try Different Phrases**: Use alternative command phrases
4. **Check Command Examples**: Refer to the tooltip for example commands

### Navigation Issues
1. **Check URL Structure**: Ensure category URLs match the expected format
2. **API Connectivity**: Verify backend API is running and accessible
3. **Network Issues**: Check internet connection

## Development

### Adding New Commands
To add new voice commands, modify the `processCommand` function in `voice-assistant.jsx`:

```javascript
// Add new command patterns
if (lowerCommand.includes("your new command")) {
  // Handle the command
  speakResponse("Processing your command")
  router.push("/your-route")
}
```

### Customizing Voice Responses
Modify the `speakResponse` function to change voice settings:

```javascript
const utterance = new SpeechSynthesisUtterance(text)
utterance.rate = 0.9  // Speed (0.1 to 10)
utterance.pitch = 1.0 // Pitch (0 to 2)
utterance.volume = 1.0 // Volume (0 to 1)
```

### Styling
Voice assistant styles are in `globals.css`. Key classes:
- `.voice-assistant-button` - Main button styling
- `.voice-tooltip` - Tooltip/modal styling
- `.listening-animation` - Listening state animations

## Security Considerations
- Voice data is processed locally in the browser
- No voice recordings are stored permanently
- Commands are processed client-side for privacy

## Performance Tips
- Use specific commands for better recognition
- Avoid complex sentences
- Speak at a normal pace
- Ensure good microphone quality

## Support
If you encounter issues:
1. Check browser console for errors
2. Verify API endpoints are working
3. Test with different browsers
4. Check microphone permissions 