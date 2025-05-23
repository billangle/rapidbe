module.exports = {
   testEnvironment: 'node',
   moduleFileExtensions: ['mjs','js','ts'],
   transform: {
      '^.+\\.mjs$': 'babel-jest'
    },
   moduleNameMapper: {
     '^/opt/nodejs/Utils.mjs$': "../../mocks/Utils.mjs"
   }
};
