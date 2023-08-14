const locationIdentifier = "url";
const userIdentifier = "username";
const passwordIdentifier = "password";

function approximateDelimiter(content: string) {
    const potentialDelimiters = [',', ';']; // Possible delimiters
    let selectedDelimiter = ',';
    let maxDelimiterCount = 0;

    // Count occurrences of each delimiter in the first few rows
    const sampleRows = content.split('\n').slice(0, 5); // Using a sample of first 5 rows
    for (const delimiter of potentialDelimiters) {
        const delimiterCount = sampleRows.reduce((count, row) =>
            count + row.split(delimiter).length - 1, 0);
        if (delimiterCount > maxDelimiterCount) {
            maxDelimiterCount = delimiterCount;
            selectedDelimiter = delimiter;
        }
    }
    return selectedDelimiter;
}


function findRowIndices(headerColumns: string[]): [number, number, number] {
    const locationIdx = headerColumns.indexOf(locationIdentifier)
    const userIdx = headerColumns.indexOf(userIdentifier)
    const passwordIdx = headerColumns.indexOf(passwordIdentifier)
    if(locationIdx == -1 || userIdx == -1 || passwordIdx == -1)
        throw Error(`No valid csv headers. Expected ${locationIdentifier}, ${userIdentifier} and ${passwordIdentifier} to be present in header`)
    return [locationIdx, userIdx, passwordIdx]
}

export function importFromCsv(content: string) {
    content = content.replace(/(\r\n|\r)/g, '\n');
    const data = new Array<ImportedPassword>();
    const csvRows: string[] = content.split("\n");
    if(csvRows.length == 0 || csvRows.length == 1) //empty or empty with header
        return data;
    const delimiter = approximateDelimiter(content);
    const rowIndices = findRowIndices(csvRows[0].split(delimiter))
    csvRows.splice(0, 1); //remove header

    for (const row of csvRows) {
        const columns: string[] = row.split(delimiter);
        const entry = {
            location: columns[rowIndices[0]],
            user: columns[rowIndices[1]],
            password: columns[rowIndices[2]]
        }
        if(entry.location && entry.user && entry.password)
            data.push(entry);
    }
    return data;
}

export function exportToCsv(data: Array<ImportedPassword>) {
    let str = [locationIdentifier, userIdentifier, passwordIdentifier].join(",") + "\n";
    let counter = 0;
    for(const row of data) {
        str += [row.location, row.user, row.password].join(",")
        if(counter < data.length - 1)
            str += "\n";
        counter++;
    }
    return str;
}

export interface ImportedPassword {
    location: string,
    user: string,
    password: string
}