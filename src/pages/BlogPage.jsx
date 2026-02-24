import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import './BlogPage.css';

export default function BlogPage() {
    const [featured, ...rest] = blogPosts;

    return (
        <div className="blog-page section-padding">
            <div className="container">
                {/* Header */}
                <div className="blog-page__header">
                    <div className="aic-label">// TRANSMISSION LOG</div>
                    <h2 className="aic-heading">Blog</h2>
                    <p className="aic-subtext">
                        Written by Applied AI Club members. Tutorials, research notes, and project deep-dives.
                    </p>
                </div>

                {/* Featured post */}
                {featured && (
                    <Link to={`/blog/${featured.slug}`} className="blog-page__featured glass-card">
                        <div className="blog-page__featured-inner">
                            <span className="blog-page__category">{featured.category}</span>
                            <h3 className="blog-page__featured-title">{featured.title}</h3>
                            <p className="blog-page__featured-desc">{featured.description}</p>
                            <div className="blog-page__meta">
                                <span className="blog-page__date">
                                    {new Date(featured.date).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric',
                                    })}
                                </span>
                                <span className="blog-page__reading-time">{featured.readingTime}</span>
                            </div>
                            <div className="blog-page__tags">
                                {featured.tags.slice(0, 4).map((tag) => (
                                    <span key={tag} className="blog-page__tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="blog-page__featured-cta">
                            <span className="blog-page__read-btn">Read Article &rarr;</span>
                        </div>
                    </Link>
                )}

                {/* Remaining posts grid */}
                {rest.length > 0 && (
                    <div className="blog-page__grid">
                        {rest.map((post) => (
                            <Link to={`/blog/${post.slug}`} key={post.slug} className="glass-card blog-page__card">
                                <span className="blog-page__category">{post.category}</span>
                                <h3 className="blog-page__title">{post.title}</h3>
                                <p className="blog-page__preview">{post.description}</p>
                                <div className="blog-page__meta">
                                    <span className="blog-page__date">
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric',
                                        })}
                                    </span>
                                    <span className="blog-page__reading-time">{post.readingTime}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
