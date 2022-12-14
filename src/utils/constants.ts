// STATE
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

// API URLS
export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
export const LEADERBOARD_API_PROD = process.env
  .NEXT_PUBLIC_LEADERBOARD_API_PROD as string;
export const LEADERBOARD_API_DEV = process.env
  .NEXT_PUBLIC_LEADERBOARD_API_DEV as string;

// KEYS
export const FATHOM_CODE = process.env.NEXT_PUBLIC_FATHOM_CODE as string;
export const AMPLITUDE_CODE = process.env.NEXT_PUBLIC_AMPLITUDE_CODE as string;

// APPLICATION
export const SITE_NAME = "list.yieldbay.io";
export const APP_NAME = "YieldBay";
export const DESCRIPTION =
  "Discover and earn yield from polkadot and kusama paraverse";
export const DOMAIN = "https://list.yieldbay.io";
export const IMAGE = "https://list.yieldbay.io/twitter-cover.png"; // OG like twitter card generally needs full path of image, not relative
export const USERNAME = "yield_bay";
