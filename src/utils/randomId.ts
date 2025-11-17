function randomId(length: { outer: number; inner: number }) {
    function genRandomWord(length: number) {
        const letters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let word = "";
        for (let i = 0; i < length; i++) {
            const randNum = Math.floor(Math.random() * 4) + 1;
            if (randNum === 4 || randNum === 2) {
                word += letters[Math.floor(Math.random() * 26)].toUpperCase();
            } else {
                word += letters[Math.floor(Math.random() * 36)];
            }
        }
        return word;
    }
    return `${genRandomWord(length.outer)}_${genRandomWord(length.inner)}_${genRandomWord(length.outer)}`;
}

export default randomId;
