// src/components/map/popupHTML.ts
export function getInfoWindowContent({
  id,
  title,
  date,
  memo,
  location,
  country,
  imageUrl,
}: {
  id: string;
  title: string;
  date: string;
  memo: string;
  location?: string;
  country?: string;
  imageUrl?: string;
}) {
  return `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); padding: 20px; min-width: 320px; max-width: 400px; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        
        <!-- 헤더 섹션 -->
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 6px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            🗺️ ${title}
          </div>
          <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 3px;">
            📅 ${date}
          </div>
          ${
            location
              ? `<div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 3px;">📍 ${location}</div>`
              : ''
          }
          ${
            country
              ? `<div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 8px;">🌍 ${country}</div>`
              : ''
          }
        </div>
        
        <!-- 메모 섹션 -->
        ${
          memo
            ? `
        <div style="background: rgba(255,255,255,0.15); border-radius: 10px; padding: 12px; margin-bottom: 16px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
          <div style="font-size: 0.9rem; line-height: 1.4; word-break: break-all; opacity: 0.95;">${memo}</div>
        </div>
        `
            : ''
        }
        
        <!-- 이미지 섹션 (사진이 있을 때만 표시) -->
        ${
          imageUrl
            ? `
        <div style="margin-bottom: 16px;">
          <img src="${imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3);" alt="여행 사진" />
        </div>
        `
            : ''
        }
        
        <!-- 액션 버튼들 -->
        <div style="display: flex; gap: 6px; margin-top: 12px;">
          <button id="edit-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                  onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            📝 편집
          </button>
          <button id="share-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                  onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            🔗 공유
          </button>
          <button id="delete-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: rgba(231, 76, 60, 0.8); border: 1px solid rgba(231, 76, 60, 0.6); border-radius: 8px; font-size: 0.8rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: white; transition: all 0.2s; backdrop-filter: blur(10px);" 
                  onmouseover="this.style.background='rgba(231, 76, 60, 1)'" 
                  onmouseout="this.style.background='rgba(231, 76, 60, 0.8)'">
            🗑️ 삭제
          </button>
        </div>
      </div>
    `;
}
