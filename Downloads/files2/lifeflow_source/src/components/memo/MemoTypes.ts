export type MemoCategory = "make" | "eat" | "buy";

export interface MemoItem {
  id: string;
  category: MemoCategory;
  text: string;
  done: boolean;
  createdAt: string;
}

export const categoryLabels: Record<MemoCategory, { label: string; icon: string; color: string }> = {
  make: { label: "만들 것", icon: "chef", color: "#3B82F6" },
  eat: { label: "먹고 싶은 것", icon: "heart", color: "#F97316" },
  buy: { label: "살 것", icon: "cart", color: "#8B5CF6" },
};
