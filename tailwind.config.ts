import type { Config } from "tailwindcss";
const config: Config = { content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}","./lib/**/*.{ts,tsx}"], theme:{ extend:{ colors:{ rune:{bg:"#0A0A0A",panel:"#111111",border:"#1F1F1F",muted:"#A1A1AA"}}, fontFamily:{sans:["var(--font-geist-sans)","Inter","sans-serif"]}, boxShadow:{terminal:"0 0 0 1px #1F1F1F, 0 24px 80px rgba(0,0,0,.45)"}}}, plugins:[]};
export default config;
