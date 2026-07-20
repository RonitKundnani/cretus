export type CommitteeMember = {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  linkedin: string | null;
  github: string | null;
  tenure_year: string | null;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  cover_url: string | null;
  status: string | null;
  code_repo_url: string | null;
  demo_url: string | null;
  published: boolean;
  created_at: string;
};

export type ProjectSection = {
  id: string;
  project_id: string;
  heading: string;
  body_md: string;
  sort_order: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  content_md: string;
  author: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
};

export type Achievement = {
  id: string;
  title: string;
  happened_on: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
};

export type EventType = "workshop" | "competition" | "event";

export type ClubEvent = {
  id: string;
  title: string;
  slug: string;
  type: EventType;
  description_md: string;
  cover_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  registration_open: boolean;
  capacity: number | null;
  published: boolean;
  created_at: string;
};
