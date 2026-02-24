export interface App {
  name: string;
  url: string;
  icon?: string;
  description?: string;
}

export function iconUrl(app: App): string {
  if (app.icon) return app.icon;
  const domain = new URL(app.url).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

// Add your apps here
export const apps: App[] = [
  {
    name: "Âm lịch",
    url: "https://amlich.xyz",
    icon: "https://amlich.xyz/lunar-calendar.svg",
    description: "Quick lunar calendar viewer",
  },
  {
    name: "Henlich",
    url: "https://henlich.fly.dev",
    description: "Make a schedule that works for everyone",
  },
  {
    name: "Music with me",
    url: "https://musicwithme.fly.dev",
    description: "Listen Youtube music together, in sync",
  },
];
