import { jobPostings } from '@/content/careers.ts'
import type { JobPosting } from '@/types/careers.ts'

export const ALL_TEAMS = 'All'

/** Teams with open roles, in the order they first appear in the listings. */
export const careerTeams: readonly string[] = [...new Set(jobPostings.map((job) => job.department))]

export function rolesForTeam(team: string): JobPosting[] {
  return team === ALL_TEAMS ? jobPostings : jobPostings.filter((job) => job.department === team)
}

/** "1 role", "4 roles" */
export function roleCount(count: number) {
  return `${count} ${count === 1 ? 'role' : 'roles'}`
}

/** "1 open role", "6 open roles" */
export function openRoleCount(count: number) {
  return `${count} open ${count === 1 ? 'role' : 'roles'}`
}

/** True while any listing is still an example rather than a live opening. */
export const hasExampleRoles = jobPostings.some((job) => job.status === 'placeholder')
