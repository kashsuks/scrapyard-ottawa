// https://wrapped-maps.hackclub.dev/api/annotations?latitude=39.369935&longitude=-97.384106&zoom=3&size=600x300&annotations=

import AirtablePlus from 'airtable-plus'

export default async function handler (req, res) {
    const key = req.query.key; 

    if (!process.env.AIRTABLE_API_KEY) {
        return res.status(500).json({
            error: "Misconfigured server API key. Report this in #scrapyard"
        })
    }

    if (key != process.env.API_KEY) {
        return res.status(401).json({
            error: "Invalid API key"
        });
    }

    const attendeesTable = new AirtablePlus({
        baseID: process.env.AIRTABLE_BASE_ID,
        apiKey: process.env.AIRTABLE_API_KEY,
        tableName: 'Stipends'
    });

    const stipends = await attendeesTable.read({
        filterByFormula: `NOT(Coordinates = '')`
    });

    const annotations = [];
    
    for (let i = 0; i < stipends.length; i++) {
        const stipend = stipends[i];

        annotations.push({
            point: stipend.fields['Coordinates'],
            color: '449944',
            glyphText: (i + 1).toString()
        });
    }



    return res.status(200).json({ url: "https://wrapped-maps.hackclub.dev/api/annotations?latitude=39.369935&longitude=-97.384106&zoom=3&size=600x300&annotations=" + JSON.stringify(annotations) });
}