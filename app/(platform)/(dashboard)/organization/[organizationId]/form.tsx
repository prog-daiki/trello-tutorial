"use client";

import { createBoard } from "@/actions/create-board";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";
import { useAction } from "@/hooks/use-action";

export const Form = () => {
  //アクションの実行とその結果のハンドリングを行う
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, "SUCCESS");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  //フォームデータを送信するための関数を定義します
  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title: title });
  };

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={fieldErrors} />
      </div>
      <FormButton />
    </form>
  );
};
