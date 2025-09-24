export type View =
  | 'dashboard'
  | 'groups'
  | 'discussions'
  | 'community'
  | 'connect'
  | 'podcasts'
  | 'webinars'
  | 'resources'
  | 'events';

export interface ChatMessage {
  sender: 'user' | 'hazel';
  text: string;
  resources?: Resource[];
}

export interface Resource {
  name: string;
  type:
    | 'Professional'
    | 'Support Group'
    | 'Online Course'
    | 'Article'
    | 'Hotline';
  description: string;
  rating: number;
  contact: {
    phone?: string;
    website?: string;
    address?: string;
  };
}
