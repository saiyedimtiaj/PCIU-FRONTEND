const config = {
  theme: {
  extend: {
    // ... তোমার existing extend কনফিগ থাকলে সেটা রেখে এই দুটো যোগ করো
    keyframes: {
      "border-flow": {
        "0%": { backgroundPosition: "0% 50%" },
        "100%": { backgroundPosition: "300% 50%" },
      },
    },
    animation: {
      "border-flow": "border-flow 4s linear infinite",
      "border-flow-fast": "border-flow 1.5s linear infinite",
    },
  },
},
};

export default config;