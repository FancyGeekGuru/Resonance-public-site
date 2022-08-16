import React, { useCallback, useMemo, useState } from 'react'
import { Section } from 'core/layouts/Section'
import useSWR from 'swr'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'core/components/Link'
import { Dropdown } from './Dropdown'

export const ALL_FILTER = 'all'
const NO_RESULTS = 'Sorry, no results.'
const VIEW_JOB = 'View Job'

const fetcher = (...args) => fetch(...args).then((res) => res.json())
const variants = {
  hidden: {
    opacity: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.5,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      ease: 'easeOut',
      duration: 0.5,
    },
  },
}

const CopyBlock = ({ slice: { primary }, ...rest }) => {
  const { data: jobs } = useSWR('/api/careers', fetcher)
  const loaded = !!jobs
  const [filters, setFilters] = useState({ department: ALL_FILTER, location: ALL_FILTER })

  const { departments, locations } = useMemo(() => {
    if (jobs) {
      const departmentsSet = new Set()
      const locationsSet = new Set()
      for (const job of jobs) {
        if (!!job.department) departmentsSet.add(job.department)
        if (!!job.location) locationsSet.add(job.location)
      }

      return {
        departments: [ALL_FILTER, ...departmentsSet.values()],
        locations: [ALL_FILTER, ...locationsSet.values()],
      }
    }
    return {}
  }, [jobs])

  const onFilterChange = useCallback((ev) => {
    const updatedName = ev.target.name
    const updatedValue = ev.target.value
    setFilters((oldFilters) => {
      const newFilters = { ...oldFilters }
      newFilters[updatedName] = updatedValue
      return newFilters
    })
  }, [])

  const results = useMemo(
    () => jobs?.filter(
      (job) => (filters.location === ALL_FILTER || filters.location === job.location)
        && (filters.department === ALL_FILTER || filters.department === job.department),
    ),
    [jobs, filters],
  )

  return (
    <Section {...primary} {...rest} className="container">
      <AnimatePresence exitBeforeEnter>
        {loaded && results && (
          <motion.div initial="hidden" animate="visible" exit="hidden" variants={variants}>
            <div className="flex gap-gutter max-w-full flex-wrap mb-36">
              <Dropdown name="location" value={filters.location} options={locations} onChange={onFilterChange} />
              <Dropdown name="department" value={filters.department} options={departments} onChange={onFilterChange} />
            </div>
            <motion.div className="flex flex-col space-y-14">
              {results.length === 0 && (
                <motion.div
                  className="type-h3"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={variants}
                >
                  {NO_RESULTS}
                </motion.div>
              )}
              {results.map((job, jobIndex) => (
                <motion.div
                  key={`job--${job.title}--${jobIndex}`}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={variants}
                >
                  <div className="type-career-title">{job.title}</div>
                  <div className="type-h4 mt-3 md:mt-4 max-w-3xl">{job.department ? `${job.department}, ` : ''}{job.location}</div>
                  <Link href={job.url} className="btn bg-foreground text-background mt-5 md:mt-8 normal-case">{VIEW_JOB}</Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}

export default CopyBlock
