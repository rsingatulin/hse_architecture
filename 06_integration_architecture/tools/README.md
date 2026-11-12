# Сборка и проверка пакета

Нужны Java, PlantUML (проверено с 1.2025.2), Node.js с пакетами `marked` и `playwright` (с установленным Chromium), Python 3 с `jsonschema`. Graphviz не требуется: схемы C4 используют встроенный Smetana. Внешние сервисы рендеринга не используются.

Из корня репозитория:

```sh
java -Djava.awt.headless=true -jar /path/to/plantuml.jar -charset UTF-8 -tsvg -failfast2 '06_integration_architecture/diagrams/*.puml'
node 06_integration_architecture/tools/build.mjs /path/to/node_modules/marked
node 06_integration_architecture/tools/check-html.cjs /path/to/node_modules/playwright
python3 06_integration_architecture/tools/validate.py
```

HTML содержит схемы и скачиваемые исходники. Документы, SVG, PlantUML и примеры публикуются отдельными файлами; архивы не входят в GitHub-пакет. Относительные ссылки на материалы кейса сохраняются в репозитории.

После сборки открыть HTML, проверить читаемость схем, навигацию и увеличение. `validate.py` проверяет структуру документов и примеры контрактов; это не тест реализации сервисов.
