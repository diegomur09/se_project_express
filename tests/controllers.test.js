/* eslint-env jest */
// Tests that call controller functions directly without starting the server.
const { getUsers } = require('../controllers/users');
const { getItems } = require('../controllers/clothingItems');

jest.mock('../models/user', () => ({
  find: jest.fn().mockResolvedValue([{ name: 'Alice' }]),
}));

jest.mock('../models/clothingItems', () => ({
  find: jest.fn().mockResolvedValue([]),
}));

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe('Controller smoke tests', () => {
  test('getUsers responds 200 with array', async () => {
    const req = {};
    const res = makeRes();

    await getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.any(Array));
  });

  test('getItems responds 200 with array', async () => {
    const req = {};
    const res = makeRes();

    await getItems(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.any(Array));
  });
});
