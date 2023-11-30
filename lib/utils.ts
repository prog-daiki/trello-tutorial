import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//cn関数は、可変長の引数を受け取ります。これらの引数は ClassValue 型のクラス、またはクラスを返す関数である必要があります。
export function cn(...inputs: ClassValue[]) {
  //渡されたすべてのクラスをclsxを使って結合し、その後にtwMergeを使ってTailwind CSSのクラスをマージします。結果として、最終的なCSSクラス文字列が得られます。
  return twMerge(clsx(inputs));
}
