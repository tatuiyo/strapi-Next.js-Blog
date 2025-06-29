import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * StrapiからのWebhookリクエストを受け取り、On-demand RevalidationをトリガーするAPIルート。
 * コンテンツの変更に応じて、関連するページのキャッシュを効率的に無効化（再生成）する。
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#on-demand-revalidation
 */
export async function POST(request: NextRequest) {
  // リクエストヘッダーからシークレットトークンを取得し、認証を行う。
  // これにより、正規のStrapiからのリクエストであることを保証する。
  const secret = request.headers.get('Authorization');
  if (secret !== `Bearer ${process.env.STRAPI_REVALIDATE_TOKEN}`) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  // リクエストボディをJSONとしてパースする。
  const body = await request.json();
  if (!body) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }

  // Webhookペイロードからイベントタイプ、モデル名、エントリー（記事データ）を取得。
  const { event, model, entry } = body;

  // Strapiのイベント（作成、更新、削除など）かを確認。
  if (event && event.startsWith('entry.')) {
    // モデル名（API ID）に応じて、適切なキャッシュタグを無効化する。
    if (model === 'blog') {
      // ブログ記事一覧ページのキャッシュを無効化
      revalidateTag('blog_posts');
      // 個別のブログ記事ページのキャッシュを無効化
      if (entry && entry.slug) {
        revalidateTag(`blog_post:${entry.slug}`);
      }
    } else if (model === 'category') {
      // カテゴリー一覧ページのキャッシュを無効化
      revalidateTag('categories');
      // 個別のカテゴリーページのキャッシュを無効化
      if (entry && entry.slug) {
        revalidateTag(`category:${entry.slug}`);
      }
    }
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
