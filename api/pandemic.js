const baseUrl = 'https://corona.lmao.ninja';

// API call to get covid stats for All countries
export const getGlobalStats = async () => {
    try {
    const response = await fetch(baseUrl + '/v2/countries?yesterday&sort=cases')
    return response.ok && response.json();
    }
    catch(e) {
        //Log error output if API fails
        //Not adding console log. We can add a logging service.
        return undefined;
    }
    
 }

// API call to get covid stats for single country
export const getCountryStats = async (country) => {
    try {
        const response = await fetch(baseUrl + '/v2/countries/'+country+'?yesterday&strict&query%20')
        return response.ok && response.json();
    }
    catch(e) {
        //Log error output if API fails
        //Not adding console log. We can add a logging service.
        return undefined;
    }
}
export default {getCountryStats, getGlobalStats};