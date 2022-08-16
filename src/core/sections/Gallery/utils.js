export const tokenizeTagString = (tags) => tags
  .split(',')
  .map((tag) => tag.trim())
  .filter((tag) => tag.length > 0)

export const tokenizeItemsTags = (items) => ([
  ...items.reduce((acc, { tags: tagString }) => {
    const tags = tokenizeTagString(tagString)
    for (const tag of tags) acc.add(tag)
    return acc
  }, new Set()).values(),
])
