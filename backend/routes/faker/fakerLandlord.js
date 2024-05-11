const { faker } = require('@faker-js/faker');

function generateRandomTenant() {
  const thisTitle = faker.helpers.arrayElement(['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Other']);

  const tenant = {
    title: thisTitle,
    titleOther: thisTitle === 'Other' ? faker.lorem.word() : '',
    firstName: faker.person.firstName(),
    surName: faker.person.lastName(),
    phoneNumber: faker.string.numeric(10, { allowLeadingZeros: true }),
    email: faker.internet.email(),
  };

  return tenant;
}

module.exports = generateRandomTenant; 