"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  X,
  Send,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "admin";
  content: string;
  image?: string;
  timestamp: Date;
}

export function ChatWidget() {
  console.log("ChatWidget rendering");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "admin",
      content: "Xin chào! Tôi có thể giúp gì cho bạn?",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    const handleToggleChat = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("toggle-chat", handleToggleChat);
    return () => window.removeEventListener("toggle-chat", handleToggleChat);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate admin response
    setTimeout(() => {
      const adminResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "admin",
        content: "Cảm ơn bạn đã nhắn tin! Admin sẽ phản hồi sớm nhất có thể.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, adminResponse]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "",
          image: reader.result as string,
          timestamp: new Date(),
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Chat Popup */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300",
            isMinimized
              ? "bottom-3 right-3 w-80 h-16"
              : "bottom-3 right-3 w-96 h-[600px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Hỗ trợ trực tuyến
                </h3>
                <p className="text-white/50 text-xs">Admin đang online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-white/70" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-white/70" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-180px)]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.type === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                        msg.type === "admin"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : "bg-white/10 text-white/70",
                      )}
                    >
                      {msg.type === "admin" ? "A" : "U"}
                    </div>
                    <div
                      className={cn(
                        "max-w-[70%] space-y-1",
                        msg.type === "user" ? "items-end" : "items-start",
                      )}
                    >
                      {msg.image && (
                        <div className="rounded-lg overflow-hidden">
                          <Image
                            src={msg.image}
                            alt="Uploaded image"
                            width={300}
                            height={200}
                            className="max-w-full h-auto"
                          />
                        </div>
                      )}
                      {msg.content && (
                        <div
                          className={cn(
                            "px-4 py-2 rounded-2xl text-sm",
                            msg.type === "user"
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-sm"
                              : "bg-white/10 text-white rounded-bl-sm",
                          )}
                        >
                          {msg.content}
                        </div>
                      )}
                      <p className="text-[10px] text-white/40">
                        {msg.timestamp.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Nhập tin nhắn..."
                      className="h-10 w-full bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm placeholder:text-white/40 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
                      rows={1}
                    />
                  </div>
                  <div className="flex gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10"
                      >
                        <ImageIcon className="w-4 h-4 text-white/70" />
                      </Button>
                    </label>
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
