import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'
import { components } from 'core/sections'
import sm from '../../../sm.json'

const homeUID = 'home'
export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {
  switch (doc.type) {
    case 'page':
      return doc.uid === '/' ? '/' : `/${doc.uid}`
    default:
      return null
  }
}

// This factory function allows smooth preview setup
export function createClient(config = {}) {
  const client = prismic.createClient(endpoint, {
    ...config,
  })

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}

export async function fetchStaticPaths({ previewData }) {
  const client = createClient({ previewData })

  const pages = await client.getAllByType('page')
  return {
    paths: pages.map(({ uid }) => ({ params: { page: [uid === homeUID ? '' : uid] } })),
    fallback: false,
  }
}

export async function fetchStaticProps({ previewData, params }) {
  const uid = params.page?.[0] ?? homeUID

  const client = createClient({ previewData })

  const page = (await client.getByUID('page', uid))?.data ?? null
  page.theme = page.slices[0]?.primary.theme ?? null

  // fetch breakoutpages for slices in page that contain them
  if (page.slices) {
    for (const { slice_type: type, ...slice } of page.slices) {
      if (components[type].fetchSliceData) {
        // eslint-disable-next-line no-await-in-loop
        await components[type].fetchSliceData(client, slice)
      }
    }
  }

  const nav = (await client.getAllByType('nav'))?.[0]?.data ?? null

  return {
    // Will be passed to the page component as props
    props: { page, nav },
  }
}
