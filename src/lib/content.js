const blogPosts = [];
const caseStudies = [];
/**
 * Content access boundary. Pages should read posts and case studies through
 * this provider. A local MDX loader or a headless CMS adapter can replace
 * `content` without changing page components.
 */
export const content = {
    async getBlogPosts() {
        return blogPosts;
    },
    async getBlogPost(slug) {
        return blogPosts.find((post) => post.slug === slug) ?? null;
    },
    async getCaseStudies() {
        return caseStudies;
    },
    async getCaseStudy(slug) {
        return caseStudies.find((study) => study.slug === slug) ?? null;
    },
};
