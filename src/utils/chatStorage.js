// src/utils/chatStorage.js
const CHATS_KEY = 'imagr_chats';
const MESSAGES_KEY = 'imagr_messages';

export const saveChat = (chatId, title, messages) => {
  try {
    const chats = getChats();
    chats[chatId] = {
      id: chatId,
      title: title || messages[0]?.content?.slice(0, 30) + '...',
      updatedAt: Date.now(),
      messageCount: messages.length
    };
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    localStorage.setItem(`${MESSAGES_KEY}_${chatId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Save chat error:', error);
  }
};

export const getChatMessages = (chatId) => {
  try {
    const messagesJson = localStorage.getItem(`${MESSAGES_KEY}_${chatId}`);
    const messages = messagesJson ? JSON.parse(messagesJson) : [];
    return messages;
  } catch (error) {
    console.error(`Error getting messages for chat ${chatId}:`, error);
    return [];
  }
};

export const getChats = () => {
  try {
    const chatsJson = localStorage.getItem(CHATS_KEY);
    const chats = chatsJson ? JSON.parse(chatsJson) : {};
    return chats;
  } catch (error) {
    console.error('Error loading chats:', error);
    return {};
  }
};

export const deleteChat = (chatId) => {
  try {
    const chats = getChats();
    delete chats[chatId];
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    localStorage.removeItem(`${MESSAGES_KEY}_${chatId}`);
  } catch (error) {
    console.error(`Error deleting chat ${chatId}:`, error);
  }
};
