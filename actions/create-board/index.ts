"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

// ハンドラ関数の定義
const handler = async (data: InputType): Promise<ReturnType> => {
  // 認証情報の取得
  const { userId, orgId } = auth();

  // 認証情報が存在しない場合はエラーを返す
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // 入力データからタイトルを取得
  const { title } = data;

  // ボード情報を格納する変数の初期化
  let board;

  // ボードの作成を試みる
  try {
    board = await db.board.create({
      data: {
        title,
      },
    });
    // 作成に失敗した場合はエラーを返す
  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }
  // ボードのパスを再検証
  revalidatePath(`/board/${board.id}`);
  // 作成したボードのデータを返す
  return { data: board };
};

// createSafeAction関数を使用して、ボードを作成するアクションをエクスポートします。
// 第一引数には、入力データのバリデーションを行うスキーマを指定します。
// 第二引数には、バリデーションが成功した場合に呼び出されるハンドラ関数を指定します。
export const createBoard = createSafeAction(CreateBoard, handler);
