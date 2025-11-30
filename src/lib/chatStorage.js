// Simple localStorage-backed conversation store
const KEY = 'softcode_conversations_v1'

export function loadConversations(){
  try{
    const raw = localStorage.getItem(KEY)
    if(!raw) return []
    return JSON.parse(raw)
  }catch(e){ return [] }
}

export function saveConversations(convs){
  try{ localStorage.setItem(KEY, JSON.stringify(convs)) }catch(e){}
}

export function makeConversation(title){
  return { id: String(Date.now()) + Math.random().toString(36).slice(2,8), title: title || 'New chat', createdAt: Date.now(), messages: [] }
}
