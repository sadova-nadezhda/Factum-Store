// Заглушка для регистрации пользователя
export const registerAPI = async ({ email, password, name }: { email: string, password: string, name: string }) => {
  return new Promise<{ token: string; user: { email: string; name: string } }>((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com') {
        reject('Email уже используется');
      } else {
        resolve({
          token: 'fake-token', // В будущем здесь будет настоящий токен
          user: { email, name },
        });
      }
    }, 1000);
  });
};

// Заглушка для логина
export const loginAPI = async ({ email, password }: { email: string; password: string }) => {
  return new Promise<{ token: string; user: { email: string; name: string } }>((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com' && password === 'password') {
        resolve({
          token: 'fake-token',
          user: { email, name: 'Test User' },
        });
      } else {
        reject('Неверный email или пароль');
      }
    }, 1000);
  });
};