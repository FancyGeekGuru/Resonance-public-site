import { DefaultLayout } from 'core/layouts/DefaultLayout'
import { fetchStaticPaths, fetchStaticProps } from 'lib/prismic/client'
import { NextSeo } from 'next-seo'
import { Sections } from 'core/layouts/Sections'

function Page({ page }) {
  return (
    <>
      <NextSeo title={page.title} />
      <Sections page={page} key={page.title} />
    </>
  )
}

Page.layout = DefaultLayout

export const getStaticProps = fetchStaticProps
export const getStaticPaths = fetchStaticPaths

export default Page
