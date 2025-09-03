- [Dashboard State Utility](#dashboard-state-utility)
	- [Usage](#usage)
- [CI/CD](#cicd)
	- [Версия билда в package.json](#версия-билда-в-packagejson)
	- [Расположение файлов связанных с CI/CD](#расположение-файлов-связанных-с-cicd)



# Dashboard State Utility
Dev utility to extract dashboard configuration for manual setup.
## Usage
Open browser DevTools console and use:
```javascript
// Get full info
window.debugDashboardState()

// Get current dashboard state
window.getDashboardState()

// Get all dashboards
window.getAllDashboards()

// Get grid data
window.getGridInfo()
```

# CI/CD
## Версия билда в package.json
Чтобы при деплои у нас была свежая версия билда, добавлен механизм, которые автоматически проставляет при билде в package.json версию билда. Каждый новый билд (в рамках проекта) повышает версию билда.

Для ручного повышения билда и обновления major/minor версий, достаточно изменить первое или второе значение в файле package.json в поле "version". CI изменияет только последнию часть версии.

⚠️ **В самом package.json версия билда в репозитории не обновляется. Версия билда присутсвует только в готовых контейнерах. При необходимости, версию билда можно посмотреть в логе pipeline в стадии app_build.**

## Расположение файлов связанных с CI/CD
* .gitlab-ci\envs\front_config - конфиги для vite
* .gitlab-ci\snippets - setup и lint
* .gitlab-ci\templates - основной CI/CD
* .gitlab-ci.yml - генератор переменных и билда
