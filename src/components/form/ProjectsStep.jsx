import CourseWritingGuide from './CourseWritingGuide'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { createEmptyProject } from '../../data/defaultResume'

export default function ProjectsStep() {
  const { control, register } = useFormContext()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'projects',
  })
  const projectValues = useWatch({ control, name: 'projects' }) || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-text">Academic &amp; Personal Projects</h2>
          <p className="text-sm text-text-muted">
            Capstone projects, hackathon builds, or course projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append(createEmptyProject())}
          className="shrink-0 rounded-[6px] bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent transition-colors cursor-pointer"
        >
          + Add Project
        </button>
      </div>

      <CourseWritingGuide section="projects" />

      {fields.length === 0 && (
        <p className="text-sm text-text-muted italic py-5 text-center border border-dashed border-border bg-page rounded-[10px]">
          No projects added yet. Click &ldquo;+ Add Project&rdquo; above.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const projectName = projectValues[index]?.name?.trim()

          return (
            <div
              key={field.id}
              className="rounded-[10px] border border-border bg-page p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border pb-2.5 gap-2">
                <span className="text-xs font-semibold text-text truncate">
                  Project {index + 1}
                  {projectName ? ` — ${projectName}` : ''}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => swap(index, index - 1)}
                    aria-label={`Move project entry ${index + 1} up`}
                    title="Move up"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M8 12.5v-9" />
                      <path d="M4.5 7 8 3.5 11.5 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    disabled={index === fields.length - 1}
                    onClick={() => swap(index, index + 1)}
                    aria-label={`Move project entry ${index + 1} down`}
                    title="Move down"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M8 3.5v9" />
                      <path d="M4.5 9 8 12.5 11.5 9" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove project entry ${index + 1}`}
                    className="inline-flex h-7 items-center rounded-[6px] border border-error/25 bg-white px-2.5 text-xs font-medium text-error hover:bg-error/8 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`proj-name-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Project Name
                  </label>
                  <input
                    id={`proj-name-${index}`}
                    type="text"
                    placeholder="e.g. StudySync"
                    {...register(`projects.${index}.name`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`proj-link-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Link / Repository
                  </label>
                  <input
                    id={`proj-link-${index}`}
                    type="text"
                    placeholder="e.g. github.com/alexcarter/studysync"
                    {...register(`projects.${index}.link`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`proj-stack-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Tech Stack
                  </label>
                  <input
                    id={`proj-stack-${index}`}
                    type="text"
                    placeholder="e.g. React, Node.js, PostgreSQL, Tailwind CSS"
                    {...register(`projects.${index}.techStack`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`proj-desc-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id={`proj-desc-${index}`}
                    rows={2}
                    placeholder="Describe what you built and the problem it solved..."
                    {...register(`projects.${index}.description`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

