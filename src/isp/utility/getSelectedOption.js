const getSelectedOption = (selector) => selector.childNodes
    .find((elem) => /selected/.test(elem.rawAttrs))
    .structuredText;

module.exports = getSelectedOption;
