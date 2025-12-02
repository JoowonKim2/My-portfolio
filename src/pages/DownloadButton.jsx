// DownloadButton.jsx
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function DownloadButton({ modelName, modelFiles }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      for (const filePath of modelFiles) {
        const response = await fetch(filePath);
        const blob = await response.blob();
        const fileName = filePath.split('/').pop();
        zip.file(fileName, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${modelName}_model.zip`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드 실패');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        .download-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }

        .download-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .download-button:hover:not(:disabled) {
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .download-icon {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          stroke-width: 2;
          fill: none;
        }
      `}</style>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="download-button"
      >
        <svg className="download-icon" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {isDownloading ? 'Downloading...' : 'Download'}
      </button>
    </>
  );
}

export default DownloadButton;