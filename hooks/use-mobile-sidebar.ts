import { create } from "zustand";

//MobileSidebarStore は、モバイルサイドバーの状態を定義する型です。具体的には、isOpen（サイドバーが開いているかどうかを示すブール値）、onOpen（サイドバーを開くための関数）、onClose（サイドバーを閉じるための関数）の3つのプロパティを持っています。
type MobileSidebarStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

//create 関数を使用して、useMobileSidebar というカスタムフックを作成しています。このフックは、MobileSidebarStore の形状を持つ状態管理ストアを扱います。
//set は、状態を更新するための関数で、useMobileSidebar フック内で呼び出されることで状態が変更されます。
//初期状態として、isOpen が false であり、onOpen と onClose がそれぞれ set({ isOpen: true }) と set({ isOpen: false }) を呼び出す関数になっています。
export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
