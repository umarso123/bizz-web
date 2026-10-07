/**
 * Premium homepage sections — copy grounded in content/legacy-site.md.
 * Visual language follows the provided design-system reference.
 */
export const premiumHome = {
    hero: {
        badge: 'HealthTech studio',
        badgeNote: 'Healthcare solutions, from day one',
        titleLead: 'Digital products that move healthcare forward for',
        titleAccent: 'care teams.',
        body: 'We design, build and grow apps, platforms and brands for health, wellness and care teams — fast, clear and human-centred.',
        primaryCta: 'Book a call',
        primaryTo: '/contact',
        secondaryCta: 'See our work',
        secondaryTo: '/#featured-projects',
    },
    facts: {
        cards: [
            {
                id: 'focus',
                tone: 'light',
                value: 'Healthcare',
                label: 'Lead industry focus',
            },
            {
                id: 'offers',
                tone: 'brand',
                value: 'CDS · EHR · HIE',
                label: 'Digital health systems we build',
            },
            {
                id: 'rating',
                tone: 'light',
                value: '5/5',
                label: 'Stated rating on overall platforms',
            },
        ],
    },
    whatWeDo: {
        index: '(01)',
        label: 'What we do',
        title: 'One studio.',
        titleLine2: 'Every layer of your product.',
        body: 'Custom mobile apps, websites, creative design, and branding — strengthened by frontend, backend, and cloud expertise.',
        cards: [
            {
                id: 'product',
                index: '01',
                tone: 'brand',
                badge: 'Product design',
                title: 'UI/UX and product experiences people can use.',
                body: 'From research-backed flows to polished interfaces across website, product, and dashboard work.',
                tags: [],
            },
            {
                id: 'apps',
                index: '02',
                tone: 'accent',
                badge: 'Web & app development',
                title: 'Mobile and web products built to ship.',
                body: 'Android, iOS, Flutter, and web development tuned to your business needs.',
                tags: ['Android', 'iOS', 'Flutter', 'Web'],
            },
            {
                id: 'cloud',
                index: '03',
                tone: 'light',
                badge: 'Cloud & platforms',
                title: 'Frontend, backend, and scalable cloud.',
                body: 'Expert front and back-end development with cloud solutions built to grow.',
                tags: [],
            },
            {
                id: 'brand',
                index: '04',
                tone: 'warm',
                badge: 'Design & branding',
                title: 'Creative design and impactful branding solutions.',
                body: 'Strengthen digital presence with design that captivates — logo, UI/UX, and brand expression.',
                tags: ['Logo', 'UI/UX', 'Website'],
            },
        ],
    },
    approach: {
        index: '(02)',
        label: 'Approach',
        titleLead: 'Built fast',
        titleAccent: 'and',
        titleTrail: 'built right.',
        items: [
            {
                number: '01',
                title: 'Understanding & research',
                body: 'We start by understanding the problem, people, and opportunity — then research workflows and constraints.',
            },
            {
                number: '02',
                title: 'Analysis & design',
                body: 'Findings become clear product direction. Design shapes the experience before engineering takes over.',
            },
            {
                number: '03',
                title: 'Testing before launch',
                body: 'We validate that the product works as intended — so what ships is ready for real use.',
            },
        ],
    },
    healthcare: {
        index: '(03)',
        label: 'Digital health',
        title: 'Healthcare is where we go deep.',
        body: 'Custom mobile applications, websites, designs, and branding for care teams — plus clinical systems that keep data moving securely.',
        offers: [
            'Clinical Decision Support',
            'Telemedicine',
            'Health Information Exchange',
            'Electronic Health Records',
            'Integration and Interoperability',
        ],
        cta: 'Book a call',
        ctaTo: '/contact',
    },
};
