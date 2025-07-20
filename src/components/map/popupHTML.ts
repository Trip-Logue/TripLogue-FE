// src/components/map/popupHTML.ts
export function getInfoWindowContent({
    id, title, date, memo, imageUrl
  }: {
    id: string;
    title: string;
    date: string;
    memo: string;
    imageUrl?: string;
  }) {
    return `
      <div style="background: white; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); padding: 24px; min-width: 240px; max-width: 340px; display: flex; flex-direction: column; align-items: center;">
        <div style="width: 200px; height: 100px; background: #eee; border-radius: 10px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
          ${imageUrl ? `<img src="${imageUrl}" style="max-width: 100%; max-height: 100%; border-radius: 10px;" />` : ""}
        </div>
        <div style="width: 100%; margin-bottom: 10px;">
          <div style="font-size: 1.1rem; font-weight: bold;">${title}</div>
          <div style="font-size: 0.98rem; color: #888;">${date}</div>
          <div style="font-size: 1rem; margin-top: 4px; word-break: break-all;">${memo}</div>
        </div>
        <div style="width: 100%; display: flex; flex-direction: row; gap: 10px; margin-top: 10px;">
          <button style="flex: 1; display: flex; align-items: center; justify-content: center; background: #e5e5e5; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: #222; transition: background 0.2s;">
            편집
          </button>
          <button style="flex: 1; display: flex; align-items: center; justify-content: center; background: #e5e5e5; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: #222; transition: background 0.2s;">
            공유
          </button>
          <button id="delete-${id}" style="flex: 1; display: flex; align-items: center; justify-content: center; background: #ef4444; border: none; border-radius: 8px; font-size: 1rem; font-weight: 500; padding: 8px 0; cursor: pointer; color: #fff; transition: background 0.2s;">
            삭제
          </button>
        </div>
      </div>
    `;
  }