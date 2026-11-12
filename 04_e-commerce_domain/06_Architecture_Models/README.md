# Architecture models

Раздел предназначен для моделей BPMN, ArchiMate, C4 и UML домена интернет-продаж.

## Общая интеграционная модель To-Be

[Восемь схем с исходниками PlantUML и SVG](../../06_integration_architecture/README.md): общий ландшафт, платформа, контейнеры интернет-магазина, заказ, восстановление оплаты, закупка/приёмка, POS/лояльность и владение данными. Статус — проект для согласования; As-Is ниже сохранён отдельно.

## BP-04 — Интернет-продажи As-Is

- [Редактируемая BPMN](BPMN/BP-04-internet-sales-as-is.bpmn).
- [Диаграмма SVG](BPMN/BP-04-internet-sales-as-is.svg).
- [Описание, связь с проблемами и допущения](BPMN/BP-04-internet-sales-as-is.md).

Версия 1.1 — черновик для согласования. Детализация исключений и взаимодействия с CRM содержит явно обозначенные допущения.

## Глава 4 — архитектура приложений As-Is

- [Описание, состав моделей и трассируемость](../02_Application_Architecture/APP-EC-001-as-is.md).
- C4: [Context](C4/C4-EC-001-context.svg), [Container](C4/C4-EC-002-container.svg).
- UML: [Component](UML/UML-EC-001-order-components.svg), [Sequence](UML/UML-EC-002-checkout-sequence.svg).
- [Фрагмент связи с ArchiMate](ArchiMate/AM-EC-001-application-bridge.svg).

Исходники `.puml` находятся рядом с SVG. Container и Component — логическая реконструкция As-Is по DOC-03/04/05/15. Неизвестные технологии и внутреннее устройство явно обозначены.

Просмотр диаграмм прямо на GitHub: [C4](C4/README.md), [UML](UML/README.md), [ArchiMate](ArchiMate/README.md).

Материалы для сдачи: [PDF](../output/pdf/RetailMax_chapter4_AsIs.pdf), [HTML с увеличением схем](../output/RetailMax_chapter4_AsIs.html), [архив исходников](../output/RetailMax_chapter4_AsIs_sources.zip).
