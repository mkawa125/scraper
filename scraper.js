const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://matokeo.necta.go.tz/results/2023/csee/CSEE2023/results/s4459.htm';


/** Defining async scrapedResults function */
async function scrapeResults(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let results = [];
        
        // Select the third table which contains the results
        const thirdTable = $('table').eq(2);

        // Iterate through each row of the third table
        thirdTable.find('tr').each((index, element) => {
            if (index === 0) return; // Skip the header row

            const cells = $(element).find('td');

            if (cells.length > 0) {
                const examNumber = $(cells[0]).find('font').text().trim();
                const points = $(cells[2]).find('font').text().trim();
                const division = $(cells[3]).find('font').text().trim();
                const subjectsText = $(cells[4]).find('font').text().trim();

                // Check if we have valid data before proceeding
                
                if (examNumber && points && division && subjectsText) {
                    // Parse the subjects and grades
                    const subjectsArray = subjectsText.split(/\s{2,}/).map(subjGrade => {
                        const [subject, grade] = subjGrade.split('-').map(s => s.trim().replace(/'/g, ''));
                        return { subject: subject, grade: grade };
                    });

                    const result = {
                        examNumber: examNumber,
                        points: points,
                        division: division,
                        subjects: subjectsArray
                    };
                    results.push(result);
                }
            }
        });
        return results;

    } catch (error) {
        console.error('Error fetching the results:', error);
    }
}

/** Call scrapeResults function when url is provided */
scrapeResults(url).then(results => {
    console.log(JSON.stringify(results, null, 2));
});