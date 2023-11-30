import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

export default authMiddleware({
  //publicRoutesは、認証を必要としないパスを指定するための設定です。
  publicRoutes: ["/"],

  //afterAuthは、認証が成功した後に実行されるコールバック関数です。
  afterAuth(auth, req) {
    // 認証済みのユーザー、かつアクセスしようとしているページがパブリックルートの場合の処理
    if (auth.userId && auth.isPublicRoute) {
      let path = "/select-org";

      //認証済みのユーザー、かつアクセスしようとしているページがパブリックルート、かつorgIdを持っている場合、pathの値を変更する
      if (auth.orgId) {
        path = `/organization/${auth.orgId}`;
      }

      //URL クラスを使用して、新しいURLオブジェクトを作成しています。
      //この新しいURLは、path（リダイレクト先のパス）を基準として、現在のリクエストのURL（req.url）に対して解決されます。
      const orgSelection = new URL(path, req.url);

      //NextResponse.redirect を使用して、指定されたURLにリダイレクトするようにレスポンスを構築しています。
      //orgSelectionは先程作成した新しいURLオブジェクトで、ここで指定したURLに対してブラウザがリダイレクトされます。
      return NextResponse.redirect(orgSelection);
    }

    //未認証のユーザーがプライベートルートにアクセスした時の処理
    if (!auth.userId && !auth.isPublicRoute) {
      //サインインページへのリダイレクトを行うためのもので、オプションとして returnBackUrl が指定されています。
      //これにより、ユーザーがサインイン後に元のページに戻ることが期待されています。
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    //認証済みだが、orgIdを持っていなくて、/select-orgにアクセスした時の処理
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org") {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
