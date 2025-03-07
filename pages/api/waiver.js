import AirtablePlus from 'airtable-plus'

export default async function handler (req, res) {
    const attendeeId = req.query.attendee; 

    if (!process.env.AIRTABLE_API_KEY) {
        return res.status(500).json({
            error: "Misconfigured server API key. Report this in #scrapyard"
        })
    }

    const attendeesTable = new AirtablePlus({
        baseID: process.env.AIRTABLE_BASE_ID,
        apiKey: process.env.AIRTABLE_API_KEY,
        tableName: 'Flagship Attendees'
    });

    const attendees = await attendeesTable.read({
        filterByFormula: `ID = '${attendeeId}'`
    });

    const attendee = attendees[0];

    if (!attendee) {
        return res.status(401).json({
            error: "No attendee found"
        });
    }

    return res.redirect(attendee.fields['Waiver URL']);
}