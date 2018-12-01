export class SortFnFactory {

    static getSortFn(args: any[]) { //multiple sort https://stackoverflow.com/questions/6913512/how-to-sort-an-array-of-objects-by-multiple-fields

        let fields = [];
        const n_fields = args.length;
        let field, name, cmp;


        let default_cmp = function (a, b) {
            if (a) {
                if (b) {
                    if (a == b) {
                        return 0;
                    }
                    return a < b ? -1 : 1;
                } else {
                    return 1;
                }
            } else {
                return b ? -1 : 0;
            }
        };


        let getCmpFunc = function (primer, reverse) {
            let dfc = default_cmp, // closer in scope
                cmp = default_cmp;
            if (primer) {
                cmp = function (a, b) {
                    return dfc(primer(a), primer(b));
                };
            }
            if (reverse) {
                return function (a, b) {
                    return -1 * cmp(a, b);
                };
            }
            return cmp;
        };

        // preprocess sorting options
        for (let i = 0; i < n_fields; i++) {
            field = args[i];
            if (typeof field === 'string') {
                name = field;
                cmp = default_cmp;
            } else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
            }
            fields.push({
                name: name,
                cmp: cmp
            });
        }


        // final comparison function
        return function (a, b) {
            let name, result;
            for (let i = 0; i < n_fields; i++) {
                result = 0;
                field = fields[i];
                name = field.name;

                result = field.cmp(a[name], b[name]);
                if (result !== 0) break;
            }
            return result;
        }
    };
}