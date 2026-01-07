import { apiClient } from './api'

export interface ChatRequest {
  message: string
  conversationId?: string
}

export interface ChatResponse {
  reply: string
  conversationId: string
}

export const chatService = {
  /**
   * Send a message to the chatbot
   */
  async sendMessage(
    message: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    const request: ChatRequest = {
      message,
      conversationId,
    }

    const response = await apiClient.post<ChatResponse>('/chat', request)
    return response as ChatResponse
  },
}

