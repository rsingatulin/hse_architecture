# API и события Warehouse CENTRAL и STORE

| Поле | Значение |
| --- | --- |
| Идентификатор / версия | WH-API-001 / 1.3 |
| Дата | 12.11.2026 |
| Ответственная группа | Команда 3 — Warehouse |
| Статус | Проект для согласования |
| Источники | [DOC-03](../../../00_Documentation/DOC-03.md), [DOC-05](../../../00_Documentation/DOC-05.md), [DOC-06](../../../00_Documentation/DOC-06.md), [DOC-12](../../../00_Documentation/DOC-12.md), [DOC-17](../../../00_Documentation/DOC-17.md); [INT-001/1.3](../../../06_integration_architecture/INT-001-target-model.md) |
| Связанные требования | WH-R-01/02/03/05/09/15/21/22/23/24 — [каталог](../../01_Business_Architecture/Requirements/WH-REQ-001-requirements.md) |

## Статус и правила

Контракты — проект To-Be, не перечень уже работающих endpoint. База `/warehouse/v1` — внутренний Gateway IS-07, браузер покупателя не обращается к WMS напрямую. Адаптер использует только поддерживаемый интерфейс WMS. Область доступа сервисной учётной записи и бизнес-права проверяются отдельно.

Для изменяющих команд нужны commandId, Idempotency-Key, X-Correlation-Id; получатель сохраняет hash тела и результат атомарно с изменением. Другой payload с прежним ключом даёт 409. Конкурентные переходы используют expectedVersion. Срок хранения ключей покрывает окно replay/восстановления и утверждается до пилота. Количество — decimal string + unitCode; дробные штуки отклоняются. UTC-время не заменяет aggregateVersion.

| WH ID | Метод / путь после базы | Инициатор / результат | Общий контракт |
|---|---|---|---|
| API-01 | GET /stocks | Онлайн/ERP → onHand, reserved, blocked, available, version, asOf и синхронизация по CENTRAL/STORE для ERP/закупок; онлайн-резерв ограничен CENTRAL; чтение не резерв | INT API-04 |
| API-02 | POST /reservations | Онлайн/ERP: orderId/version, строки → один атомарный ACTIVE с expiresAt; 409 при нехватке | INT API-05 |
| API-03 | POST /reservations/{id}/release | Владелец заказа; только допустимый переход; HELD требует подтверждённой отмены, ALLOCATED — отмены задания | INT API-08 |
| API-04 | PUT /expected-receipts/{externalId} | ERP; purchaseId, версия, строки → принятая версия плана; не приход товара | INT API-15 |
| API-05 | POST /receipts/{id}/confirm | Уполномоченный складской клиент → факт принятых/отклонённых строк и movementIds | Локальная функция WMS |
| API-06 | POST /fulfillment-tasks | **Только ERP**; orderId/version, erpOrderId, прежний reservationId → taskId; уникальное исполнение | INT API-11 |
| API-07 | GET /fulfillment-tasks/{id} | Владелец заказа/ERP → состояние, version, исключения | INT API-25 |
| API-08 | POST /fulfillment-tasks/{id}/cancel | ERP → CANCELLED/PENDING_PHYSICAL_RETURN/REJECTED_AFTER_HANDOVER | INT API-12 |
| API-09 | POST /shipments/{id}/confirm-handover | Только уполномоченный исполнитель → факт передачи; онлайн не разрешён | Локальная функция WMS |
| API-10 | POST /inventory-counts/{id}/approve | Руководитель → утверждённые корректировки с причиной и проверкой снимка | Локальная функция WMS |
| API-11 | GET /stock-snapshots/{id}/items?cursor= | ERP/BI/магазин → стабильный снимок одной границы; STORE содержит journalId/appliedThroughSequence | INT API-20 |
| API-12 | PUT /products/{productId} | ERP → разрешённая проекция master-товара с sourceVersion; не изменение master в WMS | Системный контракт ERP |
| API-13 | GET /reservations/{id}; поиск по orderId/version | Онлайн/ERP → состояние/версия/связи; восстановление UNKNOWN | INT API-06 |
| API-14 | POST /reservations/{id}/confirm-paid | Координатор по правилам канала: paymentId, expectedVersion → HELD_FOR_FULFILLMENT; только действующий ACTIVE | INT API-07 |
| API-15 | PUT /fulfillment-tasks/{id}/handover-plan | Координатор: shipmentId/trackingId/перевозчик → версия плана; не факт передачи и не новое задание | INT API-26 |
| API-16 | PUT /store-movements/{movementId} | Inventory магазина → APPLIED/RECONCILIATION_REQUIRED, stockVersion, непрерывный appliedThroughSequence | INT API-29 |
| API-17 | POST /store-sync-status | Inventory: heartbeatId/sentAt, journalId, highestLocalSequence → статус, граница, missingRanges, lastContactAt | INT API-30 |
| API-18 | PUT /store-transfers/{transferId} | ERP: CENTRAL/STORE, строки, expectedVersion → план пополнения; физические этапы отдельно | INT API-31 |

200/201 с бизнес-результатом подтверждает исполнителя. 202 + operationId подтверждает сохранённое поручение; `GET /integration/v1/operations/{operationId}` возвращает отдельный businessStatus. HTTP 200 этого status endpoint не равен SUCCEEDED. При таймауте повторяется тот же ключ либо читается прежний результат. 400/422 — неверные данные; 401/403 — доступ; 409 — версия/бизнес-конфликт; 429/503 — ограниченный технический повтор по политике IS-07.

## STORE: входной факт и непрерывная граница

```json
{"movementId":"MOV-S01-104","storeId":"S01","locationId":"STORE-S01","journalId":"J-S01-01","sourceSequence":104,"type":"SALE","productId":"SKU-01","quantity":"2","unitCode":"PCS","saleId":"S01-R01-C00045","lineId":"1","occurredAt":"2026-11-12T17:00:00Z"}
```

Идентификаторы и дата — пример формата. Для RECEIPT используются transferId/receiptId, для RETURN — returnId и разрешённое основание, для WRITE_OFF/ADJUSTMENT — документ и полномочия. Направление SALE/RECEIPT задаётся типом; у ADJUSTMENT явно указывается направление утверждённой коррекции. WMS дедуплицирует movementId и бизнес-основание+lineId+тип. Противоречивый физический факт сохраняется в исключениях и не отбрасывается как будто операции не было.

N+1 не считается применённым до N. appliedThroughSequence не перескакивает через пропуск/расхождение. Повтор N после потери ответа возвращает исходный результат. Heartbeat не подтверждает движение и не поднимает границу журнала. Старая sentAt, повтор heartbeatId и закрытый journalId не обновляют lastContactAt. Допустимый возраст heartbeat, часы, период опроса и таймаут OFFLINE утверждаются до пилота; просроченный heartbeat не replay-ится как свежий.

Снимок STORE содержит snapshotId, locationId, productId, подтверждённые количества, journalId и appliedThroughSequence одной границы. Локальная копия = основа снимка + только ещё не применённые движения. После переустановки новый journalId вводится через сверку; нельзя повторно прислать весь старый журнал под новыми ID.

## События

Оболочка: eventId, eventType, schemaVersion, source, aggregateType, aggregateId, aggregateVersion, occurredAt, correlationId, payload; causationId связывает команду. Отдельные версии разных агрегатов не сравниваются между собой. Передача at-least-once требует inbox/дедупликации у потребителя.

| Тип события | Агрегат / потребитель | Общий ID |
|---|---|---|
| warehouse.stock.changed.v1 | CENTRAL Stock; онлайн/BI обновляют разрешённую проекцию, ERP использует событие для повторного запроса INT API-04 | INT EVT-04 |
| warehouse.reservation.changed.v1 | Reservation; владелец заказа; включает HELD_FOR_FULFILLMENT | INT EVT-05 |
| warehouse.task.state-changed.v1 | Task; ERP, онлайн; готовность не означает передачу | INT EVT-07 |
| warehouse.shipment.handed-over.v1 | Shipment; ERP/каналы/BI; не DELIVERED | INT EVT-08 |
| warehouse.receipt.confirmed.v1 | Уникальные receiptId/movementIds; закупки/ERP | INT EVT-12 |
| warehouse.inventory.adjusted.v1 | Утверждённая корректировка; ERP/аудит | INT EVT-13 |
| warehouse.store-stock.changed.v1 | Полный STORE Stock по locationId+productId; магазин/BI обновляют проекции, ERP/закупки повторяют запрос без сохранения копии | INT EVT-25 |
| warehouse.store-transfer.changed.v1 | Transfer: planned/dispatched/received/inTransit и расхождения | INT EVT-26 |
| warehouse.store-sync.changed.v1 | SyncState по locationId: SYNCED/LAGGING/OFFLINE/RECONCILIATION_REQUIRED | INT EVT-27 |

Receipt/Shipment/Transfer и POS SaleCompleted не являются дополнительным расходом/приходом поверх Stock. CENTRAL EVT-04 не получает несовместимое расширение enum STORE. Для STORE используется отдельный EVT-25; свежесть дополнительно определяется EVT-27, а не возрастом последней продажи.

Схемы: [оболочка](schemas/event-envelope.schema.json), [STORE Stock](schemas/store-stock-changed.schema.json), [пример](schemas/store-stock-changed.example.json). Это образцы документального контракта, не полный OpenAPI legacy WMS. Общий каталог остаётся источником междоменной нумерации.

[К содержанию Warehouse](../../README.md)
