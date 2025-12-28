// Simple localStorage/sessionStorage-backed conversation store
const KEY = 'softcode_conversations_v1'
const SESSION_KEY = 'softcode_conversations_session_v1'

// Check if user is guest (simple check)
function isGuest(){
  try{
    const userStr = localStorage.getItem('softcode_user') || sessionStorage.getItem('softcode_user')
    if(!userStr) return true
    const user = JSON.parse(userStr)
    return user?.guest === true || user?.name?.toLowerCase() === 'guest'
  }catch(e){ return true }
}

export function loadConversations(){
  try{
    const useSession = isGuest()
    const storage = useSession ? sessionStorage : localStorage
    const storageKey = useSession ? SESSION_KEY : KEY
    
    const raw = storage.getItem(storageKey)
    if(!raw) return []
    const convs = JSON.parse(raw)
    
    // Show restoration notice if restored from session
    if(useSession && convs.length > 0){
      const restored = sessionStorage.getItem('softcode_restored_notice_shown')
      if(!restored){
        sessionStorage.setItem('softcode_restored_notice_shown', '1')
        // Trigger custom event for restoration notice
        window.dispatchEvent(new CustomEvent('chat-restored', { detail: { from: 'session' } }))
      }
    }
    
    return convs
  }catch(e){ return [] }
}

export function saveConversations(convs){
  try{
    const useSession = isGuest()
    const storage = useSession ? sessionStorage : localStorage
    const storageKey = useSession ? SESSION_KEY : KEY
    storage.setItem(storageKey, JSON.stringify(convs))
  }catch(e){}
}

export function makeConversation(title){
  return { id: String(Date.now()) + Math.random().toString(36).slice(2,8), title: title || 'New chat', createdAt: Date.now(), messages: [] }
}
