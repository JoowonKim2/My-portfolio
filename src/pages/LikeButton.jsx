import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function LikeButton({ pageName }) {
  const [likes, setLikes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)

  // 페이지 로드시 좋아요 수 가져오기
  useEffect(() => {
    fetchLikes()
  }, [pageName])

  async function fetchLikes() {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('likes')
        .eq('page_name', pageName)
        .single()

      if (error) throw error
      setLikes(data.likes)
    } catch (error) {
      console.error('Error fetching likes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 좋아요 버튼 클릭
  async function handleLike() {
    if (isLiking) return

    setIsLiking(true)
    try {
      await supabase.rpc('increment_likes', {
        page_name_input: pageName
      })
      
      setLikes(prev => prev + 1)
    } catch (error) {
      console.error('Error liking:', error)
    } finally {
      setIsLiking(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      padding: '10px'
    }}>
      <button 
        onClick={handleLike}
        disabled={isLiking}
        style={{
          fontSize: '24px',
          padding: '10px 20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          background: 'white',
          cursor: isLiking ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        ❤️ 좋아요
      </button>
      
      <span style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ff6b6b'
      }}>
        {likes}
      </span>
    </div>
  )
}

export default LikeButton