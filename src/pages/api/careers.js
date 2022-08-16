const AccessToken = process.env.WORKABLE_ACCESS_TOKEN

const apiBase = 'https://resonance.workable.com/spi/v3/jobs?state=published'

export default async function handler(req, res) {
  const careersData = await fetch(
    apiBase,
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${AccessToken}`,
      },
    },
  ).then((res) => res.json())

  if (careersData) {
    const { jobs: jobsData } = careersData
    const jobs = jobsData.map(({ title, url, department, location }) => ({
      title,
      url,
      department,
      location: location.location_str,
    }))
    res.status(200).json(jobs)
  }
  else res.status(500).json(null)
}
