/**
 *
 * @returns {{
 *      date?: "last24Hours" | "pastWeek" | "pastMonth",
 *      modality?: "hybrid" | "onSite" | "remote",
 *      searchTerm?: string,
 *      location?: string
 * }}
 */
const getFiltersFromCmdArgs = () => {
  const cmdArgs = process.argv.slice(2);

  const knownFilters = ["location", "searchTerm", "date", "modality"];
  const knownOperators = ["AND", "OR", "&&", "||"];

  const filters = cmdArgs.reduce((acc = {}, arg) => {
    const [key, value = ""] = arg.split("=");

    if (!knownFilters.includes(key)) return;

    let _value = value;

    const operatorsInUse = knownOperators.filter((x) => value.includes(x));
    if (operatorsInUse.length > 0) {
      for (const operator of operatorsInUse) {
        const values = _value.split(operator);
        _value = values.join(` ${operator} `);
      }
    }

    acc[key] = _value;
    return acc;
  }, {});

  return filters;
};

module.exports = { getFiltersFromCmdArgs };
