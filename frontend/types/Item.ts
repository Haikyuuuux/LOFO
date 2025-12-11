export interface Item {
  id: number;
  name: string;
  description: string;
  image_url: string;
  location: string;
  created_at: string; // Database uses created_at, not date_found
  type: "lost" | "found";
  user_id: number;
  username?: string | null;
  email?: string | null;
  contact_number?: string | null;
}
