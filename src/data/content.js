export const letter = `Happy Birthday, my beautiful Sunshine! 🌞

Today is all about YOU. The girl who walks into a room and somehow makes everything brighter just by being there. The girl whose smile is so contagious it should honestly be illegal. Those bright, beautiful eyes that hold so much warmth and magic, I could get lost in them forever and never once complain.

And yes, before you say anything, I am absolutely going to tease you about that adorable forehead today too. It's your birthday, not a truce. 😄

But in all seriousness, my love, you are something special. Your soft, beautiful skin, your gentle touch, the way your hugs make every single worry just... vanish. You are caring and sweet and understanding in ways that still catch me off guard. Your heart is enormous. Your soul is even bigger.

You've given me cuddles, laughter, and moments I'll carry with me for the rest of my life. And today I just want you to feel every bit of the love and joy you pour into the world every single day.

So here's to YOU. Happy Birthday, my love.
May this year be as radiant, warm, and wonderful as you are. ♥️

Yours always,
Divine`


// How the reasons slideshow behaves. Everything advances by itself;
// tapping or swiping just lets her go faster (or go back).
export const reasonSettings = {
  photoSeconds: 4,       // photo pages advance after this long
  videoMaxSeconds: 12,   // safety cap; videos normally advance ~1s after they end
  textMinSeconds: 5,     // shortest time a text page stays up
  secondsPerWord: 0.4,   // reading time for text pages
  pairTextPages: true,   // put two consecutive text-only reasons on one page
  closingSeconds: 4,     // "Enjoy your day" page before the celebration
}

// Each reason is { text, media? }. Add `seconds: 6` next to `media` to override a photo's time.
// media (optional): { type: 'image' | 'video', src: 'filename', caption?: '...', ratio?: '4 / 5' }
// Put the files in public/media/ and use just the filename here.
// If a file is missing, that reason simply shows without it.
export const reasons = [
  {
    text: "That smile. Genuinely the most beautiful thing I've ever seen 😊",
    media: { type: 'image', src: 'eyes.jpg', caption: 'that smile' },
  },
  //{ text: "The way you walk into a room and instantly make it better" },
 // { text: "Those big bright eyes full of warmth, magic, and mischief" },
  {
    text: "Your hugs, they fix everything, every single time",
    media: { type: 'image', src: 'hug.jpg', caption: 'my favourite place' },
  },
  {
    text: "That adorable forehead I will tease you about for the rest of our lives 🥰",
    media: { type: 'video', src: 'forehead.mp4', caption: 'guilty' },
  },

   {
    text: "How gentle and tender your touch always is",
    media: { type: 'video', src: 'gentle.mp4', caption: 'Beautiful' },
  },
  //{ text: "The way you love people so fully, so quietly, so genuinely" },
  //{ text: "" },
    {
    text: "Your soft, beautiful skin and the way you carry yourself with such grace",
    media: { type: 'video', src: 'Ski.mp4', caption: 'Caramel' },
  },
 // { text: "How understanding you are even when I least deserve it" },
 
     {
    text: "The joy you bring into every ordinary moment🥰",
    media: { type: 'video', src: 'joy.mp4', caption: 'Happiness' },
  },
 // },
  {
    text: "Your laugh. Once I hear it, I need to hear it again immediately",
    media: { type: 'video', src: 'laugh.mp4', caption: 'on repeat' },
  },
  { text: "I wish you all your heart desires, and the very best things life has to offer 💕" },
]