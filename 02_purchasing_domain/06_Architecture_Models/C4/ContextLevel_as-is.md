# C4: контекст (AS-IS) — Система управления закупками (ERP)

| Поле | Значение |
| --- | --- |
| Уровень | Контекст (**AS-IS**) |
| Система в фокусе | Система управления закупками (ERP) |
| Источник | [c4 context.png](c4%20context.png), DOC-04, DOC-05, BP-02 |

## Почему это AS-IS

- **Integration Platform уже есть** (IS-07), но по DOC-05 **не все** обмены идут через неё.
- **Системы поставщика нет**: поставщик — **Person**, связь с менеджером **[Email / Телефон]**.
- Сотрудник склада работает в **WMS**, не в ERP.

## Какие потоки через IP, какие напрямую (DOC-05)

| Поток | Как в AS-IS | Основание |
| --- | --- | --- |
| ERP ↔ Integration Platform ↔ WMS (планы поставок / часть складских сообщений) | **через IP** | схема на `c4 context.png` |
| ERP ↔ WMS (поступления, остатки — INT-05) | **напрямую** (часть связей) | DOC-05 INT-05; PR-06 |
| ERP → BI / DWH (закупки, остатки — INT-06) | **напрямую** ETL раз в сутки | DOC-05 INT-06 |
| Менеджер ↔ Поставщик | **вне ИС** (Email / Телефон) | `c4 context.png` |

## Диаграмма

```mermaid
flowchart TB
  buyer["Человек: Менеджер по закупкам<br/>Формирует потребности, создаёт заказы, контролирует поставки"]
  finance["Человек: Финансовый контролёр<br/>Утверждает лимиты и счета на оплату поставок"]
  warehouse["Человек: Сотрудник склада<br/>Фиксирует фактический приход товара по накладным"]
  supplier["Внешний человек: Поставщик (контрагент)<br/>Согласует спецификации и условия отгрузки"]

  erp["Программная система: Система управления закупками (ERP)<br/>Центральный контур: поставщики, заказы и остатки"]

  wms["Внешняя система: WMS (управление складом)<br/>Физическая приёмка, ячейки, остатки"]
  ip["Внешняя система: Integration Platform<br/>Маршрутизация и валидация сообщений"]
  bi["Внешняя система: BI / DWH<br/>Аналитика динамики закупок"]

  buyer -->|"Анализирует остатки, формирует заказы<br/>[GUI / Web]"| erp
  finance -->|"Согласовывает оплату<br/>[GUI]"| erp
  warehouse -->|"Физическая приёмка товаров<br/>[ТСД / GUI]"| wms
  buyer -->|"Согласование заказов, цен и сроков<br/>[Email / Телефон]"| supplier

  erp -->|"через IP → : планы поставок и часть сообщений<br/>[REST API / JSON]"| ip
  ip -->|"через IP ← : ответы / статусы<br/>[REST API / JSON]"| erp
  ip -->|"через IP → : заказы на приёмку / акты<br/>[REST API]"| wms
  wms -->|"через IP ← : статусы приёмки / остатки<br/>[REST API]"| ip

  erp -->|"напрямую → : поступления / задания<br/>[INT-05 REST] PR-06"| wms
  wms -->|"напрямую ← : остатки / факты<br/>[INT-05 REST] PR-06"| erp
  erp -->|"напрямую → : выгрузка закупок<br/>[INT-06 ETL / Batch, 1× сутки]"| bi

  style erp fill:#1168BD,stroke:#0B4884,color:#ffffff,stroke-width:2px
  style buyer fill:#08427B,stroke:#052E56,color:#ffffff
  style finance fill:#08427B,stroke:#052E56,color:#ffffff
  style warehouse fill:#08427B,stroke:#052E56,color:#ffffff
  style supplier fill:#6B6477,stroke:#4A4453,color:#ffffff
  style wms fill:#999999,stroke:#666666,color:#ffffff
  style ip fill:#999999,stroke:#666666,color:#ffffff
  style bi fill:#999999,stroke:#666666,color:#ffffff
```

## Граница

В фокусе **ERP (закупки)**. Integration Platform есть, но AS-IS смешанный: часть потоков через IP, часть напрямую (ERP↔WMS, ERP→BI). Поставщик вне ИС.

См. также: [Context TO-BE](ContextLevel_to-be.md) · [Containers AS-IS](Containers_as-is.md) · [Containers TO-BE](Containers_to-be.md).
