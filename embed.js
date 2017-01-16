module.exports = (str) => {
    let h = false, h2 = 0;
    let max = () => h ? 256 : 1024;
    let temp = [], buf = [], cn = 0, pointer = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str[i];
        cn++;
        temp.push(c);
        if (cn > (max() - 2) || i == (str.length - 1)) {
            buf.push(temp.join(''));
            temp = [];
            h = !h;
            cn = 0;
        }
    }
    let ret = [];
    temp = [];
    for (let i in buf) {
        if (ret.length >= 25)
            break;
        if (i % 2 == 0) {
            temp.push(buf[i]);
            if (temp.length < 2) {
                temp.push("f");
                temp.reverse();
            }
            ret.push(temp);
            temp = [];
            continue;
        }
        temp.push(buf[i]);
    }
    return ret;
}