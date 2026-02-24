import './BlogPage.css';

const previewPosts = [
    {
        title: 'Building Your First Agent with LangChain',
        category: 'TUTORIAL',
        preview: 'Step-by-step guide to building autonomous AI agents with tool-calling capabilities.',
        date: '2026.03.01',
    },
    {
        title: 'How We Built PNW Vision Lab',
        category: 'CASE STUDY',
        preview: 'Behind the scenes of our campus object detection system using YOLOv8.',
        date: '2026.02.20',
    },
    {
        title: 'RAG vs Fine-Tuning: What We Learned',
        category: 'RESEARCH',
        preview: 'Practical insights from building both approaches for our PNW Knowledge Assistant.',
        date: '2026.02.10',
    },
];

export default function BlogPage() {
    return (
        <div className="blog-page section-padding">
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <div className="aic-label">// TRANSMISSION LOG</div>
                    <h2 className="aic-heading">Blog <span className="gold">// Coming Soon</span></h2>
                    <p className="aic-subtext">Written by Applied AI Club members. Tutorials, research notes, and project deep-dives.</p>
                </div>

                <div className="blog-page__grid">
                    {previewPosts.map((post, i) => (
                        <div key={i} className="glass-card blog-page__card">
                            <span className="blog-page__category">{post.category}</span>
                            <h3 className="blog-page__title">{post.title}</h3>
                            <p className="blog-page__preview">{post.preview}</p>
                            <div className="blog-page__meta">
                                <span className="blog-page__date">{post.date}</span>
                                <span className="blog-page__status">DRAFT</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
