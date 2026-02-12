const Anthropic = require("@anthropic-ai/sdk");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PROMPT = (resume, jobDescription) =>
  `You are an expert career advisor and recruiter. Analyze how well the following resume matches the job description.

Resume:
${resume}

Job Description:
${jobDescription}

Provide your analysis in the following JSON format only (no extra text):
{
  "score": <number from 0 to 100>,
  "feedback": "<detailed feedback with strengths, weaknesses, and suggestions for improvement>"
}`;

// --- Claude (Anthropic) ---
const analyzeWithClaude = async (resume, jobDescription) => {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [{ role: "user", content: PROMPT(resume, jobDescription) }],
  });
  return JSON.parse(message.content[0].text);
};

// --- OpenAI ---
const analyzeWithOpenAI = async (resume, jobDescription) => {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: PROMPT(resume, jobDescription) }],
  });
  return JSON.parse(completion.choices[0].message.content);
};

// --- Gemini (Google) ---
const analyzeWithGemini = async (resume, jobDescription) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(PROMPT(resume, jobDescription));
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(cleaned);
};

// --- DeepSeek (OpenAI-compatible API) ---
const analyzeWithDeepSeek = async (resume, jobDescription) => {
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: PROMPT(resume, jobDescription) }],
  });
  return JSON.parse(completion.choices[0].message.content);
};

// --- Ollama (local, no API key needed) ---
const analyzeWithOllama = async (resume, jobDescription) => {
  const baseURL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3";
  const response = await fetch(`${baseURL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: PROMPT(resume, jobDescription) }],
      stream: false,
    }),
  });
  const data = await response.json();
  const text = data.message.content;
  const cleaned = text.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(cleaned);
};

// --- Provider router ---
const providers = {
  claude: analyzeWithClaude,
  openai: analyzeWithOpenAI,
  gemini: analyzeWithGemini,
  deepseek: analyzeWithDeepSeek,
  ollama: analyzeWithOllama,
};

const analyzeResumeMatch = async (resume, jobDescription, provider = "claude") => {
  const analyze = providers[provider];
  if (!analyze) {
    throw new Error(`Unknown AI provider: ${provider}`);
  }
  return analyze(resume, jobDescription);
};

module.exports = { analyzeResumeMatch };
