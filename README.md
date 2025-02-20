# i88

### DevOps

Доступ (консольный) к репозиторию через **HTTPS** по ссылке https://gitlab.planet9.uk/ . Доступ по **OAuth** доступен, поэтому можно ввести учётные данные от GitLab. **Access tokens** должен тоже работать. **SSH** доступ закрыт!

Наш основной репозиторий https://gitlab.planet9.uk/i88/i88

Структура:

```
/backend
  ├── microservice_1/
  ├── microservice_2/
  ├── microservice_3/
/frontend
  ├── microservice_1/
  ├── microservice_2/
  ├── microservice_3/
```

На текущий момент используем **GitHub flow** пока нет прода и команда небольшой.

![48032310-63842400-e114-11e8-8db0-06dc0504dcb5](C:\test\i88\assets\48032310-63842400-e114-11e8-8db0-06dc0504dcb5.png)

Т.е. делаем **Feature** ветку, доделываем и мерджим назад в **main**.

Открытые вопросы:

* Нужен ли доступ по SSH?
* Как тегировать будем?
