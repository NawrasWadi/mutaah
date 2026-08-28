"use client";
import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

const HIDDEN_PATHS = ["/login", "/register"];

export default function ChatbotWrapper() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.includes(pathname)) return null;
  return <Chatbot />;
}