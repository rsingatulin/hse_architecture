# ArchiMate Warehouse As-Is и To-Be 1.3

| Поле | Значение |
| --- | --- |
| Идентификатор / версия | WH-AM-001 / 1.3 |
| Дата | 12.11.2026 |
| Ответственная группа | Команда 3 — Warehouse |
| Статус | Проект для согласования |
| Источники | [DOC-02](../../../00_Documentation/DOC-02.md), [DOC-03](../../../00_Documentation/DOC-03.md), [DOC-04](../../../00_Documentation/DOC-04.md), [DOC-05](../../../00_Documentation/DOC-05.md), [DOC-06](../../../00_Documentation/DOC-06.md), [DOC-07](../../../00_Documentation/DOC-07.md), [DOC-08](../../../00_Documentation/DOC-08.md), [DOC-09](../../../00_Documentation/DOC-09.md); [INT-001/1.3](../../../06_integration_architecture/INT-001-target-model.md) |
| Связанные требования | WH-R-01/02/17/21/22/23/24 — [каталог](../../01_Business_Architecture/Requirements/WH-REQ-001-requirements.md) |

Модель использует типы ArchiMate и разделяет факт As-Is и проект To-Be. Сохранены три исходных представления (Application As-Is, Application To-Be, сквозные слои); добавлено Warehouse Store To-Be. Новые элементы не включены в As-Is как существующие.

Файлы: [Open Exchange XML](WH-AM-001-model-exchange.xml), [нативная модель Archi](Warehouse_RetailMax_1_2.archimate). В общей coArchi-модели ничего не менялось; нативный файл предназначен для локального открытия, XML — для согласованного импорта и объединения с общими ERP/WMS/IS-07 без дублирования master-элементов.

## Элементы

| ID | Тип ArchiMate | Название | Состояние |
| --- | --- | --- | --- |
| BA1 | BusinessActor | Распределительный склад | As-Is/To-Be |
| BR1 | BusinessRole | Кладовщик / комплектовщик | As-Is/To-Be |
| BR2 | BusinessRole | Начальник склада | As-Is/To-Be |
| BP1 | BusinessProcess | Приёмка и размещение | As-Is/To-Be, детали различаются |
| BP2 | BusinessProcess | Комплектация и передача | As-Is/To-Be |
| BP3 | BusinessProcess | Инвентаризация | As-Is/To-Be |
| BS1 | BusinessService | Складское исполнение заказа | As-Is/To-Be |
| AC1 | ApplicationComponent | WMS | As-Is/To-Be |
| AC2 | ApplicationComponent | ERP | As-Is/To-Be, внешний |
| AC3 | ApplicationComponent | Integration Platform | As-Is по DOC-04/05; To-Be развиваемая |
| AC4 | ApplicationComponent | Адаптер Warehouse | To-Be, новый |
| AC5 | ApplicationComponent | Интернет-магазин | Внешний |
| AC6 | ApplicationComponent | BI | Внешний |
| AF1 | ApplicationFunction | Регистрация складских операций | As-Is/To-Be |
| AF2 | ApplicationFunction | Управление заданием | As-Is/To-Be |
| AF3 | ApplicationFunction | Атомарное управление резервом | To-Be: уточнение возможностей WMS |
| AF4 | ApplicationFunction | Преобразование и восстановимая доставка | To-Be |
| AF5 | ApplicationFunction | Ведение товара и учётного заказа | As-Is/To-Be, ERP |
| AS1 | ApplicationService | Управление запасами | As-Is/To-Be; SRV-05 |
| AS2 | ApplicationService | Исполнение складского задания | As-Is/To-Be |
| AS3 | ApplicationService | Подтверждение резерва | To-Be |
| AS4 | ApplicationService | Обмен Warehouse | To-Be |
| AS5 | ApplicationService | Данные товара и заказа | As-Is/To-Be |
| DO1 | DataObject | Складской остаток | CENTRAL в As-Is; CENTRAL/STORE в To-Be |
| DO2 | DataObject | Задание и отгрузка | As-Is/To-Be |
| DO3 | DataObject | Товар и заказ | As-Is/To-Be |
| DO4 | DataObject | Резерв | Поле в As-Is; ACTIVE/HELD/ALLOCATED в To-Be |
| N1 | Node | Поддерживаемая среда WMS | As-Is/To-Be |
| N2 | Node | Корпоративный контейнерный контур | To-Be |
| TF1 | TechnologyFunction | Выполнение приложения WMS | As-Is/To-Be |
| TF2 | TechnologyFunction | Выполнение адаптера | To-Be |
| TS1 | TechnologyService | Среда выполнения WMS | As-Is/To-Be |
| TS2 | TechnologyService | Контейнерное выполнение | To-Be |

### Расширение магазинного контура

| ID | Тип | Элемент | Состояние |
| --- | --- | --- | --- |
| BA2 | BusinessActor | Розничный магазин | Только To-Be |
| BP4 | BusinessProcess | Движение и сверка магазина | Только To-Be |
| BP5 | BusinessProcess | Пополнение CENTRAL → STORE | Только To-Be |
| AC7 | ApplicationComponent | Store Inventory логистики | Только To-Be |
| AF6 | ApplicationFunction | Подтверждение движения STORE | Только To-Be |
| AF7 | ApplicationFunction | Контроль журнала и свежести | Только To-Be |
| AF8 | ApplicationFunction | Удержание оплаченного резерва | Только To-Be |
| AS6 | ApplicationService | Подтверждённый запас магазина | Только To-Be |
| AS7 | ApplicationService | Синхронизация магазина | Только To-Be |
| DO5 | DataObject | STORE Stock и StoreSync | Только To-Be |
| DO6 | DataObject | StoreJournal и movementId | Только To-Be |
| DO7 | DataObject | Transfer и товар в пути | Только To-Be |
| N3 | Node | Среда магазина | Только To-Be |

## Реестр отношений

| Источник | Отношение | Цель | Смысл |
| --- | --- | --- | --- |
| BA1 | Assignment | BR1, BR2 | Подразделение выполняет роли |
| BR1 | Assignment | BP1, BP2, BP3 | Исполнитель процессов |
| BR2 | Assignment | BP3 | Участие в контроле/утверждении инвентаризации |
| BP2 | Realization | BS1 | Процесс реализует складское исполнение |
| AC1 | Assignment | AF1, AF2, AF3 | WMS выполняет функции |
| AC2 | Assignment | AF5 | ERP ведёт мастер-объекты и учёт |
| AC4 | Assignment | AF4 | Адаптер выполняет преобразование/доставку |
| AF1, AF2, AF3, AF4, AF5 | Realization | AS1, AS2, AS3, AS4, AS5 соответственно | Функции реализуют сервисы |
| AS1 | Serving | BP1, BP3 | Складские операции поддерживают приёмку и инвентаризацию |
| AS2 | Serving | BP2 | Сервис поддерживает исполнение заказа |
| AS3 | Serving | AF2, AF4 | Подтверждение резерва используется заданием и адаптером |
| AS4 | Serving | AC2, AC5, AC6 | Складской обмен обслуживает внешние приложения |
| AS5 | Serving | AF1, AF2 | Товар/заказ нужны складским функциям |
| AF1 | Access (read/write) | DO1 | Изменение физического остатка |
| AF2 | Access (read/write) | DO2 | Изменение задания/отгрузки |
| AF3 | Access (read/write) | DO4, DO1 | Резерв и агрегат доступности |
| AF1, AF2 | Access (read) | DO3 | Склад читает данные ERP |
| AF5 | Access (read/write) | DO3 | ERP изменяет мастер-объекты |
| N1, N2 | Assignment | TF1, TF2 соответственно | Среды выполняют технологическое поведение |
| TF1, TF2 | Realization | TS1, TS2 соответственно | Поведение реализует техническую услугу |
| TS1, TS2 | Serving | AC1, AC4 соответственно | Среды поддерживают WMS/адаптер |
| AC2 | Flow | AC3 | Товар, поставка, задание |
| AC3 | Flow | AC4 | Управляемая доставка команд |
| AC4 | Flow | AC1 | Преобразованные команды |
| AC1 | Flow | AC4 | Подтверждённые складские факты |
| AC4 | Flow | AC3 | События с версиями и идентификаторами |
| AC3 | Flow | AC2, AC5, AC6 | Результаты/события потребителям |

Строка с несколькими целями разворачивается в отдельные отношения одного типа. У объекта DO1 один авторитетный писатель; Access у функций означает работу внутри границы WMS.


## Связь слоёв с целевым процессом

| Уровень | Основные элементы | Связь с задачей |
|---|---|---|
| Business | Склад/магазин, роли, приёмка/исполнение/инвентаризация; новые движение и пополнение STORE | BP-03 и новые целевые подпроцессы |
| Application | WMS, ERP, IS-07, адаптер, Store Inventory; Stock/Reserve/Sync/Transfer | C2 модули и междоменные контракты |
| Data | Исходные Stock/Task/Product/Reserve; новые STORE Stock/Sync, Journal, Transfer | Единый бизнес-писатель WMS и первичный локальный журнал |
| Technology | Поддерживаемая среда WMS, общий контейнерный контур; среда магазина | WMS/БД на поддерживаемых узлах, устойчивый локальный журнал |

Assignment связывает исполнителя с поведением, Realization — функцию с сервисом, Serving — сервис с потребителем, Access — работу с данными, Flow — передачу. Flow через IS-07 не переносит владение Stock в платформу. Предыдущие отношения AC1/DO1 и DO4 уточняются моделью данных: To-Be Stock охватывает площадки CENTRAL/STORE, удержание оплаченного резерва — новое состояние резерва.

Трассировка: приёмка/задание/STORE в BPMN → Application Services → C2/C6 → компоненты UML → API/события → QA. Читаемый обзор границ дан в [C4](../C4/WH-C4-002-containers.md). Нативный формат и XML проверяются структурно; фактическое согласование общей корпоративной модели остаётся за командами.

[К содержанию Warehouse](../../README.md)
