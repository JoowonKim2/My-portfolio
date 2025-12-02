// LikeButton.jsx
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

function LikeButton({ pageName }) {
  const [likes, setLikes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
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

    fetchLikes()
  }, [pageName])

  async function handleLike() {
    if (isLiking) return

    setIsLiking(true)
    setIsAnimating(true)
    setIsLiked(true)
    
    try {
      await supabase.rpc('increment_likes', {
        page_name_input: pageName
      })
      
      setLikes(prev => prev + 1)
      
      setTimeout(() => setIsAnimating(false), 600)
    } catch (error) {
      console.error('Error liking:', error)
      setIsAnimating(false)
      setIsLiked(false)
    } finally {
      setIsLiking(false)
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      <style>{`
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1.1); }
        }

        .like-button-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .like-button-container:hover {
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .like-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #333;
          padding: 0;
          transition: all 0.2s ease;
        }

        .like-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .like-button:hover:not(:disabled) {
          color: #ff6b6b;
        }

        .like-button:hover:not(:disabled) .heart-icon {
          fill: #ff6b6b;
          stroke: #ff6b6b;
        }

        .heart-icon {
          width: 24px;
          height: 24px;
          transition: all 0.2s ease;
          fill: none;
          stroke: #ff6b6b;
          stroke-width: 2;
        }

        .heart-icon.liked {
          fill: #ff6b6b;
        }

        .heart-icon.animating {
          animation: heartBeat 0.6s ease;
        }

        .like-count {
          font-size: 18px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #ff6b6b;
          min-width: 30px;
          text-align: center;
          padding: 4px 8px;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 12px;
        }
      `}</style>

      <div className="like-button-container">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className="like-button"
        >
          <svg 
            className={`heart-icon ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Like</span>
        </button>
        
        <span className="like-count">
          {likes}
        </span>
      </div>
    </>
  )
}

export default LikeButton