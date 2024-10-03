export const lockScroll = () => {
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = 'var(--scrollbar-width)'
}

export const unlockScroll = () => {
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

// Calculate scrollbar width on mount and set CSS variable
if (typeof window !== 'undefined') {
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`)
}