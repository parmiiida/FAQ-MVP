export type Assistant = {
    id: string;
    name: string;
    description: string | null;
    tone: string | null;
    personality: string | null;
  };

  export type FAQ = {
    id: string;
    question: string;
    answer: string;
    assistant_id: string;
    is_visible: boolean | null;
  };

  export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };

  export type ChatSession = {
    id: string;
    assistant_id: string | null;
    last_activity: string;
    is_test_session: boolean | null;
    started_at: string;
    user_id: string | null;
    assistants: { name: string } | null;
  };