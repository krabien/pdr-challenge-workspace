import axios from 'axios';

describe('GET /users basic smoke test', () => {
  it('should return the list of users', async () => {
    const res = await axios.get(`/api/users`);
    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThanOrEqual(100);
    expect(res.data[0].id).toEqual(1);
    expect(res.data[0].firstName).toEqual('Cynthia');
  });
});

describe('GET /users/:id basic smoke test', () => {
  it('should return a specific user', async () => {
    const res = await axios.get(`/api/users/3`);
    expect(res.status).toBe(200);
    expect(res.data.id).toEqual(3);
    expect(res.data.firstName).toEqual('Anita');
  });
});

describe('POST /users simple validation failure test', () => {
  it('should fail creating a new user when validation fails', async () => {
    // data before
    const usersBefore = await axios.get(`/api/users`);

    try {
      await axios.post(`/api/users`, {
        firstName: 'Test Data First Name',
        lastName: 'Test Data Last Name',
        role: 'user',
      });
    } catch (axiosError) {
      // check validation response
      expect(axiosError.response.status).toBe(400);
      expect(axiosError.response.data.statusCode).toEqual(400);
      expect(axiosError.response.data.message).toEqual('Validation failed');
      expect(axiosError.response.data.errors.length).toEqual(1);
      expect(axiosError.response.data.errors[0].path).toEqual('role');
    }

    // data after
    const usersAfter = await axios.get(`/api/users`);

    // the data length should be unchanged
    expect(usersBefore.data.length).toEqual(usersAfter.data.length);
  });
});

describe('POST /users complex validation failure test', () => {
  it('should fail creating a new admin when complex validation fails', async () => {
    // data before
    const usersBefore = await axios.get(`/api/users`);

    try {
      await axios.post(`/api/users`, {
        firstName: 'Test Data First Name',
        lastName: 'Test Data Last Name',
        email: 'test-data@test.data',
        role: 'admin',
      });
    } catch (axiosError) {
      // check validation response
      expect(axiosError.response.status).toBe(400);
      expect(axiosError.response.data.statusCode).toEqual(400);
      expect(axiosError.response.data.message).toEqual('Validation failed');
      expect(axiosError.response.data.errors.length).toEqual(2);
      expect(axiosError.response.data.errors[0].path).toEqual('phoneNumber');
      expect(axiosError.response.data.errors[1].path).toEqual('birthDate');
    }

    // data after
    const usersAfter = await axios.get(`/api/users`);

    // the data length should be unchanged
    expect(usersBefore.data.length).toEqual(usersAfter.data.length);
  });

  it('should fail creating a new editor when complex validation fails', async () => {
    // data before
    const usersBefore = await axios.get(`/api/users`);

    try {
      await axios.post(`/api/users`, {
        firstName: 'Test Data First Name',
        lastName: 'Test Data Last Name',
        email: 'test-data@test.data',
        role: 'editor',
      });
    } catch (axiosError) {
      // check validation response
      expect(axiosError.response.status).toBe(400);
      expect(axiosError.response.data.statusCode).toEqual(400);
      expect(axiosError.response.data.message).toEqual('Validation failed');
      expect(axiosError.response.data.errors.length).toEqual(1);
      expect(axiosError.response.data.errors[0].path).toEqual('phoneNumber');
    }

    // data after
    const usersAfter = await axios.get(`/api/users`);

    // the data length should be unchanged
    expect(usersBefore.data.length).toEqual(usersAfter.data.length);
  });
});

//TODO: test POST success. That would require a mock database, which is beyond the scope of this assignment.
