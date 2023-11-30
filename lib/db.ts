import { PrismaClient } from "@prisma/client";

// global オブジェクトに prisma という変数を定義しています。この変数は PrismaClient の型か undefined のいずれかを持つことができます。これにより、globalThis.prisma を通じてグローバルにアクセスできるようになります。
declare global {
  var prisma: PrismaClient | undefined;
}

//db という変数をエクスポートしています。この変数は、globalThis.prisma が定義されている場合はそれを使用し、そうでない場合は新しい PrismaClient インスタンスを作成しています。これにより、アプリケーション全体で唯一の PrismaClient インスタンスが使われるようになります。
export const db = globalThis.prisma || new PrismaClient();

// 開発環境であるかどうかを確認し、開発環境であれば globalThis.prisma に db をセットしています。これにより、開発中に PrismaClient のインスタンスが再作成されず、同じインスタンスが再利用されることになります。本番環境では新しいインスタンスが作成され、それが使われます。
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
