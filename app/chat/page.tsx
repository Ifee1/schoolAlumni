"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type ChatMessage = {
  created_at: string | undefined;
  sender_id: string | undefined;
  id: number | string;
  sender: string;
  content?: string;
  media_url?: string;
  media_type?: string;
};

function Chatpage() {
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      setMessages(data || []);
    };

    loadMessages();
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("REALTIME EVENT RECEIVED:", payload);

          const newMessage = payload.new as ChatMessage;

          setMessages((prev) => {
            // avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const channel = typingChannel
      .on("broadcast", { event: "typing" }, (payload) => {
        setSomeoneTyping(true);

        // auto-hide after 3 seconds of no typing
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          setSomeoneTyping(false);
        }, 3000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const typingChannel = supabase.channel("typing-events");
  const [someoneTyping, setSomeoneTyping] = useState(false);
  let typingTimeout: any = null;
  const [messageInput, setMessageInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // IMAGE MESSAGE
    if (selectedFile) {
      const publicUrl = await uploadImageToSupabase(selectedFile, user.id);

      if (!publicUrl) {
        console.error("Failed to upload image");
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          content: "",
          media_url: publicUrl,
          media_type: "image",
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to save image", error);
        return;
      }

      setPreviewImage(null);
      setSelectedFile(null);
      return;
    }

    // TEXT MESSAGE
    if (!messageInput.trim()) return;

    const text = messageInput.trim();

    const { data, error } = await supabase.from("messages").insert({
      sender_id: user.id,
      content: text,
      media_url: null,
      media_type: null,
    });

    if (error) {
      console.error("Failed to save text", error);
      return;
    }

    setMessageInput("");
  };

  const handleImageSelect = (file: File) => {
    const tempUrl = URL.createObjectURL(file);
    setPreviewImage(tempUrl);
    setSelectedFile(file);

    // ensure file input cannot receive focus (just in case)
    const fileInput = document.getElementById(
      "imageInput"
    ) as HTMLInputElement | null;
    fileInput?.blur();

    setTimeout(() => {
      previewRef.current?.focus();
    }, 0);
  };

  const generateFilePath = (file: File, userId: string) => {
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    return `images/${userId}/${timestamp}.${extension}`;
  };

  const uploadImageToSupabase = async (file: File, userId: string) => {
    const filePath = generateFilePath(file, userId);

    const { data, error } = await supabase.storage
      .from("alumniChat")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("alumniChat")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {someoneTyping && (
          <p className="text-gray-500 text-sm italic mb-2">
            Someone is typing…
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-xs rounded-lg shadow-md mb-2 ${
                msg.sender_id === currentUserId
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {msg.content && <p>{msg.content}</p>}

              {msg.media_url && msg.media_type === "image" && (
                <Image
                  src={msg.media_url}
                  alt="chat image"
                  width={250}
                  height={250}
                  className="rounded-lg mt-2"
                />
              )}
              <p
                className={`text-xs mt-1 ${
                  msg.sender_id === currentUserId
                    ? "text-blue-200"
                    : "text-gray-500"
                }`}
              >
                {formatTimestamp(msg.created_at)}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {previewImage && (
        <div
          className="p-4 bg-white border-t flex flex-col items-center"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend(); // SEND IMAGE
            }
          }}
          tabIndex={0}
          ref={previewRef}
        >
          <Image
            src={previewImage}
            alt="preview"
            width={300}
            height={300}
            className="max-w-xs rounded-lg mb-3 h-auto w-auto"
          />
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => {
                setPreviewImage(null);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>

            <Button onClick={handleSend} className="bg-blue-600 text-white">
              Send Image
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 bg-white border-2 border-gray-800 flex items-center gap-2 px-20">
        {/* Hidden file input */}
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="imageInput"
          tabIndex={-1}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageSelect(file);
          }}
        />

        {/* Image button */}
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => document.getElementById("imageInput")?.click()}
        >
          📷
        </Button>

        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-4 text-gray-800 border-2 border-gray-800"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);

            // Send typing status to others
            typingChannel.send({
              type: "broadcast",
              event: "typing",
              payload: { typing: true },
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <Button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-full"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default Chatpage;
