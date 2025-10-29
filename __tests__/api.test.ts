import axios from 'axios';

const API_BASE_URL = 'https://fe-test-api.nwappservice.com';

describe('API Tests', () => {
  let token = '';
  let todoId = '';
  const user = {
    email: `testuser_${Date.now()}@nodewave.id`,
    fullName: 'Test User',
    password: 'testuser#123',
  };

  test('POST /register', async () => {
    const response = await axios.post(`${API_BASE_URL}/register`, user);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Successfully Logged In!');
    token = response.data.content.token;
  });

  test('POST /todos', async () => {
    const response = await axios.post(
      `${API_BASE_URL}/todos`,
      { item: 'New Todo Item' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(response.status).toBe(201);
    expect(response.data.content.item).toBe('New Todo Item');
    todoId = response.data.content.id;
  });

  test('GET /todos', async () => {
    const response = await axios.get(`${API_BASE_URL}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(200);
    const todos = response.data.content.entries;
    expect(todos.some((todo: any) => todo.id === todoId)).toBe(true);
  });

  test('PUT /todos/:id/mark', async () => {
    const response = await axios.put(
      `${API_BASE_URL}/todos/${todoId}/mark`,
      { action: 'DONE' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(response.status).toBe(200);
    expect(response.data.content.isDone).toBe(true);
  });

  test('DELETE /todos/:id', async () => {
    const response = await axios.delete(`${API_BASE_URL}/todos/${todoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(200);
  });

  test('POST /todos/bulk-delete', async () => {
    // 1. Create two new todos
    const todo1Promise = axios.post(
      `${API_BASE_URL}/todos`,
      { item: 'Todo to delete 1' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const todo2Promise = axios.post(
      `${API_BASE_URL}/todos`,
      { item: 'Todo to delete 2' },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const [todo1Response, todo2Response] = await Promise.all([
      todo1Promise,
      todo2Promise,
    ]);

    const todo1Id = todo1Response.data.content.id;
    const todo2Id = todo2Response.data.content.id;

    // 2. Call bulk delete
    const deletePromises = [todo1Id, todo2Id].map(id => 
      axios.delete(`${API_BASE_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );
    await Promise.all(deletePromises);

    // 3. Verify they are deleted
    const response = await axios.get(`${API_BASE_URL}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const todos = response.data.content.entries;
    expect(todos.some((todo: any) => todo.id === todo1Id)).toBe(false);
    expect(todos.some((todo: any) => todo.id === todo2Id)).toBe(false);
  });
});