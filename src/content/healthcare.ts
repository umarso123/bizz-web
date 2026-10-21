/**
 * Healthcare: the lead industry. Copy from content/legacy-site.md (Healthcare).
 * One source for the hero route map, the homepage healthcare zone, and /healthcare.
 */

export const healthcareIntro = {
  title: 'Healthcare is where we go deep.',
  body: 'Bizaffix is about revolutionizing the healthcare industry with custom mobile applications, websites, designs, and branding solutions. Experience the power of innovation, and let us attune our interactive services to elevate your healthcare business’s digital presence.',
} as const

export type HealthcareSolution = {
  id: 'cds' | 'telemedicine' | 'hie' | 'ehr' | 'interop'
  /** Plain-language station name on the route map. */
  station: string
  title: string
  /** One line for the map and lists. */
  summary: string
  /** Full description from the legacy site. */
  body: string
  /** Case page under /work. */
  slug: string
}

export const healthcareSolutions = [
  {
    id: 'cds',
    station: 'Decision support',
    title: 'Clinical Decision Support',
    summary: 'Real-time, evidence-based recommendations inside the clinical workflow.',
    body: 'Grow your healthcare business with Bizaffix’s advanced Clinical Decision Support System services. Leverage data-driven insights to streamline decision-making, customizing solutions for seamless workflow integration. Improve patient outcomes with real-time, evidence-based recommendations, enhancing clinical efficiency. Let our expertise allow professionals to focus on delivering exceptional care.',
    slug: 'clinical-decision-support',
  },
  {
    id: 'telemedicine',
    station: 'Telemedicine',
    title: 'Telemedicine',
    summary: 'Patient–provider connections with the convenience of virtual care.',
    body: 'Embrace the future of healthcare with our Telemedicine Development solutions. Enhance patient-provider connections, access, and operational efficiency with our personalized telemedicine platforms. Prioritize patient satisfaction and quality care with seamless system integration and the convenience of virtual healthcare. Step into a more accessible, connected healthcare experience.',
    slug: 'telemedicine',
  },
  {
    id: 'hie',
    station: 'Data exchange',
    title: 'Health Information Exchange',
    summary: 'Secure, scalable healthcare data sharing, tailored to your needs.',
    body: 'Revolutionize healthcare data sharing with our cutting-edge HIE Development services. Secure, scalable, and tailored to your needs.',
    slug: 'health-information-exchange',
  },
  {
    id: 'ehr',
    station: 'Health records',
    title: 'Electronic Health Records',
    summary: 'User-friendly records that fit the workflow and safeguard patient data.',
    body: 'Streamline your healthcare practice with our user-friendly Electronic Health Record (EHR) System solutions. Enhance patient care, boost efficiency, and enjoy seamless integration into your workflow. Say goodbye to paperwork and safeguard patient data with advanced security measures.',
    slug: 'electronic-health-records',
  },
  {
    id: 'interop',
    station: 'Interoperability',
    title: 'Integration and Interoperability',
    summary: 'Smooth data exchange that replaces siloed data with one ecosystem.',
    body: 'Break healthcare data barriers with our Integration and Interoperability services. Our team ensures smooth data exchange for informed decisions, customizes solutions for optimized data flow, and minimizes errors. Improve patient care coordination and outcomes, say goodbye to siloed data, and embrace a unified healthcare ecosystem with us.',
    slug: 'integration-interoperability',
  },
] as const satisfies readonly HealthcareSolution[]
