# 🚀 Как запустить приложение

## В PowerShell (Windows)

```powershell
# Перейти в папку проекта
cd gpttest/patient-booking-app

# Запустить в режиме разработки
npm run dev
```

## ⚠️ Важно для PowerShell

В PowerShell **НЕ используйте** символ `&&` для выполнения нескольких команд.

❌ **Неправильно:**
```powershell
cd patient-booking-app && npm run dev
```

✅ **Правильно:**
```powershell
cd patient-booking-app
npm run dev
```

## 🌐 Доступ к приложению

После запуска приложение будет доступно по адресу:
- **Local**: http://localhost:5173
- **Network**: http://[ваш-ip]:5173

## 📦 Другие команды

```powershell
# Установить зависимости (если нужно)
npm install

# Собрать для продакшена
npm run build

# Просмотр готовой сборки
npm run preview
```

## 🎯 Что ожидать

После запуска вы увидите:
1. **Выбор справки** - различные медицинские справки
2. **Выбор услуг** - необходимые медицинские процедуры
3. **Умная настройка записи** - система автоматически определит лучший способ записи
4. **Подтверждение** - итоговая информация о всех записях

## 🆘 Если что-то не работает

1. Убедитесь, что установлен Node.js (версия 16+)
2. Проверьте, что вы находитесь в правильной папке
3. Попробуйте переустановить зависимости: `npm install`
4. Убедитесь, что порт 5173 свободен 