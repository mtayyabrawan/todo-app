function capitalize(str: string) {
    return str
        .split(" ")
        .map((word) => {
            return word
                .slice(0, 1)
                .toUpperCase()
                .concat(word.slice(1).toLowerCase());
        })
        .join(" ");
}

export default capitalize;
