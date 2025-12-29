// components/app/ChatSheet.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useAuth } from "@clerk/nextjs";
import {
  Sparkles,
  Send,
  Loader2,
  X,
  Bot,
  Minimize2,
  Trash2,
  Volume2,
  VolumeX,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useIsChatOpen,
  useChatActions,
  usePendingMessage,
} from "@/lib/store/chat-store-provider";
import { WelcomeScreen } from "./chat/WelcomeScreen";
import { ToolCallUI } from "./chat/ToolCallUI";
import { MessageBubble } from "./chat/MessageBubble";
import { getMessageText, getToolParts } from "./chat/utils";
import { cn } from "@/lib/utils";

// Quick action suggestions
const QUICK_ACTIONS = [
  { label: "Sofás em promoção", icon: "🛋️" },
  { label: "Móveis para sala", icon: "🏠" },
  { label: "Frete grátis", icon: "🚚" },
  { label: "Mais vendidos", icon: "⭐" },
];

export function ChatSheet() {
  const isOpen = useIsChatOpen();
  const { closeChat, clearPendingMessage } = useChatActions();
  const pendingMessage = usePendingMessage();
  const { isSignedIn } = useAuth();

  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat();
  const isLoading = status === "streaming" || status === "submitted";
  const hasMessages = messages.length > 0;

  // Auto-scroll to bottom
  useEffect(() => {
    if (!showScrollButton) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, showScrollButton]);

  // Handle scroll position to show/hide scroll button
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Handle pending message
  useEffect(() => {
    if (isOpen && pendingMessage && !isLoading) {
      sendMessage({ text: pendingMessage });
      clearPendingMessage();
    }
  }, [isOpen, pendingMessage, isLoading, sendMessage, clearPendingMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  const handleQuickAction = (action: string) => {
    if (isLoading) return;
    sendMessage({ text: action });
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Mobile/Tablet */}
      <div
        className={cn(
          "fixed inset-0 z-40",
          "bg-black/60 backdrop-blur-sm",
          "xl:hidden",
          "animate-in fade-in duration-200"
        )}
        onClick={closeChat}
        aria-hidden="true"
      />

      {/* Chat Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50",
          "flex h-full w-full flex-col",
          "sm:w-[400px] 2xl:w-[448px]",
          "bg-white dark:bg-zinc-950",
          "border-l border-zinc-200 dark:border-zinc-800",
          "shadow-2xl shadow-black/10 dark:shadow-black/30",
          "animate-in slide-in-from-right duration-300",
          "overscroll-contain"
        )}
      >
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <header
          className={cn(
            "relative shrink-0",
            "border-b border-zinc-200 dark:border-zinc-800",
            "bg-gradient-to-r from-amber-50 to-orange-50",
            "dark:from-amber-950/20 dark:to-orange-950/20"
          )}
        >
          {/* Main Header */}
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {/* AI Avatar */}
              <div className="relative">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center",
                    "rounded-full",
                    "bg-gradient-to-br from-amber-400 to-orange-500",
                    "shadow-lg shadow-amber-500/30"
                  )}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                {/* Online Indicator */}
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5",
                    "flex h-3.5 w-3.5 items-center justify-center",
                    "rounded-full",
                    "bg-white dark:bg-zinc-950",
                    "ring-2 ring-white dark:ring-zinc-950"
                  )}
                >
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Assistente de Compras
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                      </span>
                      Digitando...
                    </span>
                  ) : (
                    "Online • Pronto para ajudar"
                  )}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              >
                {isSoundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>

              {/* Clear Chat */}
              {hasMessages && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
                  onClick={handleClearChat}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              {/* Minimize (Desktop) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 xl:flex"
                onClick={closeChat}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>

              {/* Close */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                onClick={closeChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* AI Badge */}
          <div
            className={cn(
              "absolute -bottom-3 left-1/2 -translate-x-1/2",
              "px-3 py-1",
              "text-[10px] font-medium",
              "bg-gradient-to-r from-amber-500 to-orange-500",
              "text-white",
              "rounded-full",
              "shadow-md shadow-amber-500/30"
            )}
          >
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </span>
          </div>
        </header>

        {/* ============================================ */}
        {/* MESSAGES AREA */}
        {/* ============================================ */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className={cn(
            "relative flex-1",
            "overflow-y-auto overscroll-contain",
            "px-4 pt-6 pb-4",
            "bg-zinc-50 dark:bg-zinc-900"
          )}
        >
          {/* Background Pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative">
            {!hasMessages ? (
              <WelcomeScreen
                onSuggestionClick={sendMessage}
                isSignedIn={isSignedIn ?? false}
              />
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const content = getMessageText(message);
                  const toolParts = getToolParts(message);
                  const hasContent = content.length > 0;
                  const hasTools = toolParts.length > 0;

                  if (!hasContent && !hasTools) return null;

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "space-y-3",
                        "animate-in fade-in slide-in-from-bottom-2",
                        "duration-300"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Tool Calls */}
                      {hasTools &&
                        toolParts.map((toolPart) => (
                          <ToolCallUI
                            key={`tool-${message.id}-${toolPart.toolCallId}`}
                            toolPart={toolPart}
                            closeChat={closeChat}
                          />
                        ))}

                      {/* Message Content */}
                      {hasContent && (
                        <MessageBubble
                          role={message.role}
                          content={content}
                          closeChat={closeChat}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center",
                        "rounded-full",
                        "bg-gradient-to-br from-amber-100 to-orange-100",
                        "dark:from-amber-900/40 dark:to-orange-900/40",
                        "ring-2 ring-white dark:ring-zinc-900"
                      )}
                    >
                      <Bot className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1.5",
                        "px-4 py-3",
                        "bg-white dark:bg-zinc-800",
                        "rounded-2xl rounded-tl-md",
                        "shadow-sm",
                        "border border-zinc-100 dark:border-zinc-700"
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          "bg-amber-400",
                          "animate-bounce [animation-delay:-0.3s]"
                        )}
                      />
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          "bg-amber-500",
                          "animate-bounce [animation-delay:-0.15s]"
                        )}
                      />
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          "bg-orange-400",
                          "animate-bounce"
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Scroll Anchor */}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            )}
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className={cn(
                "fixed bottom-32 right-6 sm:right-[188px] 2xl:right-[212px]",
                "flex h-10 w-10 items-center justify-center",
                "rounded-full",
                "bg-white dark:bg-zinc-800",
                "border border-zinc-200 dark:border-zinc-700",
                "shadow-lg",
                "text-zinc-600 dark:text-zinc-400",
                "hover:bg-zinc-50 dark:hover:bg-zinc-700",
                "transition-all duration-200",
                "animate-in fade-in zoom-in duration-200"
              )}
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ============================================ */}
        {/* QUICK ACTIONS */}
        {/* ============================================ */}
        {!hasMessages && (
          <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Sugestões rápidas:
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.label)}
                  disabled={isLoading}
                  className={cn(
                    "flex items-center gap-1.5",
                    "px-3 py-1.5",
                    "text-xs font-medium",
                    "bg-zinc-100 dark:bg-zinc-800",
                    "hover:bg-zinc-200 dark:hover:bg-zinc-700",
                    "text-zinc-700 dark:text-zinc-300",
                    "rounded-full",
                    "transition-colors duration-200",
                    "disabled:opacity-50"
                  )}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* INPUT AREA */}
        {/* ============================================ */}
        <div
          className={cn(
            "shrink-0",
            "border-t border-zinc-200 dark:border-zinc-800",
            "bg-white dark:bg-zinc-950",
            "p-4"
          )}
        >
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre nossos móveis..."
                disabled={isLoading}
                className={cn(
                  "h-12 pr-4",
                  "bg-zinc-100 dark:bg-zinc-800",
                  "border-0",
                  "rounded-xl",
                  "text-sm",
                  "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                  "focus-visible:ring-2 focus-visible:ring-amber-500",
                  "transition-all duration-200"
                )}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className={cn(
                "h-12 w-12",
                "rounded-xl",
                "bg-gradient-to-r from-amber-500 to-orange-500",
                "hover:from-amber-600 hover:to-orange-600",
                "shadow-lg shadow-amber-500/25",
                "hover:shadow-xl hover:shadow-amber-500/30",
                "disabled:opacity-50 disabled:shadow-none",
                "transition-all duration-200"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <p className="mt-3 text-center text-[10px] text-zinc-400 dark:text-zinc-500">
            IA pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </>
  );
}