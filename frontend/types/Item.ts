export interface Item {
  id: number;
  name: string;
  description: string;
  image_url: string;
  location: string;
  date_found: string;
  type: "lost" | "found";
}
