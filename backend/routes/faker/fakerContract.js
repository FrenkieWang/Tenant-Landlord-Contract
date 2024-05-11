const { faker } = require('@faker-js/faker');

function generateRandomContract() {
    const thisContractLength = faker.helpers.arrayElement(['Month', 'Year', 'Permanent']);
    const thisPropertyType = faker.helpers.arrayElement(['Apartment', 'Semi-Detached', 'Detached', 'Other']);
    const dateWithinNextYear = faker.date.between({ from: new Date(), to: new Date(Date.now() + 31536000000) });
  
  const contract = {
    contractDate: dateWithinNextYear,
    monthlyFee: faker.number.int({ min: 200, max: 6000 }), 
    doorNumber: faker.number.int({ min: 1, max: 99 }), 
    contractLength: thisContractLength,
    propertyType: thisPropertyType,
    propertyTypeOther: thisPropertyType === 'Other' ? faker.lorem.words(2) : undefined, 
  };

  return contract;
}

module.exports = generateRandomContract;