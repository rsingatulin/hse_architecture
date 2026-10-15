# C4: контейнеры (AS-IS) — Система управления закупками (ERP)

| Поле | Значение |
| --- | --- |
| Уровень | Контейнеры (**AS-IS**) |
| Раскрывает | [Контекст AS-IS](ContextLevel_as-is.md) |
| Источники | ArchiMate as-is, DOC-04, DOC-05, BPMN |
| Сравнение | [Containers TO-BE](Containers_to-be.md) |

## Диаграмма

```mermaid
flowchart LR
  buyer["Человек: Менеджер по закупкам"]
  finance["Человек: Финансовый контролёр"]
  warehouse["Человек: Сотрудник склада"]
  supplierPerson["Внешний человек: Поставщик"]

  subgraph ERP["Система управления закупками (ERP)"]
    direction TB
    ui["Контейнер: Рабочее место закупок<br/>GUI / Web"]
    orders["Контейнер: Сервис управления заказами<br/>Оформление заказов поставщикам"]
    financeSvc["Контейнер: Сервис финансового согласования<br/>Ручное согласование оплаты"]
    receiving["Контейнер: Сервис приёмки товаров<br/>Учёт факта приёмки в ERP"]
    db[("Контейнер: База данных ERP")]
  end

  ip["Внешняя система: Integration Platform"]
  wms["Внешняя система: WMS (склад)"]
  bi["Внешняя система: BI / DWH"]

  buyer -->|"заказы, остатки<br/>[GUI / Web]"| ui
  finance -->|"согласование оплаты<br/>[GUI]"| ui
  warehouse -->|"физическая приёмка<br/>[ТСД / GUI]"| wms
  buyer -->|"условия поставки<br/>[Email / Телефон]"| supplierPerson

  ui --> orders
  ui --> financeSvc
  orders --> financeSvc
  receiving --> orders
  orders --> db
  financeSvc --> db
  receiving --> db

  orders -->|"через IP → : часть планов / сообщений<br/>[REST]"| ip
  ip -->|"через IP ← : часть статусов<br/>[REST]"| orders
  ip -->|"через IP → : часть сообщений на склад<br/>[REST]"| wms
  wms -->|"через IP ← : часть статусов<br/>[REST]"| ip

  orders -->|"напрямую → : поступления / задания<br/>[INT-05 REST]"| wms
  wms -->|"напрямую ← : остатки / факты<br/>[INT-05 REST]"| orders

  orders -->|"напрямую → : закупки / остатки<br/>[INT-06 ETL, 1× сутки]"| bi

  style ERP fill:#FFFFFF,stroke:#1168BD,stroke-width:2px
  style ui fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style orders fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style financeSvc fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style receiving fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style db fill:#23A2D9,stroke:#1A7BA8,color:#ffffff
  style buyer fill:#08427B,stroke:#052E56,color:#ffffff
  style finance fill:#08427B,stroke:#052E56,color:#ffffff
  style warehouse fill:#08427B,stroke:#052E56,color:#ffffff
  style supplierPerson fill:#6B6477,stroke:#4A4453,color:#ffffff
  style ip fill:#999999,stroke:#666666,color:#ffffff
  style wms fill:#999999,stroke:#666666,color:#ffffff
  style bi fill:#999999,stroke:#666666,color:#ffffff
```

## Замечания AS-IS

- Нет контейнеров **прогнозирования** и **авто-согласования** (PR-01, PR-02, PR-11).
- Нет **систем поставщиков** — только Person (Email / Телефон).
- Есть **сотрудник склада** → WMS.
- **Смешанные** интеграции: часть через IP, часть **напрямую** ERP↔WMS (INT-05), ERP→BI (INT-06).
