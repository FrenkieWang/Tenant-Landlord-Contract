const { faker } = require('@faker-js/faker');

function generateRandomLandlord() {
  const thisTitle = faker.helpers.arrayElement(['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Other']);

  const landlord = {
    title: thisTitle,
    titleOther: thisTitle === 'Other' ? faker.lorem.word() : '',
    firstName: faker.person.firstName(),
    surName: faker.person.lastName(),
    phoneNumber: faker.string.numeric(10, { allowLeadingZeros: true }),
    email: faker.internet.email(),
    dateOfBirth: faker.date.between({ from: '1900-01-01', to: '2006-05-11' }), 
    rentPermit: faker.helpers.arrayElement(['Y', 'N']),  
    contactViaEmail: faker.helpers.arrayElement(['Y', 'N'])  
  };

  return landlord;
}

module.exports = generateRandomLandlord; 