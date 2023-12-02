import { z } from "zod";

//Tが{ name: string, age: number }のような型である場合、FieldErrors<T>は{ name?: string[], age?: string[] }のような型になります。これは、各フィールドに対するエラーメッセージを格納するのに便利な型です。
export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

// ActionState型は、フィールドエラー、エラー、データを持つオブジェクトを表します。
// TInputは入力データの型、TOutputは出力データの型を表します。
export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>; // フィールドエラーは、TInput型の各フィールドに対するエラーメッセージを格納します。
  error?: string | null; // エラーは、アクションの実行中に発生した全般的なエラーを表します。
  data?: TOutput; // データは、アクションの結果として生成されたデータを表します。
};

// createSafeAction関数は、スキーマとハンドラを引数に取り、Promise<ActionState<TInput, TOutput>>を返す関数を生成します。
// スキーマは、入力データのバリデーションを行うためのzodスキーマです。
// ハンドラは、バリデーションが成功した場合に呼び出される関数です。この関数は、バリデーション済みのデータを引数に取り、Promise<ActionState<TInput, TOutput>>を返します。
export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  // この関数は、入力データを引数に取り、Promise<ActionState<TInput, TOutput>>を返します。
  // まず、入力データに対してスキーマのsafeParseメソッドを呼び出してバリデーションを行います。
  // バリデーションが失敗した場合、fieldErrorsにエラーメッセージを格納したオブジェクトを返します。
  // バリデーションが成功した場合、ハンドラ関数を呼び出して結果を返します。
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    return handler(validationResult.data);
  };
};
