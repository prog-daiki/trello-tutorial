import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { FormDelete } from "./form-delete";

type BoardProps = {
  id: string;
  title: string;
};

export const Board = async ({ id, title }: BoardProps) => {
  //bind メソッドは、関数に対して特定の this コンテキストと引数をバインドするメソッドです。この場合、deleteBoard.bind(null, id) は、deleteBoard 関数において this コンテキストを null に設定し、id を引数としてバインドした新しい関数を生成します。
  const deleteBoardWithId = await deleteBoard.bind(null, id);
  return (
    <form action={deleteBoardWithId} className="flex items-center gap-x-2">
      <p>Board title : {title}</p>
      <FormDelete />
    </form>
  );
};
