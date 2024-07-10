export const formatDateToTime = (date: Date) => {
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "numeric"
    })
    return dateFormatter.format(date)
}