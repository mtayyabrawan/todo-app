function formatDate(date: string) {
    return date.slice(0, date.indexOf(".")).slice(0, date.lastIndexOf(":"));
}

export default formatDate;
