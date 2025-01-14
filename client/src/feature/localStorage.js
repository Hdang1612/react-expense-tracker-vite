export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getFromStorage = (key) => {
  const storedData = localStorage.getItem(key)
  return storedData ? JSON.parse(storedData) : null
}

export const removeFromStorage = (key) => {
  localStorage.removeItem(key)
}
