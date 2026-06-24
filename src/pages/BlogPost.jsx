import React, { useCallback } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { getPost, BLOG_POSTS } from '../content/blogPosts';
import { buildArticleSchema } from '../lib/seo-schema';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPost(slug);

  // Intercept clicks on internal <a href="/..."> links inside the rendered
  // HTML body so they use SPA navigation instead of a full page reload.
  const onBodyClick = useCallback(
    (event) => {
      const anchor = event.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('/')) {
        event.preventDefault();
        navigate(href);
      }
    },
    [navigate],
  );

  if (!post) return <Navigate to="/blog" replace />;

  const jsonLd = buildArticleSchema({
    title: post.title,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    datePublished: post.date,
    faqs: post.faqs,
  });

  const more = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <article className="container py-16 blog-post">
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription}
        canonicalPath={`/blog/${post.slug}`}
        type="article"
        jsonLd={jsonLd}
      />

      <nav className="blog-post__crumbs">
        <Link to="/blog">← All guides</Link>
      </nav>

      <header className="blog-post__header">
        <span className="blog-card__category">{post.category}</span>
        <h1 className="blog-post__title">{post.title}</h1>
        <p className="blog-post__meta">{post.readMins} min read</p>
      </header>

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div className="blog-post__body" onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: post.body }} />

      {post.faqs && post.faqs.length > 0 && (
        <section className="tool-seo__block blog-post__faqs">
          <h2>Frequently asked questions</h2>
          <div className="tool-seo__faqs">
            {post.faqs.map((faq) => (
              <details className="tool-seo__faq" key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {post.related && post.related.length > 0 && (
        <section className="tool-seo__block">
          <h2>Try the tools</h2>
          <div className="tool-seo__related">
            {post.related.map((item) => (
              <Link key={item.to} to={item.to} className="tool-seo__related-link">{item.label}</Link>
            ))}
          </div>
        </section>
      )}

      <section className="blog-post__more">
        <h2>More guides</h2>
        <div className="blog-list">
          {more.map((item) => (
            <Link key={item.slug} to={`/blog/${item.slug}`} className="blog-card">
              <span className="blog-card__category">{item.category}</span>
              <h3 className="blog-card__title">{item.title}</h3>
              <span className="blog-card__meta">{item.readMins} min read · Read guide →</span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
