export enum ToolCategory {
  FORMATTING = 'Formatting',
  CASE = 'Case',
  SORTING = 'Sorting',
  MANIPULATION = 'Manipulation',
  STYLING = 'Styling',
  AI = 'AI Features'
}

export interface ToolAction {
  id: string;
  label: string;
  category: ToolCategory;
  iconName: string; // We will map this to Lucide icons dynamically
  description: string;
  isPro?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    isPro: boolean;
  } | null;
}

export type ToneType = 'formal' | 'casual' | 'academic' | 'concise';