export default defineEventHandler(async (event) => {
    try {
        const response = await fetch('https://prayertimes.muslimthaipost.com/app_crud.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: 'action=getsolatbyprovince&id=2' // Bangkok
        });

        const data = await response.json();

        if (data.success === "1" && data.rowsolat) {
            const solat = data.rowsolat;
            return {
                success: true,
                province: data.provincename,
                date: {
                    gregorian: `${solat.dd}/${solat.mm}/${solat.yyyy}`,
                    hijri: `${solat.hdd}/${solat.hmm}/${solat.hyyyy}`
                },
                times: {
                    imsak: solat.aimsak,
                    fajr: solat.subhi,
                    sunrise: solat.shuruk,
                    dhuhr: solat.zuhri,
                    asr: solat.asri,
                    maghrib: solat.maghrib,
                    isha: solat.aisha
                }
            };
        }

        return { success: false, error: 'Failed to fetch prayer times' };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
