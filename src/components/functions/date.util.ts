export const isDateToday = (date: string | Date) => {
  const otherDate = new Date(date)
  const todayDate = new Date()

  if (
    otherDate.getDate() === todayDate.getDate() &&
    otherDate.getMonth() === todayDate.getMonth() &&
    otherDate.getFullYear() === todayDate.getFullYear()
  ) {
    return true
  } else {
    return false
  }
}
