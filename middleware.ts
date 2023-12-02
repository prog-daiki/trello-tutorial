import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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

      //もしpathが/select-orgで、req.urlがhttp://mywebsite.comだった場合、新しく作成されるURLはhttp://mywebsite.com/select-orgになります。
      const orgSelection = new URL(path, req.url);

      //NextResponse.redirect を使用して、指定されたURLにリダイレクトするようにレスポンスを構築しています。
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
