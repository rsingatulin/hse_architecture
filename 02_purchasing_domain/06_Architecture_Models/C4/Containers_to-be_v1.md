# C4: контейнеры (TO-BE) — Система управления закупками (ERP)

| Поле | Значение |
| --- | --- |
| Уровень | Контейнеры (**TO-BE**) |
| Раскрывает | [Контекст TO-BE](ContextLevel_to-be.md) |
| Сравнение | [Containers AS-IS](Containers_as-is.md) |

## Диаграмма

```mermaid
flowchart LR
  buyer["Человек: Менеджер по закупкам"]
  finance["Человек: Финансовый контролёр"]
  warehouse["Человек: Сотрудник склада"]
  supplierPerson["Внешний человек: Поставщик"]

  subgraph ERP["Система управления закупками (ERP)"]
    direction TB
    ui["Контейнер: Рабочее место закупок<br/>Веб-интерфейс<br/>АРМ: остатки, заказы, согласование"]
    forecast["Контейнер: Прогнозирование потребности<br/>Сервис + ML<br/>Предложения закупок"]
    po["Контейнер: Управление заказами поставщикам<br/>Сервис<br/>Заказы и планы поставок"]
    approval["Контейнер: Согласование оплаты<br/>Сервис<br/>Авто-правила и эскалация"]
    supplierMaster["Контейнер: Справочник поставщиков<br/>Сервис<br/>Поставщики и условия"]
    adapter["Контейнер: Адаптер интеграции ERP<br/>REST API / JSON<br/>Единая точка выхода вовне"]
    etl["Контейнер: Выгрузка закупок<br/>Пакетная / ETL<br/>Выгрузка в BI / DWH"]
    db[("Контейнер: База данных ERP<br/>Поставщики, заказы, остатки, аудит")]
  end

  ip["Внешняя система: Integration Platform"]
  wms["Внешняя система: WMS (склад)"]
  bi["Внешняя система: BI / DWH"]
  supplierSys["Внешняя система: Системы поставщиков"]

  buyer -->|"Анализирует остатки, формирует заказы<br/>[GUI / Web]"| ui
  finance -->|"Согласовывает оплату (эскалация)<br/>[GUI]"| ui
  warehouse -->|"Физическая приёмка товаров<br/>[ТСД / GUI]"| wms
  buyer -->|"Согласование условий<br/>[Email / Телефон]"| supplierPerson

  ui --> forecast
  ui --> po
  ui --> approval
  ui --> supplierMaster

  forecast --> db
  forecast --> adapter
  po --> supplierMaster
  po --> approval
  po --> db
  po --> adapter
  approval --> db
  supplierMaster --> db
  adapter --> db
  etl --> db

  adapter -->|"→ планы поставок и запросы остатков<br/>[REST API / JSON]"| ip
  ip -->|"← обновление остатков и статусы<br/>[REST API / JSON]"| adapter
  ip -->|"→ заказы на приёмку<br/>[REST API]"| wms
  wms -->|"← акты расхождений / факты приёмки<br/>[REST API]"| ip
  ip -->|"→ заказы поставщику<br/>[REST API / EDI]"| supplierSys
  supplierSys -->|"← подтверждения и статусы поставки<br/>[REST API / EDI]"| ip
  etl -->|"→ выгрузка данных по закупкам<br/>[ETL / пакетно]"| bi

  style ERP fill:#FFFFFF,stroke:#1168BD,stroke-width:2px
  style ui fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style forecast fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style po fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style approval fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style supplierMaster fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style adapter fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style etl fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style db fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style buyer fill:#08427B,stroke:#052E56,color:#ffffff
  style finance fill:#08427B,stroke:#052E56,color:#ffffff
  style warehouse fill:#08427B,stroke:#052E56,color:#ffffff
  style supplierPerson fill:#6B6477,stroke:#4A4453,color:#ffffff
  style ip fill:#999999,stroke:#666666,color:#ffffff
  style wms fill:#999999,stroke:#666666,color:#ffffff
  style bi fill:#999999,stroke:#666666,color:#ffffff
  style supplierSys fill:#999999,stroke:#666666,color:#ffffff
```

## Что появилось относительно AS-IS

| AS-IS | TO-BE |
| --- | --- |
| Нет прогноза | Прогнозирование потребности (ML) |
| Только ручное согласование | Авто-правила + эскалация |
| Нет адаптера / смешанные связи | Адаптер → только через IP |
| Нет систем поставщиков | Системы поставщиков ↔ IP |
| Прямая ERP↔WMS (часть потоков) | Только IP ↔ WMS |
