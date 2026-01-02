import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader } from "lucide-react";

const HelpSupportPage = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I'm SentriAI Assistant. How can I help you with crowd safety and monitoring today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Response using OpenAI-style API (Free alternative - Hugging Face)
  const getAIResponse = async (userMessage) => {
    // Always use SentriAI context-aware responses
    return getSentriAIResponse(userMessage);
  };

  // Context-aware responses for SentriAI with better variety
  const getSentriAIResponse = (message) => {
    const lowerMsg = message.toLowerCase();
    
    // About the app
    if (lowerMsg.includes("about") && (lowerMsg.includes("app") || lowerMsg.includes("sentri"))) {
      return "SentriAI is an AI-powered crowd safety and alert system designed for large events. We use computer vision, audio analytics, and social media monitoring to detect overcrowding, panic, and emergencies in real-time. Our system includes live heatmaps, responder management, panic sentiment analysis, and automated alerts to keep crowds safe.";
    }
    
    // Features
    if (lowerMsg.includes("feature") || lowerMsg.includes("what can") || lowerMsg.includes("capabilities")) {
      return "SentriAI offers:\n• Real-time crowd density monitoring with heatmaps\n• AI panic detection through social media\n• Automated emergency alerts (PA, LED boards, mobile)\n• Responder tracking and dispatch\n• Video analytics for anomaly detection\n• Post-event reports and analytics\n\nWhich feature would you like to explore?";
    }
    
    // Crowd safety related
    if (lowerMsg.includes("crowd") || lowerMsg.includes("density")) {
      return "Our crowd density monitoring uses AI-powered cameras to track people count and movement patterns. When density exceeds 70%, the system automatically alerts responders. You can view live heatmaps showing red zones (critical), orange (high), yellow (moderate), and green (safe) areas. Want to know how to set custom thresholds?";
    }
    
    if (lowerMsg.includes("threshold") || lowerMsg.includes("limit") || lowerMsg.includes("set")) {
      return "You can customize alert thresholds in the Crowd Heatmap page using the slider (default: 70%). When crowd density exceeds this level, automatic alerts are triggered. You can also set zone-specific thresholds for areas like entrances, stages, and exits. Would you like to know more about alert types?";
    }
    
    if (lowerMsg.includes("alert") || lowerMsg.includes("notification") || lowerMsg.includes("warning")) {
      return "SentriAI sends multi-channel alerts:\n• Dashboard notifications (instant)\n• Mobile push alerts to responders\n• LED signboard messages to guide crowds\n• PA system announcements\n• SMS/calls to emergency contacts\n\nAlerts include location, severity, and recommended actions. Need help setting up alert preferences?";
    }
    
    if (lowerMsg.includes("responder") || lowerMsg.includes("team") || lowerMsg.includes("staff")) {
      return "We support 4 responder teams: Medical (Manaswitha), Fire (Thanusiya), Security (Kevna), and Crowd Control (Latika). Each responder has real-time status tracking, battery/signal monitoring, and can be dispatched instantly. You can call them directly, track their location, and view response times. Want to know about dispatch procedures?";
    }
    
    if (lowerMsg.includes("dispatch") || lowerMsg.includes("send")) {
      return "To dispatch a responder:\n1. Go to Responder Status page\n2. Select an available team member\n3. Click 'Dispatch' button\n4. Assign incident ID and type\n5. Monitor their ETA and location\n\nYou can recall responders anytime. The system auto-updates their status and logs completed tasks.";
    }
    
    if (lowerMsg.includes("panic") || lowerMsg.includes("sentiment") || lowerMsg.includes("social")) {
      return "The Panic Sentiment Gauge uses AI to monitor Twitter, Facebook, and Instagram posts in real-time. It analyzes keywords like 'crowded', 'pushing', 'unsafe', 'blocked' and assigns a panic score (0-100%). When the score exceeds 60%, high panic alerts are triggered. You can see trending keywords and individual posts with sentiment scores.";
    }
    
    if (lowerMsg.includes("heatmap") || lowerMsg.includes("map") || lowerMsg.includes("zone")) {
      return "The Crowd Heatmap displays 8 monitored zones: Entrance, Main Stage, Food Court, VIP Area, Exits A & B, Merchandise, and Parking. Each zone shows real-time density percentage with color coding. You can click any zone for detailed stats, view historical data, and export heatmap images. The map updates every 5 seconds.";
    }
    
    if (lowerMsg.includes("emergency") || lowerMsg.includes("incident") || lowerMsg.includes("crisis")) {
      return "In an emergency:\n1. Use 'Broadcast' button for mass alerts\n2. Dispatch nearest responders immediately\n3. Trigger evacuation protocols if needed\n4. Monitor evacuation routes on heatmap\n5. All actions are logged automatically\n\nThe system prioritizes life safety and guides crowds to safe zones. Need emergency contact numbers?";
    }
    
    if (lowerMsg.includes("report") || lowerMsg.includes("analytics") || lowerMsg.includes("data")) {
      return "Event Reports include:\n• Total attendees and peak density times\n• Incident count and response times\n• Responder performance metrics\n• Sentiment analysis trends\n• Safety compliance scores\n\nReports are auto-generated daily and can be exported as PDF. Access them in Reports & Analytics section. Want to generate a custom report?";
    }
    
    if (lowerMsg.includes("camera") || lowerMsg.includes("video") || lowerMsg.includes("feed")) {
      return "We have 23 AI-powered cameras monitoring the event. Video analytics detect:\n• Crowd counting and movement\n• Unusual behavior patterns\n• Fight detection\n• Overcrowding in real-time\n• Abandoned objects\n\nAll feeds are recorded and can be reviewed post-event. Access live feeds in Video Feeds section (23 active).";
    }
    
    if (lowerMsg.includes("call") || lowerMsg.includes("contact") || lowerMsg.includes("phone")) {
      return "You can call responders directly:\n• Manaswitha (Medical): +91-9014721672\n• Thanusiya (Fire): +91-9618775125\n• Latika (Crowd Control): +91-7601062419\n• Kevna (Security): +91-8500111654\n\nClick 'Call' button in Responder Status page to dial instantly from any device.";
    }
    
    if (lowerMsg.includes("how") && (lowerMsg.includes("work") || lowerMsg.includes("use") || lowerMsg.includes("start"))) {
      return "Getting started with SentriAI:\n1. Dashboard - Overview of all systems\n2. Live Event Map - See crowd locations\n3. Anomaly Alerts - Review 5 active alerts\n4. Crowd Heatmap - Monitor density zones\n5. Panic Sentiment - Check social media\n6. Responder Status - Manage your team\n\nEverything updates in real-time. What would you like to try first?";
    }
    
    if (lowerMsg.includes("dashboard") || lowerMsg.includes("overview")) {
      return "The Dashboard shows:\n• System status (Operational ✅)\n• Live attendee count (12,450)\n• Active alerts (5 anomalies, 2 panic signals)\n• Responder availability (4 active)\n• Camera feeds (23 online)\n• Quick access to all modules\n\nIt's your command center for crowd safety. Need help navigating any section?";
    }
    
    if (lowerMsg.includes("thank") || lowerMsg.includes("thanks") || lowerMsg.includes("appreciate")) {
      return "You're very welcome! I'm always here to help keep your events safe. If you have more questions about SentriAI's features or need immediate assistance, just ask. Stay safe! 🚨";
    }
    
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey") || lowerMsg.includes("good")) {
      return "Hello! Welcome to SentriAI Support. I'm your AI assistant for crowd safety monitoring. I can help you with real-time alerts, responder management, crowd analytics, emergency protocols, and more. What would you like to know?";
    }
    
    if (lowerMsg.includes("problem") || lowerMsg.includes("issue") || lowerMsg.includes("error") || lowerMsg.includes("bug")) {
      return "I'm sorry you're experiencing an issue. Please describe the problem:\n• What feature is affected?\n• When did it start?\n• Any error messages?\n\nFor urgent technical issues, contact the system administrator. For general troubleshooting, I'm here to help!";
    }
    
    if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("plan")) {
      return "For pricing and licensing information, please contact our sales team. SentriAI offers custom plans based on:\n• Event size and duration\n• Number of cameras needed\n• Responder count\n• Additional features\n\nWould you like to know more about available features?";
    }
    
    // Default response with variety
    const defaultResponses = [
      "I'm your SentriAI Assistant specialized in crowd safety. I can help with crowd monitoring, emergency alerts, responder coordination, panic detection, and event analytics. What specific aspect interests you?",
      "Great question! SentriAI covers crowd density tracking, real-time alerts, responder management, social sentiment analysis, and post-event reports. Which area would you like to explore?",
      "I'm here to help! Ask me about our AI-powered safety features like live heatmaps, panic detection, automated alerts, or responder tracking. What can I explain?",
      "Let me help you with that. SentriAI specializes in keeping large crowds safe using AI and real-time monitoring. What feature would you like to learn about?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const aiReply = await getAIResponse(input);
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I apologize for the technical difficulty. Please try rephrasing your question or contact system administrator for urgent issues." },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black p-4">
      <div className="bg-gradient-to-br from-black to-red-950/30 w-full max-w-3xl shadow-2xl shadow-red-900/50 rounded-2xl flex flex-col border-2 border-red-600/50">
        {/* Header */}
        <div className="p-6 border-b-2 border-red-600/50 bg-gradient-to-r from-red-900/50 to-red-950/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-400">Help & Support Chat</h2>
              <p className="text-sm text-red-300/70">AI-Powered Assistance</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 h-[500px] bg-black/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.sender === "user"
                    ? "bg-red-600 shadow-red-900/50"
                    : "bg-red-950 border-2 border-red-600 shadow-red-900/50"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-red-400" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl max-w-[75%] shadow-lg ${
                  msg.sender === "user"
                    ? "bg-red-600 text-white border border-red-500 shadow-red-900/50"
                    : "bg-gradient-to-br from-red-950/50 to-black border-2 border-red-600/30 text-red-200 shadow-red-900/30"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-950 border-2 border-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
                <Bot className="w-5 h-5 text-red-400" />
              </div>
              <div className="bg-gradient-to-br from-red-950/50 to-black border-2 border-red-600/30 p-4 rounded-2xl shadow-lg shadow-red-900/30">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 text-red-400 animate-spin" />
                  <span className="text-red-300 text-sm italic">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex items-center border-t-2 border-red-600/50 p-4 bg-gradient-to-r from-red-950/30 to-black rounded-b-2xl">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            disabled={loading}
            className="flex-1 p-3 bg-black border-2 border-red-600/50 rounded-lg outline-none text-red-200 placeholder-red-400/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 disabled:opacity-50 shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="ml-3 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-semibold border border-red-500 shadow-lg shadow-red-900/50"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </div>

      {/* Info Badge */}
      <div className="mt-4 text-center text-red-400/70 text-sm">
        <p>💡 Ask me about crowd monitoring, alerts, responders, or emergency protocols</p>
      </div>
    </div>
  );
};

export default HelpSupportPage;