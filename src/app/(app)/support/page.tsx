"use client";

import { useState, useEffect, useRef } from "react";
import { supportApi } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaSpinner, FaPaperPlane, FaUser } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

// Define interfaces for API responses
interface TicketResponse {
  ticketId: string;
  channelId: string;
  channelName: string;
  status: string;
  responseTime: number;
}

interface ReplyItem {
  id: string;
  from: string;
  content: string;
  timestamp: number;
  avatar: string;
  displayName: string;
  isBot: boolean;
  isSupport: boolean;
  userType: string;
}

export default function SupportPage() {
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [previousRepliesLength, setPreviousRepliesLength] = useState(0);

  // Create a new ticket automatically
  const createTicket = async () => {
    setLoading(true);
    try {
      const response = await supportApi.post<TicketResponse>("/ticket", {
        subject: "Support Request",
        message: "I need assistance with my account",
      });

      if (response.data) {
        setTicketId(response.data.ticketId);
        fetchReplies(response.data.ticketId);
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send a reply to an existing ticket
  const sendReply = async () => {
    if (!replyInput || !ticketId) return;

    setSendingMessage(true);
    try {
      await supportApi.post(`/reply/${ticketId}`, {
        message: replyInput,
      });

      setReplyInput("");
      fetchReplies(ticketId);
      // Always scroll to bottom when user sends a message
      setAutoScroll(true);
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Fetch all replies for a ticket
  const fetchReplies = async (id: string) => {
    try {
      const fetchedReplies = await supportApi.get<ReplyItem[]>(
        `/replies/${id}`,
        {
          showErrorToast: false,
        }
      );
      if (fetchedReplies.data) {
        setPreviousRepliesLength(replies.length);
        setReplies(fetchedReplies.data.slice(1, fetchedReplies.data.length));
      }
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    }
  };

  // Add this function to check if a URL is an image
  const isImageUrl = (url: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const extension = url.split(".").pop()?.toLowerCase();
    return extension && imageExtensions.includes(extension);
  };

  // Format message content to handle special Discord formatting
  const formatMessageContent = (content: string, isUserMessage = false) => {
    let formattedContent = content;
    const urlRegex = /(https?:\/\/[^\s<>"]+)(?:\s|$)/g;
    const matches = [...formattedContent.matchAll(urlRegex)];

    // Process each URL
    for (const match of matches) {
      const url = match[1];

      // First check if it looks like an image URL by extension
      if (isImageUrl(url)) {
        // Simplified image rendering without complicated JS event handlers
        const imageHtml = `
          <div class="mt-2 relative">
            <img 
              src="${url}" 
              alt="Image" 
              class="max-w-full rounded-md max-h-[300px]"
            />
          </div>
        `;
        formattedContent = formattedContent.replace(url, imageHtml);
        continue;
      }

      // Check for video links
      const videoExtensions = ["mp4", "webm", "mov", "ogg"];
      const urlExtension = url.split(".").pop()?.toLowerCase();

      if (urlExtension && videoExtensions.includes(urlExtension)) {
        const extension = urlExtension;
        let mimeType = "video/mp4"; // default

        // Set the correct MIME type based on extension
        if (extension === "webm") mimeType = "video/webm";
        else if (extension === "ogg") mimeType = "video/ogg";
        else if (extension === "mov") mimeType = "video/quicktime";

        // Simplified video tag
        const videoHtml = `
          <div class="mt-2">
            <video controls preload="metadata" class="max-w-full rounded-md max-h-[300px]">
              <source src="${url}" type="${mimeType}">
              Your browser does not support video.
            </video>
          </div>
        `;
        formattedContent = formattedContent.replace(url, videoHtml);
        continue;
      }

      // Regular URL (not processed as media)
      const linkClass = isUserMessage
        ? "text-white underline"
        : "text-blue-500 hover:underline";
      const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${url}</a>`;
      formattedContent = formattedContent.replace(url, linkHtml);
    }

    // Handle Discord user mentions like <@497085547970560021>
    formattedContent = formattedContent.replace(
      /<@(\d+)>/g,
      (match, userId) => {
        const mentionClass = isUserMessage
          ? "bg-white/20 text-white"
          : "bg-blue-500/15 text-blue-600";
        return `<a href="https://discord.com/users/${userId}" target="_blank" class="px-1.5 py-0.5 ${mentionClass} rounded font-medium hover:underline">@User-${userId.substring(
          0,
          4
        )}</a>`;
      }
    );

    // Handle Discord role mentions like <@&1364540037101781107>
    formattedContent = formattedContent.replace(
      /<@&(\d+)>/g,
      (match, roleId) => {
        const mentionClass = isUserMessage
          ? "bg-white/20 text-white"
          : "bg-blue-500/15 text-blue-600";
        return `<span class="px-1.5 py-0.5 ${mentionClass} rounded font-medium">@Support Team</span>`;
      }
    );

    // Convert newlines to <br>
    return formattedContent.replace(/\n/g, "<br/>");
  };

  // Detect when user scrolls up (to disable auto-scroll)
  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (!isAtBottom && autoScroll) {
      setAutoScroll(false);
    } else if (isAtBottom && !autoScroll) {
      setAutoScroll(true);
    }
  };

  // Create ticket on page load if no ticket exists
  useEffect(() => {
    if (!ticketId) {
      createTicket();
    }
  }, []);

  // Scroll to bottom when new messages arrive if autoScroll is enabled
  useEffect(() => {
    // Only auto-scroll if we received new messages or if the user just sent a message
    const hasNewMessages = replies.length > previousRepliesLength;

    if (autoScroll && hasNewMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [replies, autoScroll, previousRepliesLength]);

  // Refresh replies periodically if we have an active ticket
  useEffect(() => {
    if (!ticketId) return;

    const interval = setInterval(() => {
      fetchReplies(ticketId);
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [ticketId]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Add this component to safely handle loading images
  const ImageLoader = ({
    url,
    isUserMessage,
  }: {
    url: string;
    isUserMessage: boolean;
  }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
      <div className="mt-2 relative">
        {!loaded && !error && (
          <div className="loading-spinner absolute inset-0 flex items-center justify-center">
            <div
              className={`animate-spin h-8 w-8 ${
                isUserMessage ? "text-white" : "text-blue-500"
              }`}
            >
              {/* Spinner implementation */}
            </div>
          </div>
        )}

        {error ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isUserMessage
                ? "text-white underline"
                : "text-blue-500 hover:underline"
            }
          >
            {url}
          </a>
        ) : (
          <img
            src={url}
            alt="Image"
            className={`max-w-full rounded-md max-h-[300px] ${
              loaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full max-w-full p-0 overflow-hidden">
      {loading && !ticketId ? (
        // Loading state while creating ticket
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <span className="text-gray-600">Connecting to support...</span>
          </div>
        </div>
      ) : (
        // Chat interface
        <div className="flex flex-col bg-white overflow-hidden h-full">
          {/* Messages container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 pt-6 bg-white"
            onScroll={handleScroll}
          >
            <div className="w-full mx-auto space-y-4">
              {replies.length === 0 && (
                <div className="flex justify-center items-center h-[50vh]">
                  <div className="text-center max-w-md p-8 rounded-lg  text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2 ">
                      Welcome to Support
                    </h3>
                    <p>
                      Your support conversation will appear here. Type a message
                      below to get started with one of our agents.
                    </p>
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {replies.map((reply, index) => {
                const isUser = !reply.isBot && !reply.isSupport;
                const isSupport = !isUser;
                const hasMention = reply.content.includes("@");

                return (
                  <div
                    key={reply.id}
                    className={cn(
                      "flex w-full items-end gap-3",
                      isUser ? "flex-row-reverse" : "flex-row",
                      isUser ? "ml-4" : "mr-4",
                      hasMention ? "relative" : ""
                    )}
                  >
                    {hasMention && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full -mt-1 -mr-1"></div>
                    )}

                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={
                        reply.avatar
                          ? {
                              backgroundImage: `url(${reply.avatar})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : {
                              backgroundColor: isUser ? "#3b82f6" : "#e2e8f0",
                            }
                      }
                    >
                      {!reply.avatar && (
                        <span
                          className={cn(
                            "text-lg font-medium",
                            isUser ? "text-white" : "text-gray-600"
                          )}
                        >
                          {isUser
                            ? "P"
                            : reply.displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col max-w-[80%]">
                      <div
                        className={cn(
                          "px-4 py-3 rounded-md",
                          hasMention ? "ring-1 ring-blue-500/20" : "",
                          isUser
                            ? "bg-blue-500 text-white font-medium"
                            : "bg-gray-100 text-blue-600"
                        )}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatMessageContent(reply.content, isUser),
                          }}
                        />
                      </div>
                      <div
                        className={cn(
                          "text-xs mt-1",
                          isUser ? "text-right" : "text-left",
                          hasMention ? "text-blue-600" : "text-gray-500"
                        )}
                      >
                        {formatDate(reply.timestamp)}
                        {hasMention && <span className="ml-2">@mentioned</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Reply input - fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#f8f9fa] border-t ">
            <div className="flex items-center w-full px-4 mx-auto relative">
              <Input
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Type your message..."
                disabled={sendingMessage}
                className=" h-11"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendReply()
                }
              />
              <Button
                onClick={sendReply}
                disabled={sendingMessage || !replyInput}
                size="icon"
                variant="ghost"
                className="absolute right-6 h-10 w-10 rounded-full text-blue-500 hover:text-blue-600 hover:bg-transparent"
              >
                {sendingMessage ? (
                  <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                  <FaPaperPlane className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
