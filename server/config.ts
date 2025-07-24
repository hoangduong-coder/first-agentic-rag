import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  openaiApiKey: string;
}

const config: Config = {
  port: parseInt(process.env.PORT) || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY || "",
};

export default config;
