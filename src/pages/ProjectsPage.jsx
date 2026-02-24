import { projects } from '../data/projects';
import './ProjectsPage.css';

const borderColor = (status) => {
    if (status === 'Live') return 'var(--neon-green)';
    if (status === 'In Progress') return 'var(--neon-cyan)';
    return 'var(--neon-magenta)';
};

export default function ProjectsPage() {
    return (
        <div className="projects-page section-padding">
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <div className="aic-label">// FULL DATABASE</div>
                    <h2 className="aic-heading">All <span className="gold">Projects</span></h2>
                    <p className="aic-subtext">Complete archive of Applied AI Club experiments and deployed systems.</p>
                </div>

                <div className="projects-page__grid">
                    {projects.map((project, i) => (
                        <div
                            key={project.id}
                            className="glass-card projects-page__card"
                            style={{ '--card-accent': borderColor(project.status) }}
                        >
                            <div className="projects-page__card-border"></div>
                            <div className="projects-page__card-header">
                                <span className="projects-page__codename">
                                    {project.name.toUpperCase().replace(/ /g, '_')}
                                </span>
                                <span className="projects-page__status">{project.status}</span>
                            </div>
                            <h3 className="projects-page__name">{project.name}</h3>
                            <p className="projects-page__desc">{project.description}</p>
                            <div className="projects-page__tags">
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                            <div className="projects-page__meta">
                                <span>{project.semester}</span>
                                {project.techStack && <span>Stack: {project.techStack.join(', ')}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
