// Helper to check if a metric is a valid positive number entered by the student
const hasNumber = (value) =>
  typeof value === 'number' && !Number.isNaN(value) && value > 0

// Format plain numbers with commas (e.g. 5000 -> "5,000")
const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value)

// Format money using Intl.NumberFormat (e.g. 150000, "PHP" -> "₱150,000")
export const formatMoney = (amount, currency = 'PHP') =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: currency || 'PHP',
    maximumFractionDigits: 0,
  }).format(amount)

// Role definitions for the Organizations section.
// Each role has:
// 1. "fields": numeric inputs shown in the form
// 2. "bullets": functions that build a bullet ONLY when the student's number is present
export const ROLE_TEMPLATES = {
  marketing: {
    label: 'Marketing / Publicity',
    fields: [
      { key: 'campaigns', label: 'Campaigns Launched', placeholder: 'e.g. 5' },
      { key: 'reach', label: 'Total Social Media Reach', placeholder: 'e.g. 12000' },
      { key: 'engagementPercent', label: 'Engagement Growth (%)', placeholder: 'e.g. 35' },
    ],
    bullets: [
      (m) =>
        hasNumber(m.campaigns) && hasNumber(m.reach)
          ? `Spearheaded ${formatNumber(m.campaigns)} marketing campaigns reaching ${formatNumber(m.reach)}+ students across campus channels.`
          : hasNumber(m.campaigns)
            ? `Spearheaded ${formatNumber(m.campaigns)} marketing campaigns to promote organization events.`
            : hasNumber(m.reach)
              ? `Generated ${formatNumber(m.reach)}+ total reach across social media platforms.`
              : null,
      (m) =>
        hasNumber(m.engagementPercent)
          ? `Increased social media engagement by ${formatNumber(m.engagementPercent)}% through targeted student content.`
          : null,
    ],
  },

  president: {
    label: 'President / Lead',
    fields: [
      { key: 'membersLed', label: 'Members Led', placeholder: 'e.g. 85' },
      { key: 'eventsOrganized', label: 'Events Organized', placeholder: 'e.g. 6' },
      { key: 'partnershipsSecured', label: 'Partnerships Secured', placeholder: 'e.g. 4' },
    ],
    bullets: [
      (m) =>
        hasNumber(m.membersLed)
          ? `Directed an organization of ${formatNumber(m.membersLed)} members, overseeing operations and executive committee alignment.`
          : null,
      (m) =>
        hasNumber(m.eventsOrganized)
          ? `Orchestrated ${formatNumber(m.eventsOrganized)} campus-wide events from planning to execution.`
          : null,
      (m) =>
        hasNumber(m.partnershipsSecured)
          ? `Cultivated ${formatNumber(m.partnershipsSecured)} external sponsorships and organizational partnerships.`
          : null,
    ],
  },

  treasurer: {
    label: 'Treasurer / Finance',
    fields: [
      { key: 'budgetManaged', label: 'Total Budget Managed', placeholder: 'e.g. 150000', isCurrency: true },
      { key: 'fundsRaised', label: 'Funds / Sponsorships Raised', placeholder: 'e.g. 45000', isCurrency: true },
      { key: 'costSavedPercent', label: 'Costs Reduced (%)', placeholder: 'e.g. 15' },
    ],
    bullets: [
      (m, currency) =>
        hasNumber(m.budgetManaged)
          ? `Administered an organizational budget of ${formatMoney(m.budgetManaged, currency)} with 100% financial accountability.`
          : null,
      (m, currency) =>
        hasNumber(m.fundsRaised)
          ? `Secured ${formatMoney(m.fundsRaised, currency)} in sponsorships and fundraising initiatives.`
          : null,
      (m) =>
        hasNumber(m.costSavedPercent)
          ? `Reduced operational expenses by ${formatNumber(m.costSavedPercent)}% through vendor negotiation and budget tracking.`
          : null,
    ],
  },
}

/**
 * Builds action-verb bullet points for an organization entry using ONLY the numbers
 * the student typed. Missing or empty metrics are skipped automatically.
 *
 * @param {Object} role - An organization entry: { roleType, metrics: { ...numbers } }
 * @param {string} currency - Currency code like "PHP" or "USD"
 * @returns {string[]} Array of generated bullet strings
 */
export function generateBullets(role, currency = 'PHP') {
  if (!role || !role.roleType) return []

  const template = ROLE_TEMPLATES[role.roleType]
  if (!template) return []

  const metrics = role.metrics || {}

  return template.bullets
    .map((buildBullet) => buildBullet(metrics, currency))
    .filter(Boolean) // remove null bullets where data was missing
}

