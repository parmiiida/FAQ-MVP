import type { Database as GeneratedDatabase } from "./types";

declare module "./types" {
  interface Database extends GeneratedDatabase {
    public: {
      Tables: GeneratedDatabase["public"]["Tables"] & {
        faqs: {
          Row: {
            id: string
            user_id: string
            question: string
            answer: string
            category_id: string
            tags: string[]
            is_visible: boolean
            sort_order: number
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            question: string
            answer: string
            category_id: string
            tags?: string[]
            is_visible?: boolean
            sort_order?: number
            created_at?: string
            updated_at?: string
          }
          Update: Partial<{
            id: string
            user_id: string
            question: string
            answer: string
            category_id: string
            tags: string[]
            is_visible: boolean
            sort_order: number
            created_at: string
            updated_at: string
          }>
        }
      }
    }
  }
}
