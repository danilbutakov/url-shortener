# 🔗 Сервис сокращения ссылок (URL Shortener)

Полноценное приложение для сокращения ссылок с аналитикой кликов, реализованное на **NestJS + TypeORM + PostgreSQL** (backend) и **React + MUI** (frontend).\
Проект полностью контейнеризирован с помощью **Docker Compose**.

---

## 🚀 Возможности

- ✅ Создание коротких ссылок с опциональным алиасом и сроком действия
- 🔁 Перенаправление по короткой ссылке
- 📊 Просмотр аналитики по каждой ссылке (количество кликов, последние IP)
- ❌ Удаление ссылок
- 💻 Современный и удобный интерфейс на React

---

## ⚡ Быстрый старт

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/danilbutakov/url-shortener.git
cd url-shortener
```

### 2. Запуск через Docker Compose

> ⚠️ Внимание: все данные в БД будут удалены при первом запуске (volume пересоздаётся).

```bash
docker-compose down -v   # Удалить старые volume БД (важно для корректной схемы!)
docker-compose up --build
```

- 🔌 Backend: [http://localhost:3000](http://localhost:3000)
- 🌐 Frontend: [http://localhost:3001](http://localhost:3001)

---

## 🛠 Важно: корректное удаление ссылок с аналитикой

Иногда при пересоздании БД внешний ключ в таблице `click` может быть создан без опции `ON DELETE CASCADE`. Это вызывает ошибки при удалении ссылок с аналитикой.

Чтобы исправить:

1. Зайдите в контейнер с БД:

```bash
docker exec -it url-shortener-db-1 psql -U postgres -d url_shortener
```

2. Внутри `psql` выполните команды:

```sql
ALTER TABLE click DROP CONSTRAINT "FK_c2f71156bfb882effa9a8471495";
ALTER TABLE click ADD CONSTRAINT "FK_c2f71156bfb882effa9a8471495"
FOREIGN KEY ("urlId") REFERENCES url(id) ON DELETE CASCADE;
```

---

## 📁 Структура проекта

```
url-shortener/
├── backend/       # Серверная часть (NestJS, TypeORM, PostgreSQL)
├── frontend/      # Клиентская часть (React, MUI)
├── docker-compose.yml
```

---

## ⚙️ Переменные окружения

Все основные параметры уже заданы в `docker-compose.yml`.

### Для локального запуска без Docker:

Создайте файл `.env` в папке `backend/`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=url_shortener
```

---

## 🧪 Тестирование

### Backend

- Юнит-тесты:

```bash
cd backend
npm run test
```

- E2E-тесты:

```bash
npm run test:e2e
```

### Frontend

```bash
cd frontend
npm test
```

---

## 🔧 Полезные команды

- Удалить все данные БД (volume):

```bash
docker-compose down -v
```

- Пересоздать контейнеры:

```bash
docker-compose up --build
```

---

## 📌 Примечания

- Для корректного удаления ссылок с аналитикой **обязательно** выполните команды с `ON DELETE CASCADE` (см. выше).
- Все связи и каскадные удаления реализованы на уровне БД и TypeORM.

---

## 👤 Авторы

- **Данил Бутаков**
