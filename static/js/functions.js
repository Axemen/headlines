/**
 *
 * @param {*} words
 * Creates a plotly trace for the word given.
 */
function createTrace(word, years, data) {
    trace = {
        x: [],
        y: [],
        name: word,
    }

    data.forEach(d => {
        if (word === d.word && years.includes(d.year)) {
            trace.x.push(d.year);
            trace.y.push(d.count);
        }
    })
    return trace
}

function unique(value, index, self) {
    return self.indexOf(value) === index
}