String.prototype.replaceAll = function (target, replacement) {
    return this.split(target).join(replacement);
};

function fuck(str) {
    try {
    str = str.toLowerCase();
    str = str.replaceAll("'", "");
    str = str.replaceAll(",", "");
    str = str.replaceAll("ing", "en");
    str = str.replaceAll("am", "do");
    let words = str.split(" ");
    let amount = Math.floor(words.length - (Math.random() * words.length) + 1);
    console.log(amount);
    for (let i = 0; i < amount; i++) {
        let index = pickIndex(words);
        words = swap(words, index, index + 1);
    }
    amount = Math.floor(words.length - (Math.random() * words.length) + 1);
    for (let i = 0; i < amount; i++) {
        let index = pickIndex(words);
        let letterIndex = pickIndex(words[index]);
        words[index] = swap(words[index], letterIndex, letterIndex + 1);
    }
    return words.join(" ");
    }catch(e) {
        // something went wronglol
        
        return str;
    }

}

function pickIndex(arr) {
    return Math.max(0, Math.floor(Math.random() * arr.length - 2));
}

function swap(arr, indx, indx2) {
    let temp = arr[indx];
    arr[indx] = arr[indx2];
    arr[indx2] = temp;
    return arr;
}