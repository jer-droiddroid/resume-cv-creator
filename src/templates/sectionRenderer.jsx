import { Text, View, StyleSheet } from '@react-pdf/renderer'
import { generateBullets } from '../data/roleTemplates'
import { formatDateRange } from '../utils/resumeFormatting'

export { formatDateRange, getContactItems } from '../utils/resumeFormatting'

// Base section styles generated from any theme
export const createSectionStyles = (theme, options = {}) => {
  const headingColor = options.headingColor || theme.accentColor
  const textColor = options.textColor || theme.textColor
  const mutedColor = options.mutedColor || theme.mutedColor

  return StyleSheet.create({
    section: {
      marginBottom: theme.spacing.sectionGap,
    },
    sectionHeading: {
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.sectionHeading,
      color: headingColor,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 5,
      paddingBottom: theme.headingStyle === 'underline' ? 2 : 3,
      paddingHorizontal: theme.headingStyle === 'accent-tint' ? 5 : 0,
      paddingTop: theme.headingStyle === 'accent-tint' ? 3 : 0,
      backgroundColor:
        theme.headingStyle === 'accent-tint' && !options.invert
          ? theme.accentLight || '#f1f5f9'
          : 'transparent',
      borderBottomWidth: theme.headingStyle === 'underline' ? 1 : 0,
      borderBottomColor: headingColor,
    },
    itemContainer: {
      marginBottom: theme.spacing.itemGap,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 6,
    },
    itemTitle: {
      flex: 1,
      paddingRight: 8,
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.itemTitle,
      color: textColor,
    },
    itemSubtitle: {
      fontFamily: theme.fontFamilyItalic,
      fontSize: theme.fontSize.body,
      color: mutedColor,
      marginBottom: 2,
    },
    dateText: {
      flexShrink: 0,
      textAlign: 'right',
      fontSize: theme.fontSize.small,
      color: mutedColor,
    },
    bodyText: {
      fontSize: theme.fontSize.body,
      color: textColor,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 2,
      paddingLeft: 3,
    },
    bulletDot: {
      width: 9,
      fontSize: theme.fontSize.body,
      color: textColor,
    },
    bulletText: {
      flex: 1,
      fontSize: theme.fontSize.body,
      color: textColor,
    },
  })
}

/**
 * Renders any single resume section by its sectionId.
 * Shared across all layouts so adding or updating a section works everywhere.
 */
export function renderResumeSection(sectionId, data, theme, styleOverrides = {}) {
  const styles = createSectionStyles(theme, styleOverrides)
  const currency = data?.currency || 'USD'

  switch (sectionId) {
    case 'summary':
      return (
        <View key="summary" style={styles.section}>
          <Text style={styles.sectionHeading} minPresenceAhead={36}>
            {data?.isOjtMode ? 'Career Objective' : 'Summary'}
          </Text>
          <Text style={styles.bodyText}>{data.summary}</Text>
        </View>
      )

    case 'education':
      return (
        <View key="education" style={styles.section}>
          <Text style={styles.sectionHeading} minPresenceAhead={48}>
            Education
          </Text>
          {data.education
            .filter((edu) => edu.school || edu.degree)
            .map((edu, index) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{edu.school}</Text>
                  <Text style={styles.dateText}>
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </Text>
                </View>
                {edu.degree ? <Text style={styles.itemSubtitle}>{edu.degree}</Text> : null}
                {edu.details ? <Text style={styles.bodyText}>{edu.details}</Text> : null}
                {edu.coursework ? (
                  <Text style={styles.bodyText}>Relevant Coursework: {edu.coursework}</Text>
                ) : null}
              </View>
            ))}
        </View>
      )

    case 'experience':
      return (
        <View key="experience" style={styles.section}>
          <Text style={styles.sectionHeading} minPresenceAhead={48}>
            Experience
          </Text>
          {data.experience
            .filter((exp) => exp.company || exp.title)
            .map((exp, index) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.dateText}>
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </Text>
                </View>
                {exp.company ? <Text style={styles.itemSubtitle}>{exp.company}</Text> : null}
                {(exp.bullets || [])
                  .filter((b) => b && b.trim())
                  .map((bullet, bIndex) => (
                    <View key={bIndex} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
              </View>
            ))}
        </View>
      )

    case 'organizations':
      return (
        <View key="organizations" style={styles.section}>
          <Text style={styles.sectionHeading} minPresenceAhead={48}>
            Leadership &amp; Activities
          </Text>
          {data.organizations
            .filter((org) => org.organization || org.title)
            .map((org, index) => {
              const bullets = generateBullets(org, currency)
              return (
                <View key={index} style={styles.itemContainer} wrap={false}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.itemTitle}>{org.title}</Text>
                    <Text style={styles.dateText}>
                      {formatDateRange(org.startDate, org.endDate)}
                    </Text>
                  </View>
                  {org.organization ? (
                    <Text style={styles.itemSubtitle}>{org.organization}</Text>
                  ) : null}
                  {bullets.map((bullet, bIndex) => (
                    <View key={bIndex} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              )
            })}
        </View>
      )

    case 'projects':
      return (
        <View key="projects" style={styles.section}>
          <Text style={styles.sectionHeading} minPresenceAhead={48}>
            Projects
          </Text>
          {data.projects
            .filter((proj) => proj.name || proj.description)
            .map((proj, index) => (
              <View key={index} style={styles.itemContainer} wrap={false}>
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.link ? <Text style={styles.dateText}>{proj.link}</Text> : null}
                </View>
                {proj.techStack ? (
                  <Text style={styles.itemSubtitle}>Tech: {proj.techStack}</Text>
                ) : null}
                {proj.description ? (
                  <Text style={styles.bodyText}>{proj.description}</Text>
                ) : null}
              </View>
            ))}
        </View>
      )

    case 'skills':
      return (
        <View key="skills" style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading} minPresenceAhead={36}>
            Skills
          </Text>
          <Text style={styles.bodyText}>
            {data.skills.filter((s) => s && s.trim()).join(' • ')}
          </Text>
        </View>
      )

    case 'awards':
      return (
        <View key="awards" style={styles.section}>
          <Text style={styles.sectionHeading} minPresenceAhead={36}>
            Awards &amp; Honors
          </Text>
          {data.awards
            .filter((a) => a && a.trim())
            .map((award, index) => (
              <View key={index} style={styles.bulletRow} wrap={false}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{award}</Text>
              </View>
            ))}
        </View>
      )

    case 'certifications':
      return (
        <View key="certifications" style={styles.section}>
          <Text style={styles.sectionHeading} minPresenceAhead={36}>
            Certifications
          </Text>
          {data.certifications
            .filter((c) => c && c.trim())
            .map((cert, index) => (
              <View key={index} style={styles.bulletRow} wrap={false}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{cert}</Text>
              </View>
            ))}
        </View>
      )

    case 'ojt':
      return (
        <View key="ojt" style={styles.section} wrap={false}>
          <Text style={styles.sectionHeading} minPresenceAhead={36}>
            OJT Availability
          </Text>
          {data.ojtInfo?.requiredHours ? (
            <Text style={styles.bodyText}>
              Required OJT Hours: {data.ojtInfo.requiredHours}
            </Text>
          ) : null}
          {data.ojtInfo?.preferredStartDate ? (
            <Text style={styles.bodyText}>
              Preferred Start Date: {data.ojtInfo.preferredStartDate}
            </Text>
          ) : null}
        </View>
      )

    default:
      return null
  }
}

