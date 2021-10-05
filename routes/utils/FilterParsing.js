const { Op } = require('sequelize')

const validLocations = ['BidiBidi Zone 1', 'BidiBidi Zone 2', 'BidiBidi Zone 3',
    'BidiBidi Zone 4', 'BidiBidi Zone 5', 'Palorinya Basecamp',
    'Palorinya Zone 1', 'Palorinya Zone 2', 'Palorinya Zone 3'];
const validDisabilities = [
    'Amputee', 'Polio', 'Spinal Cord Injury', 'Cerebral Palsy',
    'Spina Bifida', 'Hydrocephalus', 'Visual Impairment', 'Hearing Impairment',
    'Don\'t Know', 'Other'];
const validServices = [ 'Physiotherapy', 'Prosthetic', 'Orthotic', 'Wheelchair', 'Other' ];

function ValidateFilters(filters) {
    function removeNulls(filters) {
        let validatedFilters = Object.fromEntries(Object.entries(filters).filter(filter => {
            const [key, val] = filter;
            if (key === 'Location' || key === 'DisabilityType' || key === 'Date' || key === 'ServiceRequired') {
                return (filters[key][0] !== null);
            }
            return (filters[key] !== null);
        }));
        return validatedFilters;
    }

    // Removes all nulls from the object
    let validatedFilters = removeNulls(filters);

    for (let [key, val] of Object.entries(validatedFilters)) {
        if (key === 'Location') {
            val = JSON.parse(val);
            let locations = val.filter(location => {
                return !!validLocations.find(validLocation => location === validLocation);
            })
            if (locations.length === 0) {
                delete validatedFilters.Location;
            }
            else if (locations.length === 1) {
                validatedFilters.Location = locations[0];
            }
            else if (locations.length > 1) {
                validatedFilters.Location = { [Op.in]: locations };
            }
        }
        else if (key === 'DisabilityType') {
            val = JSON.parse(val);
            let disabilities = val.filter(disability => {
                return !!validDisabilities.find(validDisability => disability === validDisability);
            })
            if (disabilities.length === 0) {
                delete validatedFilters.DisabilityType;
            }
            else if (disabilities.length === 1) {
                validatedFilters.DisabilityType = disabilities;
            }
            else if (disabilities.length > 1) {
                // TODO add multiple disability search
                validatedFilters.DisabilityType = { [Op.contains]: disabilities }
            }
        }
        else if (key === 'Date') {
            let date = JSON.parse(validatedFilters.Date);
            if (date.length === 0) {
                delete validatedFilters.Date;
            }
            else if (date.length === 1) {
                let dateParsed = date[0].split('-').reverse().map(Number);
                validatedFilters.Date = new Date(dateParsed[0], dateParsed[1], dateParsed[2]);
            }
            else if (date.length === 2) {
                let from = date[0].split('-').reverse().map(Number);
                let to = date[1].split('-').reverse().map(Number);

                let fromDate = new Date(from[0], from[1] - 1, from[2]);
                let toDate = new Date(to[0], to[1] - 1, to[2]);

                validatedFilters.Date = {
                    [Op.between]: [fromDate, toDate]
                }
            }
        }
        else if (key === 'Status') {
            if (validatedFilters.Status !== 'Made' && validatedFilters.Status !== 'Resolved') {
                delete validatedFilters.Status
                throw "Invalid Status value"
            }
        }
        else if (key === 'ServiceRequired') {
            val = JSON.parse(val);
            let services = val.filter(service => {
                return !!validServices.find(validService => service === validService);
            })
            if (services.length === 0) {
                delete validatedFilters.ServiceRequired;
            }
            else if (services.length === 1) {
                validatedFilters.ServiceRequired = services;
            }
            else if (services.length > 1) {
                validatedFilters.ServiceRequired = { [Op.in]: [services] };
            }
        }
    }
    return validatedFilters;
}

function MatchFilters(filters, query) {
    const validQuery = Object.entries(query).filter(entry => {
        const [key, val] = entry;
        return filters.hasOwnProperty(key);
    });

    validQuery.map(filter => {
        const [key, val] = filter;
        return filters[key] = val;
    });
}

module.exports = { ValidateFilters, MatchFilters }
