import { z } from "zod";

// CreateBoardスキーマを定義します。これは、ボードの作成時に必要な入力データのバリデーションを行います。
export const CreateBoard = z.object({
  // titleフィールドは、必須であり、最小文字数は3です。
  title: z
    .string({
      required_error: "Title is required", // titleが存在しない場合のエラーメッセージ
      invalid_type_error: "Title is required", // titleが文字列でない場合のエラーメッセージ
    })
    .min(3, {
      message: "Title is too short.", // titleが3文字未満の場合のエラーメッセージ
    }),
});
