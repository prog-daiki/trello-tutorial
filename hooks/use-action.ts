import { useState, useCallback } from "react";

import { ActionState, FieldErrors } from "@/lib/create-safe-action";

// 非同期アクションを定義するための型
type Action<TInput, TOutput> = (
  data: TInput
) => Promise<ActionState<TInput, TOutput>>;

// アクションの実行結果に対するコールバックを定義するためのオプション
interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void; // 成功時のコールバック
  onError?: (error: string) => void; // エラー時のコールバック
  onComplete?: () => void; // 完了時のコールバック
}

// 非同期アクションを実行し、その結果を管理するためのフック
export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<TInput> | undefined
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined); // エラーを管理するためのstate
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // アクションを実行する関数
  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);

      try {
        const result = await action(input);

        if (!result) {
          return;
        }
        setFieldErrors(result.fieldErrors);
        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }
        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } finally {
        setIsLoading(false); // 成功・失敗に関わらずローディングステートを更新
        options.onComplete?.();
      }
    },
    [action, options]
  );
  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading,
  };
};
