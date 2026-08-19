/**
 * PristineTech Biz — AI Quote Chat (frontend)
 * Talks to the Cloudflare Worker, which safely runs the free AI model.
 *
 * IMPORTANT: replace WORKER_URL below with your actual deployed Worker URL
 * from Cloudflare (looks like https://pristinetech-quote-bot.YOUR-SUBDOMAIN.workers.dev)
 */
const WORKER_URL = "https://pristinetech-quote-bot.YOUR-SUBDOMAIN.workers.dev";

let chatHistory = [];

function appendMessage(role, text) {
  const log = document.getElementById("quote-chat-log");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble chat-${role}`;
  bubble.textContent = text;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
}

function appendTyping() {
  const log = document.getElementById("quote-chat-log");
  const typing = document.createElement("div");
  typing.className = "chat-bubble chat-assistant chat-typing";
  typing.id = "chat-typing-indicator";
  typing.textContent = "Calculating...";
  log.appendChild(typing);
  log.scrollTop = log.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("chat-typing-indicator");
  if (typing) typing.remove();
}

async function sendMessage(userText) {
  appendMessage("user", userText);
  chatHistory.push({ role: "user", content: userText });
  appendTyping();

  const sendBtn = document.getElementById("quote-chat-send");
  sendBtn.disabled = true;

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatHistory }),
    });
    const data = await res.json();
    removeTyping();

    if (data.error) {
      appendMessage("assistant", "Sorry, something went wrong getting your quote. Please try again or reach us on WhatsApp.");
    } else {
      appendMessage("assistant", data.reply);
      chatHistory.push({ role: "assistant", content: data.reply });
    }
  } catch (err) {
    removeTyping();
    appendMessage("assistant", "Connection issue - please check your internet and try again.");
  } finally {
    sendBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quote-chat-form");
  if (!form) return;

  appendMessage("assistant", "Hi! Tell me the flat size you need wired (e.g. \"2 bedroom flat\") and I'll work out an estimate for you.");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("quote-chat-input");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });
});
