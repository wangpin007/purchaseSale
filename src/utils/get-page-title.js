import defaultSettings from '@/settings'

const title = defaultSettings.title || '美云智数品质云'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
