# C4: контекст (TO-BE) — Система управления закупками (ERP)

| Поле | Значение |
| --- | --- |
| Уровень | Контекст (**TO-BE**) |
| Система в фокусе | Система управления закупками (ERP) |
| Опирается на | [Context AS-IS](ContextLevel_as-is.md), REQ-AA-04, паспорт домена |

## Что меняется относительно AS-IS

- Все **новые и межсистемные** обмены закупок — **только через Integration Platform** (нет прямой ERP↔WMS).
- Появляются **системы поставщиков** (внешние ИС) ↔ IP.
- Поставщик как **Person** может остаться для переговоров (Email / Телефон); электронный обмен заказами/статусами — через системы поставщиков.
- Внутри ERP (не на Context) появляются прогноз и авто-согласование — см. [Containers TO-BE](Containers_to-be.md).

## Диаграмма

```mermaid
flowchart TB
  buyer["Человек: Менеджер по закупкам<br/>Формирует потребности, создаёт заказы, контролирует поставки"]
  finance["Человек: Финансовый контролёр<br/>Утверждает лимиты и счета на оплату поставок"]
  warehouse["Человек: Сотрудник склада<br/>Фиксирует фактический приход товара по накладным"]
  supplierPerson["Внешний человек: Поставщик (контрагент)<br/>Согласует условия (при необходимости)"]

  erp["Программная система: Система управления закупками (ERP)<br/>Поставщики, заказы, остатки; прогноз и правила согласования"]

  wms["Внешняя система: WMS (управление складом)<br/>Физическая приёмка, ячейки, остатки"]
  ip["Внешняя система: Integration Platform<br/>Единая шина обменов закупок"]
  bi["Внешняя система: BI / DWH<br/>Аналитика динамики закупок"]
  supplierSys["Внешняя система: Системы поставщиков<br/>Заказы, подтверждения, статусы поставки"]

  buyer -->|"Анализирует остатки, формирует заказы<br/>[GUI / Web]"| erp
  finance -->|"Согласовывает оплату (эскалация)<br/>[GUI]"| erp
  warehouse -->|"Физическая приёмка товаров<br/>[ТСД / GUI]"| wms
  buyer -->|"Согласование условий<br/>[Email / Телефон]"| supplierPerson

  erp -->|"→ планы поставок, запросы остатков<br/>[REST API / JSON]"| ip
  ip -->|"← остатки, статусы, подтверждения<br/>[REST API / JSON]"| erp

  ip -->|"→ заказы на приёмку<br/>[REST API]"| wms
  wms -->|"← факты приёмки, акты, остатки<br/>[REST API]"| ip

  ip -->|"→ заказ поставщику<br/>[REST API / EDI]"| supplierSys
  supplierSys -->|"← подтверждение и статусы<br/>[REST API / EDI]"| ip

  erp -->|"→ выгрузка данных по закупкам<br/>[ETL / Batch]"| bi

  style erp fill:#1168BD,stroke:#0B4884,color:#ffffff,stroke-width:2px
  style buyer fill:#08427B,stroke:#052E56,color:#ffffff
  style finance fill:#08427B,stroke:#052E56,color:#ffffff
  style warehouse fill:#08427B,stroke:#052E56,color:#ffffff
  style supplierPerson fill:#6B6477,stroke:#4A4453,color:#ffffff
  style wms fill:#999999,stroke:#666666,color:#ffffff
  style ip fill:#999999,stroke:#666666,color:#ffffff
  style bi fill:#999999,stroke:#666666,color:#ffffff
  style supplierSys fill:#999999,stroke:#666666,color:#ffffff
```

## Граница

Прямой связи **ERP ↔ WMS нет**. Обмены с WMS и системами поставщиков — через **Integration Platform**. Детализация ERP — [Containers TO-BE](Containers_to-be.md).
