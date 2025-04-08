export interface ServiceConfig {
  name: string;
  type: "api" | "cli";
}

export interface ApiKeyEntry {
  service: string;
  token: string;
  lastUsed?: Date;
}
