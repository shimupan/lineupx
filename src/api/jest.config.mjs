export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};